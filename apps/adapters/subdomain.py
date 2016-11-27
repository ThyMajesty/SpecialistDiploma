from subdomains.middleware import SubdomainMiddleware as BaseSubdomainMiddleware
from subdomains.middleware import SubdomainURLRoutingMiddleware as BaseSubdomainURLRoutingMiddleware
try:
    from django.utils.deprecation import MiddlewareMixin
except ImportError:
    # Pre Django 1.10 middleware does not require the mixin.
    MiddlewareMixin = object
 
class SubdomainMiddleware(MiddlewareMixin, BaseSubdomainMiddleware):
    """
    A middleware class that adds a ``subdomain`` attribute to the current request.
    """
    pass

class SubdomainURLRoutingMiddleware(SubdomainMiddleware, BaseSubdomainURLRoutingMiddleware):
    pass