"""
Django settings for project project.

Generated by 'django-admin startproject' using Django 1.10.3.

For more information on this file, see
https://docs.djangoproject.com/en/1.10/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.10/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.10/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '$xa7y-njl%pgn8tk4+32s#-eku!m(*dxiaw(n92%o3f91g0%d0'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = not False

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',

    'django_extensions',
    'debug_toolbar',
    'social.apps.django_app.default',
    # 'django_jinja.contrib._easy_thumbnails',
    'django_jinja.contrib._subdomains',
    'django_jinja.contrib._humanize',

    'subdomains',
    #'easy_thumbnails',
    'tastypie',
    'jwt_auth',
    'corsheaders',

    'apps.adapters',
    'apps.core',
    'apps.index',
    'apps.utils',
    'apps.xapi',
]


MIDDLEWARE = [
    'debug_toolbar.middleware.DebugToolbarMiddleware',

    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'apps.adapters.subdomain.SubdomainURLRoutingMiddleware', # before CommonMiddleware 
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

SITE_ID = 1

ROOT_URLCONF = 'project.urls'

SUBDOMAIN_URLCONFS = {
    None: 'project.urls',  # no subdomain, e.g. ``example.com``
    'api': 'project.api_urls',      # e.g. ``api.example.com``
    'admin': 'project.admin_urls',      # e.g. ``admin.example.com``
}

ALLOWED_HOSTS = [
    'localhost', 
    '.localhost', 
    '127.0.0.1', 
    '[::1]',
]
CORS_ORIGIN_WHITELIST = (
    'localhost:8080',
    '127.0.0.1:8080'
)

CORS_ALLOW_HEADERS = (
    'Access-Control-Allow-Origin',
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
)

CONTEXT_PROCESSORS = [
    'django.template.context_processors.debug',
    'django.template.context_processors.request',
    'django.contrib.auth.context_processors.auth',
    'django.contrib.messages.context_processors.messages',
    'social.apps.django_app.context_processors.backends',
    'social.apps.django_app.context_processors.login_redirect',
]

TEMPLATES = [
    {
        "BACKEND": "django_jinja.backend.Jinja2",
        "APP_DIRS": True,
        "OPTIONS": {
            "match_extension": ".jinja2", # Match the template names ending in .jinja2 but not the ones in the admin folder.
            "match_regex": r"^(?!admin/).*",
            "app_dirname": "templates",
            "undefined": None, # Can be set to "jinja2.Undefined" or any other subclass.
            "newstyle_gettext": True,
            "extensions": [
                "jinja2.ext.do",
                "jinja2.ext.loopcontrols",
                "jinja2.ext.with_",
                "jinja2.ext.i18n",
                "jinja2.ext.autoescape",
                "django_jinja.builtins.extensions.CsrfExtension",
                "django_jinja.builtins.extensions.CacheExtension",
                "django_jinja.builtins.extensions.TimezoneExtension",
                "django_jinja.builtins.extensions.UrlsExtension",
                "django_jinja.builtins.extensions.StaticFilesExtension",
                "django_jinja.builtins.extensions.DjangoFiltersExtension",
            ],
            "context_processors": CONTEXT_PROCESSORS,
            "bytecode_cache": {
                "name": "default",
                "backend": "django_jinja.cache.BytecodeCache",
                "enabled": False,
            },
            "autoescape": True,
            "auto_reload": DEBUG,
            "translation_engine": "django.utils.translation",
        }
    },
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": CONTEXT_PROCESSORS,
        }
    },
]

WSGI_APPLICATION = 'project.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.10/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

FIXTURE_DIRS = ['fixtures']

DATABASE_URL = 'http://neo4j:qwerty@localhost:7474/db/data/'
os.environ['NEO4J_REST_URL'] = DATABASE_URL

# Password validation
# https://docs.djangoproject.com/en/1.10/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/1.10/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.10/howto/static-files/

STATIC_URL = '/static/'

STATIC_ROOT = os.path.join(BASE_DIR, "static")

MEDIA_URL = '/media/'

MEDIA_ROOT = os.path.join(BASE_DIR, "media")

# PYTHON-SOCIAL-AUTH
# https://python-social-auth.readthedocs.io/en/latest/configuration/django.html

AUTHENTICATION_BACKENDS = (
    'apps.adapters.jwt_mv.JWTAuthenticationMiddleware',
    'social.backends.google.GoogleOAuth2',
    'django.contrib.auth.backends.ModelBackend',
)

# Used to redirect the user once the auth process ended successfully.
# The value of ?next=/foo is used if it was present
SOCIAL_AUTH_LOGIN_REDIRECT_URL = '/logged-in/'

# URL where the user will be redirected in case of an error
SOCIAL_AUTH_LOGIN_ERROR_URL = '/login-error/'

# Is used as a fallback for LOGIN_ERROR_URL
SOCIAL_AUTH_LOGIN_URL = '/login-url/'

# Used to redirect new registered users, will be used in place of SOCIAL_AUTH_LOGIN_REDIRECT_URL if defined. 
# Note that ?next=/foo is appended if present, if you want new users to go to next, you'll need to do it yourself.
SOCIAL_AUTH_NEW_USER_REDIRECT_URL = '/new-users-redirect-url/'

# Like SOCIAL_AUTH_NEW_USER_REDIRECT_URL but for new associated accounts (user is already logged in). 
# Used in place of SOCIAL_AUTH_LOGIN_REDIRECT_URL
SOCIAL_AUTH_NEW_ASSOCIATION_REDIRECT_URL = '/new-association-redirect-url/'

# The user will be redirected to this URL when a social account is disconnected
SOCIAL_AUTH_DISCONNECT_REDIRECT_URL = '/account-disconnected-redirect-url/'

# Inactive users can be redirected to this URL when trying to authenticate.
SOCIAL_AUTH_INACTIVE_USER_URL = '/inactive-user/'

# If you want to use the full email address as the username, define this setting.
SOCIAL_AUTH_USERNAME_IS_FULL_EMAIL = True

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = '126035424988-d6554vq6oa5nftp4tjsui4cecrqernk1.apps.googleusercontent.com'
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = 'TwB9CjQijPPDEcsrca3juo6v'
SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = []

SOCIAL_AUTH_PIPELINE = (
    # Get the information we can about the user and return it in a simple format to create the user instance later. On some cases the details are
    # already part of the auth response from the provider, but sometimes this could hit a provider API.
    'social.pipeline.social_auth.social_details',
    # Get the social uid from whichever service we're authing thru. The uid is the unique identifier of the given user in the provider.
    'social.pipeline.social_auth.social_uid',
    # Verifies that the current auth process is valid within the current project, this is were emails and domains whitelists are applied (if defined).
    'social.pipeline.social_auth.auth_allowed',
    # Checks if the current social-account is already associated in the site.
    'social.pipeline.social_auth.social_user',
    # Make up a username for this person, appends a random string at the end if there's any collision.
    'social.pipeline.user.get_username',
    # Send a validation email to the user to verify its email address. Disabled by default.
    # 'social.pipeline.mail.mail_validation',
    # Associates the current social details with another user account with a similar email address. Disabled by default.
    'social.pipeline.social_auth.associate_by_email',
    # Create a user account if we haven't found one yet.
    'social.pipeline.user.create_user',
    # Create the record that associated the social account with this user.
    'social.pipeline.social_auth.associate_user',
    # Populate the extra_data field in the social record with the values specified by settings (and the default ones like access_token, etc).
    'social.pipeline.social_auth.load_extra_data',
    # Update the user record with any changed info from the auth service.
    'social.pipeline.user.user_details',
    # Updates neo4j records
    'apps.core.pipeline.update_user_neo4j_record'
)
# DEBUG_TOOLBAR

if DEBUG:
    INTERNAL_IPS = ['127.0.0.1',]

    DEBUG_TOOLBAR_PANELS = [
        'debug_toolbar.panels.versions.VersionsPanel',
        'debug_toolbar.panels.timer.TimerPanel',
        'debug_toolbar.panels.settings.SettingsPanel',
        'debug_toolbar.panels.headers.HeadersPanel',
        'debug_toolbar.panels.request.RequestPanel',
        'debug_toolbar.panels.sql.SQLPanel',
        'debug_toolbar.panels.staticfiles.StaticFilesPanel',
        'apps.adapters.debug.TemplatesPanel', # http://stackoverflow.com/questions/38569760/django-debug-toolbar-template-object-has-no-attribute-engine
        'debug_toolbar.panels.cache.CachePanel',
        'debug_toolbar.panels.signals.SignalsPanel',
        'debug_toolbar.panels.logging.LoggingPanel',
        'debug_toolbar.panels.redirects.RedirectsPanel',
    ]

# TASTYPIE

API_LIMIT_PER_PAGE = 50
TASTYPIE_FULL_DEBUG = DEBUG
TASTYPIE_DEFAULT_FORMATS = ['json',]
TASTYPIE_ABSTRACT_APIKEY = True

JWT_AUTH_HEADER_PREFIX = 'JWT'