from django.contrib.auth import logout
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("create", views.create, name="create"),
    path("resource/<int:resource_id>", views.resource, name="resource"),
    path("comment/<int:resource_id>", views.post_comment, name="post_comment"),
    path("download_file/<int:resource_id>", views.download_file, name="download_file"),
    path("edit_resource", views.edit_resource, name="edit_resource"),
    path("save_resource/<int:resource_id>", views.save_resource, name="save_resource"),
    path("search", views.search, name="search"),
    path("profiles/<int:user_id>", views.profile, name="profile"),
    path("browse", views.browse, name="browse"),
    path("load_view/<str:selection>", views.load_view, name="load_view"),
    path("archive_requests", views.archive_requests, name="archive_requests"),
    path("open_request", views.open_request, name="open_request"),
    path("support_request", views.support_request, name="support_request"),
    path("update_request/<int:request_id>", views.update_request, name="update_request"),
    path("revoke_request", views.revoke_request, name="revoke_request"),
    path("close_request/<int:request_id>", views.close_request, name="close_request")
]