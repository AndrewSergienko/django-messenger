from django.urls import path

from . import views

app_name = 'files'
urlpatterns = [
    path('upload', views.FileUpload.as_view()),
    path('<int:pk>', views.FileDownload.as_view()),
]