document.addEventListener("DOMContentLoaded", () => {
    const booksList = document.getElementById("books-list");
    const apiUrl = "http://127.0.0.1:8080/api/livres";
    let selectedBookId = null;

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
                        bookElement.classList.add("book-item");

                        const coverImage = book.coverImage ?
                            `<img src="${book.coverImage}" alt="${book.titre}" class="book-cover">` :
                            `<div class="book-cover">
                                <div class="book-title">${book.titre}</div>
                             </div>`;
                        bookElement.innerHTML = `
    ${coverImage}
    <div class="book-details">
        <h3 class="book-title">${book.titre}</h3>
        <i class="fas fa-book book-icon"></i> <!-- Icône de livre -->
        <button class="borrow-button" data-id="${book.id}">Emprunter</button>
    </div>
`;



                        booksList.appendChild(bookElement);
                    });
                }

                document.querySelectorAll(".borrow-button").forEach(button => {
                    button.addEventListener("click", (event) => {
                        selectedBookId = event.target.getAttribute("data-id");
                        openModal();
                    });
                });
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des livres:", error);
                booksList.innerHTML = "<p>Erreur lors du chargement des livres disponibles. Veuillez réessayer plus tard.</p>";
            });
    }

    function openModal() {
        document.getElementById("modal-confirm").style.display = "block";
    }

    function closeModal() {
        document.getElementById("modal-confirm").style.display = "none";
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


    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    document.getElementById("confirm-button").addEventListener("click", () => {
        const userId = document.getElementById("user-id-input").value.trim();
        if (selectedBookId && userId) {
            borrowBook(selectedBookId, userId);
        } else {
            alert("Veuillez entrer un ID utilisateur valide.");
        }
    });

    displayAvailableBooks();
});
