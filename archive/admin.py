from django.contrib import admin
from .models import Resource, Comment, Request, Collection

# Register your models here.
class ResourceAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'author', 'icon', 'publication_date', 'category', 'content', 'description', 'download_count']
    list_editable = ['name', 'icon', 'category', 'content','description', 'download_count']

class CommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'resource', 'title', 'body', 'user', 'post_date']
    list_editable = ['title', 'body']

class RequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'description', 'request_author', 'request_date', 'priority_number']
    list_editable = ['title', 'description', 'priority_number']

class CollectionAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'archive_request']

admin.site.register(Resource, ResourceAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Request, RequestAdmin)
admin.site.register(Collection, CollectionAdmin)