from rest_framework import serializers
from chat.models import Chat, Message


class ChatSerializer(serializers.ModelSerializer):
    users = serializers.PrimaryKeyRelatedField(many=True, allow_empty=False, read_only=True)

    class Meta:
        model = Chat
        fields = ['id', 'users']
