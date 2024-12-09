// The Dock is an intuitively designed UI component which allows users to quickly switch between various
// categories and view all resources contained under that category
// The following code actively listens and creates Bootstrap Card components based on context.

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#audio').addEventListener('click', load_audio);
    document.querySelector('#books').addEventListener('click', load_books);
    document.querySelector('#images').addEventListener('click', load_images);
    document.querySelector('#software').addEventListener('click', load_software);
    document.querySelector('#video').addEventListener('click', load_video);
    document.querySelector('#unknown').addEventListener('click', load_unknown);
    load_unknown();
})

function load_audio() {
    document.querySelector('#empty-view').style.display = 'none';
    document.querySelector('#audio-view').style.display = 'block';
    document.querySelector('#books-view').style.display = 'none';
    document.querySelector('#images-view').style.display = 'none';
    document.querySelector('#software-view').style.display = 'none';
    document.querySelector('#video-view').style.display = 'none';
    document.querySelector('#unknown-view').style.display = 'none';

    document.querySelector('#audio-view').innerHTML = '';
    document.querySelector('#books-view').innerHTML = '';
    document.querySelector('#images-view').innerHTML = '';
    document.querySelector('#software-view').innerHTML = '';
    document.querySelector('#video-view').innerHTML = '';
    document.querySelector('#unknown-view').innerHTML = '';

    document.querySelector('#heading').innerHTML = '<p class="display-4">Audio Archive</p>';
    const selection = "audio";

    fetch(`/load_view/${selection}`)
    .then(response => response.json())
    .then(resources => {
        console.log(resources);

        if (resources.length === 0) {
            document.querySelector('#empty-view').style.display = 'block';
        }
        else {
            resources.forEach(resource => {

                const res = document.createElement('div');
                res.className = 'card mb-3';

                const row = document.createElement('div');
                row.className = 'row g-0';

                const col_1 = document.createElement('div');
                col_1.className = 'col-md-4';

                const icon = document.createElement('img');
                icon.src = resource.icon;
                icon.alt = resource.name;
                icon.style.maxWidth = '200px';
                icon.style.marginLeft = '150px';

                const col_2 = document.createElement('div');
                col_2.className = 'col-md-8';

                const card_body = document.createElement('div');
                card_body.className = 'card-body';

                const title = document.createElement('h5');
                title.className = 'card-title';
                title.innerHTML = resource.name;

                const category = document.createElement('h6');
                category.className = 'card-subtitle md-2 text-muted';
                
                // Category Description Point - Because Django Models store FIELD_CHOICES as shorthand abbreviations.
                if (resource.category === "AU") {
                    category.innerHTML = "Audio";
                }
                else if (resource.category === "BK") {
                    category.innerHTML = "Books";
                }
                else if (resource.category === "IM") {
                    category.innerHTML = "Images";
                }
                else if (resource.category === "SF") {
                    category.innerHTML = "Software";
                }
                else if (resource.category === "VD") {
                    category.innerHTML = "Video"
                }
                else {
                    category.innerHTML = "Unknown";
                }

                const pub_date = document.createElement('p');
                pub_date.className = 'card-subtitle mb-2 text-muted';
                pub_date.innerHTML = 'Posted ' + resource.publication_date;

                const author_link = document.createElement('a');
                author_link.className = 'btn btn-outline-primary';
                author_link.href = `/resource/${resource.id}`;
                author_link.innerHTML = 'Learn More';
                
                card_body.append(title);
                card_body.append(category);
                card_body.append(document.createElement('br'));
                card_body.append(pub_date);
                card_body.append(document.createElement('br'));
                card_body.append(author_link);
                col_1.append(icon);
                col_2.append(card_body);
                row.append(col_1);
                row.append(col_2);
                res.append(row);

                document.querySelector('#audio-view').append(res);
            })
        }
    })

    return false;
}

