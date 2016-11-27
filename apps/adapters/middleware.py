from subdomains.middleware import SubdomainMiddleware as BaseSubdomainMiddleware
  
try:
    from django.utils.deprecation import MiddlewareMixin
except ImportError:
    # Pre Django 1.10 middleware does not require the mixin.
    MiddlewareMixin = object
 
BaseSubdomainMiddleware.__bases__ = (MiddlewareMixin,)
class SubdomainMiddleware(MiddlewareMixin, BaseSubdomainMiddleware):
        """
        A middleware class that adds a ``subdomain`` attribute to the current request.
        """