from .models import CustomUser
from rest_framework import serializers


class UserSeralizer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        exclude = ['is_staff', 'groups', 'user_permissions']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        required_attrs = ['username', 'password', 'first_name']
        or_attrs = ['phone', 'email']

        if not all(attr in attrs.keys() for attr in required_attrs):
            raise serializers.ValidationError('Missig required fields')
        if not any(attr in attrs.keys() for attr in or_attrs):
            raise serializers.ValidationError('Phone or email field required')
        return attrs

    def save(self, **kwargs):
        self.validated_data['is_active'] = True
        return CustomUser.objects.create_user(**self.validated_data)
