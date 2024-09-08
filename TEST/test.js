document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('bookForm');
    const booksList = document.getElementById('booksList');

    // Fonction pour ajouter un livre avec une image
    bookForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('titre', document.getElementById('titre').value);
        formData.append('isbn', document.getElementById('isbn').value);
        formData.append('datePublication', document.getElementById('datePublication').value);
        formData.append('image', document.getElementById('image').files[0]);

        // Ajouter le livre et uploader l'image
        axios.post('/api/livres', {
            titre: document.getElementById('titre').value,
            isbn: document.getElementById('isbn').value,
            datePublication: document.getElementById('datePublication').value,
            disponible: true
        }).then(response => {
            const bookId = response.data.id;

            // Uploader l'image après avoir ajouté le livre
            axios.post(`/api/livres/uploadImage/${bookId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(() => {
                alert('Livre ajouté avec succès');
                displayBooks(); // Mettre à jour la liste des livres
            }).catch(error => {
                console.error('Erreur lors de l\'upload de l\'image:', error);
            });
        }).catch(error => {
            console.error('Erreur lors de l\'ajout du livre:', error);
        });
    });

    // Fonction pour afficher la liste des livres
    function displayBooks() {
        axios.get('/api/livres').then(response => {
            const books = response.data;
            booksList.innerHTML = '';

            books.forEach(book => {
                const bookDiv = document.createElement('div');
                bookDiv.classList.add('book');

                const bookImage = book.imageUrl ? `<img src="${book.imageUrl}" alt="${book.titre}">` : '';

                bookDiv.innerHTML = `
                    ${bookImage}
                    <h3>${book.titre}</h3>
                    <p>ISBN: ${book.isbn}</p>
                    <p>Date de publication: ${book.datePublication}</p>
                `;

                booksList.appendChild(bookDiv);
            });
        }).catch(error => {
            console.error('Erreur lors de la récupération des livres:', error);
        });
    }

    // Afficher la liste des livres lors du chargement de la page
    displayBooks();
});
