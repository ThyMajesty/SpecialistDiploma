import json
import os
import mimetypes
from hashlib import sha224
from django.http import HttpResponse, Http404, JsonResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.parsers import FileUploadParser, MultiPartParser
from rest_framework.response import Response
from rest_framework_jwt.views import obtain_jwt_token
from rest_framework_jwt.settings import api_settings
from django.template.loader import render_to_string
from apps.index.utils import person_required


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


@csrf_exempt
def reg(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        new_user = User()
        new_user.username = data.get('username', '')
        new_user.email = data.get('email', '')
        try:
            new_user.set_password(data.get('password', ''))
            new_user.save()
        except Exception as e:
            return JsonResponse({'msg':e.message})
        return obtain_jwt_token(request)
    elif request.method == 'GET':
        return HttpResponse(content=render_to_string('index/social.jinja2'), content_type="application/json")


def sauth(request):
    payload = api_settings.JWT_PAYLOAD_HANDLER(request.user)
    token = api_settings.JWT_ENCODE_HANDLER(payload)
    return redirect('http://localhost:8080/#/social?token='+token)


class FileUploadView(APIView):
    parser_classes = (FileUploadParser,)

    @csrf_exempt
    @person_required
    def post(self, request, format=None):
        print 'FileUploadView'
        up_file = request.data['file']
        binary_content = up_file.read()
        extension = mimetypes.guess_extension(request.content_type)
        file_hash = sha224(binary_content).hexdigest() + extension
        fullpath = os.path.join(settings.MEDIA_ROOT, file_hash)
        if not os.path.exists(fullpath):
            try:
                os.makedirs(settings.MEDIA_ROOT)
            except OSError as exc: # Guard against race condition
                pass
            with open(fullpath, 'wb+') as stored_file:
                stored_file.write(binary_content)
                stored_file.close()

        return Response({ 'result':{ 'hash': file_hash, 'mimetype': up_file.content_type } }, status=202)
        

class MultiFileUploadView(APIView):
    parser_classes = (MultiPartParser,)

    @csrf_exempt
    @person_required
    def post(self, request, format=None):
        print 'MultiFileUploadView'
        result = {}
        for name, up_file in request.data.items():
            binary_content = up_file.read()
            extension = mimetypes.guess_extension(up_file.content_type)
            file_hash = sha224(binary_content).hexdigest()
            file_hash += extension or ('.' + up_file.content_type.split('/')[1])
            fullpath = os.path.join(settings.MEDIA_ROOT, file_hash)
            if not os.path.exists(fullpath):
                try:
                    os.makedirs(settings.MEDIA_ROOT)
                except OSError as exc: # Guard against race condition
                    pass
                with open(fullpath, 'wb+') as stored_file:
                    stored_file.write(binary_content)
                    stored_file.close()
            result[name] = { 'hash': file_hash, 'mimetype': up_file.content_type }
        return Response({ 'result':result }, status=202)