function load_books() {
    document.querySelector('#empty-view').style.display = 'none';

    document.querySelector('#audio-view').style.display = 'none';
    document.querySelector('#books-view').style.display = 'block';
    document.querySelector('#images-view').style.display = 'none';
    document.querySelector('#software-view').style.display = 'none';
    document.querySelector('#video-view').style.display = 'none';
    document.querySelector('#unknown-view').style.display = 'none';

    document.querySelector('#audio-view').innerHTML = '';
    document.querySelector('#books-view').innerHTML = '';
    document.querySelector('#images-view').innerHTML = '';
    document.querySelector('#software-view').innerHTML = '';
    document.querySelector('#video-view').innerHTML = '';
    document.querySelector('#unknown-view').innerHTML = '';

    document.querySelector('#heading').innerHTML = '<p class="display-4">Books Archive</p>';
    const selection = "books";

    fetch(`/load_view/${selection}`)
    .then(response => response.json())
    .then(resources => {
        console.log(resources);

        if (resources.length === 0) {
            document.querySelector('#empty-view').style.display = 'block';
        }
        else {
            resources.forEach(resource => {

                const res = document.createElement('div');
                res.className = 'card mb-3';

                const row = document.createElement('div');
                row.className = 'row g-0';

                const col_1 = document.createElement('div');
                col_1.className = 'col-md-4';

                const icon = document.createElement('img');
                icon.src = resource.icon;
                icon.alt = resource.name;
                icon.style.maxWidth = '200px';
                icon.style.marginLeft = '150px';

                const col_2 = document.createElement('div');
                col_2.className = 'col-md-8';

                const card_body = document.createElement('div');
                card_body.className = 'card-body';

                const title = document.createElement('h5');
                title.className = 'card-title';
                title.innerHTML = resource.name;

                const category = document.createElement('h6');
                category.className = 'card-subtitle md-2 text-muted';
                
                // Category Description Point - Because Django Models store FIELD_CHOICES as shorthand abbreviations.
                if (resource.category === "AU") {
                    category.innerHTML = "Audio";
                }
                else if (resource.category === "BK") {
                    category.innerHTML = "Books";
                }
                else if (resource.category === "IM") {
                    category.innerHTML = "Images";
                }
                else if (resource.category === "SF") {
                    category.innerHTML = "Software";
                }
                else if (resource.category === "VD") {
                    category.innerHTML = "Video"
                }
                else {
                    category.innerHTML = "Unknown";
                }

                const pub_date = document.createElement('p');
                pub_date.className = 'card-subtitle mb-2 text-muted';
                pub_date.innerHTML = 'Posted ' + resource.publication_date;

                const author_link = document.createElement('a');
                author_link.className = 'btn btn-outline-primary';
                author_link.href = `/resource/${resource.id}`;
                author_link.innerHTML = 'Learn More';
                
                card_body.append(title);
                card_body.append(category);
                card_body.append(document.createElement('br'));
                card_body.append(pub_date);
                card_body.append(document.createElement('br'));
                card_body.append(author_link);
                col_1.append(icon);
                col_2.append(card_body);
                row.append(col_1);
                row.append(col_2);
                res.append(row);

                document.querySelector('#books-view').append(res);
            })
        }
    })
}

