import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message, Room
from users.models import CustomUser
import datetime
import pytz
from urllib.parse import parse_qs
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model

User = get_user_model()



class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        query_string = self.scope["query_string"].decode()
        query_params = parse_qs(query_string)
        token = query_params.get("token", [None])[0]

        if token is None:
            await self.close()
            return

        try:
            # ✅ Decode and validate JWT token
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            self.user = await self.get_user_by_id(user_id)

            if self.user is None:
                await self.close()
                return

        except Exception as e:
            print("Token error:", e)
            await self.close()
            return

        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"chat_{self.room_name}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        print(f"Received WebSocket Data: {text_data}")
        data = json.loads(text_data)
        message = data['message']
        # username = data['username']
        room_name = data['room']

        # user = await self.get_user(username)
        room = await self.get_room(room_name)

        if self.user and room:
            await self.save_message(self.user, room, message)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'username': self.user.username
                }
            )

    async def chat_message(self, event):
        # timestamp = datetime.datetime.now().strftime("%I:%M %p")  # Format: HH:MM AM/PM
        # timestamp = datetime.datetime.now().isoformat()
        india_time = datetime.datetime.now(pytz.timezone("Asia/Kolkata"))
        event["timestamp"] =  india_time.isoformat()
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def get_user(self, username):
        user = CustomUser.objects.filter(username=username).first()
        print(f"🔍 Fetching User: {username} -> {user}")  # Debugging
        return user

    @database_sync_to_async
    def get_user_by_id(self, user_id):
        return User.objects.filter(id=user_id).first()

    @database_sync_to_async
    def get_room(self, room_name):
        room = Room.objects.filter(name=room_name).first()
        print(f"🔍 Fetching Room: {room_name} -> {room}")  # Debugging
        return room

    @database_sync_to_async
    def save_message(self, sender, room, content):
        print(f"📌 Attempting to Save Message: Sender={sender}, Room={room}, Content={content}")  # Debugging
        message = Message.objects.create(sender=sender, room=room, content=content)
        print(f"✅ Message Saved: {message}")
