from django.shortcuts import render

# Create your views here.
from django.contrib.auth.forms import UserCreationForm
from django.urls import reverse_lazy
from django.views import generic
from django import forms
from .models import CustomUser


class SignUpForm(UserCreationForm):
    email = forms.EmailField(label = "Email")
    username = forms.CharField(label = "Username")
    class Meta:
        model = CustomUser
        fields = ("email", "username")

    
    def save(self, commit=True):
        user = super(SignUpForm, self).save(commit=False)
        user.email = self.cleaned_data["email"]
        user.username = self.cleaned_data["username"]
        if commit:
            user.save()
        return user
    


class SignUpView(generic.CreateView):
    form_class = SignUpForm
    success_url = reverse_lazy("login")
    template_name = "registration/signup.html"
