import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from .models import Chat, ChannelUser
from account.models import CustomUser


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        '''# Отримyє root_name з URL маршрута
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # Підключення до групи.
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name)'''

        await self.create_channel_user()

        # Приймає підключення WebSocket.
        # Якщо не викликати, то підключення буде відхилено
        await self.accept()

    async def disconnect(self, code):
        '''await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name)'''
        await self.delete_channel_user()

    # Отримує введене повідомлення від JS і відсилає групі chat_message
    async def receive(self, text_data=None, bytes_data=None):
        try:
            text_data_json = json.loads(text_data)
            user = await self.get_channel_user(text_data_json['user_id'])
            user_channel_name = await self.get_channel_name(user)
            message = text_data_json['message']
            await self.channel_layer.send(user_channel_name,
                                          {
                                              'type': 'chat_message',
                                              'message': message
                                          })

        except (CustomUser.DoesNotExist, ChannelUser.DoesNotExist):
            await print('ERROR')
        '''await self.channel_layer.group_send(
            self.room_group_name,
            {
                # type - ім'я метода, який повинен викликатись у отримувачів
                'type': 'chat_message',
                'message': message
            })'''

    # Отримує повідомлення від channel_layer.group_send і відсилає його в JS
    async def chat_message(self, event):
        message = event['message']

        await self.send(text_data=json.dumps({
            'message': message
        }))

    @database_sync_to_async
    def create_channel_user(self):
        ChannelUser.objects.get_or_create(user=self.scope['user'], channel_name=self.channel_name)

    @database_sync_to_async
    def delete_channel_user(self):
        ChannelUser.objects.filter(channel_name=self.channel_name).delete()

    @database_sync_to_async
    def get_channel_user(self, user_id):
        return CustomUser.objects.get(id=user_id)

    @database_sync_to_async
    def get_channel_name(self, user):
        return user.channel_name.channel_name
