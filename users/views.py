from django.contrib.auth.models import User
from knox.models import AuthToken
from .serializers import (
    LoginSerializer,
    UserSerializer,
    RegisterSerializer,
    ConnectionSerializer,
    ConnectionDetailSerializer,
    UserDetailSerializer
)
from rest_framework import status, permissions, generics, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Connection
from chat.models import Chat
from django.utils import timezone

class LoadUserAPIView(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = UserSerializer
    def get_object(self):
        return self.request.user

class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            'user': UserSerializer(user, context=self.get_serializer_context).data,
            'token': AuthToken.objects.create(user)[1]
        })

class LoginAPIView(generics.CreateAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        token = AuthToken.objects.create(user)[1]
        return Response({
            'user': UserSerializer(user, context=self.get_serializer_context).data,
            'token': token
        })

class ConnectionRequestReceivedAPIView(generics.ListAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = ConnectionDetailSerializer

    def get_queryset(self):
        queryset = Connection.objects.filter(to_user=self.request.user, accepted=False)
        return queryset

class SearchUsersAPIView(generics.ListAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = UserDetailSerializer
    search_fields = ['username']
    filter_backends = (filters.SearchFilter,)

    def get_queryset(self):
        queryset = User.objects.all().exclude(id=self.request.user.id)
        return queryset

class CreateConnectionAPIView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def post(self, request, user_id, format=None):
        to_user = User.objects.get(id=user_id)
        serializer = ConnectionDetailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(from_user=self.request.user, to_user=to_user)
        return Response(data=serializer.data, status=status.HTTP_201_CREATED)

class CancelConnectionAPIView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def delete(self, request, user_id, format=None):
        try:
            connection = Connection.objects.get(to_user=user_id, from_user=self.request.user.id)
            connection.delete()
            return Response(status=status.HTTP_200_OK)
        except Connection.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class AcceptConectionAPIView(generics.RetrieveUpdateAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = ConnectionSerializer

    def update(self, request, *args, **kwargs):
        try:
            connection = Connection.objects.get(
                from_user=self.kwargs['user_id'],
                to_user=self.request.user.id
            )
            request.data.update({'accepted': True})
            serializer = ConnectionDetailSerializer(connection, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            chat = Chat.objects.create(connection_id=connection.id, last_modification=timezone.now())
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        except Connection.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class AllTypeConnectionsAPIView(generics.ListAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    queryset = Connection.objects.all()
    serializer_class = ConnectionDetailSerializer

    def get_queryset(self):
        connection_request_sent = self.queryset.filter(
            accepted=False,
            from_user=self.request.user.id,
        )
        connection_request_received = self.queryset.filter(
            accepted=False,
            to_user=self.request.user.id
        )
        connected_to = self.queryset.filter(
            accepted=True,
            from_user=self.request.user.id
        )
        connected_from = self.queryset.filter(
            accepted=True,
            to_user=self.request.user.id
        )
        return connection_request_sent.union(
            connection_request_received,
            connected_to,
            connected_from
        )

class GetFriendsAPIView(generics.ListAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = ConnectionDetailSerializer
    queryset = Connection.objects.all()

    def get_queryset(self):
        connected_from = self.queryset.filter(accepted=True, from_user=self.request.user.id)
        connected_to = self.queryset.filter(accepted=True, to_user=self.request.user.id)
        return connected_from.union(connected_to)
