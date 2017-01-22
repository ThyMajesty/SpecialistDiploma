import os
import mimetypes
from hashlib import sha224
from django.conf import settings
from django.core.exceptions import PermissionDenied
from rest_framework_jwt.settings import api_settings


def person_required(_view):
    def _decorated(*args, **kwargs):
        request = None
        for arg in args:
            if 'request' in type(arg).__name__.lower():
                request = arg
        if request is None:
            raise PermissionDenied
        person = request.person
        if person is None:
            raise PermissionDenied
        return _view(*args, **kwargs)
    return _decorated


def save_file(up_file):
    binary_content = up_file.read()
    extension = mimetypes.guess_extension(up_file.content_type)
    file_hash = sha224(binary_content).hexdigest()
    file_hash += extension or ('.' + up_file.content_type.split('/')[1])
    fullpath = os.path.join(settings.MEDIA_ROOT, file_hash)
    if not os.path.exists(fullpath):
        try:
            os.makedirs(settings.MEDIA_ROOT)
        except OSError as exc:  # Guard against race condition
            print exc.message
        with open(fullpath, 'wb+') as stored_file:
            stored_file.write(binary_content)
            stored_file.close()
    return {'hash': file_hash, 'mimetype': up_file.content_type}


def generate_jwt_for_user(user):
    payload = api_settings.JWT_PAYLOAD_HANDLER(user)
    token = api_settings.JWT_ENCODE_HANDLER(payload)
    return token
