const apiUrl = 'http://localhost:8080/api/livres';

// Fonction pour récupérer et afficher la liste des livres
async function fetchBooks() {
    const response = await fetch(apiUrl);
    const books = await response.json();
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';

    books.forEach(book => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>${book.titre}</strong> - ${book.isbn} - ${book.description}
            <br><img src="${book.imageUrl}" alt="${book.titre}" style="width: 100px;">
            <button onclick="editBook(${book.id})">Modifier</button>
        `;
        bookList.appendChild(listItem);
    });
}

// Fonction pour ajouter ou mettre à jour un livre
document.getElementById('book-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = document.getElementById('book-id').value;
    const livre = {
        titre: document.getElementById('titre').value,
        isbn: document.getElementById('isbn').value,
        datePublication: document.getElementById('datePublication').value,
        disponible: document.getElementById('disponible').value === 'true',
        imageUrl: document.getElementById('imageUrl').value,
        description: document.getElementById('description').value,
    };

    if (id) {
        // Mise à jour d'un livre
        await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(livre),
        });
    } else {
        // Ajout d'un nouveau livre
        await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(livre),
        });
    }

    // Réinitialiser le formulaire et rafraîchir la liste des livres
    document.getElementById('book-form').reset();
    document.getElementById('book-id').value = '';
    fetchBooks();
});

// Fonction pour charger les informations d'un livre dans le formulaire pour modification
function editBook(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(book => {
            document.getElementById('book-id').value = book.id;
            document.getElementById('titre').value = book.titre;
            document.getElementById('isbn').value = book.isbn;
            document.getElementById('datePublication').value = book.datePublication;
            document.getElementById('disponible').value = book.disponible;
            document.getElementById('imageUrl').value = book.imageUrl;
            document.getElementById('description').value = book.description;
        });
}

// Chargement initial des livres
document.addEventListener('DOMContentLoaded', fetchBooks);