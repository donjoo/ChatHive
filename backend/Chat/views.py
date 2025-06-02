from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Room, Message
from users.models import CustomUser
from rest_framework.permissions import IsAuthenticated

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_room(request):
    name = request.data.get('name')
    user = request.user  # Ensure authentication
    room, created = Room.objects.get_or_create(name=name, defaults={'created_by': user})
    return Response({"room_id": room.id, "room_name": room.name})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_rooms(request):
    rooms = Room.objects.all().values("id", "name")
    return Response({"rooms": list(rooms)})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_messages(request, room_name):
    try:
        room = Room.objects.get(name=room_name)
        messages = Message.objects.filter(room=room).values("sender__username", "content", "timestamp")
        print(messages)
        return Response({"messages": list(messages)})
    except Room.DoesNotExist:
        return Response({"error": "Room not found"}, status=404)
