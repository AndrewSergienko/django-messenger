from .serializers import ChatSerializer
from .models import Chat, Message
from account.models import CustomUser
from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class ChatList(APIView):
    def get(self, request, format=None):
        chats = request.user.chats.all()
        serializer = ChatSerializer(chats, many=True)
        return Response(serializer.data)

    # Create chat
    def post(self, request, format=None):
        serializer = ChatSerializer(data=request.data)
        if serializer.is_valid():
            if request.data['user_id']:
                user = get_object_or_404(CustomUser, id=request.data['user_id'])
                chat = serializer.save()
                chat.users.add(request.user, user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(data=status.HTTP_400_BAD_REQUEST)


class ChatDetail(APIView):
    def get(self, request, pk, format=None):
        chat = get_object_or_404(Chat, id=pk)
        if request.user in chat.users.all():
            serializer = ChatSerializer(chat)
            return Response(serializer.data, status=status.HTTP_200_OK)


def room(request):
    return render(request, 'chat/room.html')
