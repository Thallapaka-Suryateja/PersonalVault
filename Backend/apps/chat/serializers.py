from rest_framework import serializers
from .models import ChatHistory

class AskQuestionSerializer(serializers.Serializer):
    question = serializers.CharField()

class SourceSerializer(serializers.Serializer):
    filename = serializers.CharField(source='file.filename')
    page_number = serializers.IntegerField(allow_null=True)
    chunk_text = serializers.CharField()

class ChatHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatHistory
        fields = ['id', 'question', 'answer', 'created_at']