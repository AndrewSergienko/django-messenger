from django.contrib.auth import authenticate, login
from django.shortcuts import render
from .models import CustomUser
from .forms import CustomUserLoginForm
from django.http import HttpResponse


def user_login(request):
    if request.method == 'POST':
        form = CustomUserLoginForm(request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            user = authenticate(request,
                                username=cd['login'],
                                password=cd['password'])
            if user is not None:
                if user.is_active:
                    login(request, user)
                    return HttpResponse('Вхід успішний')
                else:
                    return HttpResponse('Аккаунт заблокований')
            else:
                return HttpResponse('Неправильний логін або пароль')
    else:
        form = CustomUserLoginForm()
    context = {'form': form}
    return render(request, 'account/login.html', context=context)