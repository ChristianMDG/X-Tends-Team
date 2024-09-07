document.addEventListener('DOMContentLoaded', function () {
    initializeBooks();
    fetchBorrowedBooks();
});

// Simuler les emprunts avec un stockage local
function initializeBooks() {
    // Exemple de données de livres
    const borrowedBooks = [
        { id: 1, titre: "Livre A", dateEmprunt: "2024-09-01" },
        { id: 2, titre: "Livre B", dateEmprunt: "2024-09-02" },
        { id: 3, titre: "Livre C", dateEmprunt: "2024-09-03" }
    ];

    // Stocker dans le localStorage si les livres ne sont pas encore présents
    if (!localStorage.getItem('borrowedBooks')) {
        localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
    }
}

// Récupérer les livres empruntés depuis le localStorage
function fetchBorrowedBooks() {
    const borrowedBooksList = document.getElementById('borrowed-books-list');
    const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];

    borrowedBooksList.innerHTML = ''; // Vider la liste

    borrowedBooks.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        bookCard.innerHTML = `
            <h3>${book.titre}</h3>
            <p><strong>Date d'emprunt:</strong> ${book.dateEmprunt}</p>
            <button onclick="returnBook(${book.id})">Retourner</button>
        `;
        borrowedBooksList.appendChild(bookCard);
    });
}

// Fonction pour simuler le retour du livre
function returnBook(bookId) {
    // Récupérer la liste actuelle des livres empruntés
    let borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];

    // Filtrer la liste pour supprimer le livre retourné
    borrowedBooks = borrowedBooks.filter(book => book.id !== bookId);

    // Mettre à jour le localStorage
    localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));

    // Rafraîchir la liste des livres empruntés
    fetchBorrowedBooks();
}
