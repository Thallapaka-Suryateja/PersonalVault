from django.shortcuts import render

# Create your views here.
from rest_framework import views, generics, permissions, response
from pgvector.django import CosineDistance
from .models import Chunk, SearchHistory
from .embeddings import generate_embedding
from .serializers import ChunkResultSerializer, SearchHistorySerializer

class SearchView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return response.Response({"error": "Missing query parameter 'q'"}, status=400)

        SearchHistory.objects.create(user=request.user, query=query)

        query_embedding = generate_embedding(query)
        results = (
            Chunk.objects
            .filter(file__user=request.user)
            .annotate(distance=CosineDistance('embedding', query_embedding))
            .order_by('distance')[:10]
        )
        serializer = ChunkResultSerializer(results, many=True)
        return response.Response(serializer.data)


class SearchHistoryListView(generics.ListAPIView):
    serializer_class = SearchHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SearchHistory.objects.filter(user=self.request.user)