from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    email = models.EmailField(max_length=100, unique=True)
    username = models.CharField(max_length=30, blank=True, unique=True)
    phone = models.CharField(max_length=20, blank=True, unique=True)
