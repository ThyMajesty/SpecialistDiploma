from .settings import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'erd_db',
        'USER': 'erd',
        'PASSWORD': 'qwerty',
    }
}
