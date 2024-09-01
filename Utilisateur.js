// Définition de l'URL de base de l'API
const API_BASE_URL = "http://127.0.0.1:8080/api";

let utilisateurEnModification = null; // Variable pour stocker l'ID de l'utilisateur en cours de modification

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
  document.getElementById("utilisateurForm").reset();
  utilisateurEnModification = null;
  document.getElementById("formTitle").textContent = "Ajouter un Utilisateur";
  document.getElementById("submitBtn").textContent = "Ajouter Utilisateur";
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

// Charger la liste des utilisateurs au démarrage
function loadUtilisateurs() {
  axios
    .get(`${API_BASE_URL}/utilisateurs`)
    .then((response) => {
      const utilisateurs = response.data;
      const tableBody = document.querySelector("#utilisateursTable tbody");
      tableBody.innerHTML = ""; // Vider le tableau avant de le remplir
      utilisateurs.forEach((utilisateur) => {
        const row = document.createElement("tr");
        row.setAttribute("data-id", utilisateur.id);
        row.innerHTML = `
          <td>${utilisateur.nom}</td>
          <td>${utilisateur.email}</td>
          <td>
            <button class="btn btn-info btn-sm" onclick="voirLivres(${utilisateur.id})">Voir Livres</button>
          </td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="modifierUtilisateur(${utilisateur.id})">Modifier</button>
            <button class="btn btn-danger btn-sm" onclick="supprimerUtilisateur(${utilisateur.id})">Supprimer</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des utilisateurs :", error);
      showMessage("Erreur lors du chargement des utilisateurs.", "danger");
    });
}

// Soumission du formulaire pour ajouter ou modifier un utilisateur
document
  .getElementById("utilisateurForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const nom = document.getElementById("nom").value;
    const email = document.getElementById("email").value;

    if (utilisateurEnModification) {
      // Mise à jour d'un utilisateur existant
      axios
        .put(`${API_BASE_URL}/utilisateurs/${utilisateurEnModification}`, {
          nom,
          email,
        })
        .then(() => {
          showMessage("Utilisateur modifié avec succès.", "success");
          resetForm();
          loadUtilisateurs();
          showSection("listSection");
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la modification de l'utilisateur :",
            error
          );
          showMessage(
            "Erreur lors de la modification de l'utilisateur.",
            "danger"
          );
        });
    } else {
      // Ajout d'un nouvel utilisateur
      axios
        .post(`${API_BASE_URL}/utilisateurs`, { nom, email })
        .then(() => {
          showMessage("Utilisateur ajouté avec succès.", "success");
          resetForm();
          loadUtilisateurs();
          showSection("listSection");
        })
        .catch((error) => {
          console.error("Erreur lors de l'ajout de l'utilisateur :", error);
          showMessage("Erreur lors de l'ajout de l'utilisateur.", "danger");
        });
    }
  });

// Fonction pour afficher les livres empruntés d'un utilisateur
function voirLivres(utilisateurId) {
  axios
    .get(`${API_BASE_URL}/utilisateurs/${utilisateurId}/livres`)
    .then((response) => {
      const livres = response.data;
      const livresList = document.getElementById("livresList");
      if (livres.length > 0) {
        livresList.innerHTML = `
          <ul class="list-group">
            ${livres
              .map(
                (livre) => `
              <li class="list-group-item">
                <strong>${livre.titre}</strong> par ${livre.auteur}
              </li>
            `
              )
              .join("")}
          </ul>
        `;
      } else {
        livresList.innerHTML = "<p>Aucun livre emprunté.</p>";
      }
      $("#livresModal").modal("show");
    })
    .catch((error) => {
      console.error(
        "Erreur lors de la récupération des livres empruntés :",
        error
      );
      showMessage(
        "Erreur lors de la récupération des livres empruntés.",
        "danger"
      );
    });
}

// Fonction pour supprimer un utilisateur
function supprimerUtilisateur(utilisateurId) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
    axios
      .delete(`${API_BASE_URL}/utilisateurs/${utilisateurId}`)
      .then(() => {
        showMessage("Utilisateur supprimé avec succès.", "success");
        loadUtilisateurs();
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la suppression de l'utilisateur :",
          error
        );
        showMessage(
          "Erreur lors de la suppression de l'utilisateur.",
          "danger"
        );
      });
  }
}

// Fonction pour remplir le formulaire avec les informations de l'utilisateur à modifier
function modifierUtilisateur(utilisateurId) {
  axios
    .get(`${API_BASE_URL}/utilisateurs/${utilisateurId}`)
    .then((response) => {
      const utilisateur = response.data;
      document.getElementById("nom").value = utilisateur.nom;
      document.getElementById("email").value = utilisateur.email;
      utilisateurEnModification = utilisateurId;
      document.getElementById("formTitle").textContent = "Modifier Utilisateur";
      document.getElementById("submitBtn").textContent = "Mettre à jour";
      showSection("formSection");
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
      showMessage("Erreur lors de la récupération de l'utilisateur.", "danger");
    });
}

// Chargement initial des utilisateurs lorsque la page est prête
document.addEventListener("DOMContentLoaded", () => {
  loadUtilisateurs();
  showSection("listSection"); // Afficher la liste des utilisateurs par défaut
});
