from account.models import CustomUser
from rest_framework import authentication
from rest_framework import exceptions
from django.db.models import Q
from rest_framework.authtoken.models import Token


class EmailOrPhoneAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        username = request.data['username']
        password = request.data['password']
        if not username:
            return None
        try:
            user = CustomUser.objects.get(Q(email=username) | Q(phone=username) | Q(username=username))
            if user.check_password(password):
                token = Token.objects.get_or_create(user=user)
                return (user, token)

        except CustomUser.DoesNotExist:
            if 'api/users/' in request.path and request.method == 'POST':
                return None
            raise exceptions.AuthenticationFailed('No such user')