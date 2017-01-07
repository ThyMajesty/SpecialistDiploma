import json
from django.http import JsonResponse

from .api_map import api_map
from .twinword import get_api_result


def dump(value, key, subkey=None):
    return { 'name': value, 'connection': key, 'subconnection': subkey }


def transform(data, key):
    connection = { 'name': key }
    if isinstance(data, list):
        result = [dump(r, connection) for r in data if r]
    else:
        result = []
        for subkey, r in data.items():
            if r:
                subconnection = { 'name': subkey }
                if isinstance(r, list):
                    for subr in r:
                        if subr:
                            result.append(dump(subr, connection, subconnection))
                else:
                    result.append(dump(r, connection, subconnection))
    return result


def askfor(request, relation, word):
    subrelation = request.GET.get('subrelation')
    if subrelation:
        relation+='-*'
    api = api_map[relation]['api']
    subapi = api_map[relation]['subapi']
    extract = api_map[relation]['extract']
    result = get_api_result(word, api, subapi)
    if not result:
        return JsonResponse({ 'result': None })
    if subrelation:
        result = extract(result, subrelation)
    else:
        result = extract(result)

    anwser = {
        'result': transform(result, relation)
    }

    return JsonResponse(anwser)


def askforlist(request):
    return JsonResponse({'result': [
                            'context',
                            'relation',
                            'associations',
                            'meaning',
                            'example',
                            'relation2',
                            'theme'
                        ]})