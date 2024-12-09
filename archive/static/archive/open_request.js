// Handler for opening a request.

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#submit').addEventListener('click', open_request);
})

function open_request() {
    document.querySelector('#request-form').onsubmit = () => {
        const title = document.querySelector('#request-title').value;
        const description = document.querySelector('#request-description').value;

        fetch('/open_request', {
            method: 'POST',
            body: JSON.stringify({
                title: title,
                description: description
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
        });

        return false;
    }
}