import json
from django.http import Http404, JsonResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import Serializer
from rest_framework import serializers  
from .models import Person
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from neomodel import RelationshipManager


@csrf_exempt
def me(request):
    user = None
    jwt_authentication = JSONWebTokenAuthentication()
    jwt_value = jwt_authentication.get_jwt_value(request)
    if jwt_value:
        user, jwt = jwt_authentication.authenticate(request)
    if not user:
        user = User.objects.get(pk=2)
    try:
        person = Person.nodes.get(user_id=user.pk)
    except:
        person = Person(user_id=user.pk).save()
        person.value = {
            'name': user.username
        }
        person.save()

    print request.body
    print request.method
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            for key, value in data.items():
                print key, value
                rel = getattr(person, key)
                if isinstance(rel, RelationshipManager):
                    for v in value:
                        rel.connect(rel.target_class.get_object(v))
                else:
                    setattr(person, key, value)
            person.save()
            print 'saved'
        except Exception as e:
            print e.message
    return JsonResponse(person.to_json())


def create_viewset_for_model(model):
    name = model.__name__

    class BaseViewSet(ModelViewSet):
        neo_model = None
        queryset = None

        def list(self, request):
            objs_list = self.neo_model.nodes.all()
            objs_list_json = map(lambda obj: obj.to_json(), objs_list)
            return Response(objs_list_json)

        def create(self, request):
            obj = self.neo_model(**request.data)
            try:
                obj.save()
            except Exception as e:
                return Response(unicode(e), status=status.HTTP_400_BAD_REQUEST)
            return Response(obj.to_json(), status=status.HTTP_201_CREATED)

        def retrieve(self, request, pk=None):
            obj = self.get_object(pk)
            return Response(obj.to_json())

        def update(self, request, pk=None):
            obj = self.get_object(pk)
            try:
                data = request.data
                for key, value in data.items():
                    rel = getattr(obj, key)
                    if isinstance(rel, RelationshipManager):
                        for v in value:
                            rel.connect(rel.target_class.get_object(v))
                    else:
                        setattr(obj, key, value)
                obj.save()
            except Exception as e:
                return Response(unicode(e), status=status.HTTP_400_BAD_REQUEST)
            return Response(obj.to_json())

        def partial_update(self, request, pk=None):
            pass

        def destroy(self, request, pk=None):
            obj = self.get_object(pk)
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        def get_object(self, pk):
            try:
                return self.neo_model.nodes.get(pk=pk)
            except obj.DoesNotExist:
                raise Http404

        def get_serializer_class(self):
            return type('Serializer', (Serializer,), {'pk':serializers.CharField()})

    view_set = type(name + 'ViewSet', (BaseViewSet,), { 'neo_model':model, 'queryset':model.nodes.all() })
    return view_set