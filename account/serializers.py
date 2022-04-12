from .models import CustomUser
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password, ValidationError


class UserSeralizer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        exclude = ['is_staff', 'groups', 'user_permissions']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        required_attrs = ['username', 'first_name']

        errors = []
        not_in_fields = []
        for attr in required_attrs:
            if attr not in attrs.keys():
                not_in_fields.append(attr)

        if not_in_fields:
            errors.append(f'No required fields: {", ".join(not_in_fields)}')
        try:
            validate_password(attrs['password'])
        except ValidationError as e:
            errors.append(e.messages)
        if errors:
            raise serializers.ValidationError(errors)

        return attrs

    def save(self, **kwargs):
        self.validated_data['is_active'] = True
        cleaned_data_keys = ['email', 'username', 'first_name', 'last_name', 'is_active']
        cleaned_data = {}
        for key in cleaned_data_keys:
            if key in self.validated_data:
                cleaned_data[key] = self.validated_data[key]

        user = CustomUser(**cleaned_data)
        validate_password(self.validated_data['password'])
        user.set_password(self.validated_data['password'])
        return user.save()
