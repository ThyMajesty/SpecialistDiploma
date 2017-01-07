api_map = {
    'context': {
        'api': 0,
        'subapi': 0,
        'extract': lambda data: data['context']
    },
    'relation': {
        'api': 0,
        'subapi': 0,
        'extract': lambda data: data['relation']
    },
    'relation-*': {
        'api': 0,
        'subapi': 0,
        'extract': lambda data, key: data['relation'][key]
    },
    'associations': {
        'api': 1,
        'subapi': 0,
        'extract': lambda data: data['associations_array']
    },
    'meaning': {
        'api': 2,
        'subapi': 1,
        'extract': lambda data: data['meaning']
    },
    'meaning-*': {
        'api': 2,
        'subapi': 1,
        'extract': lambda data, key: data['meaning'][key]
    },
    'example': {
        'api': 2,
        'subapi': 3,
        'extract': lambda data: data['example']
    },
    'relation2': {
        'api': 2,
        'subapi': 4,
        'extract': lambda data: { k:v.split(', ') for k, v in data['relation'].items() }
    },
    'relation2-*': {
        'api': 2,
        'subapi': 4,
        'extract': lambda data, key: data['relation'][key].split(', ')
    },
    'theme': {
        'api': 2,
        'subapi': 5,
        'extract': lambda data: data['theme']
    }
}