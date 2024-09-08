document.addEventListener("DOMContentLoaded", () => {
    const booksList = document.getElementById("books-list");

    // API endpoint
    const apiUrl = "http://127.0.0.1:8080/api/livres";

    // Afficher les livres disponibles
    function displayAvailableBooks() {
        booksList.innerHTML = ''; // Vider avant d'ajouter le loader

        const loader = document.createElement('div');
        loader.classList.add('loader');
        loader.innerHTML = '<img src="./images/loader.gif" alt="Chargement...">';
        booksList.appendChild(loader);

        fetch(`${apiUrl}/disponibles`)
            .then(response => response.json())
            .then(data => {
                booksList.innerHTML = ""; // Réinitialise la liste
                if (data.length === 0) {
                    booksList.innerHTML = "<p>Aucun livre disponible pour le moment.</p>";
                } else {
                    data.forEach(book => {
                        const bookElement = document.createElement("div");
                        bookElement.classList.add("book-card");

                        const coverImage = book.coverImage ?
                            `<img src="${book.coverImage}" alt="${book.titre}">` :
                            `<div class="default-cover"><span class="icon-book"></span></div>`;

                        bookElement.innerHTML = `
                            ${coverImage}
                            <h3>${book.titre}</h3>
                            <p>ISBN: ${book.isbn}</p>
                            <button class="borrow-button" data-id="${book.id}">Emprunter</button>
                        `;

                        booksList.appendChild(bookElement);
                    });
                }

                document.querySelectorAll(".borrow-button").forEach(button => {
                    button.addEventListener("click", (event) => {
                        const bookId = event.target.getAttribute("data-id");
                        borrowBook(bookId);
                    });
                });
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des livres:", error);
                booksList.innerHTML = "<p>Erreur lors du chargement des livres disponibles. Veuillez réessayer plus tard.</p>";
            });
    }

    // Emprunter un livre
    function borrowBook(bookId) {
        fetch(`${apiUrl}/emprunter/${bookId}`, {
            method: "POST"
        })
            .then(response => response.text())
            .then(message => {
                showToast(message);
                displayAvailableBooks();
            })
            .catch(error => {
                console.error("Erreur lors de l'emprunt du livre:", error);
                alert("Une erreur est survenue lors de l'emprunt. Veuillez réessayer.");
            });
    }

    // Afficher un message toast
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    displayAvailableBooks();
});
