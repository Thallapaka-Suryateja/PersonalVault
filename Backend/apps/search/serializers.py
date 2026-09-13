from rest_framework import serializers
from .models import Chunk
from .models import SearchHistory

class SearchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchHistory
        fields = ['id', 'query', 'searched_at']

    
class ChunkResultSerializer(serializers.ModelSerializer):
    filename = serializers.CharField(source='file.filename')
    file_id = serializers.UUIDField(source='file.id')
    distance = serializers.FloatField(read_only=True)

    class Meta:
        model = Chunk
        fields = ['file_id', 'filename', 'chunk_text', 'page_number', 'distance']