import json
from collections import namedtuple

#from .models import Instance, Connection

def _json_object_hook(d):
    return namedtuple('X', d.keys())(*d.values())

def json2obj(data):
    return json.loads(data, object_hook=_json_object_hook)

def obj2json(obj):
    return json.dumps(data._asdict())

def dict_from_dict(d, fields):
    result = {}
    for field in fields:
        result[field] = d[result]
    return result

def instance_from_dict(data, parent=None):
    uid = data.get('id', None)
    if uid:
        inst = Instance.nodes.get(pk=uid)
    else:
        inst = Instance()
    inst.value = dict_from_dict(data, ['name', 'description'])

    if parent:
        conn_uid = data['connection'].get('id', None)
        connection = Connection()

    inst.save()

    for child in data["children"]:
        inst_child = instance_from_dict(child, inst)

        # "name": "flare",
        # "description": "description",
        # "connection": "null",
        # "subconnection": "null",
        # "children": [{
        #     "name": "analytics",
        #     "description": "description",
        #     "subconnection": { "name": "noun" },
        #     "connection": { id "name": "meaning" },
        #     "children": [{