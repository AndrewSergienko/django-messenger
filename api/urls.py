from django.urls import path, include
from .authtoken import authtoken_view
from rest_framework.urlpatterns import format_suffix_patterns


app_name = 'api'
urlpatterns = [
    path('chats/', include('chat.urls', namespace='chat')),
    path('users/', include('account.urls', namespace='account')),
    path('auth/', authtoken_view, name="auth")
]

urlpatterns = format_suffix_patterns(urlpatterns)
