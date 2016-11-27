from tastypie import fields
from tastypie.authorization import Authorization
from tastypie.resources import Resource

from .models import Connection, KnowlageDB, Instance, Pack, Person


class NeoResourceMixin():
    model_class = None

    # The following methods will need overriding regardless of your
    # data source.
    def detail_uri_kwargs(self, bundle_or_obj):
        kwargs = {}

        kwargs['pk'] = bundle_or_obj.pk

        return kwargs

    def get_object_list(self, request):
        
        return self.model_class.nodes.all()

    def obj_get_list(self, bundle, **kwargs):
        # Filtering disabled for brevity...
        return self.get_object_list(bundle.request)

    def obj_get(self, bundle, **kwargs):
        obj = self.model_class.nodes.get(pk=kwargs['pk'])
        return obj

    def obj_create(self, bundle, **kwargs):
        bundle.obj = self.model_class(kwargs)
        bundle.obj.save()
        bundle = self.full_hydrate(bundle)
        return bundle

    def obj_update(self, bundle, **kwargs):
        bundle.obj = self.model_class.nodes.get(pk=kwargs.pop('pk'))
        bundle.obj.__dict__.update(kwargs)
        bundle.obj.save()
        bundle = self.full_hydrate(bundle)
        return bundle

    def obj_delete_list(self, bundle, **kwargs):
        raise Exception()

    def obj_delete(self, bundle, **kwargs):
        obj = self.model_class.nodes.get(pk=kwargs['pk'])
        obj.delete()

    def rollback(self, bundles):
        pass



class KnowlageDBResource(NeoResourceMixin, Resource):
    model_class = KnowlageDB
    class Meta:
        resource_name = 'db'
        object_class = KnowlageDB
        authorization = Authorization()



class InstanceResource(NeoResourceMixin, Resource):
    model_class = Instance
    class Meta:
        resource_name = 'instance'
        object_class = Instance
        authorization = Authorization()



class PackResource(NeoResourceMixin, Resource):
    model_class = Pack
    class Meta:
        resource_name = 'pack'
        object_class = Pack
        authorization = Authorization()



class PersonResource(NeoResourceMixin, Resource):
    model_class = Person
    class Meta:
        resource_name = 'person'
        object_class = Person
        authorization = Authorization()



class ConnectionResource(NeoResourceMixin, Resource):
    model_class = Connection
    class Meta:
        resource_name = 'connection'
        object_class = Connection
        authorization = Authorization()



