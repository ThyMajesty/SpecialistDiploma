from rest_framework.negotiation import BaseContentNegotiation

class IgnoreClientContentNegotiation(BaseContentNegotiation):
    def select_parser(self, request, parsers):
        if request.GET.get('format', None) == 'web':
            return parsers[1]
        return parsers[0]

    def select_renderer(self, request, renderers, format_suffix):
        if request.GET.get('format', None) == 'web':
            return (renderers[1], renderers[1].media_type)
        return (renderers[0], renderers[0].media_type)