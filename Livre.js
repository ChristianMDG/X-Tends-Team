// Définition de l'URL de base de l'API
const API_BASE_URL = "http://127.0.0.1:8080/api";

let livreEnModification = null; // Variable pour stocker l'ID du livre en cours de modification

// Fonction pour basculer l'affichage du menu
function toggleMenu() {
  const navbar = document.getElementById("navbar");
  navbar.style.display = navbar.style.display === "flex" ? "none" : "flex";
}

// Fonction pour afficher la section correspondante et masquer les autres
function showSection(sectionId) {
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    if (section.id === sectionId) {
      section.classList.remove("d-none");
    } else {
      section.classList.add("d-none");
    }
  });
  // Masquer le menu après sélection
  toggleMenu();
}

// Réinitialiser le formulaire
function resetForm() {
  document.getElementById("livreForm").reset();
  livreEnModification = null;
  document.getElementById("formTitle").textContent = "Ajouter un Livre";
  document.getElementById("submitBtn").textContent = "Ajouter Livre";
}

// Afficher un message d'alerte
function showMessage(message, type) {
  const alertDiv = document.getElementById("alertMessage");
  alertDiv.textContent = message;
  alertDiv.className = `alert alert-${type}`;
  alertDiv.classList.remove("d-none");
  // Masquer l'alerte après 5 secondes
  setTimeout(() => {
    alertDiv.classList.add("d-none");
  }, 5000);
}

// Charger la liste des livres au démarrage
function loadLivres() {
  axios
    .get(`${API_BASE_URL}/livres`)
    .then((response) => {
      const livres = response.data;
      const tableBody = document.querySelector("#livresTable tbody");
      tableBody.innerHTML = ""; // Vider le tableau avant de le remplir
      livres.forEach((livre) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${livre.titre}</td>
          <td>${livre.isbn}</td>
          <td>${new Date(livre.datePublication).toLocaleDateString()}</td>
          <td>${livre.disponible ? "Oui" : "Non"}</td>
          <td>${livre.auteur}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="modifierLivre(${livre.id})">Modifier</button>
            <button class="btn btn-danger btn-sm" onclick="supprimerLivre(${livre.id})">Supprimer</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      showMessage("Erreur lors du chargement des livres", "danger");
      console.error("Erreur lors du chargement des livres :", error);
    });
}

// Fonction pour ajouter ou modifier un livre
document.getElementById("livreForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const livreData = {
    titre: document.getElementById("titre").value,
    isbn: document.getElementById("isbn").value,
    datePublication: document.getElementById("datePublication").value,
    disponible: document.getElementById("disponible").value === "true",
    auteur: document.getElementById("auteur").value
  };

  if (livreEnModification) {
    // Modification d'un livre existant
    axios
      .put(`${API_BASE_URL}/livres/${livreEnModification}`, livreData)
      .then((response) => {
        showMessage("Livre modifié avec succès", "success");
        resetForm();
        loadLivres(); // Recharger la liste des livres après modification
      })
      .catch((error) => {
        showMessage("Erreur lors de la modification du livre", "danger");
        console.error("Erreur lors de la modification du livre :", error);
      });
  } else {
    // Ajout d'un nouveau livre
    axios
      .post(`${API_BASE_URL}/livres`, livreData)
      .then((response) => {
        showMessage("Livre ajouté avec succès", "success");
        resetForm();
        loadLivres(); // Recharger la liste des livres après ajout
      })
      .catch((error) => {
        showMessage("Erreur lors de l'ajout du livre", "danger");
        console.error("Erreur lors de l'ajout du livre :", error);
      });
  }
});

// Fonction pour remplir le formulaire lors de la modification d'un livre
function modifierLivre(id) {
  axios
    .get(`${API_BASE_URL}/livres/${id}`)
    .then((response) => {
      const livre = response.data;
      document.getElementById("titre").value = livre.titre;
      document.getElementById("isbn").value = livre.isbn;
      document.getElementById("datePublication").value = livre.datePublication.split("T")[0]; // Pour compenser le format de date
      document.getElementById("disponible").value = livre.disponible ? "true" : "false";
      document.getElementById("auteur").value = livre.auteur;
      livreEnModification = id;
      document.getElementById("formTitle").textContent = "Modifier Livre";
      document.getElementById("submitBtn").textContent = "Modifier Livre";
      showSection("formSection"); // Afficher la section du formulaire
    })
    .catch((error) => {
      showMessage("Erreur lors du chargement des données du livre", "danger");
      console.error("Erreur lors du chargement des données du livre :", error);
    });
}

// Fonction pour supprimer un livre
function supprimerLivre(id) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) {
    axios
      .delete(`${API_BASE_URL}/livres/${id}`)
      .then((response) => {
        showMessage("Livre supprimé avec succès", "success");
        loadLivres(); // Recharger la liste des livres après suppression
      })
      .catch((error) => {
        showMessage("Erreur lors de la suppression du livre", "danger");
        console.error("Erreur lors de la suppression du livre :", error);
      });
  }
}

// Charger les livres lors du chargement de la page
document.addEventListener("DOMContentLoaded", loadLivres);
