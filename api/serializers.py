from rest_framework import serializers
from django.contrib.auth import authenticate
from account.models import CustomUser


class CustomAuthTokenSerializer(serializers.Serializer):
    email = serializers.CharField(write_only=True)
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True
    )
    token = serializers.CharField(
        read_only=True
    )

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'),
                                username=email, password=password)
            if user is None:
                try:
                    CustomUser.objects.get(email=email)
                    raise serializers.ValidationError({'password': 'not correct'})
                except CustomUser.DoesNotExist:
                    raise serializers.ValidationError({'email': 'not exist'})

            attrs['user'] = user
            return attrs


