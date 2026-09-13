from django.urls import path
from .views import AskView, ChatHistoryListView

urlpatterns = [
    path('ask/', AskView.as_view(), name='chat-ask'),
    path('history/', ChatHistoryListView.as_view(), name='chat-history'),
]