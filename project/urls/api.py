from django.conf import settings
from django.contrib import admin
from django.conf.urls import url, include
from django.conf.urls.static import static

from jwt_auth.views import obtain_jwt_token


urlpatterns = [
    url(r'', include('apps.core.urls')),
    url(r'', include('apps.xapi.urls')),
    url(r'^token-auth/', obtain_jwt_token),
]