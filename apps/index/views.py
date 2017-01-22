import json
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import redirect
from rest_framework.views import APIView
from django.template.loader import render_to_string
from rest_framework.parsers import FileUploadParser, MultiPartParser
from rest_framework.response import Response
from rest_framework_jwt.views import obtain_jwt_token
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt

from .utils import person_required, save_file, generate_jwt_for_user


def index(request):
    # Just redirect to angular interface
    return redirect(settings.INTERFACE_URL)


@csrf_exempt
def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        new_user = User()
        new_user.username = data.get('username', '')
        new_user.email = data.get('email', '')
        try:
            new_user.set_password(data.get('password', ''))
            new_user.save()
        except Exception as e:
            return JsonResponse({'msg': e.message}, status=500)
        return obtain_jwt_token(request)
    elif request.method == 'GET':
        urls = json.loads(render_to_string('index/social.jinja2'))
        return JsonResponse(urls)


def social_post_jwt_auth(request):
    token = generate_jwt_for_user(request.user)
    return redirect(settings.INTERFACE_URL + '#/social?token=' + token)


class SingleFileUploadView(APIView):
    parser_classes = (FileUploadParser,)

    @csrf_exempt
    @person_required
    def post(self, request, format=None):
        print 'FileUploadView'
        up_file = request.data['file']
        result = save_file(up_file)
        return Response({'result': result}, status=202)


class MultiFileUploadView(APIView):
    parser_classes = (MultiPartParser,)

    @csrf_exempt
    @person_required
    def post(self, request, format=None):
        print 'MultiFileUploadView'
        items = request.data.items()
        result = {name: save_file(up_file) for name, up_file in items}
        return Response({'result': result}, status=202)


singlefileuploadview = SingleFileUploadView.as_view()
multifileuploadview = MultiFileUploadView.as_view()
