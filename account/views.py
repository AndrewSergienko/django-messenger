import random
from app.redis import redis
from .models import CustomUser, EmailToken
from .serializers import UserSeralizer, EmailTokenSerializer
from .tasks import task_send_mail
from django.shortcuts import get_object_or_404
from django.contrib.postgres.search import TrigramSimilarity
from rest_framework import status, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from files.models import File
from files.serializers import FileSerializer


def overwrite_errors_user_info(errors):
    # Перезапис помилок валідацій на зручніші для API, які відбуваються на рівні полей
    # Всі інші кастомні валідації відбуваються в UserSerializer.valiate()
    for error in errors.detail.keys():
        if error == 'password':
            if errors.detail[error][0] == 'This field may not be blank.':
                errors.detail[error][0] = 'no value'
        elif error == 'username':
            for i, message in enumerate(errors.detail[error]):
                if message == 'user with this username already exists.':
                    errors.detail[error][i] = 'user exist'
    return errors


class UserRegister(APIView):
    """Клас призначений для реєстрації користувача через POST-запит."""

    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = UserSeralizer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            EmailToken.objects.get(email=request.data['email']).delete()
            return Response(status=status.HTTP_201_CREATED)
        except serializers.ValidationError as e:
            raise overwrite_errors_user_info(e)


class UserSetAvatar(APIView):
    def post(self, request, format=None):
        try:
            user = request.user
            avatar = File.objects.get(id=request.data['file_id'])
            if 'image' not in avatar.type:
                return Response({"file": "not is image"}, status=status.HTTP_400_BAD_REQUEST)
            user.avatar = avatar
            user.save()
            return Response(status=status.HTTP_200_OK)
        except File.DoesNotExist:
            return Response({"file": "not exist"}, status=status.HTTP_400_BAD_REQUEST)


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
        result_data = serializer.data
        is_online = redis.get(str(user.id))
        result_data['active_status'] = "online" if is_online else "offline"
        return Response(result_data, status=status.HTTP_200_OK)


class UserEdit(APIView):
    def post(self, request, format=None):
        allowed_fields_update = ['username', 'first_name', 'last_name', 'phone']
        update_fields = []
        user = request.user
        for field in request.data.keys():
            if field in allowed_fields_update:
                user.__dict__[field] = request.data[field]
                update_fields.append(field)
        serializer = UserSeralizer(data=user.__dict__)
        try:
            serializer.is_valid(raise_exception=True)
            user.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except serializers.ValidationError as e:
            e.detail.update(serializer.validate(serializer.data, return_errors=True))
            errors = overwrite_errors_user_info(e)
            error_fields = list(errors.detail.keys())
            for error in error_fields:
                if error not in update_fields:
                    del errors.detail[error]
            if errors.detail:
                raise errors
            user.save()
            serializer = UserSeralizer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)


class UserSearch(APIView):
    def get(self, request, format=None):
        username = request.GET['username']
        users = CustomUser.objects.annotate(similarity=TrigramSimilarity('username', username))\
            .filter(similarity__gt=0.3).order_by('-similarity')
        if len(users) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = UserSeralizer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