function load_images() {
    document.querySelector('#empty-view').style.display = 'none';

    document.querySelector('#audio-view').style.display = 'none';
    document.querySelector('#books-view').style.display = 'none';
    document.querySelector('#images-view').style.display = 'block';
    document.querySelector('#software-view').style.display = 'none';
    document.querySelector('#video-view').style.display = 'none';
    document.querySelector('#unknown-view').style.display = 'none';

    document.querySelector('#audio-view').innerHTML = '';
    document.querySelector('#books-view').innerHTML = '';
    document.querySelector('#images-view').innerHTML = '';
    document.querySelector('#software-view').innerHTML = '';
    document.querySelector('#video-view').innerHTML = '';
    document.querySelector('#unknown-view').innerHTML = '';

    document.querySelector('#heading').innerHTML = '<p class="display-4">Images Archive</p>';
    const selection = "images";

    fetch(`/load_view/${selection}`)
    .then(response => response.json())
    .then(resources => {
        console.log(resources);

        if (resources.length === 0) {
            document.querySelector('#empty-view').style.display = 'block';
        }
        else {
            resources.forEach(resource => {

                const res = document.createElement('div');
                res.className = 'card mb-3';

                const row = document.createElement('div');
                row.className = 'row g-0';

                const col_1 = document.createElement('div');
                col_1.className = 'col-md-4';

                const icon = document.createElement('img');
                icon.src = resource.icon;
                icon.alt = resource.name;
                icon.style.maxWidth = '200px';
                icon.style.marginLeft = '150px';

                const col_2 = document.createElement('div');
                col_2.className = 'col-md-8';

                const card_body = document.createElement('div');
                card_body.className = 'card-body';

                const title = document.createElement('h5');
                title.className = 'card-title';
                title.innerHTML = resource.name;

                const category = document.createElement('h6');
                category.className = 'card-subtitle md-2 text-muted';
                
                // Category Description Point - Because Django Models store FIELD_CHOICES as shorthand abbreviations.
                if (resource.category === "AU") {
                    category.innerHTML = "Audio";
                }
                else if (resource.category === "BK") {
                    category.innerHTML = "Books";
                }
                else if (resource.category === "IM") {
                    category.innerHTML = "Images";
                }
                else if (resource.category === "SF") {
                    category.innerHTML = "Software";
                }
                else if (resource.category === "VD") {
                    category.innerHTML = "Video"
                }
                else {
                    category.innerHTML = "Unknown";
                }

                const pub_date = document.createElement('p');
                pub_date.className = 'card-subtitle mb-2 text-muted';
                pub_date.innerHTML = 'Posted ' + resource.publication_date;

                const author_link = document.createElement('a');
                author_link.className = 'btn btn-outline-primary';
                author_link.href = `/resource/${resource.id}`;
                author_link.innerHTML = 'Learn More';
                
                card_body.append(title);
                card_body.append(category);
                card_body.append(document.createElement('br'));
                card_body.append(pub_date);
                card_body.append(document.createElement('br'));
                card_body.append(author_link);
                col_1.append(icon);
                col_2.append(card_body);
                row.append(col_1);
                row.append(col_2);
                res.append(row);

                document.querySelector('#images-view').append(res);
            })
        }
    })
}

function load_software() {
    document.querySelector('#empty-view').style.display = 'none';

    document.querySelector('#audio-view').style.display = 'none';
    document.querySelector('#books-view').style.display = 'none';
    document.querySelector('#images-view').style.display = 'none';
    document.querySelector('#software-view').style.display = 'block';
    document.querySelector('#video-view').style.display = 'none';
    document.querySelector('#unknown-view').style.display = 'none';

    document.querySelector('#audio-view').innerHTML = '';
    document.querySelector('#books-view').innerHTML = '';
    document.querySelector('#images-view').innerHTML = '';
    document.querySelector('#software-view').innerHTML = '';
    document.querySelector('#video-view').innerHTML = '';
    document.querySelector('#unknown-view').innerHTML = '';

    document.querySelector('#heading').innerHTML = '<p class="display-4">Software Archive</p>';
    const selection = "software";

    fetch(`/load_view/${selection}`)
    .then(response => response.json())
    .then(resources => {
        console.log(resources);

        if (resources.length === 0) {
            document.querySelector('#empty-view').style.display = 'block';
        }
        else {
            resources.forEach(resource => {

                const res = document.createElement('div');
                res.className = 'card mb-3';

                const row = document.createElement('div');
                row.className = 'row g-0';

                const col_1 = document.createElement('div');
                col_1.className = 'col-md-4';

                const icon = document.createElement('img');
                icon.src = resource.icon;
                icon.alt = resource.name;
                icon.style.maxWidth = '200px';
                icon.style.marginLeft = '150px';

                const col_2 = document.createElement('div');
                col_2.className = 'col-md-8';

                const card_body = document.createElement('div');
                card_body.className = 'card-body';

                const title = document.createElement('h5');
                title.className = 'card-title';
                title.innerHTML = resource.name;

                const category = document.createElement('h6');
                category.className = 'card-subtitle md-2 text-muted';
                
                // Category Description Point - Because Django Models store FIELD_CHOICES as shorthand abbreviations.
                if (resource.category === "AU") {
                    category.innerHTML = "Audio";
                }
                else if (resource.category === "BK") {
                    category.innerHTML = "Books";
                }
                else if (resource.category === "IM") {
                    category.innerHTML = "Images";
                }
                else if (resource.category === "SF") {
                    category.innerHTML = "Software";
                }
                else if (resource.category === "VD") {
                    category.innerHTML = "Video"
                }
                else {
                    category.innerHTML = "Unknown";
                }

                const pub_date = document.createElement('p');
                pub_date.className = 'card-subtitle mb-2 text-muted';
                pub_date.innerHTML = 'Posted ' + resource.publication_date;

                const author_link = document.createElement('a');
                author_link.className = 'btn btn-outline-primary';
                author_link.href = `/resource/${resource.id}`;
                author_link.innerHTML = 'Learn More';
                
                card_body.append(title);
                card_body.append(category);
                card_body.append(document.createElement('br'));
                card_body.append(pub_date);
                card_body.append(document.createElement('br'));
                card_body.append(author_link);
                col_1.append(icon);
                col_2.append(card_body);
                row.append(col_1);
                row.append(col_2);
                res.append(row);

                document.querySelector('#software-view').append(res);
            })
        }
    })
}

