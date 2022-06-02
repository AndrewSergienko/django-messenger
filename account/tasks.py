from app.celery import app
from django.core.mail import send_mail


@app.task
def task_send_mail(email, token):
    title = "Django Messenger: Підтвердження почти."
    message = f"""
                Привіт. Цей адрес вказаний під час реєстрації на сервісі Djano Messenger.
                Тепер його потрібно підтвердити, ввівши код в полі на сторнці.

                Код підтвердження: {token}

                Якщо ви не робили вищенаписаних дій, просто проігноруйте це повідомлення.
                """
    send_mail(title, message, 'djangomessenger.noreply@gmail.com', [email])
