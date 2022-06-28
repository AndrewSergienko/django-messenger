from account.serializers import UserSeralizer
from .serializers import ChatSerializer, MessageSerializer
from .models import Chat, Message
from account.models import CustomUser
from files.serializers import FileSerializer
from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from app.redis import redis


class ChatList(APIView):
    def get(self, request, format=None):
        chats = request.user.chats.all()
        serializer = ChatSerializer(chats, many=True)
        for i, chat in enumerate(serializer.data):
            if chat['type'] == 'personal':
                friend_id = chat['users'][0] if chat['users'][1] == request.user.id else chat['users'][1]
                friend = CustomUser.objects.get(id=friend_id)
                friend_serializer = UserSeralizer(friend)
                chat['friend'] = friend_serializer.data
                is_online = redis.get(str(friend.id))
                chat['friend']['active_status'] = "online" if is_online else "offline"
                if friend.avatar:
                    avatar_serializer = FileSerializer(friend.avatar)
                    chat['friend']['avatar'] = avatar_serializer.data

                message_serializer = MessageSerializer(chats[i].messages.last())
                chat['last_message'] = message_serializer.data
                del chat['users']
        return Response(serializer.data, status=status.HTTP_200_OK)


class ChatCreate(APIView):
    def post(self, request, format=None):
        if request.data['user_id']:
            try:
                user = CustomUser.objects.get(id=request.data['user_id'])
                if user == request.user:
                    return Response({'user_id': 'same user'}, status=status.HTTP_400_BAD_REQUEST)
                if Chat.objects.filter(users=request.user).filter(users=user):
                    return Response({'chat': 'chat exist'}, status=status.HTTP_400_BAD_REQUEST)
                serializer = ChatSerializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                chat = serializer.save()
                chat.users.add(request.user, user)
                return Response({'id': serializer.data['id']}, status=status.HTTP_201_CREATED)
            except CustomUser.DoesNotExist:
                return Response({'user_id': 'not exist'}, status=status.HTTP_400_BAD_REQUEST)


class ChatRemove(APIView):
    def post(self, request, format=None):
        chat = get_object_or_404(Chat, id=request.data['chat_id'])
        if request.user in chat.users.all():
            chat.delete()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response({'reason': 'has no right'}, status=status.HTTP_400_BAD_REQUEST)


class ChatDetail(APIView):
    def get(self, request, pk, format=None):
        chat = get_object_or_404(Chat, id=pk)
        if request.user in chat.users.all():
            serializer = ChatSerializer(chat)
            return Response(serializer.data, status=status.HTTP_200_OK)


class Messages(APIView):
    def get(self, request, chat_pk):
        chat = get_object_or_404(Chat, id=chat_pk)
        message = get_object_or_404(Message, id=request.GET['message_id'])\
            if 'message_id' in request.GET else None
        direction = request.GET['direction'] if 'direction' in request.GET else None
        messages_num = int(request.GET['messages_num'])
        if message and direction:
            if direction == 'up':
                messages = chat.messages.filter(id__lt=message.id).order_by('id')[:messages_num]
            elif direction == 'down':
                messages = chat.messages.filter(id__gt=message.id).order_by('-id')[:messages_num]
        else:
            messages = chat.messages.order_by('id')

        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
