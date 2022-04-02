from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from .models import Chat
from account.models import CustomUser
from django.http import JsonResponse


@login_required(login_url='/login/')
def chats(request):
    user = request.user
    chats = user.chats.all()
    context = {'chats': chats}
    return render(request, 'chat/chats.html', context=context)


@login_required
def create_chat(request, user_id):
    try:
        user = CustomUser.objects.get(id=user_id)
        chat = Chat.objects.filter(users=request.user).filter(users=user)
        if chat:
            return JsonResponse({'status': 'error', 'desc': 'ChatArleadyExist'})
        else:
            chat = Chat()
            chat.save()
            chat.users.add(request.user, user)
            chat.save()
            return JsonResponse({'status': 'ok'})
    except CustomUser.DoesNotExist:
        return JsonResponse({'status': 'error', 'desc': 'UserDontExist'})


def room(request):
    return render(request, 'chat/room.html')
