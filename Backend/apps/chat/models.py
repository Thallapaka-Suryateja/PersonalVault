import uuid
from django.db import models
from django.conf import settings
from apps.search.models import Chunk

class ChatHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chat_history')
    question = models.TextField()
    answer = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

class ChatSource(models.Model):
    chat = models.ForeignKey(ChatHistory, on_delete=models.CASCADE, related_name='sources')
    chunk = models.ForeignKey(Chunk, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('chat', 'chunk')

    