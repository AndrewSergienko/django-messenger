from django.urls import path, include
from rest_framework.authtoken import views as api_views
from rest_framework.urlpatterns import format_suffix_patterns


app_name = 'api'
urlpatterns = [
    path('chats/', include('chat.urls', namespace='chat')),
    path('users/', include('account.urls', namespace='account')),
    path('auth/', api_views.obtain_auth_token)
]

urlpatterns = format_suffix_patterns(urlpatterns)
