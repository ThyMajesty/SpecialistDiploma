from django.conf import settings
from django.contrib import admin
from django.conf.urls import url, include
from django.conf.urls.static import static

from rest_framework_jwt.views import obtain_jwt_token

urlpatterns = [
    url(r'^admin/', admin.site.urls),

    url(r'', include('apps.index.urls')),
    url(r'^api/', include('apps.core.urls')),
    url(r'^api/', include('apps.xapi.urls')),
    url(r'^api/token-auth/', obtain_jwt_token),

    url(r'', include('social.apps.django_app.urls', namespace='social'))
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)