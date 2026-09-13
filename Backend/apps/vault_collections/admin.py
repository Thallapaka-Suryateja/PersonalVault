# Register your models here.
from django.contrib import admin
from .models import Collection, Tag, Bookmark, RelatedDocument

admin.site.register(Collection)
admin.site.register(Tag)
admin.site.register(Bookmark)
admin.site.register(RelatedDocument)