# Generated by Django 4.0.3 on 2022-06-28 10:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0003_customuser_account'),
    ]

    operations = [
        migrations.RenameField(
            model_name='customuser',
            old_name='account',
            new_name='avatar',
        ),
    ]