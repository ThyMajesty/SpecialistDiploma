from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from django.contrib.sites.shortcuts import get_current_site
from apps.core.models import Person
from .utils import generate_jwt_for_user


class AuthenticationMiddlewareJWT(object):
    def __init__(self, get_response):
        self.get_response = get_response
        self.jwt_authentication = JSONWebTokenAuthentication()

    def __call__(self, request):
        domain = get_current_site(request).domain
        print '!!!>>>', domain
        print '!!!>>>', request.META['HTTP_HOST']
        request.META['HTTP_HOST'] = get_current_site(request).domain
        print '!!!>>>', request.META['HTTP_HOST']

        user, person = self.get_jwt_user_person(request)
        request.jwt_user = user
        request.person = person

        response = self.get_response(request)

        refresh_jwt = request.GET.get("?jwt", None)
        if refresh_jwt is not None:
            print 'refresh_jwt', refresh_jwt
            token = generate_jwt_for_user(user)
            response['X-NEW-JWT'] = token

        return response

    def get_jwt_user_person(self, request):
        if self.jwt_authentication.get_jwt_value(request):
            user, jwt = self.jwt_authentication.authenticate(request)
            if user and user.is_authenticated():
                try:
                    person = Person.nodes.get(user_id=user.pk)
                except Person.DoesNotExist:
                    print 'Person.DoesNotExist'
                    value = {'name': user.username}
                    person = Person(user_id=user.pk, value=value).save()
                return user, person
        return None, None
