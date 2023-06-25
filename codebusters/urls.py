from django.urls import path
from django.views.generic.base import TemplateView # new
from . import views

urlpatterns = [
    path("", TemplateView.as_view(template_name='home.html'), name='home'),
    path("singleplayer", TemplateView.as_view(template_name='game/singleplayer.html'), name='singleplayer'),
    path("fetch-puzzle", views.FetchPuzzleView.as_view()),
    path("check-puzzle", views.CheckPuzzleView.as_view())
]