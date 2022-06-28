from django.urls import path

from . import views

app_name = 'chats'
urlpatterns = [
    path('list', views.ChatList.as_view()),
    path('create', views.ChatCreate.as_view()),
    path('remove', views.ChatRemove.as_view()),
    path('<int:pk>', views.ChatDetail.as_view()),
    path('<int:chat_pk>/messages', views.Messages.as_view())
]