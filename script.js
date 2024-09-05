document.addEventListener('DOMContentLoaded', function () {
    // Exemple de livres disponibles (à remplacer par une requête API réelle)
    const books = [
        { id: 1, title: "Le Petit Prince", author: "Antoine de Saint-Exupéry" },
        { id: 2, title: "1984", author: "George Orwell" },
        { id: 3, title: "L'Étranger", author: "Albert Camus" },
        { id: 4, title: "Les Misérables", author: "Victor Hugo" },
        { id: 5, title: "Le Seigneur des Anneaux", author: "J.R.R. Tolkien" }
    ];

    // Exemple de prêts (à remplacer par une requête API réelle)
    let loans = [
        // { id: 1, userId: 1, bookId: 2, loanDate: '2024-04-01', dueDate: '2024-04-15' }
    ];

    const bookList = document.getElementById('book-list');
    const loanList = document.getElementById('loan-list');
    const bookCount = document.getElementById('book-count');
    const loanCount = document.getElementById('loan-count');

    // Fonction pour afficher les livres disponibles
    function displayBooks() {
        bookList.innerHTML = '';
        books.forEach(book => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${book.title} - ${book.author}</span>
                <button onclick="addLoan(${book.id})">Emprunter</button>
            `;
            bookList.appendChild(li);
        });
        bookCount.textContent = books.length;
    }

    // Fonction pour afficher les emprunts
    function displayLoans() {
        loanList.innerHTML = '';
        loans.forEach(loan => {
            const book = books.find(b => b.id === loan.bookId);
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${book ? book.title : 'Livre supprimé'} - Emprunté le ${loan.loanDate}</span>
                <span>Retour prévu le ${loan.dueDate}</span>
            `;
            loanList.appendChild(li);
        });
        loanCount.textContent = loans.length;
    }

    // Initialisation des affichages
    displayBooks();
    displayLoans();

    // Gestion du formulaire d'emprunt
    const borrowBookForm = document.getElementById('borrowBookForm');
    borrowBookForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const userId = parseInt(document.getElementById('userId').value);
        const bookId = parseInt(document.getElementById('bookId').value);

        // Validation des IDs
        const userExists = userId > 0; // À remplacer par une vérification réelle
        const bookExists = books.some(book => book.id === bookId);

        if (!userExists) {
            alert('ID utilisateur invalide.');
            return;
        }

        if (!bookExists) {
            alert('ID livre invalide.');
            return;
        }

        // Vérifier si le livre est déjà emprunté
        const isBookLoaned = loans.some(loan => loan.bookId === bookId);
        if (isBookLoaned) {
            alert('Ce livre est déjà emprunté.');
            return;
        }

        // Créer un nouvel emprunt
        const today = new Date();
        const dueDate = new Date();
        dueDate.setDate(today.getDate() + 14); // 2 semaines

        const newLoan = {
            id: loans.length + 1,
            userId: userId,
            bookId: bookId,
            loanDate: today.toISOString().split('T')[0],
            dueDate: dueDate.toISOString().split('T')[0]
        };

        loans.push(newLoan);
        displayLoans();
        displayBooks(); // Mettre à jour la liste des livres si nécessaire

        alert('Livre emprunté avec succès !');
        closeBorrowForm();
        borrowBookForm.reset();
    });
});

// Fonctions pour gérer l'affichage du formulaire d'emprunt
function showBorrowForm() {
    document.getElementById('borrow-form').style.display = 'block';
}

function closeBorrowForm() {
    document.getElementById('borrow-form').style.display = 'none';
}

// Fonction pour ajouter un emprunt directement depuis la liste des livres
function addLoan(bookId) {
    // Simuler un emprunt en remplissant le formulaire automatiquement
    const userId = prompt("Entrez votre ID utilisateur:");
    if (userId) {
        // Remplir et soumettre le formulaire
        document.getElementById('userId').value = userId;
        document.getElementById('bookId').value = bookId;
        document.getElementById('borrowBookForm').dispatchEvent(new Event('submit'));
    }
}
