from django.conf.urls import url

from .views import askforlist

urlpatterns = [
    url(r'^askfor/$', askforlist),
]
