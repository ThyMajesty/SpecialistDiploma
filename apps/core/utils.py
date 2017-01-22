import json
from collections import namedtuple


def _json_object_hook(d):
    return namedtuple('X', d.keys())(*d.values())


def json2obj(data):
    return json.loads(data, object_hook=_json_object_hook)


def obj2json(data):
    return json.dumps(data._asdict())


def dict_from_dict(d, fields):
    result = {}
    for field in fields:
        result[field] = d[result]
    return result
