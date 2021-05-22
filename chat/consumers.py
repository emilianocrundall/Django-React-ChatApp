from datetime import date
from channels.consumer import AsyncConsumer
from channels.db import database_sync_to_async
from django.utils import timezone
import json
from .models import Chat, Connection, Message
from .serializers import MessageSerializer

class ChatConsumer(AsyncConsumer):

    async def websocket_connect(self, event):

        chat_room = f"chat_room_{self.scope['url_route']['kwargs']['chat_id']}"
        self.chat_room = chat_room
        await self.channel_layer.group_add(chat_room, self.channel_name)

        await self.send({
            'type': 'websocket.accept'
        })

        valid = await self.valid_user()

        if not valid:
            await self.send({
                'type': 'websocket.close'
            })
        messages = await self.get_chat_messages()
        
        await self.send({
            'type': 'chat_messages',
            'text': json.dumps(messages)
        })

    async def websocket_disconnect(self, event):
        await self.channel_layer.group_discard(
            self.chat_room,
            self.channel_name
        )

    async def websocket_receive(self, event):

        data = json.loads(event['text'])

        if 'type' in data:
            messages = await self.get_chat_messages()
            await self.send({
                'type': 'websocket.send',
                'text': json.dumps(messages)
            })
        elif 'text' in data:
            message = await self.save_message(
                data['text'],
                self.scope['user'],
                self.scope['url_route']['kwargs']['chat_id'],
                timezone.now()
            )

            await self.update_last_chat_modification()

            await self.channel_layer.group_send(
                self.chat_room, {
                    'type': 'chat_message',
                    'text': json.dumps(message)
                }
            )

    async def chat_message(self, event):
        await self.send({
            'type': 'websocket.send',
            'text': event['text']
        })

    @database_sync_to_async
    def valid_user(self):
        chat = Chat.objects.get(id=self.scope['url_route']['kwargs']['chat_id'])
        connection = Connection.objects.get(id=chat.connection.id)

        if connection.to_user == self.scope['user'] or connection.from_user == self.scope['user']:
            return True
        
    @database_sync_to_async
    def save_message(self, text, user, chat, date):
        message = Message.objects.create(
            text=text,
            author=user,
            chat_id=chat,
            date=date
        )
        data = MessageSerializer(instance=message).data
        return data

    @database_sync_to_async
    def get_chat_messages(self):
        chat = Chat.objects.get(id=self.scope['url_route']['kwargs']['chat_id'])
        connection = Connection.objects.get(id=chat.connection.id)

        data = []
        if connection.to_user == self.scope['user'] or connection.from_user == self.scope['user']:
            messages = Message.objects.filter(
                chat_id=self.scope['url_route']['kwargs']['chat_id']
            ).order_by('date')
            for message in messages:
                json_message = MessageSerializer(instance=message).data
                data.append(json_message)   
        return data

    @database_sync_to_async
    def update_last_chat_modification(self):
        chat = Chat.objects.get(id=self.scope['url_route']['kwargs']['chat_id'])
        chat.last_modification = timezone.now()
        chat.save()