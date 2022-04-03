from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views
from rest_framework.authtoken import views as api_views

app_name = 'api'
urlpatterns = [
    path('chats/', views.ChatList.as_view()),
    #path('user/login/', views.UserLogin.as_view()),
    path('auth/', api_views.obtain_auth_token)
]

urlpatterns = format_suffix_patterns(urlpatterns)
