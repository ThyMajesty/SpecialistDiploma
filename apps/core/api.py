from tastypie import fields
from tastypie.authorization import Authorization
from tastypie.resources import Resource

from .models import Connection, KnowlageDB, Instance, Pack, Person

class KnowlageDBResource(Resource):
    class Meta:
        resource_name = 'db'
        object_class = KnowlageDB
        authorization = Authorization()

    # The following methods will need overriding regardless of your
    # data source.
    def detail_uri_kwargs(self, bundle_or_obj):
        kwargs = {}

        kwargs['pk'] = bundle_or_obj.pk

        return kwargs

    def get_object_list(self, request):
        
        return KnowlageDB.nodes

    def obj_get_list(self, bundle, **kwargs):
        # Filtering disabled for brevity...
        return self.get_object_list(bundle.request)

    def obj_get(self, bundle, **kwargs):
        obj = KnowlageDB.nodes.get(pk=kwargs['pk'])
        return obj

    def obj_create(self, bundle, **kwargs):
        bundle.obj = KnowlageDB(kwargs)
        bundle.obj.save()
        bundle = self.full_hydrate(bundle)
        return bundle

    def obj_update(self, bundle, **kwargs):
        bundle.obj = KnowlageDB.nodes.get(pk=kwargs.pop('pk'))
        bundle.obj.__dict__.update(kwargs)
        bundle.obj.save()
        bundle = self.full_hydrate(bundle)
        return bundle

    def obj_delete_list(self, bundle, **kwargs):
        raise Exception()

    def obj_delete(self, bundle, **kwargs):
        obj = KnowlageDB.nodes.get(pk=kwargs['pk'])
        obj.delete()

    def rollback(self, bundles):
        pass