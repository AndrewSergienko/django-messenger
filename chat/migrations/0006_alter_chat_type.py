# Generated by Django 4.0.3 on 2022-05-22 17:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0005_alter_chat_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chat',
            name='type',
            field=models.CharField(choices=[('personal', 'personal'), ('group', 'group')], default='personal', max_length=8),
        ),
    ]