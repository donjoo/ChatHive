from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import create_room,list_rooms ,get_messages

router = DefaultRouter()
# router.register(r'messages', MessageViewSet)


urlpatterns = [
    path('',include(router.urls)),
    path('create-room/',create_room, name='create_room'),
    path('list-rooms/',list_rooms, name='list_rooms'),
    path("messages/<str:room_name>/", get_messages, name='get_messages'),

]