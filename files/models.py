from django.db import models
from account.models import CustomUser
from app.storage_backends import PublicMediaStorage


class File(models.Model):
    file = models.FileField(storage=PublicMediaStorage())
    data = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=10)
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='files')
