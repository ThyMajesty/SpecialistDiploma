import jwt
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

from jwt_auth import settings, exceptions
from jwt_auth.utils import get_authorization_header
from jwt_auth.compat import json, smart_text, User


jwt_decode_handler = settings.JWT_DECODE_HANDLER
jwt_get_user_id_from_payload = settings.JWT_PAYLOAD_GET_USER_ID_HANDLER

class JWTAuthenticationMiddleware(ModelBackend):
    def authenticate(self, request):
        UserModel = get_user_model()
        auth = get_authorization_header(request).split()
        auth_header_prefix = settings.JWT_AUTH_HEADER_PREFIX.lower()
        try:
            if not auth or smart_text(auth[0].lower()) != auth_header_prefix:
                raise exceptions.AuthenticationFailed()

            if len(auth) == 1:
                msg = 'Invalid Authorization header. No credentials provided.'
                raise exceptions.AuthenticationFailed(msg)
            elif len(auth) > 2:
                msg = ('Invalid Authorization header. Credentials string '
                       'should not contain spaces.')
                raise exceptions.AuthenticationFailed(msg)

            try:
                payload = jwt_decode_handler(auth[1])
            except jwt.ExpiredSignature:
                msg = 'Signature has expired.'
                raise exceptions.AuthenticationFailed(msg)
            except jwt.DecodeError:
                msg = 'Error decoding signature.'
                raise exceptions.AuthenticationFailed(msg)

            user = self.authenticate_credentials(payload)
        except exceptions.AuthenticationFailed as e:
            pass
        
        return user

    def authenticate_credentials(self, payload):
        """
        Returns an active user that matches the payload's user id and email.
        """
        try:
            user_id = jwt_get_user_id_from_payload(payload)

            if user_id:
                user = User.objects.get(pk=user_id, is_active=True)
            else:
                msg = 'Invalid payload'
                raise exceptions.AuthenticationFailed(msg)
        except User.DoesNotExist:
            msg = 'Invalid signature'
            raise exceptions.AuthenticationFailed(msg)

        return user
