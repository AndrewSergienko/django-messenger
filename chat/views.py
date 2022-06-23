from account.serializers import UserSeralizer
from .serializers import ChatSerializer, MessageSerializer
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
        for i, chat in enumerate(serializer.data):
            if chat['type'] == 'personal':
                friend_id = chat['users'][0] if chat['users'][1] == request.user.id else chat['users'][1]
                friend_serializer = UserSeralizer(CustomUser.objects.get(id=friend_id))
                chat['friend'] = friend_serializer.data
                message_serializer = MessageSerializer(chats[i].messages.last())
                chat['last_message'] = message_serializer.data
                del chat['users']
        return Response(serializer.data, status=status.HTTP_200_OK)


class ChatCreate(APIView):
    def post(self, request, format=None):
        serializer = ChatSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            if request.data['user_id']:
                try:
                    user = CustomUser.objects.get(id=request.data['user_id'])
                    chat = serializer.save()
                    chat.users.add(request.user, user)
                    # TEMP SOLUTION
                    message = Message(chat=chat, user=request.user, text="temp init")
                    message.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                except CustomUser.DoesNotExist:
                    return Response({'user_id': 'not exist'}, status=status.HTTP_400_BAD_REQUEST)


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


def room(request):
    return render(request, 'chat/room.html')
