document.addEventListener("DOMContentLoaded", () => {
  const booksList = document.getElementById("books-list");
  const borrowedBooksList = document.getElementById("borrowed-books-list");

  // API endpoint
  const apiUrl = "http://127.0.0.1:8080/api/livres";

  // Afficher les livres disponibles
  function displayAvailableBooks() {
    booksList.innerHTML = ''; // Vider avant d'ajouter le loader

    const loader = document.createElement('div');
    loader.classList.add('loader');
    loader.innerHTML = '<img src="./images/loader.gif" alt="Chargement...">';
    booksList.appendChild(loader); // Afficher le loader pendant le chargement

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
            bookElement.innerHTML = `
                            <div class="book-card">
                                <img src="${book.coverImage || './images/default_cover.jpg'}" alt="${book.titre}" class="book-cover">
                                <h3>${book.titre}</h3>
                                <p>Auteur(s): ${book.auteurs.join(", ")}</p>
                                <button class="borrow-button" data-id="${book.id}">Emprunter</button>
                            </div>
                        `;
            booksList.appendChild(bookElement);
          });
        }

        // Ajouter les gestionnaires d'événements pour les boutons d'emprunt
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
        alert(message);
        displayAvailableBooks(); // Rafraîchir la liste des livres disponibles
        displayBorrowedBooks();  // Rafraîchir la liste des livres empruntés
      })
      .catch(error => {
        console.error("Erreur lors de l'emprunt du livre:", error);
        alert("Une erreur est survenue lors de l'emprunt. Veuillez réessayer.");
      });
  }

  // Afficher les livres empruntés
  function displayBorrowedBooks() {
    borrowedBooksList.innerHTML = ''; // Vider avant d'ajouter le loader

    const loader = document.createElement('div');
    loader.classList.add('loader');
    loader.innerHTML = '<img src="./images/loader.gif" alt="Chargement...">';
    borrowedBooksList.appendChild(loader); // Afficher le loader pendant le chargement

    fetch(`${apiUrl}/emprunts`)
      .then(response => response.json())
      .then(data => {
        borrowedBooksList.innerHTML = ""; // Réinitialise la liste
        if (data.length === 0) {
          borrowedBooksList.innerHTML = "<p>Vous n'avez aucun emprunt en cours.</p>";
        } else {
          data.forEach(book => {
            const bookElement = document.createElement("div");
            bookElement.classList.add("borrowed-book-item");
            bookElement.innerHTML = `
                            <div class="borrowed-book-card">
                                <img src="${book.coverImage || './images/default_cover.jpg'}" alt="${book.titre}" class="book-cover">
                                <h3>${book.titre}</h3>
                                <p>Auteur(s): ${book.auteurs.join(", ")}</p>
                                <p>Date d'emprunt: ${new Date(book.borrowDate).toLocaleDateString()}</p>
                                <p>Date de retour: ${new Date(book.returnDate).toLocaleDateString()}</p>
                                <button class="return-button" data-id="${book.id}">Retourner</button>
                            </div>
                        `;
            borrowedBooksList.appendChild(bookElement);
          });
        }

        // Ajouter les gestionnaires d'événements pour les boutons de retour
        document.querySelectorAll(".return-button").forEach(button => {
          button.addEventListener("click", (event) => {
            const bookId = event.target.getAttribute("data-id");
            returnBook(bookId);
          });
        });
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des livres empruntés:", error);
        borrowedBooksList.innerHTML = "<p>Erreur lors du chargement des emprunts. Veuillez réessayer plus tard.</p>";
      });
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
      .catch(error => {
        console.error("Erreur lors du retour du livre:", error);
        alert("Une erreur est survenue lors du retour. Veuillez réessayer.");
      });
  }

  // Initialiser l'affichage
  displayAvailableBooks();
  displayBorrowedBooks();
});