function load_video() {
    document.querySelector('#empty-view').style.display = 'none';

    document.querySelector('#audio-view').style.display = 'none';
    document.querySelector('#books-view').style.display = 'none';
    document.querySelector('#images-view').style.display = 'none';
    document.querySelector('#software-view').style.display = 'none';
    document.querySelector('#video-view').style.display = 'block';
    document.querySelector('#unknown-view').style.display = 'none';

    document.querySelector('#audio-view').innerHTML = '';
    document.querySelector('#books-view').innerHTML = '';
    document.querySelector('#images-view').innerHTML = '';
    document.querySelector('#software-view').innerHTML = '';
    document.querySelector('#video-view').innerHTML = '';
    document.querySelector('#unknown-view').innerHTML = '';

    document.querySelector('#heading').innerHTML = '<p class="display-4">Video Archive</p>';
    const selection = "video";

    fetch(`/load_view/${selection}`)
    .then(response => response.json())
    .then(resources => {
        console.log(resources);

        if (resources.length === 0) {
            document.querySelector('#empty-view').style.display = 'block';
        }
        else {
            resources.forEach(resource => {

                const res = document.createElement('div');
                res.className = 'card mb-3';

                const row = document.createElement('div');
                row.className = 'row g-0';

                const col_1 = document.createElement('div');
                col_1.className = 'col-md-4';

                const icon = document.createElement('img');
                icon.src = resource.icon;
                icon.alt = resource.name;
                icon.style.maxWidth = '200px';
                icon.style.marginLeft = '150px';

                const col_2 = document.createElement('div');
                col_2.className = 'col-md-8';

                const card_body = document.createElement('div');
                card_body.className = 'card-body';

                const title = document.createElement('h5');
                title.className = 'card-title';
                title.innerHTML = resource.name;

                const category = document.createElement('h6');
                category.className = 'card-subtitle md-2 text-muted';
                
                // Category Description Point - Because Django Models store FIELD_CHOICES as shorthand abbreviations.
                if (resource.category === "AU") {
                    category.innerHTML = "Audio";
                }
                else if (resource.category === "BK") {
                    category.innerHTML = "Books";
                }
                else if (resource.category === "IM") {
                    category.innerHTML = "Images";
                }
                else if (resource.category === "SF") {
                    category.innerHTML = "Software";
                }
                else if (resource.category === "VD") {
                    category.innerHTML = "Video"
                }
                else {
                    category.innerHTML = "Unknown";
                }

                const pub_date = document.createElement('p');
                pub_date.className = 'card-subtitle mb-2 text-muted';
                pub_date.innerHTML = 'Posted ' + resource.publication_date;

                const author_link = document.createElement('a');
                author_link.className = 'btn btn-outline-primary';
                author_link.href = `/resource/${resource.id}`;
                author_link.innerHTML = 'Learn More';
                
                card_body.append(title);
                card_body.append(category);
                card_body.append(document.createElement('br'));
                card_body.append(pub_date);
                card_body.append(document.createElement('br'));
                card_body.append(author_link);
                col_1.append(icon);
                col_2.append(card_body);
                row.append(col_1);
                row.append(col_2);
                res.append(row);

                document.querySelector('#video-view').append(res);
            })
        }
    })
}

