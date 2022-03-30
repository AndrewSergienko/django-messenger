from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from account.models import CustomUser


@login_required(login_url='/login/')
def chats(request):
    user = request.user
    chats = user.chats.all()
    context = {'chats': chats}
    return render(request, 'chat/chats.html', context=context)


def index(request):
    return render(request, 'chat/index.html')


def room(request, room_name):
    context = {'room_name': room_name}
    return render(request, 'chat/room.html', context=context)
