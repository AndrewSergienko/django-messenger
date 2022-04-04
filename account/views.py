from .models import CustomUser
from .serializers import UserSeralizer
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response


class UserRegister(APIView):
    def post(self, request, format=None):
        serializer = UserSeralizer(request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class UserDetail(APIView):
    def get(self, request, pk, format=None):
        if pk == 'me':
            user = request.user
        else:
            user = get_object_or_404(CustomUser, id=pk)
        serializer = UserSeralizer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
