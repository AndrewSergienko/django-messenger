from django.db import models
from chat.models import Message
from app.storage_backends import PublicMediaStorage


class File(models.Model):
    file = models.FileField(storage=PublicMediaStorage())
    data = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=10)
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='files')
