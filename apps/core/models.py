#http://neomodel.readthedocs.io/en/latest/getting_started.html
import json
import time
from uuid import uuid4
from hashlib import sha224
from deepdiff import DeepDiff
from django.db import models
from neomodel import StructuredNode, StructuredRel, One, ZeroOrMore
from neomodel import StringProperty, IntegerProperty, JSONProperty
from neomodel import RelationshipTo, RelationshipFrom, Relationship
from neomodel import RelationshipManager
from apps.adapters.neomodel_properties_fix import *
from .utils import json2obj, obj2json


class TestDB(models.Model):
    uuid = models.CharField(max_length=200, unique=True)
    json_data = models.TextField(blank=True)


REL_FROM = 'FROM'
REL_CONNECTED_FROM = 'CONNECTED_FROM'
REL_CONNECTED_TO = 'CONNECTED_TO'
REL_LIKE = 'LIKE'
REL_OWN = 'OWN'


class Value2ObjMixin(object):
    @property
    def value_obj(self):
        return json2obj(self.value)

    @value_obj.setter
    def value_obj(self, value):
        self.value = obj2json(value)

    def to_json(self):
        data = {}
        for key in self.defined_properties().keys():
            value = getattr(self, key)
            if self.__class__.__name__ == 'Instance':
                key = 'id' if key == 'pk' else key
            if isinstance(value, RelationshipManager):
                data[key] = map(lambda obj: {obj.pk:obj.value}, value.all())
            else:
                data[key] = value
        return data
        
    def __repr__(self):
        return self.__class__.__name__ + unicode(self.value)


class RelationModel(StructuredRel):
    value = JSONProperty(unique_index=False, required=False)


class KnowlageDB(Value2ObjMixin, StructuredNode):
    pk = StringProperty(unique_index=True, default=uuid4)

    value = JSONProperty(unique_index=False, required=False)
    history = JSONProperty(required=False, default={})

    instances = RelationshipTo('Instance', REL_FROM, model=RelationModel)


    def to_mindmap(self):
        mindmap = {
            "id": self.pk,
            "name": self.value.get('name', None),
            "description": self.value.get('description', None),
            "value": self.value,
            "tree": self.instances.all()[0].to_mindmap()
        }
        # mindmap_json = json.dumps(mindmap)
        # mindmap_uid = sha224(mindmap_json).hexdigest()
        # if not mindmap_uid in self.history:
        #     if 'last' in self.history:
        #         previous_mindmap = self.history[self.history['last']]['data']
        #         msg = dict(DeepDiff(previous_mindmap, mindmap))
        #     else:
        #         msg = 'initial'
        #     self.history[mindmap_uid] = {
        #         'id': mindmap_uid,
        #         'timestamp': time.time(),
        #         'changelog': msg,
        #         'data': mindmap.copy()
        #     }
        #     self.history['last'] = mindmap_uid
        #     self.save()
        # history = self.history.copy()
        # if 'last' in  history:
        #     history.pop(history.pop('last'))
        # mindmap['history'] = history.values()
        return mindmap

    @staticmethod
    def my_create(data):
        db = KnowlageDB(value=data.pop("value")).save()
        inst = Instance(value=data.pop("tree").pop("value")).save()
        db.instances.connect(inst)
        return db.save()


class Connection(Value2ObjMixin, StructuredNode):
    pk = StringProperty(unique_index=True, default=uuid4)
    
    value = JSONProperty(unique_index=False, required=False)

    rel_from = Relationship('Instance', REL_CONNECTED_FROM)
    rel_to = Relationship('Instance', REL_CONNECTED_TO)

    def to_mindmap(self):
        inst = self.rel_to.all()[0]
        return inst.to_mindmap(self)

    def to_mindmap_repr(self):
        return {
            "connection": { 
                'id': self.pk,
                "name": self.value.get('name', None),
                "value": self.value,
            },
            "subconnection": self.value.get('subconnection', None),
        }

    def delete(self, delete_to=True):
        if delete_to:
            print 'delete', self.value
            for inst in self.rel_to.all():
                inst.delete()
        return super(Connection, self).delete()


class Instance(Value2ObjMixin, StructuredNode):
    pk = StringProperty(unique_index=True, default=uuid4)

    value = JSONProperty(unique_index=False, required=False)

    knowlage_db = RelationshipFrom('KnowlageDB', REL_FROM, model=RelationModel)

    connections = Relationship('Connection', REL_CONNECTED_FROM, cardinality=ZeroOrMore)
    connections_from = Relationship('Connection', REL_CONNECTED_TO, cardinality=ZeroOrMore)

    @staticmethod
    def my_create(data):
        parent = Instance.nodes.get(pk=data.pop("parent_id"))
        conn = Connection(value=data.pop("connection")).save()
        conn.value["subconnection"] = data.get("subconnection", None)
        conn.rel_from.connect(parent)
        inst = Instance(value=data.pop("value")).save()
        conn.rel_to.connect(inst)
        conn.save()
        return inst

    @staticmethod
    def my_update(self, data):
        self.value = data["value"]
        return self

    def instances(self, *args, **kwargs):
        return [conn.rel_to for conn in connections.all()]

    def to_mindmap(self, parent=None):
        print self.value.get('name', None)
        mindmap = {
            "id": self.pk,
            "name": self.value.get('name', None),
            "description": self.value.get('description', None),
            "value": self.value,
        }

        if parent:
            mindmap.update(parent.to_mindmap_repr())
        else:
            mindmap.update({"connection": None, "subconnection": None})

        children = [conn.to_mindmap() for conn in self.connections.all()]

        if children:
            mindmap['children'] = children

        return mindmap

    def delete(self):
        print 'delete', self.value
        for conn in self.connections.all():
            conn.delete()
        for conn in self.connections_from.all():
            conn.delete(delete_to=False)
        return super(Instance, self).delete()


class Pack(Value2ObjMixin, StructuredNode):
    pk = StringProperty(unique_index=True, default=uuid4)

    value = JSONProperty(unique_index=False, required=False)
    
    owner = RelationshipFrom('Person', REL_OWN, model=RelationModel)



class Person(Value2ObjMixin, StructuredNode):
    pk = StringProperty(unique_index=True, default=uuid4)

    user_id = StringProperty(unique_index=True, required=True)

    value = JSONProperty(unique_index=False, required=False)

    connections = RelationshipTo('Connection', REL_LIKE, model=RelationModel)
    
    knowlagedb = RelationshipFrom('KnowlageDB', REL_OWN, model=RelationModel)
