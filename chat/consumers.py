import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Отримyє root_name з URL маршрута
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # Підключення до групи.
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name)

        # Приймає підключення WebSocket.
        # Якщо не викликати, то підключення буде відхилено
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name)

    # Отримує введене повідомлення від JS і відсилає групі chat_message
    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                # type - ім'я метода, який повинен викликатись у отримувачів
                'type': 'chat_message',
                'message': message
            })

    # Отримує повідомлення від channel_layer.group_send і відсилає його в JS
    async def chat_message(self, event):
        message = event['message']

        await self.send(text_data=json.dumps({
            'message': message
        }))
