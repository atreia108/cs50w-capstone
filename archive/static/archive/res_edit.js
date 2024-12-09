// Handler for opening the edit form that is initially set to display: none; 
// and loading in the resource information via AJAX.
// Upon execution, the edit form is displayed for the author to make necessary
// to the model and automatically update the resource and proceeds
// to redirect the user back to the resource page in question.

// N.B: The Edit form is a mirror of the ModelForm used to create a resource.
// AJAX was NOT used to save the form and dynamically update the resource as 
// md2 would not be available to translate the Markdown to HTML once more due
// to the former being a Python library.

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#resource-edit').addEventListener('click', res_edit);
    document.querySelector('#back-button').addEventListener('click', back_to_resource);
});

function res_edit() {
    resource = document.querySelector('#resource-edit');
    resource_id = resource.getAttribute('data-res');

    fetch('/edit_resource', {
        method: 'POST',
        body: JSON.stringify({
            resource_id: resource_id
        })
    })
    .then(response => response.json())
    .then(resource => {
        console.log(resource);

        resource_name = document.querySelector('#id_name')
        resource_icon = document.querySelector('#id_icon')
        resource_category = document.querySelector('#id_category')
        resource_description = document.querySelector('#id_description')

        document.querySelector('#resource-container').style.display = 'none';
        document.querySelector('#resource-comments').style.display = 'none';

        document.querySelector('#create-resource').style.display = 'block';

        resource_name.value = resource.name;
        resource_icon.value = resource.icon;
        
        resource_category.value = resource.category;

        resource_description.innerHTML = resource.description;
    });

    return false;
}

function back_to_resource() {
    document.querySelector('#create-resource').style.display = 'none';

    document.querySelector('#resource-container').style.display = 'block';
    document.querySelector('#resource-comments').style.display = 'block';
}