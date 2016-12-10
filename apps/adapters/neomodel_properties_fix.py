from functools import wraps
from neomodel.properties import PropertyManager


def decorate(func):
    def wrapper(*args, **kwargs):
        func_result = func(*args, **kwargs)
        self = args[0]
        properties = self.defined_properties(rels=False, aliases=False).items()
        for key, val in properties:
            raw_value = getattr(self, key)
            if raw_value and isinstance(raw_value, unicode):
                setattr(self, key, val.inflate(raw_value))
        return func_result
    return wraps(func)(wrapper)

PropertyManager.__init__ = decorate(PropertyManager.__init__)