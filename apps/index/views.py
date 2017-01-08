import os
import mimetypes
from hashlib import sha224
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response

def index(request):
    messages.debug(request, '%s SQL statements were executed.' % 123)
    messages.info(request, 'Three credits remain in your account.')
    messages.success(request, 'Profile details updated.')
    messages.warning(request, 'Your account expires in three days.')
    messages.error(request, 'Document deleted.')
    return render(request, 'index/index.jinja2')


def oauth_callback(request):
    referer = request.META.get('HTTP_REFERER', 'http://localhost:80/')
    return redirect(referer)


class FileUploadView(APIView):
    parser_classes = (FileUploadParser,)

    @csrf_exempt
    def put(self, request, format=None):
        up_file = request.data['file']
        binary_content = up_file.read()
        file_hash = sha224(binary_content).hexdigest()
        fullpath = os.path.join(settings.MEDIA_ROOT, file_hash)
        if not os.path.exists(fullpath):
            try:
                os.makedirs(settings.MEDIA_ROOT)
            except OSError as exc: # Guard against race condition
                if exc.errno != errno.EEXIST:
                    raise
            with open(fullpath, 'wb+') as up_file:
                up_file.write(binary_content)
                up_file.close()

        return Response({ 'result':file_hash }, status=202)
