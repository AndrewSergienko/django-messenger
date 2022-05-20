from django.urls import path
from . import views


app_name = 'account'
urlpatterns = [
    path('', views.UserRegister.as_view(), name="register"),
    path('<str:pk>', views.UserDetail.as_view(), name="detail"),
]
