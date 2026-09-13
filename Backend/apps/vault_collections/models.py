

# Create your models here.
import uuid
from django.db import models
from django.conf import settings
from apps.files.models import File


class Collection(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='collections'
    )
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    files = models.ManyToManyField(
        File,
        related_name='collections',
        blank=True
    )

    def __str__(self):
        return self.name


class Tag(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tags'
    )
    tag_name = models.CharField(max_length=100)
    files = models.ManyToManyField(
        File,
        related_name='tags',
        blank=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'tag_name'],
                name='unique_tag_per_user'
            )
        ]

    def __str__(self):
        return self.tag_name


class Bookmark(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bookmarks'
    )
    url = models.URLField()
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class RelatedDocument(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file1 = models.ForeignKey(
        File,
        on_delete=models.CASCADE,
        related_name='related_from'
    )
    file2 = models.ForeignKey(
        File,
        on_delete=models.CASCADE,
        related_name='related_to'
    )
    similarity_score = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('file1', 'file2')