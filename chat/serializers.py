from .models import Chat, Message
from rest_framework import serializers
from users.serializers import ConnectionDetailSerializer

class ChatSerializer(serializers.ModelSerializer):
    connection = ConnectionDetailSerializer(read_only=True)
    class Meta:
        model = Chat
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = Message
