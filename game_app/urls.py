from django.urls import path
from . import views

urlpatterns = [
    path('', views.menu_view, name='menu'),
    path('game/<int:level>/', views.game_view, name='game'),
    path('api/save-score/', views.save_score_api, name='save_score'),
    path('api/scores/live/<int:level>/',
         views.live_scores_stream, name='live_scores'),
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
]
