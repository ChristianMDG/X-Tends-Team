document.addEventListener("DOMContentLoaded", () => {
    const booksList = document.getElementById("books-list");
    const borrowedBooksList = document.getElementById("borrowed-books-list");

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

                    const bookIcon = document.createElement('div');
                    bookIcon.className = 'book-icon';
                    bookIcon.innerHTML = '<i class="fas fa-book"></i>';

                    bookElement.innerHTML = `
                        <div class="book-info">
                            <div>ID Du Livre: <span>${book.id}</span></div>
                            <div>Titre: <span>${book.titre}</span></div>
                            <div>Isbn: <span>${book.isbn}</span></div>
                            <button class="borrow-button" data-id="${book.id}">Emprunter</button>
                        </div>
                    `;

                    bookElement.appendChild(bookIcon);
                    booksList.appendChild(bookElement);
                });

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
                displayAvailableBooks();
                displayBorrowedBooks();
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

                    const bookIcon = document.createElement('div');
                    bookIcon.className = 'book-icon';
                    bookIcon.innerHTML = '<i class="fas fa-book"></i>';

                    bookElement.innerHTML = `
                        <div class="book-info">
                            <div>Titre: <span>${book.titre}</span></div>
                            <div>Isbn: <span>${book.isbn}</span></div>
                            <div>Date d'emprunt: <span>${book.borrowDate}</span></div>
                            <div>Date de retour: <span>${book.returnDate}</span></div>
                        </div>
                        <!-- Le bouton "Retourner" est maintenant en bas -->
                        <button class="return-button" data-id="${book.id}">Retourner</button>
                    `;

                    bookElement.appendChild(bookIcon);
                    borrowedBooksList.appendChild(bookElement);
                });

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
        fetch(`${apiUrl}/retourner/${bookId}`, {
            method: "POST"
        })
            .then(response => response.text())
            .then(message => {
                alert(message);
                displayAvailableBooks();
                displayBorrowedBooks();
                window.location.href = "./Dispo.html";

            })
            .catch(error => console.error("Erreur lors du retour du livre:", error));
    }

    displayAvailableBooks();
    displayBorrowedBooks();
});
