from rest_framework import serializers
from .models import Collection, Tag, Bookmark, RelatedDocument

class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ['id', 'name', 'created_at', 'files']
    
    def validate_files(self, files):
        user = self.context['request'].user
        
        # Check if any of the provided files do not belong to the user
        # This executes a single efficient database query
        invalid_files = [file for file in files if file.user_id != user.id]
        
        if invalid_files:
            raise serializers.ValidationError(
                "You cannot add another user's file to a collection."
            )
            
        return files
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'tag_name', 'files']

class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = ['id', 'url', 'title', 'description', 'created_at']

class RelatedDocumentSerializer(serializers.ModelSerializer):
    filename = serializers.CharField(source='file2.filename')
    file_id = serializers.UUIDField(source='file2.id')

    class Meta:
        model = RelatedDocument
        fields = ['file_id', 'filename', 'similarity_score']