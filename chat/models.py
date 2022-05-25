from django.db import models
from account.models import CustomUser


class Chat(models.Model):
    type_choices = (
        ('personal', 'personal'),
        ('group', 'group')
    )
    type = models.CharField(max_length=8, choices=type_choices, default='personal')
    users = models.ManyToManyField(CustomUser, related_name='chats')


class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(CustomUser, null=True, on_delete=models.SET_NULL, related_name='messages')
    text = models.TextField(default='')
    date = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

