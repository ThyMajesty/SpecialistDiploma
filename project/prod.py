import os
from .settings import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'erd_db',
        'USER': 'erd',
        'PASSWORD': 'qwerty',
        'HOST': 'localhost',
    }
}

VAR_ROOT = '/var/virtualenv/erd/'

STATIC_ROOT = os.path.join(VAR_ROOT, "static")
MEDIA_ROOT = os.path.join(VAR_ROOT, "media")
