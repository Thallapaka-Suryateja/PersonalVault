import uuid
from django.db import models
from django.conf import settings

def user_file_path(instance, filename):
    return f"user_{instance.user.id}/{filename}"

class File(models.Model):
    FILE_TYPE_CHOICES = [
        ('pdf', 'PDF'),
        ('docx', 'DOCX'),
        ('image', 'Image'),
        ('text', 'Text/Note'),
        ('bookmark', 'Bookmark'),
    ]
    PROCESSING_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('done', 'Done'),
        ('failed', 'Failed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='files')
    filename = models.CharField(max_length=255)
    file = models.FileField(upload_to=user_file_path)
    file_type = models.CharField(max_length=20, choices=FILE_TYPE_CHOICES)
    mime_type = models.CharField(max_length=100, blank=True)
    file_size = models.PositiveIntegerField(default=0)
    upload_date = models.DateTimeField(auto_now_add=True)
    extracted_text = models.TextField(blank=True, null=True)
    ocr_status = models.CharField(max_length=20, default='not_required')
    processing_status = models.CharField(max_length=20, choices=PROCESSING_STATUS_CHOICES, default='pending')

    class Meta:
        ordering = ['-upload_date']

    def delete(self, *args, **kwargs):
        # Remove the actual file from disk, not just the database row
        storage = self.file.storage
        path = self.file.path
        super().delete(*args, **kwargs)
        if storage.exists(path):
            storage.delete(path)

            
    def __str__(self):
        return self.filename