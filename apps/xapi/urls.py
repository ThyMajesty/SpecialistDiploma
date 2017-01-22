from django.conf.urls import url

from .views import askfor, askforlist

urlpatterns = [
    url(r'^askfor/(?P<word>[\w-]+)/$', askforlist),
    url(r'^askfor/(?P<relation>[\w-]+)/(?P<word>[\w-]+)/$', askfor),
]
