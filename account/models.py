from django.db import models
from django.core import validators
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    email_validator = validators.EmailValidator()
    email = models.EmailField(max_length=100, unique=True, validators=[email_validator])
    username = models.CharField(max_length=100, blank=True, unique=True, validators=[AbstractUser.username_validator])
    phone = models.CharField(max_length=20, blank=True, unique=True)
