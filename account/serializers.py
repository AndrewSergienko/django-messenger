from .models import CustomUser, EmailToken
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password, ValidationError
from files.serializers import FileSerializer


class UserSeralizer(serializers.ModelSerializer):
    avatar = FileSerializer()

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'password', 'phone', 'first_name', 'last_name', 'last_login', 'avatar']
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

        # Перевірка на те, чи підтверджений email
        try:
            token = EmailToken.objects.get(email=attrs['email'])
            if not token.confirmed:
                errors['email'] = ['not confirmed']
        except EmailToken.DoesNotExist:
            errors['email'] = ['not confirmed']

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
        # по дефолту is_active == False
        self.validated_data['is_active'] = True
        cleaned_data_keys = ['email', 'username', 'first_name', 'last_name', 'is_active']
        cleaned_data = {}
        for key in cleaned_data_keys:
            if key in self.validated_data:
                cleaned_data[key] = self.validated_data[key]

        cleaned_data['username'] = cleaned_data['username'].lower()

        user = CustomUser(**cleaned_data)
        user.set_password(self.validated_data['password'])
        return user.save()


class EmailTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailToken
        fields = '__all__'

    def validate(self, attrs):
        try:
            CustomUser.objects.get(email=attrs['email'])
            raise ValidationError({"email": "user exist"})
        except CustomUser.DoesNotExist:
            return attrs

