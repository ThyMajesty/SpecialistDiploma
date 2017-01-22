from django.conf.urls import url

from .views import (
    index, signup, social_post_jwt_auth,
    singlefileuploadview, multifileuploadview
)

urlpatterns = [
    url(r'^$', index),
    url(r'^reg/$', signup),
    url(r'^sauth/$', social_post_jwt_auth),
    url(r'^upload/$', singlefileuploadview),
    url(r'^uploads/$', multifileuploadview)
]
