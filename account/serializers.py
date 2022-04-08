from .models import CustomUser
from rest_framework import serializers


class UserSeralizer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        exclude = ['is_staff', 'groups', 'user_permissions']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        required_attrs = ['email', 'password', 'username', 'first_name']

        if not all(attr in attrs.keys() for attr in required_attrs):
            raise serializers.ValidationError('Missig required fields')
        return attrs

    def save(self, **kwargs):
        self.validated_data['is_active'] = True
        user = CustomUser(**self.validated_data)
        user.set_password(self.validated_data['password'])
        return user.save()
