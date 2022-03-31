from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404
from .models import Chat
from account.models import CustomUser
from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from common.decorators import ajax_required


@login_required(login_url='/login/')
def chats(request):
    user = request.user
    chats = user.chats.all()
    context = {'chats': chats}
    return render(request, 'chat/chats.html', context=context)


@ajax_required
@login_required
def create_chat(request, user_id):
    try:
        user = CustomUser.objects.get(id=user_id)
        chat = Chat.objects.filter(users=request.user).filter(users=user)
        if chat:
            return JsonResponse({'status': 'error', 'desc': 'ChatArleadyExist'})
        else:
            chat = Chat()
            chat.users.add(request.user, user)
            chat.save()
            return JsonResponse({'status': 'success'})
    except CustomUser.DoesNotExist:
        return JsonResponse({'status': 'error', 'desc': 'UserDontExist'})


def room(request):
    return render(request, 'chat/room.html')
