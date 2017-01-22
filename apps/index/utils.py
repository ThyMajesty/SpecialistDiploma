from django.http import HttpResponseForbidden
from django.core.exceptions import PermissionDenied

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
