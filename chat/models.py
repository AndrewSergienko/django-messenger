from django.db import models
from account.models import CustomUser


class ChannelUser(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='channel_name')
    channel_name = models.CharField(max_length=200)


class Chat(models.Model):
    users = models.ManyToManyField(CustomUser, related_name='chats')


class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(CustomUser, null=True, on_delete=models.SET_NULL, related_name='messages')
    text = models.TextField(default='')
    date = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

