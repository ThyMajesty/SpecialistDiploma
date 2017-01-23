import json

from .models import Person


def update_user_neo4j_record(backend, user, response, *args, **kwargs):
    try:
        person = Person.nodes.get(user_id=user.pk)
    except Person.DoesNotExist:
        person = Person(user_id=user.pk)
        data = dict(response)
        if backend.name == 'google-oauth2':
            args = {
                'name': data.get('displayName', user.username),
                'image': data.get('image', {}).get('url', None),
                'email': data.get('emails', [{}])[0].get('value', None),
                "socialAccounts": {
                    'url': data.get('url', ''),
                    'name': backend.name
                }
            }
        elif backend.name == 'twitter':
            args = {
                'name': data.get('name', user.username),
                'image': data.get('profile_image_url', None),
                "socialAccounts": {
                    'id': data.get('user_id', None),
                    'name': backend.name
                }
            }
        elif backend.name == 'facebook':
            args = {
                'name': data.get('name', user.username),
                "socialAccounts": {
                    'id': data.get('id', None),
                    'name': backend.name
                }
            }
        person.value = json.dumps(args)
        person.save()
