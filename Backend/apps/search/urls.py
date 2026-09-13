from django.urls import path
from .views import SearchView, SearchHistoryListView

urlpatterns = [
    path('', SearchView.as_view(), name='search'),
    path('history/', SearchHistoryListView.as_view(), name='search-history'),
]