const apiBaseURL = 'http://localhost:8080/api/livres';

// Fetch and display all available books
function fetchBooks() {
    fetch(`${apiBaseURL}/disponibles`)
        .then(response => response.json())
        .then(data => {
            const booksList = document.getElementById('books-list');
            booksList.innerHTML = '';
            data.forEach(book => {
                const bookItem = document.createElement('div');
                bookItem.classList.add('book-item');
                bookItem.innerHTML = `
                    <h3>${book.titre}</h3>
                    <p>${book.auteur}</p>
                    <p><strong>Disponible:</strong> ${book.disponible ? 'Yes' : 'No'}</p>
                `;
                booksList.appendChild(bookItem);
            });
        })
        .catch(error => console.error('Error fetching books:', error));
}

// Add a new book
document.getElementById('add-book-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const title = document.getElementById('book-title').value;
    const author = document.getElementById('book-author').value;

    fetch(apiBaseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ titre: title, auteur: author, disponible: true })
    })
        .then(response => response.json())
        .then(data => {
            alert('Book added successfully');
            fetchBooks();  // Refresh the list
        })
        .catch(error => console.error('Error adding book:', error));
});

// Update a book
document.getElementById('update-book-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const bookId = document.getElementById('update-book-id').value;
    const title = document.getElementById('update-book-title').value;
    const author = document.getElementById('update-book-author').value;

    fetch(`${apiBaseURL}/${bookId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ titre: title, auteur: author })
    })
        .then(response => response.json())
        .then(data => {
            alert('Book updated successfully');
            fetchBooks();  // Refresh the list
        })
        .catch(error => console.error('Error updating book:', error));
});

// Borrow a book
document.getElementById('borrow-book-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const bookId = document.getElementById('borrow-book-id').value;

    fetch(`${apiBaseURL}/emprunter/${bookId}`, { method: 'POST' })
        .then(response => response.text())
        .then(data => {
            alert(data);
            fetchBooks();  // Refresh the list
        })
        .catch(error => console.error('Error borrowing book:', error));
});

// Delete a book
document.getElementById('delete-book-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const bookId = document.getElementById('delete-book-id').value;

    fetch(`${apiBaseURL}/${bookId}`, {
        method: 'DELETE'
    })
        .then(() => {
            alert('Book deleted successfully');
            fetchBooks();  // Refresh the list
        })
        .catch(error => console.error('Error deleting book:', error));
});

// Initial fetch of books
fetchBooks();
