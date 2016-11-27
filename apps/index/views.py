from django.http import HttpResponse
from django.shortcuts import render
from django.contrib import messages

def index(request):
    messages.debug(request, '%s SQL statements were executed.' % 123)
    messages.info(request, 'Three credits remain in your account.')
    messages.success(request, 'Profile details updated.')
    messages.warning(request, 'Your account expires in three days.')
    messages.error(request, 'Document deleted.')
    return render(request, 'index/index.jinja2')