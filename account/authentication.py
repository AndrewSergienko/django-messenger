from .models import CustomUser
from django.db.models import Q


class EmailOrPhoneAuthBackend:
    def authenticate(self, request, username=None, password=None):
        try:
            user = CustomUser.objects.get(Q(email=username) | Q(phone=username))
            if user.check_password(password):
                return user
            return
        except CustomUser.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return CustomUser.objects.get(pk=user_id)
        except CustomUser.DoesNotExist:
            return None