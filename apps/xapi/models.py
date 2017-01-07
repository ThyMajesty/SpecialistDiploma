from django.db import models

class ApiCallCache(models.Model):
    api_name = models.CharField(max_length=50)
    query = models.CharField(max_length=50)
    result = models.TextField(blank=True)