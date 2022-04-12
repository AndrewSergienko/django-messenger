from .models import CustomUser
from .serializers import UserSeralizer
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny


class UserRegister(APIView):
    permission_classes = [AllowAny]
    def post(self, request, format=None):
        serializer = UserSeralizer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'status': 'created'}, status=status.HTTP_201_CREATED)
        return Response({'status': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)


class UserDetail(APIView):
    def get(self, request, pk, format=None):
        if pk == 'me':
            user = request.user
        else:
            user = get_object_or_404(CustomUser, id=pk)
        serializer = UserSeralizer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
