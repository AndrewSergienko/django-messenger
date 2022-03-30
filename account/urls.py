from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

app_name = 'account'
urlpatterns = [
    path('login', views.user_login, name='user_login'),
    path('register', views.user_register, name='user_register')
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)