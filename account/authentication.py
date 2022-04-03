from .models import CustomUser
from django.db.models import Q
from rest_framework.authtoken.models import Token


class EmailOrPhoneAuthBackend:
    def authenticate(self, request, username=None, password=None):
        try:
            user = CustomUser.objects.get(Q(email=username) | Q(phone=username))
            if user.check_password(password):
                token = Token.objects.get_or_create(user=user)
                return (user, token)
            return
        except CustomUser.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return CustomUser.objects.get(pk=user_id)
        except CustomUser.DoesNotExist:
            return None
