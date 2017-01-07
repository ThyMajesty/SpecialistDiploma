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
REL_CONNECTED = 'CONNECTED'
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



class Connection(Value2ObjMixin, StructuredNode):
    pk = StringProperty(unique_index=True, default=uuid4)
    
    value = JSONProperty(unique_index=False, required=False)

    rel_from = Relationship('Instance', REL_CONNECTED)
    rel_to = Relationship('Instance', REL_CONNECTED)



class Instance(Value2ObjMixin, StructuredNode):
    pk = StringProperty(unique_index=True, default=uuid4)

    value = JSONProperty(unique_index=False, required=False)

    knowlage_db = RelationshipFrom('KnowlageDB', REL_FROM, model=RelationModel)

    connections = Relationship('Connection', REL_CONNECTED, cardinality=ZeroOrMore)

    def instances(self, *args, **kwargs):
        return [conn.rel_to for conn in connections.all()]



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
