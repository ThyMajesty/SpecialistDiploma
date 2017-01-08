import unirest
import json
import os.path
from django.conf import settings
from .models import ApiCallCache

headers = {
    "X-Mashape-Key": settings.X_MASHAPE_KEY,
    "Accept": "application/json"
}

def transform_relation(data):
    relations = data.pop('relation')
    out = {}
    for relation in relations:
        for key, value in relation.items():
            if not key in out:
                out[key] = []
            out[key].append(value)
    data['relation'] = out
    return data

api_list = [
    {
        ### context [u'bee', u'bug', u'insect', u'termite']
        ### relation [u'pollen', u'firefly', u'earthworm', u'pollination', ...]
        ### relation-* [u'insect', u'bug', u'butterfly', u'flower', u'honey', u'pollen']
        'base_url': "https://twinword-visual-context-graph.p.mashape.com/",
        'headers': headers,
        'uri_list': ['visualize',],
        'exclude': ['author', 'result_msg', 'request', 'email', 'version', 'entry', 'response', 'result_code'],
        'transform': [transform_relation,],
    },
    {
        ### associations_array  [u'termite', u'bee', u'insect', u'cockroach', u'butterfly', u'bug', ...]
        'base_url': "https://twinword-word-associations-v1.p.mashape.com/",
        'headers': headers,
        'uri_list': ['associations',],
        'exclude': ['author', 'result_msg', 'request', 'email', 'version', 'entry', 'response', 'result_code', 'associations', 'associations_scored'],
        'transform': [],
    },
    {
        ### 0
        ###
        ### 1
        ### meaning-adjective u''
        ### meaning-adverb u''
        ### meaning-noun u''
        ### meaning-verb u''
        ### 2->1
        ### 3
        ### example [u'Ant is a hard working insect.', u'The larval stages of the insects mimic ants.', ...]
        ### 4
        ### relation-associations ---
        ### relation-broad_terms u'hymenopterous insect, hymenopteron, hymenopteran, hymenopter',
        ### relation-derived_terms: u''
        ### relation-evocations: u'social insect',
        ### relation-narrow_terms: u"wood ant, slave-making ant, slave-maker, slave ant,
        ### relation-related_terms: u'pismire, emmet',
        ### relation-synonyms: u'emmet, pismire'
        ### 5
        ### theme: [u'flower', u'butterfly', u'pest', u'animal', u'live', u'fly']

        'base_url': "https://twinword-word-graph-dictionary.p.mashape.com/",
        'headers': headers,
        'uri_list': ['association', 'definition', 'definition_kr', 'example', 'reference', 'theme'],
        'exclude': ['author', 'result_msg', 'request', 'email', 'version', 'entry', 'response', 'result_code', 'ipa'],
        'transform': [],
    }
]


def block_api_calls(msg=''):
    file = open('block_api!', 'w+')
    file.write(msg)
    file.close()


def check_api_calls_block(response=None):
    if response:
        limit = int(response.headers['X-RateLimit-Queries-Remaining'])
        if limit < 500:
            block_api_calls()
        else:
            print 'api limit', limit
    return os.path.exists('block_api!')



def api_call(word, api_num=None, uri_num=None):
    params = { 'entry': word }
    api = api_list[api_num]
    uri = api['uri_list'][uri_num]
    lnk = api['base_url'] + uri + '/'
    print lnk, api['headers'], params
    response = unirest.get(lnk, headers=api['headers'], params=params)
    return response


def get_api_result(word, api_num=None, uri_num=None):
    api_name = str(api_num) + '-' + str(uri_num)
    if check_api_calls_block():
        print 'api calls blocked'
        try:
            cache = ApiCallCache.objects.get(api_name=api_name, query=word)
        except:
            return None
        return json.loads(cache.result or '{}')

    cache, created = ApiCallCache.objects.get_or_create(api_name=api_name, query=word)

    if created:
        api = api_list[api_num]
        response = api_call(word, api_num, uri_num)
        check_api_calls_block(response)
        data_dict = response.body
        if not data_dict:
            return None
        for exclude in api['exclude']:
            if exclude in data_dict:
                data_dict.pop(exclude)
        for transform in api['transform']:
            try:
                data_dict = transform(data_dict)
            except Exception as e:
                pass
        if not data_dict:
            return None
        cache.result = json.dumps(data_dict)
        cache.save()
    else:
        data_dict = json.loads(cache.result or '{}')
    return data_dict


