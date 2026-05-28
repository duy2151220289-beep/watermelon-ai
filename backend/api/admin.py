from django.contrib import admin
from .models import DetectionRecord, Post


@admin.register(DetectionRecord)
class DetectionRecordAdmin(admin.ModelAdmin):
    list_display = ('id', 'source', 'label', 'confidence', 'duration_ms', 'created_at')
    list_filter = ('source', 'label', 'created_at')
    readonly_fields = ('created_at',)


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'likes', 'dislikes', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('title', 'content')
    readonly_fields = ('created_at',)
