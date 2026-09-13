

# Create your models here.
import uuid
from django.conf import settings
from django.db import models
from pgvector.django import VectorField
from apps.files.models import File

class Chunk(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file = models.ForeignKey(File, on_delete=models.CASCADE, related_name='chunks')
    chunk_text = models.TextField()
    page_number = models.IntegerField(null=True, blank=True)
    section = models.CharField(max_length=255, blank=True, null=True)
    embedding = VectorField(dimensions=384)
    chunk_index = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['chunk_index']

        
class SearchHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='search_history')
    query = models.CharField(max_length=500)
    searched_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-searched_at']

    def __str__(self):
        return f"{self.user} - {self.query}"