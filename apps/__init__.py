from social.strategies.django_strategy import DjangoStrategy
from django.http import JsonResponse


def redirect(self, url):
    return JsonResponse({'url': url})


DjangoStrategy.redirect = redirect
