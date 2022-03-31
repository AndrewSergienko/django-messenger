import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from account.models import CustomUser
from app.redis import redis


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Створює поле [user, channel_name] для подальшої ідентифікації
        redis.set(str(self.scope['user'].id), self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        redis.delete(str(self.scope['user'].id))
        # await self.delete_channel_user()

    async def receive(self, text_data=None, bytes_data=None):
        try:
            text_data_json = json.loads(text_data)
            channel_name = redis.get(text_data_json['user_id'])
            message = text_data_json['message']
            await self.channel_layer.send(channel_name,
                                          {
                                              'type': 'chat_message',
                                              'message': message
                                          })
        # Якщо не зловить помилку, то це приведе до websocket disconect
        except CustomUser.DoesNotExist:
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
    def get_user(self, user_id):
        return CustomUser.objects.get(id=user_id)
