# from django.contrib.auth.models import User
from django.db import models
from users.models import CustomUser
class Room(models.Model):
    name = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
class Message(models.Model):
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="sent_messages",null=True, blank=True)
    receiver = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="received_messages",null=True, blank=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']
