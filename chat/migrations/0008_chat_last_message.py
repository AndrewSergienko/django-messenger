# Generated by Django 4.0.3 on 2022-05-26 08:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0007_remove_message_read_message_read'),
    ]

    operations = [
        migrations.AddField(
            model_name='chat',
            name='last_message',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='last_message', to='chat.message'),
        ),
    ]
