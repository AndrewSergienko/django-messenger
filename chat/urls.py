from django.urls import path

from . import views

app_name = 'chat'
urlpatterns = [
    path('', views.room, name='room'),
    path('create/<int:user_id>', views.create_chat, name='create_chat'),
]