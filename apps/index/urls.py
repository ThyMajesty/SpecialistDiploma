from django.conf.urls import url
from django.contrib import admin

from .views import index, oauth_callback

urlpatterns = [
    url(r'^$', index),
    url(r'^oauth_callback/', oauth_callback),
]
