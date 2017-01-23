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
                'name': data.get('displayName', ''),
                'image': data.get('image', {}).get('url', None),
                'email': data.get('emails', [{}])[0].get('value', None),
                "socialAccounts": {
                    'url': data.get('url', ''),
                    'name': backend.name
                }
            }
        elif backend.name == 'twitter':
            raise Exception(data)
        elif backend.name == 'facebook':
            raise Exception(data)
        person.value = json.dumps(args)
        person.save()
