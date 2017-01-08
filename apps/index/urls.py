from django.conf.urls import url
from django.contrib import admin

from .views import index, oauth_callback, FileUploadView, MultiFileUploadView

urlpatterns = [
    url(r'^$', index),
    url(r'^oauth_callback/', oauth_callback),
    url(r'^upload/$', FileUploadView.as_view()),
    url(r'^uploads/$', MultiFileUploadView.as_view())
]
