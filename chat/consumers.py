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
        redis.delete(self.scope['user_id'])

    async def receive(self, text_data=None, bytes_data=None):
        """ Метод викливається з клієнту користувача """
        text_data_json = json.loads(text_data)
        text_data_json['chat'] = await self.get_chat(text_data_json['chat'])
        text_data_json['user'] = await self.get_user(self.scope['user_id'])
        send_functions = {
            'message': self.data_send_message,
            'read': self.data_send_read_event
        }
        send_data = await send_functions[text_data_json['type']](text_data_json)
        receivers = await self.get_receivers(text_data_json['chat'])
        for receiver in receivers:
            channel_name = redis.get(str(receiver))
            if channel_name:
                await self.channel_layer.send(channel_name, send_data)

    async def data_send_message(self, data):
        message_data = {
            'chat': data['chat'],
            'user': data['user'],
            'text': data['text']
        }
        message = await self.create_message(message_data, save=True, return_obj=True)
        return {
            'type': 'chat_message',
            'message_id': message.id
        }

    async def data_send_read_event(self, data):
        message = await self.get_message(data['message_id'])
        message.read.add(data['user'])
        await self.update_obj(message)
        return {
            'type': 'read_event',
            'message': message.id,
            'chat': data['chat'].id,
            'user': self.scope['user_id']
        }

    async def chat_message(self, event):
        # Метод викликається, якщо ловить повідомлення від іншого користувача
        message = await self.get_message(event['message_id'], relation='user', serialize=True)
        message_return = {'type': 'message',
                          'message': message}

        # Надсилається повідомлення до JS клієнта в браузері
        await self.send(text_data=json.dumps(message_return))

    async def read_event(self, event):
        await self.send(text_data=json.dumps(event))

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
    def get_message(self, pk, relation=False, serialize=False):
        if relation:
            message = Message.objects.select_related(relation).get(id=pk)
        else:
            message = Message.objects.get(id=pk)
        if serialize:
            if relation == 'chat':
                relation_serializer = ChatSerializer(message.chat)
            else:
                relation_serializer = UserSeralizer(message.user)
            message_serializer = MessageSerializer(message)
            result_data = message_serializer.data
            result_data[relation] = relation_serializer.data
            return result_data
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
        message = Message(**data)
        if save:
            message.save()
        if return_obj:
            return message

    @database_sync_to_async
    def save_obj(self, obj):
        obj.save()

    @database_sync_to_async
    def update_obj(self, obj, **kwargs):
        obj.update(**kwargs)

    @database_sync_to_async
    def get_receivers(self, chat):
        return [user.id for user in chat.users.exclude(id=self.scope['user_id'])]

    @database_sync_to_async
    def get_model_prefetch(self, model_class, pk, prefetch_fields):
        return model_class.objects.get(id=pk).prefetch_related(*prefetch_fields)
