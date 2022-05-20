from .models import CustomUser
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password, ValidationError


class UserSeralizer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        exclude = ['is_staff', 'groups', 'user_permissions']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs, return_errors=False):
        required_attrs = ['username', 'first_name']
        errors = {}

        for attr in required_attrs:
            # Перевірка на те, чи не пусті поля
            if attr not in attrs.keys() or attrs[attr] == '':
                errors[attr] = ['no value']

        if 'username' in attrs.keys() and len(attrs['username']) < 4 and attrs['username'] != '':
            # Перевірка на то, чи довжина username не менше 4
            if 'username' in errors.keys():
                errors['username'].append('short')
            else:
                errors['username'] = ['short']

        pass_valid = self._validate_password(attrs['password'])
        if pass_valid:
            errors['password'] = pass_valid

        if errors:
            if return_errors:
                return errors
            raise serializers.ValidationError(errors)

        if return_errors:
            return {}

        return attrs

    def _validate_password(self, password):
        """ Якщо пароль не пройшов валідацію, метод перезапише помилки в коротшому форматі для фронту в API"""
        errors_dict = {
            "This password is too short. It must contain at least 8 characters.": "short",
            "This password is too common.": "common",
            "This password is entirely numeric.": "onlynums"
        }
        if password != '':
            try:
                validate_password(password)
            except ValidationError as e:
                return [errors_dict[error] for error in e]

    def save(self, **kwargs):
        self.validated_data['is_active'] = True
        cleaned_data_keys = ['email', 'username', 'first_name', 'last_name', 'is_active']
        cleaned_data = {}
        for key in cleaned_data_keys:
            if key in self.validated_data:
                cleaned_data[key] = self.validated_data[key]

        user = CustomUser(**cleaned_data)
        user.set_password(self.validated_data['password'])
        return user.save()
