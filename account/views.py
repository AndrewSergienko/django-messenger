import random
from .models import CustomUser, EmailToken
from .serializers import UserSeralizer, EmailTokenSerializer
from .tasks import task_send_mail
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
                EmailToken.objects.get(email=request.data['email']).delete()
                return Response(status=status.HTTP_201_CREATED)
        except serializers.ValidationError as e:
            # Перезапис помилок валідацій на зручніші для API, які відбуваються на рівні полей
            # Всі інші кастомні валідації відбуваються в UserSerializer.valiate()
            for error in e.detail.keys():
                if error == 'password':
                    if e.detail[error][0] == 'This field may not be blank.':
                        e.detail[error][0] = 'no value'
                elif error == 'username':
                    for i, message in enumerate(e.detail[error]):
                        if message == 'user with this username already exists.':
                            e.detail[error][i] = 'user exist'
            raise e


class CreateEmailToken(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        token = str(random.randint(100000, 999999))
        data = {
            'email': request.data['email'],
            'token': token
        }
        serializer = EmailTokenSerializer(data=data)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            task_send_mail.delay(data['email'], data['token'])
            return Response(status=status.HTTP_200_OK)
        except serializers.ValidationError as e:
            # Перезапис помилок валідацій на зручніші для API, які відбуваються на рівні полей
            # Всі інші кастомні валідації відбуваються в EmailTokenSerializer.valiate()
            if e.detail['email'][0] == "Enter a valid email address.":
                e.detail['email'][0] = "not valid"
            elif e.detail['email'][0] == 'This field may not be blank.':
                e.detail['email'][0] = "no value"
            elif e.detail['email'][0] == "email token with this email already exists.":
                # Якщо код підвердження вже був відправлений, то відправити його знову
                EmailToken.objects.get(email=data['email']).delete()
                if serializer.is_valid():
                    serializer.save()
                    return Response(status=status.HTTP_200_OK)
            raise e


class VerifyEmailToken(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        try:
            email = EmailToken.objects.get(token=request.data['token'])
            email.confirmed = True
            email.save()
            return Response({'email': email.email}, status=status.HTTP_200_OK)
        except EmailToken.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UserDetail(APIView):
    def get(self, request, pk, format=None):
        if pk == 'me':
            user = request.user
        else:
            user = get_object_or_404(CustomUser, id=pk)
        serializer = UserSeralizer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
