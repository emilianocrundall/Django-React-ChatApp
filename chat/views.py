from django.db import connection
from .models import Chat
from users.models import Connection
from users.serializers import ConnectionDetailSerializer
from .serializers import ChatSerializer
from rest_framework import generics, permissions, status
from rest_framework.views import APIView, Response

class FindChatAPIView(generics.RetrieveAPIView):

    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = ChatSerializer

    def get_object(self):
        chat = Chat.objects.get(connection=self.kwargs['connect_id'])
        return chat

class GetValidUserAPIView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    def get(self, request, chat_id, format=None):
        try:
            chat = Chat.objects.get(id=chat_id)
            connection = Connection.objects.get(id=chat.connection.id)
            user_id = self.request.user.id
            if user_id == connection.to_user.id or user_id == connection.from_user.id:
                serializer = ConnectionDetailSerializer(connection)
                return Response(data=serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        except Connection.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class UserChatsAPIView(generics.ListAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = ChatSerializer
    queryset = Connection.objects.all()

    def get_queryset(self):
        connection_from_user = self.queryset.filter(
            from_user=self.request.user.id,
            accepted=True
        )
        connection_to_user = self.queryset.filter(
            to_user=self.request.user.id,
            accepted=True
        )

        all_connections = connection_from_user.union(connection_to_user)
        all_connections_ids = all_connections.values_list('id', flat=True)

        return Chat.objects.filter(connection__in=all_connections_ids).order_by('-last_modification')
