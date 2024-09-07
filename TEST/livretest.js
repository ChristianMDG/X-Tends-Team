document.addEventListener("DOMContentLoaded", () => {
    const booksList = document.getElementById("books-list");
    const borrowedBooksList = document.getElementById("borrowed-books-list");
    const borrowBookForm = document.getElementById("borrow-book-form");

    // API endpoint
    const apiUrl = "http://127.0.0.1:8080/api/livres";

    // Afficher les livres disponibles
    function displayAvailableBooks() {
        fetch(`${apiUrl}/disponibles`)
            .then(response => response.json())
            .then(data => {
                booksList.innerHTML = ""; // Réinitialise la liste
                data.forEach(book => {
                    const bookElement = document.createElement("div");
                    bookElement.textContent = `ID: ${book.id} - Titre: ${book.titre} - Auteur: ${book.auteurs}`;
                    booksList.appendChild(bookElement);
                });
            })
            .catch(error => console.error("Erreur lors de la récupération des livres:", error));
    }

    // Emprunter un livre
    borrowBookForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const livreId = parseInt(document.getElementById("borrow-book-id").value);

        fetch(`${apiUrl}/emprunter/${livreId}`, {
            method: "POST"
        })
            .then(response => response.text())
            .then(message => {
                alert(message);
                displayAvailableBooks(); // Rafraîchir la liste des livres disponibles
                displayBorrowedBooks();  // Rafraîchir la liste des livres empruntés
            })
            .catch(error => console.error("Erreur lors de l'emprunt du livre:", error));
    });

    // Afficher les livres empruntés
    function displayBorrowedBooks() {
        fetch(`${apiUrl}/emprunts`)
            .then(response => response.json())
            .then(data => {
                borrowedBooksList.innerHTML = ""; // Réinitialise la liste
                data.forEach(book => {
                    const bookElement = document.createElement("div");
                    bookElement.textContent = `ID: ${book.id} - Titre: ${book.titre} - Auteur: ${book.auteurs} - Date d'emprunt: ${book.borrowDate} - Date de retour: ${book.returnDate}`;
                    borrowedBooksList.appendChild(bookElement);
                });
            })
            .catch(error => console.error("Erreur lors de la récupération des livres empruntés:", error));
    }

    // Initialiser l'affichage
    displayAvailableBooks();
    displayBorrowedBooks();
});
