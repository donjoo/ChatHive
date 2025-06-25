from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from Chat.models import Room, Message
from django.utils.dateformat import DateFormat


User = get_user_model()

class ChatAPITest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='john', email='john@gamil.com', password='Pass@1234')
        self.client = APIClient()
        self.client.force_authenticate(user= self.user)


    def test_create_room(self):
        response = self.client.post('/api/create-room/', {'name': 'test-room'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Room.objects.count(),1)
        self.assertEqual(Room.objects.first().name, 'test-room')

    def test_list_room(self):
        Room.objects.create(name='room1', created_by=self.user)
        Room.objects.create(name='room2', created_by=self.user)
        response = self.client.get('/api/list-rooms/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['rooms']),2)


    def test_get_messages(self):
        room = Room.objects.create(name='room1',created_by= self.user)
        Message.objects.create(sender=self.user, room=room, content="Hello dude")
        response = self.client.get(f'/api/messages/{room.name}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['messages']),1)
        self.assertEqual(response.data['messages'][0]['content'],'Hello dude')
