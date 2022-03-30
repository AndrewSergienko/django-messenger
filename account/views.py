from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from .models import CustomUser
from .forms import CustomUserLoginForm, CustomUserRegistrationForm
from django.http import HttpResponse, JsonResponse


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


def user_logout(request):
    if request.user.is_authenticated:
        logout(request)
    redirect('account:user_login')


def user_register(request):
    if request.method == 'POST':
        form = CustomUserRegistrationForm(request.POST)
        if form.is_valid():
            new_user = form.save(commit=False)
            new_user.set_password(form.cleaned_data['password'])
            new_user.save()
            return redirect('account:user_login')
    else:
        form = CustomUserRegistrationForm()
    context = {'form': form}
    return render(request, 'account/register.html', context=context)


