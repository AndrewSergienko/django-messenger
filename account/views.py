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
                return Response({'status': 'created'}, status=status.HTTP_201_CREATED)
        except serializers.ValidationError as e:
            """ 
            Якщо email або пароль не проходить валідацію, то метод перезапише помилки в зручному для API форматі
            Сама валідація відбувається у системних методах Djangо.
            """

            email_errors = {
                'user with this email already exists.': 'user exist',
                'Enter a valid email address.': 'not valid',
                'This field may not be blank.': 'no value'
            }

            # Фікс ситуації, коли чомусь дублюється помилка валідації email
            if 'email' in e.detail.keys() and len(e.detail['email']) > 1:
                e.detail['email'] = [e.detail['email'][0]]

            for error in e.detail.keys():
                if error == 'email':
                    e.detail[error][0] = email_errors[e.detail[error][0]]
                elif error == 'password':
                    # В методі перезаписується тільки помилка про пустоту поля password.
                    # Всі інші помилки валідації перезаписуються в UserSeralizer.validate()
                    if e.detail[error][0] == 'This field may not be blank.':
                        e.detail[error][0] = 'no value'
            raise e

        return Response({'status': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)


class UserDetail(APIView):
    def get(self, request, pk, format=None):
        if pk == 'me':
            user = request.user
        else:
            user = get_object_or_404(CustomUser, id=pk)
        serializer = UserSeralizer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
