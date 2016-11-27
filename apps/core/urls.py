from tastypie.api import Api
from django.conf.urls import url, include
from django.contrib import admin

from .api import KnowlageDBResource

v1_api = Api(api_name='v1')
v1_api.register(KnowlageDBResource())

urlpatterns = [
    url(r'', include(v1_api.urls)),
]