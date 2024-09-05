document.addEventListener("DOMContentLoaded", () => {
    const booksList = document.getElementById("books-list");
    const borrowedBooksList = document.getElementById("borrowed-books-list");

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
                    bookElement.classList.add("book-item");
                    bookElement.innerHTML = `
                        ID: ${book.id} - Titre: ${book.titre} - Auteur: ${book.author}
                        <button class="borrow-button" data-id="${book.id}">Emprunter</button>
                    `;
                    booksList.appendChild(bookElement);
                });

                // Ajouter les gestionnaires d'événements pour les boutons d'emprunt
                document.querySelectorAll(".borrow-button").forEach(button => {
                    button.addEventListener("click", (event) => {
                        const bookId = event.target.getAttribute("data-id");
                        borrowBook(bookId);
                    });
                });
            })
            .catch(error => console.error("Erreur lors de la récupération des livres:", error));
    }

    // Emprunter un livre
    function borrowBook(bookId) {
        fetch(`${apiUrl}/emprunter/${bookId}`, {
            method: "POST"
        })
            .then(response => response.text())
            .then(message => {
                alert(message);
                displayAvailableBooks(); // Rafraîchir la liste des livres disponibles
                displayBorrowedBooks();  // Rafraîchir la liste des livres empruntés
            })
            .catch(error => console.error("Erreur lors de l'emprunt du livre:", error));
    }

    // Afficher les livres empruntés
    function displayBorrowedBooks() {
        fetch(`${apiUrl}/emprunts`)
            .then(response => response.json())
            .then(data => {
                borrowedBooksList.innerHTML = ""; // Réinitialise la liste
                data.forEach(book => {
                    const bookElement = document.createElement("div");
                    bookElement.classList.add("borrowed-book-item");
                    bookElement.innerHTML = `
                        ID: ${book.id} - Titre: ${book.titre} - Auteur: ${book.author} 
                        - Date d'emprunt: ${book.borrowDate} - Date de retour: ${book.returnDate}
                        <button class="return-button" data-id="${book.id}">Retourner</button>
                    `;
                    borrowedBooksList.appendChild(bookElement);
                });

                // Ajouter les gestionnaires d'événements pour les boutons de retour
                document.querySelectorAll(".return-button").forEach(button => {
                    button.addEventListener("click", (event) => {
                        const bookId = event.target.getAttribute("data-id");
                        returnBook(bookId);
                    });
                });
            })
            .catch(error => console.error("Erreur lors de la récupération des livres empruntés:", error));
    }

    // Retourner un livre
    function returnBook(bookId) {
        fetch(`${apiUrl}/retour/${bookId}`, {
            method: "POST"
        })
            .then(response => response.text())
            .then(message => {
                alert(message);
                displayAvailableBooks(); // Rafraîchir la liste des livres disponibles
                displayBorrowedBooks();  // Rafraîchir la liste des livres empruntés
            })
            .catch(error => console.error("Erreur lors du retour du livre:", error));
    }

    // Initialiser l'affichage
    displayAvailableBooks();
    displayBorrowedBooks();
});
