import pytest
import json
from channels.testing import WebsocketCommunicator
from backend.asgi import application  # adjust 'backend' if your project name is different
from django.contrib.auth import get_user_model
from Chat.models import Room


User = get_user_model()


@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)

async def test_chat_websocket_flow():
    user = User.objects.create_user(username='testuser', email='test@example.com',password='Pass@1234')
    room = Room,objects.create(name='testrm', created_by=user)


    communicator = WebsocketCommunicator(application, f"/ws/chat/{room.name}/")
    connected,_ = await communicator.connect()  
    assert connected

    await communicator.send_json_to({
        "message":"Hello from Websocket!",
        "username" : "testuser",
        'room': room.name
    })

    response = await communicator.receive_json_from()
    assert response['message'] == 'Hello from Websocker!'
    assert response['username' ] == 'testuser'
    assert 'timestamp' in response


    await communicator.disconnect()