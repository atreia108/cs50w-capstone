import json
from unicodedata import category
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseRedirect, Http404
from django.http.response import FileResponse, JsonResponse
from django.views.decorators import csrf
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator

from .models import User, Resource, Comment, Request, Collection
from .forms import ResourceForm

from markdown2 import Markdown, markdown

# Create your views here.
def index(request):
    resources = Resource.objects.all().order_by("-download_count").all()

    resource_collection = []

    for resource in resources:
        if resource.download_count >= 100:
            resource_collection.append(resource)
    
    return render(request, "archive/index.html", {
        "resources": resources,
        "resource_collection": resource_collection,
        "checkpoint": len(resource_collection)
    })

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "archive/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "archive/login.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "archive/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "archive/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "archive/register.html")

# ModelForm registers the Resource model instance successfully and uploads to 'resources' folder.
@login_required
def create(request):
    if request.method == "POST":
        form = ResourceForm(request.POST, request.FILES)
        if form.is_valid():
            final_resource = form.save(commit=False)
            final_resource.author = User.objects.get(id=request.user.id)
            final_resource.save()

            return HttpResponseRedirect(reverse("index"))
    else:
        form = ResourceForm()

    return render(request, "archive/create.html", {
        "form": form
    })

# Page for each resource. Description is rendered using markdown2.
def resource(request, resource_id):
    try:
        resource = Resource.objects.get(id=resource_id)
        comments = Comment.objects.filter(resource=resource_id)

        raw_description = resource.description

        markdowner = Markdown()
        markdown_content = markdowner.convert(raw_description)

    except Resource.DoesNotExist:
        return Http404("Resource not found.")
    
    return render(request, "archive/resource.html", {
        "resource": resource,
        "description": markdown_content,
        "comments": comments.order_by("-post_date").all()
    })

# Comment form registers comment model instance.
@login_required
def post_comment(request, resource_id):
    if request.method == "POST":
        resource = Resource.objects.get(id=resource_id)
        comment = Comment(resource=resource, user=request.user, title=request.POST["comment-title"], body=request.POST["comment-body"])
        comment.save()
        
        return HttpResponseRedirect(reverse("resource", args=(resource_id,)))
    else:
        return HttpResponseRedirect(reverse("resource", args=(resource_id,)))

# Core Feature
# Uses FileResponse to either preview the file if it's in a previewable format or otherwise download it.
def download_file(request, resource_id):
    resource = Resource.objects.get(id=resource_id)
    resource.download_count += 1
    resource.save()
    
    file = resource.content.path
    response = FileResponse(open(file, 'rb'))
    
    return response

