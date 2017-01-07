from django.conf.urls import url
from django.contrib import admin

from .views import askfor

urlpatterns = [
    url(r'^askfor/(?P<relation>[\w-]+)/(?P<word>[\w-]+)/', askfor),
]