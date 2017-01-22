import json
from django.http import Http404, JsonResponse
from django.http import HttpResponseForbidden
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import Serializer
from rest_framework import serializers  
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from neomodel import RelationshipManager
from apps.index.utils import person_required
from .models import Person
from .models import TestDB, KnowlageDB

@csrf_exempt
@person_required
def me(request):
    person = request.person
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
        except Exception as e:
            print e.message
    return JsonResponse(person.to_json())


def view_mindmap(request, obj=None):
    if obj and obj.__class__ == KnowlageDB:
        return obj.to_mindmap()
    mindmap = request.GET.get('mindmap', None)
    if mindmap:
        db = KnowlageDB.nodes.get(pk=mindmap)
        return db.to_mindmap()
    else:
        return None


def create_viewset_for_model(model):
    name = model.__name__

    class BaseViewSet(ModelViewSet):
        neo_model = None
        queryset = None

        @person_required
        def list(self, request):
            if self.neo_model == KnowlageDB:
                person = request.person
                objs_list = person.knowlagedb.all()
            else:
                objs_list = self.neo_model.nodes.all()
            objs_list_json = map(lambda obj: obj.to_json(), objs_list)
            return Response(objs_list_json)

        @person_required
        def create(self, request):
            if hasattr(self.neo_model, 'my_create'):
                person = request.person
                obj = self.neo_model.my_create(request.data, owner=person)
            else:
                obj = self.neo_model(**request.data)
            try:
                obj.save()
            except Exception as e:
                return Response(unicode(e), status=status.HTTP_400_BAD_REQUEST)
            return Response(view_mindmap(request, obj) or obj.to_json(), status=status.HTTP_201_CREATED)

        @person_required
        def retrieve(self, request, pk=None):
            obj = self.get_object(pk)
            return Response(view_mindmap(request) or obj.to_json())

        @person_required
        def update(self, request, pk=None):
            obj = self.get_object(pk)
            try:
                if hasattr(self.neo_model, 'my_update'):
                    obj = self.neo_model.my_update(obj, request.data)
                else:
                    for key, value in request.data.items():
                        rel = getattr(obj, key, None)
                        if rel is None:
                            continue
                        if isinstance(rel, RelationshipManager):
                            for v in value:
                                rel.connect(rel.target_class.get_object(v))
                        else:
                            setattr(obj, key, value)
                obj.save()
            except Exception as e:
                return Response(unicode(e), status=status.HTTP_400_BAD_REQUEST)
            return Response(view_mindmap(request) or obj.to_json())

        def partial_update(self, request, pk=None):
            pass

        @person_required
        def destroy(self, request, pk=None):
            obj = self.get_object(pk)
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        def get_object(self, pk):
            try:
                return self.neo_model.nodes.get(pk=pk)
            except self.neo_model.DoesNotExist:
                raise Http404

        def get_serializer_class(self):
            return type('Serializer', (Serializer,), {'pk':serializers.CharField()})

    view_set = type(name + 'ViewSet', (BaseViewSet,), { 'neo_model':model, 'queryset':model.nodes.all() })
    return view_set