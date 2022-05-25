import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from rest_framework.authtoken.models import Token
from account.models import CustomUser
from account.serializers import UserSeralizer
from .models import Chat, Message
from .serializers import MessageSerializer, ChatSerializer
from app.redis import redis


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Створює поле [user, channel_name] для подальшої ідентифікації
        token = self.scope["url_route"]["kwargs"]["token"]
        user_id = await self.get_user_id_by_token(token)
        self.scope['user_id'] = user_id
        redis.set(user_id, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        redis.delete(self.scope["url_route"]["kwargs"]["token"])
        # await self.delete_channel_user()

    async def receive(self, text_data=None, bytes_data=None):
        """ Метод викливається з клієнту користувача """
        try:
            text_data_json = json.loads(text_data)
            if text_data_json['type'] == 'message':
                message_data = {
                    'chat': text_data_json['chat'],
                    'user': self.scope['user_id'],
                    'text': text_data_json['text']
                }
                message = await self.create_message(message_data, save=True, return_obj=True)

                chat = message_data['chat']
                receivers = await self.get_receivers(chat)
                for receiver in receivers:
                    channel_name = redis.get(str(receiver))
                    if channel_name:
                        await self.channel_layer.send(channel_name,
                                                      {
                                                          'type': 'chat_message',
                                                          'message_id': message.id
                                                      })
            elif text_data_json['type'] == 'read':
                message = await self.get_message(text_data_json['message_id'])
                message.read = True
                self.save_obj(message)
        # Якщо не зловить помилку, то це приведе до websocket disconect
        except CustomUser.DoesNotExist:
            pass

    async def chat_message(self, event):
        # Метод викликається, якщо ловить повідомлення від іншого користувача
        message = await self.get_message(event['message_id'], serialize=True)
        message_return = {'type': 'message',
                          'message': message}

        # Надсилається повідомлення до JS клієнта в браузері
        await self.send(text_data=json.dumps(message_return))

    # Django ORM не підтримує асинхронність, тому потрібно використовувати декоратори
    @database_sync_to_async
    def get_user_id_by_token(self, key):
        return Token.objects.get(key=key).user_id

    @database_sync_to_async
    def get_user(self, pk, serialize=False):
        user = CustomUser.objects.get(id=pk)
        if serialize:
            serializer = UserSeralizer(user)
            return serializer.data
        return user

    @database_sync_to_async
    def get_message(self, pk, serialize=False):
        message = Message.objects.get(id=pk)
        if serialize:
            serializer = MessageSerializer(message)
            return serializer.data
        return message

    @database_sync_to_async
    def get_chat(self, pk, serialize=False):
        chat = Chat.objects.get(id=pk)
        if serialize:
            serializer = ChatSerializer(chat)
            return serializer.data
        return chat

    @database_sync_to_async
    def create_message(self, data, save=False, return_obj=False):
        data['chat'] = Chat.objects.get(id=data['chat'])
        data['user'] = CustomUser.objects.get(id=self.scope['user_id'])
        message = Message(**data)
        if save:
            message.save()
        if return_obj:
            return message

    @database_sync_to_async
    def save_obj(self, obj):
        obj.save()

    @database_sync_to_async
    def get_receivers(self, chat):
        users = [user.id for user in chat.users.all()]
        users.remove(self.scope['user_id'])
        return users