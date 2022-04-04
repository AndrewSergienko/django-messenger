from django.urls import path

from . import views

app_name = 'chat'
urlpatterns = [
    path('', views.ChatList.as_view()),
    path('<int:pk>', views.ChatDetail.as_view()),
]