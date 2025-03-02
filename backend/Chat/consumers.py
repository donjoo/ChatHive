import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.db.models import Q
import jwt
from django.conf import settings
from urllib.parse import parse_qs

logger = logging.getLogger(__name__)

class ChatConsumer(AsyncWebsocketConsumer):
    @database_sync_to_async
    def initialize_chat(self, user_id, receiver_username):
        from users.models import CustomUser
        from .models import Message, Room
        
        try:
            user = CustomUser.objects.get(id=user_id)
            room_name = f"{min(user.username, receiver_username)}_{max(user.username, receiver_username)}"
            room, _ = Room.objects.get_or_create(name=room_name)
            messages = list(
                Message.objects.select_related('sender', 'receiver', 'room')
                .filter(room=room)
                .order_by('timestamp')
            )
            return user, room, messages
        except Exception as e:
            logger.error(f"Chat initialization error: {str(e)}")
            return None, None, []

    @database_sync_to_async
    def format_message(self, message):
        return {
            'message': message.content,
            'sender': message.sender.username,
            'timestamp': message.timestamp.isoformat()
        }

    async def connect(self):
        try:
            # 🔹 Extract token safely
            query_string = parse_qs(self.scope['query_string'].decode())
            token = query_string.get('token', [None])[0]

            if not token:
                logger.warning("WebSocket rejected: No token provided")
                await self.close()
                return

            # 🔹 Decode JWT token
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            except jwt.ExpiredSignatureError:
                logger.warning("WebSocket rejected: Token expired")
                await self.close()
                return
            except jwt.InvalidTokenError:
                logger.warning("WebSocket rejected: Invalid token")
                await self.close()
                return

            # 🔹 Get user & chat room
            self.receiver_username = self.scope['url_route']['kwargs']['receiver_username']
            self.user, self.room, messages = await self.initialize_chat(payload.get('user_id'), self.receiver_username)

            if not self.user or not self.room:
                logger.warning("WebSocket rejected: User or room not found")
                await self.close()
                return

            self.sender = self.user
            self.room_group_name = f"chat_{self.room.name}"

            # 🔹 Join group and accept connection
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()
            logger.info(f"WebSocket connected: {self.user.username}")

            # 🔹 Send past messages
            for message in messages:
                formatted_message = await self.format_message(message)
                await self.send(text_data=json.dumps(formatted_message))

        except Exception as e:
            logger.error(f"WebSocket connection error: {str(e)}")
            await self.close()

    @database_sync_to_async
    def save_message(self, content):
        from users.models import CustomUser
        from .models import Message
        try:
            receiver = CustomUser.objects.get(username=self.receiver_username)
            return Message.objects.create(
                room=self.room,
                sender=self.sender,
                receiver=receiver,
                content=content
            )
        except Exception as e:
            logger.error(f"Message save error: {str(e)}")
            return None

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
            logger.info(f"WebSocket disconnected: {self.user.username}")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message = await self.save_message(data['message'])
            if message:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': message.content,
                        'sender': message.sender.username,
                        'timestamp': message.timestamp.isoformat()
                    }
                )
        except Exception as e:
            logger.error(f"WebSocket receive error: {str(e)}")

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))
