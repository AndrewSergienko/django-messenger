from django.urls import path
from . import views


app_name = 'account'
urlpatterns = [
    path('', views.UserRegister.as_view()),
    path('<str:pk>', views.UserDetail.as_view()),
]
