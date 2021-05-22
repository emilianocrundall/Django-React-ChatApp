from django.db import models
from django.contrib.auth.models import User
from users.models import Connection

class Chat(models.Model):
    connection = models.ForeignKey(Connection, on_delete=models.CASCADE, related_name='connection_chat')
    last_modification = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    text = models.CharField(max_length=500)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='author_messages')
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='chat_messages')
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text
