# Generated by Django 4.0.3 on 2022-05-26 15:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0003_chat_last_message_chat_type_remove_message_read_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chat',
            name='last_message',
        ),
    ]
