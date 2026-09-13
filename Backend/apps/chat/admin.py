

# Register your models here.
from django.contrib import admin
from .models import ChatHistory, ChatSource

admin.site.register(ChatHistory)
admin.site.register(ChatSource)