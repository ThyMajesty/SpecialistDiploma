from django.conf.urls import url
from django.contrib import admin

from .views import index, oauth_callback, FileUploadView

urlpatterns = [
    url(r'^$', index),
    url(r'^oauth_callback/', oauth_callback),
    url(r'^upload/$', FileUploadView.as_view())
]
