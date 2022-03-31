import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from .models import Chat, ChannelUser
from account.models import CustomUser


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Створює поле [user, channel_name] для подальшої ідентифікації
        await self.create_channel_user()
        await self.accept()

    async def disconnect(self, code):
        await self.delete_channel_user()

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
        # Якщо не зловить помилку, то це приведе до websocket disconect
        except (CustomUser.DoesNotExist, ChannelUser.DoesNotExist):
            pass

    async def chat_message(self, event):
        # Метод викликається, якщо ловить повідомлення від іншого користувача
        message = event['message']

        # Надсилається повідомлення до JS клієнта в браузері
        await self.send(text_data=json.dumps({
            'message': message
        }))

    # Django ORM не підтримує асинхронність, тому потрібно використовувати декоратори
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
