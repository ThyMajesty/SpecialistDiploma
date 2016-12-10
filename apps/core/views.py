from django.http import Http404, JsonResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import Serializer
from rest_framework import serializers  
from .models import Person

def me(request):
    person = Person.nodes.get(user_id=request.user.pk)
    if request.POST:
        person.value = request.POST
        person.save()
    return JsonResponse(person.value)


def create_viewset_for_model(model):
    name = model.__name__

    class BaseViewSet(ModelViewSet):
        neo_model = None
        queryset = None

        def list(self, request):
            objs_list = self.neo_model.nodes.all()
            objs_list_json = map(lambda obj: {obj.pk: obj.value}, objs_list)
            return Response(objs_list_json)

        def create(self, request):
            data = request.data
            map(unicode, data.values())
            obj = self.neo_model(**data)
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
                obj_json = self.model_serializer(obj, data=request.data)
            except Exception as e:
                return Response(unicode(e), status=status.HTTP_400_BAD_REQUEST)
            return Response(obj_json)

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