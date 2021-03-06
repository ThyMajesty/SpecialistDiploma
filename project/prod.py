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

SITE_ID = 3

INTERFACE_URL = 'http://erd-fe.herokuapp.com/'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': os.path.join(VAR_ROOT, "debug.log"),
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
