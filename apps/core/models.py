#http://neomodel.readthedocs.io/en/latest/getting_started.html
from uuid import uuid4

from neomodel import StructuredNode, StructuredRel
from neomodel import StringProperty, IntegerProperty, JSONProperty
from neomodel import RelationshipTo, RelationshipFrom, Relationship

from .utils import json2obj, obj2json

REL_FROM = 'FROM'
REL_CONNECTED = 'CONNECTED'
REL_LIKE = 'LIKE'
REL_OWN = 'OWN'


class Value2ObjMixin(object):
    @property
    def value_obj(self):
        return json2obj(self.value)

    @value_obj.setter
    def value_obj(self, value):
        self.value = obj2json(value)
        


class Connection(Value2ObjMixin, StructuredRel):
    #pk = StringProperty(unique_index=True, default=uuid4)

    value = JSONProperty(unique_index=False, required=False)



class KnowlageDB(Value2ObjMixin, StructuredNode):
    pk = StringProperty(unique_index=True, default=uuid4)

    value = JSONProperty(unique_index=False, required=False)

    instances = RelationshipTo('Instance', REL_FROM)



class Instance(Value2ObjMixin, StructuredNode):
    pk = StringProperty(unique_index=True, default=uuid4)

    value = JSONProperty(unique_index=False, required=False)

    knowlage_db = RelationshipFrom('KnowlageDB', REL_FROM)

    nodes = Relationship('Instance', REL_CONNECTED, model=Connection)

    def connectons(self):
        results, columns = self.cypher("START a=node({self}) MATCH a-[r]-() RETURN r")
        return [self.inflate(row[0]) for row in results]



class Pack(Value2ObjMixin, StructuredNode):
    pk = StringProperty(unique_index=True, default=uuid4)

    value = JSONProperty(unique_index=False, required=False)
    
    owner = RelationshipFrom('Person', REL_OWN)



class Person(Value2ObjMixin, StructuredNode):
    pk = StringProperty(unique_index=True, default=uuid4)

    value = JSONProperty(unique_index=False, required=False)

    connections = RelationshipTo('Connection', REL_LIKE)
    
    nodes = RelationshipTo('Connection', REL_LIKE)

    packs = RelationshipFrom('Pack', REL_OWN)
