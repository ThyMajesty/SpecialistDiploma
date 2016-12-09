import json

from .models import Person

def update_user_neo4j_record(backend, user, response, *args, **kwargs):
    try:
        person = Person.nodes.get(user_id=user.pk)
    except Person.DoesNotExist:
        person = Person(user_id=user.pk)
    person.value = json.dumps(dict(response))
    person.save()