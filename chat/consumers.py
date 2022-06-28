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

        await self.send_user_active_status('online')

        await self.accept()

    async def disconnect(self, code):
        await self.send_user_active_status('offline')
        redis.delete(self.scope['user_id'])

    async def receive(self, text_data=None, bytes_data=None):
        """
        Метод викливається з клієнту користувача.
        """
        text_data_json = json.loads(text_data)
        if text_data_json['type'] in ['create_chat_event']:
            await self.send_create_chat_event(text_data_json)
        else:
            text_data_json['chat'] = await self.get_chat_by_id(text_data_json['chat'])
            text_data_json['user'] = await self.get_user(self.scope['user_id'])
            data_functions = {
                'message': self.data_message,
                'read_event': self.data_read_event,
            }
            data = await data_functions[text_data_json['type']](text_data_json)
            receivers = await self.get_receivers_in_chat(text_data_json['chat'])
            await self.send_to_receivers(receivers, data)

    """
    Data defs:
    data функції обробляють відповідну подію та формують і повертають дані, які потрібно відправити отримувачу 
    """
    async def data_message(self, data):
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

    async def data_read_event(self, data):
        message = await self.get_message(data['message_id'])
        message.read.add(data['user'])
        await self.update_obj(message)
        return {
            'type': 'read_event',
            'message': message.id,
            'chat': data['chat'].id,
            'user': self.scope['user_id']
        }

    async def send_create_chat_event(self, data):
        chat = await self.get_chat_by_id(data['chat_id'])
        receivers = await self.get_receivers_in_chat(chat)
        data = {
            'type': 'create_chat_event',
            'chat_id': data['chat_id'],
            'chat_type': chat.type,
        }
        if chat.type == 'personal':
            friend_id = receivers[0]
            data['friend'] = friend_id
        await self.send_to_receivers(receivers, data)

    async def send_user_active_status(self, status):
        """
        Повідомляє друзів про змінення статусу активності користучава.
        Під "друзями" маються на увазі користувачі, в яких є персональний чат з поточним користувачем
        TODO: Повідомляти також користувача, який на даний момент переглядає профіль
        """
        user = await self.get_user(self.scope['user_id'])
        personal_chats = await self.get_chats_by_user(user, 'personal')
        receivers = []
        for chat in personal_chats:
            receivers += await self.get_receivers_in_chat(chat)
        data = {
            'type': 'user_active_status_event',
            'user_id': self.scope['user_id'],
            'status': status
        }
        await self.send_to_receivers(receivers, data)

    async def send_to_receivers(self, receivers, data):
        for receiver in receivers:
            channel_name = redis.get(str(receiver))
            if channel_name:
                await self.channel_layer.send(channel_name, data)

    async def chat_message(self, event):
        # Метод викликається, якщо ловить повідомлення від іншого користувача
        message = await self.get_message(event['message_id'], relation='user', serialize=True)
        message_return = {'type': 'message',
                          'message': message}

        # Надсилається повідомлення до JS клієнта в браузері
        await self.send(text_data=json.dumps(message_return))

    async def read_event(self, event):
        await self.send(text_data=json.dumps(event))

    async def user_active_status_event(self, event):
        await self.send(text_data=json.dumps(event))

    async def create_chat_event(self, event):
        await self.send(text_data=json.dumps(event))

    # Django ORM не підтримує асинхронність, тому потрібно використовувати декоратори
    @database_sync_to_async
    def get_user_id_by_token(self, key):
        return Token.objects.values_list('user_id', flat=True).get(key=key)

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
            message_serializer = MessageSerializer(message)
            result_data = message_serializer.data
            if relation:
                if relation == 'chat':
                    relation_serializer = ChatSerializer(message.chat)
                else:
                    relation_serializer = UserSeralizer(message.user)
                result_data[relation] = relation_serializer.data
            return result_data
        return message

    @database_sync_to_async
    def get_chat_by_id(self, pk, serialize=False):
        chat = Chat.objects.get(id=pk)
        if serialize:
            serializer = ChatSerializer(chat)
            return serializer.data
        return chat

    @database_sync_to_async
    def get_chats_by_user(self, user:CustomUser, chat_type):
        chats = user.chats.filter(type=chat_type)
        # якщо залишити в QuerySet, то при спробі отримати елемент, буде виконаний запрос в базу
        # така спроба є в методі, який не обернутий декоратором database_sync_to_async, тому буде помилка
        return list(chats)

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
    def get_receivers_in_chat(self, chat: Chat):
        receivers = chat.users.values_list('id', flat=True).exclude(id=self.scope['user_id'])
        return list(receivers)
