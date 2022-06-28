from django.urls import path
from . import views


app_name = 'account'
urlpatterns = [
    path('', views.UserRegister.as_view()),
    path('create_token', views.CreateEmailToken.as_view()),
    path('verify_token', views.VerifyEmailToken.as_view()),
    path('search', views.UserSearch.as_view()),
    path('<str:pk>', views.UserDetail.as_view()),
    path('me/edit', views.UserEdit.as_view())
]
