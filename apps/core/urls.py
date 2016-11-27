from tastypie.api import Api
from django.conf.urls import url, include
from django.contrib import admin

from .api import KnowlageDBResource, InstanceResource, PackResource, PersonResource, ConnectionResource

v1_api = Api(api_name='v1')
v1_api.register(KnowlageDBResource())
v1_api.register(InstanceResource())
v1_api.register(PackResource())
v1_api.register(PersonResource())
v1_api.register(ConnectionResource())

urlpatterns = [
    url(r'', include(v1_api.urls)),
]