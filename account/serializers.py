from .models import CustomUser
from rest_framework import serializers


class UserSeralizer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        exclude = ['password', 'is_staff', 'groups', 'user_permissions']