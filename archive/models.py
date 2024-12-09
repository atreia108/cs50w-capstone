from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

class Resource(models.Model):
    
    # Categorical Definitions
    AUDIO = 'AU'
    BOOKS = 'BK'
    IMAGES = 'IM'
    SOFTWARE = 'SF'
    VIDEO = 'VD'
    UNKNOWN = 'UN'

    CATEGORY_CHOICES = [
        (AUDIO, 'Audio'),
        (BOOKS, 'Books'),
        (SOFTWARE, 'Software'),
        (IMAGES, 'Images'),
        (VIDEO, 'Video'),
        (UNKNOWN, 'Unknown')
    ]

    default_icon = "https://www.freeiconspng.com/uploads/no-image-icon-13.png"

    author = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=256)
    icon = models.URLField()
    publication_date = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=3, choices=CATEGORY_CHOICES, default=UNKNOWN)
    content = models.FileField(upload_to='resources/')
    description = models.TextField()
    download_count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.name}"

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "icon": self.icon,
            "publication_date": self.publication_date.strftime("%b %d %Y, %I:%M %p"),
            "category": self.category,
            "description": self.description,
            "downloads": self.download_count,
        }

class Comment(models.Model):
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comment_author")

    title = models.CharField(max_length=128)
    body = models.CharField(max_length=256)
    post_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} by {self.user}"

    def serialize(self):
        return {
            "id": self.id,
            "post_author": self.user,
            "title": self.title,
            "body": self.body,
            "post_date": self.post_date.strftime("%b %d %Y, %I:%M %p")
        }

class Request(models.Model):
    title = models.CharField(max_length=256)
    description = models.CharField(max_length=128)
    request_author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="author_request")
    request_date = models.DateTimeField(auto_now_add=True)
    priority_number = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.title} requested by {self.request_author}"

    def serialize(self):
        return {
            "id": self.id,
            "request_author": self.request_author,
            "title": self.title,
            "description": self.description,
            "request_date": self.request_date.strftime("%b %d %Y, %I:%M %p")
        }

class Collection(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name="user_collection")
    archive_request = models.ForeignKey(Request, on_delete=models.CASCADE, related_name="liked_post")

    def serialize(self):
        return {
            "id": self.id,
            "user": self.user,
            "request": self.archive_request
        }