# This route returns the contents of the Resource model instance for editing in the Resource page.
@csrf_exempt
@login_required
def edit_resource(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    resource_id = data.get("resource_id", "")

    try:
        resource = Resource.objects.get(id=resource_id)
        return JsonResponse({"name": f"{resource.name}", "icon": f"{resource.icon}", "category": f"{resource.category}", "description": f"{resource.description}"}, status=201)
    except Resource.DoesNotExist:
        return JsonResponse({"error": "Resource not found."}, status=404)

# Saves the changes made to the Resource by the author.
@login_required
def save_resource(request, resource_id):
    if request.method == "POST":
        try:
            resource = Resource.objects.get(id=resource_id)
        except Resource.DoesNotExist:
            return Http404("Resource not found.")

        resource.name = request.POST["id_name"]
        resource.icon = request.POST["id_icon"]
        resource.category = request.POST["id_category"]
        resource.description = request.POST["id_description"]

        resource.save()

        return HttpResponseRedirect(reverse("resource", args=(resource_id,)))
    else:
        return HttpResponseRedirect(reverse("resource", args=(resource_id,)))

# Searches from all instances of the Resource model to locate the search query if possible.
# Uses the name__contains operation provided for a model.
def search(request):
    search_term = request.GET.get("q", "")
    found = False
    search_results = []
    resource = None

    for query in Resource.objects.filter(name__contains=search_term):
        if search_term.lower() == query.name.lower():
            found = True
            resource = query
            break
        else:
            search_results.append(query)
    
    if found is True:
        return HttpResponseRedirect(reverse("resource", args=(resource.id,)))
    else:
        return render(request, "archive/search.html", {
            "search_results": search_results,
            "search_term": search_term,
            "exact_hits": len(search_results)
        })

# Profile page for each user on the Archive. Ideally displays all uploads by a user as well.
def profile(request, user_id):
    try:
        profile = User.objects.get(id=user_id)
        resources = Resource.objects.filter(author=profile).order_by("-publication_date").all()
    except User.DoesNotExist:
        return JsonResponse({"error": "User does not exist"})
    
    return render(request, "archive/profile.html", {
        "user": profile,
        "resources": resources,
        "checkpoint": resources.count()
    })

# Simple route for the Browse function.
def browse(request):
    return render(request, "archive/browse.html")

# This route returns all the resource model instance information for a category.
@csrf_exempt
def load_view(request, selection):
    if selection == "audio":
        resources = Resource.objects.filter(category="AU")
    elif selection == "books":
        resources = Resource.objects.filter(category="BK")
    elif selection == "images":
        resources = Resource.objects.filter(category="IM")
    elif selection == "software":
        resources = Resource.objects.filter(category="SF")
    elif selection == "video":
        resources = Resource.objects.filter(category="VD")
    elif selection == "unknown":
        resources = Resource.objects.filter(category="UN")
    else:
        return JsonResponse({"error": "Invalid selection."}, status=400)

    resources = resources.order_by("-publication_date").all()
    return JsonResponse([resource.serialize() for resource in resources], safe=False)

# All requests made by users to have an item uploaded on the Archive are displayed here.
# Pagination is expressly offered here due to its forum-like nature which means that a lot of requests
# will be made over time and Pagination can better solve the problem of organization.
# The Priority number status also highlights software that users would love to see archived on the site.
def archive_requests(request):
    requests = Request.objects.all().order_by("-priority_number").all()

    user = request.user

    paginator = Paginator(requests, 10)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    pagination_render_state = False

    # This breakpoint can be adjusted for real-use cases. Current values were used during the testing phase.
    LOW_PRIORITY_RANGE = range(0, 15)
    MEDIUM_PRIORITY_RANGE = range(15, 25)

    if requests.count() == 0:
        pagination_render_state = False
    else:
        pagination_render_state = True

    if user.is_authenticated:
        user_collections = []

        for required_resource in Collection.objects.filter(user=request.user):
            user_collections.append(required_resource.archive_request)
        
        return render(request, "archive/archive_requests.html", {
            "requests": page_obj,
            "user_collections": user_collections,
            "anonymity": False,
            "pagination_render_state": pagination_render_state,
            "LOW_PRIORITY_RANGE": LOW_PRIORITY_RANGE,
            "MEDIUM_PRIORITY_RANGE": MEDIUM_PRIORITY_RANGE,
            "user": user
        })
    else:
        return render(request, "archive/archive_requests.html", {
            "requests": requests,
            "anonymity": True,
            "pagination_render_state": pagination_render_state,
            "LOW_PRIORITY_RANGE": LOW_PRIORITY_RANGE,
            "MEDIUM_PRIORITY_RANGE": MEDIUM_PRIORITY_RANGE
        })

# This route opens a new request made by a user.
@csrf_exempt
@login_required
def open_request(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    # Check incoming request
    data = json.loads(request.body)

    # Retrieve Data
    title = data.get("title", "")
    description = data.get("description", "")
    user = request.user

    post = Request(request_author=user, title=title, description=description)
    post.save()

    return JsonResponse({"message": "Request created successfully."}, status=201)

# N.B. The following feature is essentially a upvote/downvote system.

# This route commits the user's support to see a certain item archived on the site.
@csrf_exempt
@login_required
def support_request(request):
    if request.method != "PUT":
        return JsonResponse({"error": "PUT request required."}, status=400)
    
    data = json.loads(request.body)
    request_id = data.get("request_id", "")

    try:
        # Increment Priority Number.
        archive_request = Request.objects.get(id=request_id)
        archive_request.priority_number += 1
        archive_request.save()

        # Save changes.
        user_collection = Collection(user=request.user, archive_request=archive_request)
        user_collection.save()

        return JsonResponse({"priority_number": "Request updated successfully."}, status=201)
    except Request.DoesNotExist:
        return JsonResponse({"error": "Request not found."}, status=404)

# This route is used by the support/revoke functions to dynamically update count on the user-end.
@login_required
def update_request(request, request_id):
    try:
        archive_request = Request.objects.get(id=request_id)
    except Request.DoesNotExist:
        return JsonResponse({"error": "Request not found."}, status=404)
    
    if request.method == "GET":
        return JsonResponse({"priority_number": f"{archive_request.priority_number}"}, status=201)
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)
    
# This route revokes the user's support to see a certain item archived on the site.
@csrf_exempt
@login_required
def revoke_request(request):
    if request.method != "PUT":
        return JsonResponse({"error": "PUT request required."}, status=400)
    
    data = json.loads(request.body)
    request_id = data.get("request_id", "")

    try:
        # Decrement Priority Number.
        archive_request = Request.objects.get(id=request_id)
        archive_request.priority_number -= 1
        archive_request.save()

        # Save changes.
        user_collection = Collection.objects.get(user=request.user, archive_request=archive_request)
        user_collection.delete()

        return JsonResponse({"message": "Request updated successfully."}, status=201)
    except Request.DoesNotExist:
        return JsonResponse({"error": "Request not found."}, status=404)

# Once the request has been met successfully on the Archive, the request author may close the request.
# Closes request.
@login_required
def close_request(request, request_id):
    try:
        request = Request.objects.get(id=request_id)
    except Request.DoesNotExist:
        return Http404("Request not found.")
    
    request.delete()

    return HttpResponseRedirect(reverse("archive_requests"))