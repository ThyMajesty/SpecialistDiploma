# -*- coding: utf-8 -*-

from django.contrib.auth.middleware import get_user
from django.utils.functional import SimpleLazyObject
from rest_framework_jwt.authentication import JSONWebTokenAuthentication


class AuthenticationMiddlewareJWT(object):
    def __init__(self, get_response):
        self.get_response = get_response


    def __call__(self, request):
        request.user = SimpleLazyObject(lambda: self.__class__.get_jwt_user(request))
        request.person = SimpleLazyObject(lambda: self.__class__.get_jwt_person(request))
        return self.get_response(request)


    @staticmethod
    def get_jwt_user(request):
        user = get_user(request)
        if user.is_authenticated:
            return user
        jwt_authentication = JSONWebTokenAuthentication()
        if jwt_authentication.get_jwt_value(request):
            user, jwt = jwt_authentication.authenticate(request)
        return user


    @staticmethod
    def get_jwt_person(request):
        from apps.core.models import Person
        user = request.user
        if not user.is_authenticated:
            return None
        try:
            person = Person.nodes.get(user_id=user.pk)
        except Person.DoesNotExist:
            value = { 'name': user.username }
            person = Person(user_id=user.pk, value=value).save()
        return person
