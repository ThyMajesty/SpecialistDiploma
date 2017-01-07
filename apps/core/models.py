#http://neomodel.readthedocs.io/en/latest/getting_started.html
from uuid import uuid4
import json

from apps.adapters.neomodel_properties_fix import *
from neomodel import StructuredNode, StructuredRel, One, ZeroOrMore
from neomodel import StringProperty, IntegerProperty, JSONProperty
from neomodel import RelationshipTo, RelationshipFrom, Relationship
from neomodel import RelationshipManager

from .utils import json2obj, obj2json

REL_FROM = 'FROM'
REL_CONNECTED_FROM = 'CONNECTED_FROM'
REL_CONNECTED_TO = 'CONNECTED_TO'
REL_LIKE = 'LIKE'
REL_OWN = 'OWN'

from django.db import models


class TestDB(models.Model):
    uuid = models.CharField(max_length=200, unique=True)
    json_data = models.TextField(blank=True)


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
            if isinstance(value, RelationshipManager):
                data[key] = map(lambda obj: {obj.pk:obj.value}, value.all())
            else:
                data[key] = value
        return data
        

class RelationModel(StructuredRel):
    value = JSONProperty(unique_index=False, required=False)



class KnowlageDB(Value2ObjMixin, StructuredNode):
    pk = StringProperty(unique_index=True, default=uuid4)

    value = JSONProperty(unique_index=False, required=False)

    instances = RelationshipTo('Instance', REL_FROM, model=RelationModel)

    def to_mindmap(self):
        return {
            "id": self.pk,
            "name": self.value.get('name', None),
            "description": self.value.get('description', None),
            "value": self.value,
            "tree": self.instances.all()[0].to_mindmap()
        }


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

    def delete(self):
        for conn in self.rel_to.all():
            conn.delete()
        return super(Connection, self).delete()


class Instance(Value2ObjMixin, StructuredNode):
    pk = StringProperty(unique_index=True, default=uuid4)

    value = JSONProperty(unique_index=False, required=False)

    knowlage_db = RelationshipFrom('KnowlageDB', REL_FROM, model=RelationModel)

    connections = Relationship('Connection', REL_CONNECTED_FROM, cardinality=ZeroOrMore)

    @staticmethod
    def my_create(data):
        parent = Instance.nodes.get(pk=data.pop("parent_id"))
        conn = Connection()
        conn.rel_from.connect(parent)
        inst = Instance(value=data.pop("value"))
        inst.save()
        conn.rel_to.connect(inst)
        conn.value = data.pop("connection")
        conn.value["subconnection"] = data.pop("subconnection")
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
        for conn in self.connections.all():
            conn.delete()
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
