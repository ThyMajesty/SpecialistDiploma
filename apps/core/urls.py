from rest_framework import routers
from django.conf.urls import url, include

from .models import KnowlageDB, Instance, Person, Connection
from .views import create_viewset_for_model, me, test_db, get_test_db

router = routers.DefaultRouter()
for model in [KnowlageDB, Instance, Person, Connection]:
    router.register(model.__name__.lower(), create_viewset_for_model(model), base_name=model.__name__.lower())

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^me/', me),
    url(r'^testdb/$', test_db),
    url(r'^testdb/(?P<uuid>[\w-]+)/', get_test_db),
    url(r'^auth/', include('rest_framework.urls', namespace='rest_framework')),
]