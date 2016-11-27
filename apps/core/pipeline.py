import json

from .models import Person

def update_user_neo4j_record(backend, user, response, *args, **kwargs):
    # profile = user.get_profile()
    # if profile is None:
    #     profile = Profile(user_id=user.id)

    args = {
        'user_id': user.pk,
        'value': json.dumps(dict(response))
    }

    Person.create_or_update(**args)