
# Register your models here.
from django.contrib import admin
from .models import File

@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ['filename', 'user', 'file_type', 'processing_status', 'upload_date']
    list_filter = ['file_type', 'processing_status']