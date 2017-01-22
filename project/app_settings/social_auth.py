# PYTHON-SOCIAL-AUTH https://python-social-auth.readthedocs.io/en/latest/configuration/django.html

# Used to redirect the user once the auth process ended successfully.
# The value of ?next=/foo is used if it was present
SOCIAL_AUTH_LOGIN_REDIRECT_URL = '/sauth/'

# URL where the user will be redirected in case of an error
SOCIAL_AUTH_LOGIN_ERROR_URL = '/login-error/'

# Is used as a fallback for LOGIN_ERROR_URL
SOCIAL_AUTH_LOGIN_URL = '/login-url/'

# Used to redirect new registered users, will be used in place of SOCIAL_AUTH_LOGIN_REDIRECT_URL if defined. 
# Note that ?next=/foo is appended if present, if you want new users to go to next, you'll need to do it yourself.
# SOCIAL_AUTH_NEW_USER_REDIRECT_URL = '/new-users-redirect-url/'

# Like SOCIAL_AUTH_NEW_USER_REDIRECT_URL but for new associated accounts (user is already logged in). 
# Used in place of SOCIAL_AUTH_LOGIN_REDIRECT_URL
# SOCIAL_AUTH_NEW_ASSOCIATION_REDIRECT_URL = '/new-association-redirect-url/'

# The user will be redirected to this URL when a social account is disconnected
SOCIAL_AUTH_DISCONNECT_REDIRECT_URL = '/account-disconnected-redirect-url/'

# Inactive users can be redirected to this URL when trying to authenticate.
SOCIAL_AUTH_INACTIVE_USER_URL = '/inactive-user/'

# If you want to use the full email address as the username, define this setting.
SOCIAL_AUTH_USERNAME_IS_FULL_EMAIL = True

from ..secret import SOCIAL_AUTH_GOOGLE_OAUTH2_KEY, SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET
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