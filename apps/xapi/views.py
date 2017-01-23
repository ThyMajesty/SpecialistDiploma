import json
from django.http import JsonResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from apps.core.models import RelRecord
from .api_map import api_map
from .twinword import get_api_result


def dump(value, key, subkey=None):
    return {'name': value, 'connection': key, 'subconnection': subkey}


def transform(data, key):
    if not data:
        return []
    connection = {'name': key}
    if isinstance(data, list):
        result = [dump(r, connection) for r in data if r]
    else:
        result = []
        for subkey, r in data.items():
            if r:
                subconnection = {'name': subkey}
                if isinstance(r, list):
                    for subr in r:
                        if subr:
                            result.append(
                                dump(subr, connection, subconnection))
                else:
                    result.append(dump(r, connection, subconnection))
    return result


def askfor(request, relation, word):
    subrelation = request.GET.get('subrelation')
    if subrelation:
        relation += '-*'
    api = api_map[relation]['api']
    subapi = api_map[relation]['subapi']
    extract = api_map[relation]['extract']
    result = get_api_result(word, api, subapi)
    if result:
        if subrelation:
            result = extract(result, subrelation)
        else:
            result = extract(result)
    relrecords = RelRecord.nodes.filter(inst_from=word, connection=relation)
    from_db = map(lambda obj: obj.to_dict(), relrecords)
    anwser = {
        'result': transform(result, relation) + from_db
    }
    return JsonResponse(anwser)


@csrf_exempt
def askforlist(request):
    if not request.method == 'POST':
        raise Http404

    data = json.loads(request.body)
    word = data.get('word', None)
    relation = data.get('relation', None)
    if not word:
        return JsonResponse({'msg': 'word should be specified'}, status=500)
    if relation:
        return askfor(request, relation, word)

    def conv(data):
        return [{'name': n, 'description': d} for n, d in data]

    relations = set([(key, '') for key in api_map.keys()])

    used = set(map(lambda obj: obj.to_ask_form(),
                   RelRecord.nodes.filter(inst_from=word)))
    used = used.difference(relations)

    return JsonResponse({'result': conv(relations), 'users': conv(used)})
