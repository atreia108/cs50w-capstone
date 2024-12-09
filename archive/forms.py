from django.forms.widgets import FileInput, Select, TextInput, Textarea, URLInput
from . import models
from django.forms import ModelForm

class ResourceForm(ModelForm):
    class Meta:
        model = models.Resource
        exclude = ['author']
        fields = ['name', 'icon', 'category', 'content', 'description']
        widgets = {
            'name': TextInput(attrs = {"class": "form-control", "placeholder": "Title"}),
            'icon': URLInput(attrs = {"class": "form-control", "placeholder": "Icon URL"}),
            'category': Select(attrs = {"class": "form-control"}),
            'content': FileInput(attrs = {"class": "form-control-file"}),
            'description': Textarea(attrs = {"class": "form-control", "placeholder": "Description", "style": "resize: none", "rows": 8, "max-width": 40})
        }