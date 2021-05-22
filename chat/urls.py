from django.urls import path
from chat import views

urlpatterns = [
    path('api/find_chat/<connect_id>/', views.FindChatAPIView.as_view()),
    path('api/get_valid_user/<chat_id>/', views.GetValidUserAPIView.as_view()),
    path('api/user_chats/', views.UserChatsAPIView.as_view()),
]
