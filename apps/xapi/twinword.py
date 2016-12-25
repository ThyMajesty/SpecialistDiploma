import unirest

headers = {
    "X-Mashape-Key": "q4Dj0TUkc8mshmLuGaWM2TRjFHqDp16nFQKjsnTiKRvOpTxWJW",
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
        'base_url': "https://twinword-visual-context-graph.p.mashape.com/",
        'headers': headers,
        'uri_list': ['visualize',],
        'exclude': ['author', 'result_msg', 'request', 'email', 'version', 'entry', 'response', 'result_code'],
        'transform': [transform_relation,],
    },
    {
        'base_url': "https://twinword-word-associations-v1.p.mashape.com/",
        'headers': headers,
        'uri_list': ['associations',],
        'exclude': ['author', 'result_msg', 'request', 'email', 'version', 'entry', 'response', 'result_code', 'associations', 'associations_scored'],
        'transform': [],
    },
    {
        'base_url': "https://twinword-word-graph-dictionary.p.mashape.com/",
        'headers': headers,
        'uri_list': ['association', 'definition', 'definition_kr', 'example', 'reference', 'theme'],
        'exclude': ['author', 'result_msg', 'request', 'email', 'version', 'entry', 'response', 'result_code'],
        'transform': [],
    }
]



def get_api_result(word, api_num=None, uri_num=None):
    params = { 'entry': word}
    if api_num:
        api_list_todo = [api_list[api_num],]
    else:
        api_list_todo = api_list
    for api in api_list_todo:
        if uri_num:
            uri_list = [api['uri_list'][uri_num],]
        else:
            uri_list = api['uri_list']
        for uri in uri_list:
            lnk = api['base_url'] + uri + '/'
            print lnk, api['headers'], params
            response = unirest.get(lnk, headers=api['headers'], params=params)
            data_dict = response.body
            for exclude in api['exclude']:
                data_dict.pop(exclude)
            for transform in api['transform']:
                data_dict = transform(data_dict)

            return data_dict
