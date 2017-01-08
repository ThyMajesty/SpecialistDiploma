# -*- coding: utf-8 -*-

from django.contrib.auth.middleware import get_user
from django.utils.functional import SimpleLazyObject
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework_jwt.serializers import RefreshJSONWebTokenSerializer
from rest_framework_jwt.settings import api_settings


class AuthenticationMiddlewareJWT(object):
    def __init__(self, get_response):
        self.get_response = get_response
        self.jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        self.jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


    def __call__(self, request):
        request.jwt_user = SimpleLazyObject(lambda: self.__class__.get_jwt_user(request))
        request.person = SimpleLazyObject(lambda: self.__class__.get_jwt_person(request))

        response = self.get_response(request)

        refresh_jwt = request.GET.get("?jwt", None)
        if not refresh_jwt is None:
            print 'refresh_jwt', refresh_jwt
            jwt_user = request.jwt_user
            payload = self.jwt_payload_handler(jwt_user)
            token = self.jwt_encode_handler(payload)
            response['X-NEW-JWT'] = token

        return response


    @staticmethod
    def get_jwt_user(request):
        jwt_authentication = JSONWebTokenAuthentication()
        if jwt_authentication.get_jwt_value(request):
            user, jwt = jwt_authentication.authenticate(request)
            return user


    @staticmethod
    def get_jwt_person(request):
        from apps.core.models import Person
        user = request.jwt_user
        if not user or not user.is_authenticated():
            return None
        try:
            person = Person.nodes.get(user_id=user.pk)
        except Person.DoesNotExist:
            value = { 'name': user.username }
            person = Person(user_id=user.pk, value=value).save()
        return person
