from django.urls import path, re_path

from . import consumers

websocket_urlpatterns = [
    path('ws/chats/<chat_id>/', consumers.ChatConsumer.as_asgi()),
]
