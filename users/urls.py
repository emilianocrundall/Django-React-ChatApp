from django.urls import path
from users import views
from knox import views as knox_views

urlpatterns = [
    path('api/load_user', views.LoadUserAPIView.as_view()),
    path('api/register', views.RegisterAPIView.as_view()),
    path('api/login', views.LoginAPIView.as_view()),
    path('api/logout', knox_views.LogoutView.as_view(), name='logout'),
    path('api/connection_request_received/', views.ConnectionRequestReceivedAPIView.as_view()),
    path('api/search_users/', views.SearchUsersAPIView.as_view()),
    path('api/send_connection_request/<user_id>/', views.CreateConnectionAPIView.as_view()),
    path('api/cancel_connection_request/<user_id>/', views.CancelConnectionAPIView.as_view()),
    path('api/accept_connection_request/<user_id>/', views.AcceptConectionAPIView.as_view()),
    path('api/all_type_connections/', views.AllTypeConnectionsAPIView.as_view()),
    path('api/get_friends/', views.GetFriendsAPIView.as_view()),
]
