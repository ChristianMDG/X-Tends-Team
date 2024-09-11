document.addEventListener("DOMContentLoaded", () => {
    const booksList = document.getElementById("books-list");
    const apiUrl = "http://127.0.0.1:8080/api/livres";
    let selectedBookId = null;

    // Afficher la liste des livres disponibles
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

                        // Afficher l'image de couverture
                        const coverImage = book.imageUrl ?
                            `<img src="${book.imageUrl}" alt="${book.titre}" class="book-cover">` :
                            `<div class="book-cover">
                                <div class="book-title"><i class="fas fa-book book-icon"></i></div>
                            </div>`;

                        // Afficher la description du livre
                        const bookDescription = book.description ?
                            `<p class="book-description">${book.description}</p>` :
                            '';

                        bookElement.innerHTML = `
                            ${coverImage}
                            <div class="book-details">
                                <h4 class="book-title">${book.titre}</h4>
                                ${bookDescription}
                                <button class="borrow-button" data-book-id="${book.id}">Emprunter</button>
                            </div>
                        `;
                        booksList.appendChild(bookElement);
                    });
                }
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des livres:", error);
                booksList.innerHTML = "<p>Erreur lors de la récupération des livres.</p>";
            });
    }

    displayAvailableBooks();

    booksList.addEventListener("click", event => {
        if (event.target.classList.contains("borrow-button")) {
            selectedBookId = event.target.dataset.bookId;
            openModal();
        }
    });

    // Ouvrir et fermer le modal
    const modal = document.getElementById("modal-confirm");
    const confirmButton = document.getElementById("confirm-button");

    function openModal() {
        modal.style.display = "flex"; // Utilisation de "flex" pour centrer le contenu
    }

    function closeModal() {
        modal.style.display = "none";
        selectedBookId = null; // Réinitialiser l'ID du livre sélectionné
    }

    confirmButton.addEventListener("click", () => {
        const userName = document.getElementById("user-name").value;
        const userEmail = document.getElementById("user-email").value;

        if (!userName || !userEmail) {
            displayToast("Veuillez remplir les champs nom et email.");
            return;
        }

        axios.post(`${apiUrl}/emprunter/${selectedBookId}`, {
            name: userName,
            email: userEmail
        })
            .then(response => {
                closeModal();
                displayToast("Livre emprunté avec succès !");
                displayAvailableBooks();
            })
            .catch(error => {
                console.error("Erreur lors de l'emprunt du livre:", error);
                displayToast("Erreur lors de l'emprunt du livre.");
            });
    });

    function displayToast(message) {
        const toast = document.createElement("div");
        toast.classList.add("toast");
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
});
