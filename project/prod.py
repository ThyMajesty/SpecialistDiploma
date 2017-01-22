from . import settings

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'erd_db',
        'USER': 'admin',
        'PASSWORD': 'qwerty',
    }
}