function load_unknown() {
    document.querySelector('#empty-view').style.display = 'none';

    document.querySelector('#audio-view').style.display = 'none';
    document.querySelector('#books-view').style.display = 'none';
    document.querySelector('#images-view').style.display = 'none';
    document.querySelector('#software-view').style.display = 'none';
    document.querySelector('#video-view').style.display = 'none';
    document.querySelector('#unknown-view').style.display = 'block';

    document.querySelector('#audio-view').innerHTML = '';
    document.querySelector('#books-view').innerHTML = '';
    document.querySelector('#images-view').innerHTML = '';
    document.querySelector('#software-view').innerHTML = '';
    document.querySelector('#video-view').innerHTML = '';
    document.querySelector('#unknown-view').innerHTML = '';

    document.querySelector('#heading').innerHTML = '<p class="display-4">Unknown</p>';
    const selection = "unknown";

    fetch(`/load_view/${selection}`)
    .then(response => response.json())
    .then(resources => {
        console.log(resources);

        if (resources.length === 0) {
            document.querySelector('#empty-view').style.display = 'block';
        }
        else {
            resources.forEach(resource => {

                const res = document.createElement('div');
                res.className = 'card mb-3';

                const row = document.createElement('div');
                row.className = 'row g-0';

                const col_1 = document.createElement('div');
                col_1.className = 'col-md-4';

                const icon = document.createElement('img');
                icon.src = resource.icon;
                icon.alt = resource.name;
                icon.style.maxWidth = '200px';
                icon.style.marginLeft = '150px';

                const col_2 = document.createElement('div');
                col_2.className = 'col-md-8';

                const card_body = document.createElement('div');
                card_body.className = 'card-body';

                const title = document.createElement('h5');
                title.className = 'card-title';
                title.innerHTML = resource.name;

                const category = document.createElement('h6');
                category.className = 'card-subtitle md-2 text-muted';
                
                // Category Description Point - Because Django Models store FIELD_CHOICES as shorthand abbreviations.
                if (resource.category === "AU") {
                    category.innerHTML = "Audio";
                }
                else if (resource.category === "BK") {
                    category.innerHTML = "Books";
                }
                else if (resource.category === "IM") {
                    category.innerHTML = "Images";
                }
                else if (resource.category === "SF") {
                    category.innerHTML = "Software";
                }
                else if (resource.category === "VD") {
                    category.innerHTML = "Video"
                }
                else {
                    category.innerHTML = "Unknown";
                }

                const pub_date = document.createElement('p');
                pub_date.className = 'card-subtitle mb-2 text-muted';
                pub_date.innerHTML = 'Posted ' + resource.publication_date;

                const author_link = document.createElement('a');
                author_link.className = 'btn btn-outline-primary';
                author_link.href = `/resource/${resource.id}`;
                author_link.innerHTML = 'Learn More';
                
                card_body.append(title);
                card_body.append(category);
                card_body.append(document.createElement('br'));
                card_body.append(pub_date);
                card_body.append(document.createElement('br'));
                card_body.append(author_link);
                col_1.append(icon);
                col_2.append(card_body);
                row.append(col_1);
                row.append(col_2);
                res.append(row);

                document.querySelector('#unknown-view').append(res);
            })
        }
    })
}