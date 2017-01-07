from django.conf.urls import url
from django.contrib import admin

from .views import askfor, askforlist

urlpatterns = [
    url(r'^askfor/$', askforlist),
    url(r'^askfor/(?P<relation>[\w-]+)/(?P<word>[\w-]+)/$', askfor),
]