from .models import CustomUser
from .serializers import UserSeralizer
from django.shortcuts import get_object_or_404
from rest_framework import status, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny


class UserRegister(APIView):
    """Клас призначений для реєстрації користувача через POST-запит."""

    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = UserSeralizer(data=request.data)
        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(status=status.HTTP_201_CREATED)
        except serializers.ValidationError as e:
            """ 
            Якщо email або пароль не проходить валідацію, то метод перезапише помилки в зручному для API форматі
            Сама валідація відбувається у системних методах Djangо та UserSerializer.validate().
            """

            email_errors = {
                'user with this email already exists.': 'user exist',
                'Enter a valid email address.': 'not valid',
                'This field may not be blank.': 'no value'
            }

            if 'email' in e.detail.keys():
                # Якщо email буде не валідний, то у відповіді буде вказано лиш ця помилка
                # а інші помилки валідації будуть проігноровані.
                # Тому, якщо у відповіді є помилка валідації email, то в блоці відбувається перевірка інших полів
                if len(e.detail['email']) > 1:
                    # Фікс ситуації, коли чомусь дублюється помилка валідації email
                    e.detail['email'] = [e.detail['email'][0]]
                errors = serializer.validate(serializer.initial_data, return_errors=True)
                e.detail.update(errors)

            for error in e.detail.keys():
                if error == 'email':
                    e.detail[error][0] = email_errors[e.detail[error][0]]
                elif error == 'password':
                    # В методі перезаписується тільки помилка про пустоту поля password.
                    # Всі інші помилки валідації перезаписуються в UserSeralizer.validate()
                    if e.detail[error][0] == 'This field may not be blank.':
                        e.detail[error][0] = 'no value'
            raise e


class UserDetail(APIView):
    def get(self, request, pk, format=None):
        if pk == 'me':
            user = request.user
        else:
            user = get_object_or_404(CustomUser, id=pk)
        serializer = UserSeralizer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
