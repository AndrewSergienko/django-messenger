from django.shortcuts import render, get_object_or_404
from api.serializers import ChatSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from account.models import CustomUser
from django.http import Http404
from chat.models import Chat, Message
from account.models import CustomUser


class ChatList(APIView):
    def get(self, request, format=None):
        chats = request.user.chats.all()
        serializer = ChatSerializer(chats, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = ChatSerializer(data=request.data)
        if serializer.is_valid():
            if request.data['user_id']:
                user = get_object_or_404(CustomUser, id=request.data['user_id'])
                chat = serializer.save()
                chat.users.add(request.user, user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Http404


class ChatDetail(APIView):
    def get(self, request, chat_id, format=None):
        chat = get_object_or_404(Chat, id=chat_id)
        serializer = ChatSerializer()



