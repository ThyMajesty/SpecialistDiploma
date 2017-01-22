from django.conf.urls import url
from django.contrib import admin

from .views import index, FileUploadView, MultiFileUploadView, reg, sauth

urlpatterns = [
    url(r'^$', index),
    url(r'^reg/$', reg),
    url(r'^sauth/$', sauth),
    url(r'^upload/$', FileUploadView.as_view()),
    url(r'^uploads/$', MultiFileUploadView.as_view())
]
