from django.urls import path
from .views import (
    BookmarkDetailView,
    BookmarkListCreateView,
    CollectionDetailView,
    CollectionListCreateView,
    RelatedDocumentsView,
    TagDetailView,
    TagListCreateView,
)

urlpatterns = [
    path(
        "collections/",
        CollectionListCreateView.as_view(),
        name="collection-list",
    ),
    path(
        "collections/<uuid:pk>/",
        CollectionDetailView.as_view(),
        name="collection-detail",
    ),
    path(
        "tags/",
        TagListCreateView.as_view(),
        name="tag-list",
    ),
    path(
        "tags/<uuid:pk>/",
        TagDetailView.as_view(),
        name="tag-detail",
    ),
    path(
        "bookmarks/",
        BookmarkListCreateView.as_view(),
        name="bookmark-list",
    ),
    path(
        "bookmarks/<uuid:pk>/",
        BookmarkDetailView.as_view(),
        name="bookmark-detail",
    ),
    path(
        "related/<uuid:file_id>/",
        RelatedDocumentsView.as_view(),
        name="related-documents",
    ),
]