from django.urls import path
from . import views


app_name = 'account'
urlpatterns = [
    path('', views.UserRegister.as_view(), name="register"),
    path('create_token', views.CreateEmailToken.as_view()),
    path('verify_token', views.VerifyEmailToken.as_view()),
    path('<str:pk>', views.UserDetail.as_view(), name="detail"),
]
