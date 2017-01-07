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

from .utils import dict_from_dict

def get_person(request):
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
    return person


@csrf_exempt
def db_save(request):
    if not request.method == 'POST':
        return JsonResponse({'msg':'not post'})
    person = get_person(request)
    data = json.loads(request.body)
    uid = data.get('id', None)
    if uid:
        db = KnowlageDB.nodes.get(pk=uid)
    else:
        db = KnowlageDB()
    db.value = dict_from_dict(data, ['name', 'description'])


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
