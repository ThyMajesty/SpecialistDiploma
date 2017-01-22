def split_dict_values(data, sep=', '):
    return {k: v.split(sep) for k, v in data.items()}


def extract_subdict(data, key, default=None):
    return data.get(key, default or {})
