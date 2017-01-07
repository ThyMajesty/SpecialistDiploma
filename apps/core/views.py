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
from .models import TestDB, KnowlageDB

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


@csrf_exempt
def test_db(request):
    data = json.loads(request.body)
    if request.method == 'POST':
        kdb = KnowlageDB()
        kdb.save()
        db = TestDB()
        db.uuid = kdb.pk
        data['id'] = kdb.pk
        db.json_data = json.dumps(data)
        db.save()
    return JsonResponse(data)


@csrf_exempt
def get_test_db(request, uuid):
    db, created = TestDB.objects.get_or_create(uuid=uuid)
    if created:
        db.json_data = json.dumps({
                'id':uuid,
                'name': 'name',
                'description': 'descr',
            })
        db.save()
    if request.method == 'PUT':
        db.json_data = request.body
        db.save()

    data = json.loads(db.json_data)
    return JsonResponse(data)


def view_mindmap(request):
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

        def list(self, request):
            objs_list = self.neo_model.nodes.all()
            objs_list_json = map(lambda obj: obj.to_json(), objs_list)
            return Response(objs_list_json)

        def create(self, request):
            if hasattr(self.neo_model, 'my_create'):
                obj = self.neo_model.my_create(request.data)
            else:
                obj = self.neo_model(**request.data)
            try:
                obj.save()
            except Exception as e:
                return Response(unicode(e), status=status.HTTP_400_BAD_REQUEST)
            return Response(view_mindmap(request) or obj.to_json(), status=status.HTTP_201_CREATED)

        def retrieve(self, request, pk=None):
            obj = self.get_object(pk)
            return Response(view_mindmap(request) or obj.to_json())

        def update(self, request, pk=None):
            obj = self.get_object(pk)
            try:
                if hasattr(self.neo_model, 'my_update'):
                    obj = self.neo_model.my_update(obj, request.data)
                else:
                    for key, value in request.data.items():
                        rel = getattr(obj, key)
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

        def destroy(self, request, pk=None):
            obj = self.get_object(pk)
            obj.delete()
            return Response(view_mindmap(request), status=status.HTTP_202_ACCEPTED)

        def get_object(self, pk):
            try:
                return self.neo_model.nodes.get(pk=pk)
            except self.neo_model.DoesNotExist:
                raise Http404

        def get_serializer_class(self):
            return type('Serializer', (Serializer,), {'pk':serializers.CharField()})

    view_set = type(name + 'ViewSet', (BaseViewSet,), { 'neo_model':model, 'queryset':model.nodes.all() })
    return view_set