from django.shortcuts import render

from rest_framework import generics, permissions, parsers
from .models import File
from .serializers import FileSerializer, FileUploadSerializer
from .services import extract_text
from apps.search.services import process_file_into_chunks
from apps.vault_collections.services import update_related_documents_for_new_file

class FileListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def get_queryset(self):
        return File.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return FileUploadSerializer
        return FileSerializer

    def perform_create(self, serializer):
        uploaded_file = self.request.FILES['file']
        file_instance = serializer.save(
            user=self.request.user,
            mime_type=uploaded_file.content_type or '',
            file_size=uploaded_file.size,
            processing_status='processing',
        )

        text, ocr_status = extract_text(file_instance)
        file_instance.extracted_text = text
        file_instance.ocr_status = ocr_status
        file_instance.processing_status = 'done' if text else 'failed'
        file_instance.save()

        if text:
            process_file_into_chunks(file_instance)
            update_related_documents_for_new_file(file_instance)

class FileDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return File.objects.filter(user=self.request.user)