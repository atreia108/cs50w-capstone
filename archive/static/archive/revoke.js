// Handler executed upon pressing the revoke button which triggers AJAX operations
// Once the API call is done, it runs an additional function to change the button
// from 'revoke' to 'support' on the user-end.

function revoke(request_id) {
    console.log(request_id);

    fetch('/revoke_request', {
        method: 'PUT',
        body: JSON.stringify({
            request_id: request_id
        })
    })

    update_request_revoke(request_id);

    return false;
}

function update_request_revoke(request_id) {
    fetch(`/update_request/${request_id}`)
    .then(response => response.json())
    .then(request => {
        console.log(request);

        support_element = document.querySelector(`#priority-number${request_id}`);
        support_element.innerHTML = request.priority_number + " users support this.";

        document.querySelector(`#revoke${request_id}`).style.display = 'none';
        document.querySelector(`#support${request_id}`).style.display = 'inline-block';
    })

    return false;
}