from django.urls import path
from .views import (
    DetectImageView, HistoryView, StatsView, HealthCheckView, 
    ReviewView, PostListView, PostLikeView, PostDislikeView,
    RegisterView, LoginView, UserProfileView, ClearUploadsView,
    LeaderboardView, ChatAgronomistView
)

urlpatterns = [
    path('health/', HealthCheckView.as_view(), name='health'),
    path('detect/', DetectImageView.as_view(), name='detect'),
    path('history/', HistoryView.as_view(), name='history'),
    path('stats/', StatsView.as_view(), name='stats'),
    path('reviews/', ReviewView.as_view(), name='reviews'),
    path('posts/', PostListView.as_view(), name='posts-list'),
    path('posts/<int:pk>/like/', PostLikeView.as_view(), name='posts-like'),
    path('posts/<int:pk>/dislike/', PostDislikeView.as_view(), name='posts-dislike'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/profile/', UserProfileView.as_view(), name='profile'),
    path('clear-uploads/', ClearUploadsView.as_view(), name='clear-uploads'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('chat/', ChatAgronomistView.as_view(), name='chat'),
]


