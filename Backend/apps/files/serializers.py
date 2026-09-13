from rest_framework import serializers
from .models import File

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = [
            'id', 'filename', 'file', 'file_type', 'mime_type',
            'file_size', 'upload_date', 'extracted_text',
            'ocr_status', 'processing_status',
        ]
        read_only_fields = [
            'id', 'mime_type', 'file_size', 'upload_date',
            'extracted_text', 'ocr_status', 'processing_status',
        ]

class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['filename', 'file', 'file_type']