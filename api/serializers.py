from rest_framework import serializers
from chat.models import Chat, Message
from account.models import CustomUser


class ChatSerializer(serializers.ModelSerializer):
    users = serializers.PrimaryKeyRelatedField(many=True, allow_empty=False, read_only=True)

    class Meta:
        model = Chat
        fields = ['id', 'users']


class UserSeralizer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'
