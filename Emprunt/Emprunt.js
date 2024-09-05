// Définition de l'URL de base de l'API
const API_BASE_URL = "http://127.0.0.1:8080/api";
let empruntEnModification = null; // Variable pour stocker l'ID de l'emprunt en cours de modification

// Fonction pour basculer l'affichage du menu
function toggleMenu() {
  const navbar = document.getElementById("navbar");
  navbar.style.display = navbar.style.display === "flex" ? "none" : "flex";
}

// Fonction pour afficher la section correspondante et masquer les autres
function showSection(sectionId) {
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    section.classList.toggle("d-none", section.id !== sectionId);
  });
  // Masquer le menu après sélection
  toggleMenu();
}

// Réinitialiser le formulaire
function resetForm() {
  document.getElementById("empruntForm").reset();
  empruntEnModification = null;
  document.getElementById("formTitle").textContent = "Ajouter un Emprunt";
  document.getElementById("submitBtn").textContent = "Ajouter Emprunt";

  // Réinitialiser les sélections de livres et utilisateurs
  document.getElementById("livre").selectedIndex = 0;
  document.getElementById("utilisateur").selectedIndex = 0;
}

// Afficher un message d'alerte
function showMessage(message, type) {
  const alertDiv = document.getElementById("alertMessage");
  alertDiv.textContent = message;
  alertDiv.className = `alert alert-${type}`;
  alertDiv.classList.remove("d-none");
  // Masquer l'alerte après 3 secondes
  setTimeout(() => {
    alertDiv.classList.add("d-none");
  }, 3000);
}

// Charger la liste des emprunts au démarrage
function loadEmprunts() {
  axios.get(`${API_BASE_URL}/emprunts`)
    .then((response) => {
      const emprunts = response.data;
      const tableBody = document.querySelector("#empruntsTable tbody");
      tableBody.innerHTML = ""; // Vider le tableau avant de le remplir
      emprunts.forEach((emprunt) => {
        const row = document.createElement("tr");
        row.setAttribute("data-id", emprunt.id);
        row.innerHTML = `
          <td>${emprunt.livre.titre}</td>
          <td>${emprunt.utilisateur.nom}</td>
          <td>${emprunt.dateEmprunt}</td>
          <td>${emprunt.dateRetour}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="modifierEmprunt(${emprunt.id})">Modifier</button>
            <button class="btn btn-danger btn-sm" onclick="supprimerEmprunt(${emprunt.id})">Supprimer</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des emprunts :", error);
      showMessage("Erreur lors du chargement des emprunts.", "danger");
    });
}

// Soumission du formulaire pour ajouter ou modifier un emprunt
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("empruntForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const livreId = document.getElementById("livre").value;
    const utilisateurId = document.getElementById("utilisateur").value;
    const dateEmprunt = document.getElementById("dateEmprunt").value;
    const dateRetour = document.getElementById("dateRetour").value;

    const empruntData = { livre: { id: livres }, utilisateur: { id: utilisateur }, dateEmprunt, dateRetour };

    if (empruntEnModification) {
      axios.put(`http://127.0.0.1:8080/api/emprunts/${empruntEnModification}`, empruntData)
        .then(() => {
          showMessage("Emprunt modifié avec succès.", "success");
          loadEmprunts();
          resetForm();
        })
        .catch((error) => {
          console.error("Erreur lors de la modification de l'emprunt :", error);
          showMessage("Erreur lors de la modification de l'emprunt.", "danger");
        });
    } else {
      axios.post(`http://127.0.0.1:8080/api/emprunts`, empruntData)
        .then(() => {
          showMessage("Emprunt ajouté avec succès.", "success");
          loadEmprunts();
          resetForm();
        })
        .catch((error) => {
          console.error("Erreur lors de l'ajout de l'emprunt :", error);
          showMessage("Erreur lors de l'ajout de l'emprunt.", "danger");
        });
    }
  });

  loadLivresAndUtilisateurs(); // Charger les livres et utilisateurs lors du chargement de la page
  loadEmprunts(); // Charger les emprunts
});

// Charger les livres et les utilisateurs pour les sélections
function loadLivresAndUtilisateurs() {
  axios.get(`http://127.0.0.1:8080/api/livres`)
    .then((response) => {
      const livres = response.data;
      const livreSelect = document.getElementById("livre");
      livres.forEach((livre) => {
        const option = document.createElement("option");
        option.value = livre.id;
        option.textContent = livre.titre;
        livreSelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des livres :", error);
      showMessage("Erreur lors du chargement des livres.", "danger");
    });

  axios.get(`http://127.0.0.1:8080/api/utilisateurs`)
    .then((response) => {
      const utilisateurs = response.data;
      const utilisateurSelect = document.getElementById("utilisateur");
      utilisateurs.forEach((utilisateur) => {
        const option = document.createElement("option");
        option.value = utilisateur.id;
        option.textContent = utilisateur.nom;
        utilisateurSelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des utilisateurs :", error);
      showMessage("Erreur lors du chargement des utilisateurs.", "danger");
    });
}

// Fonction pour modifier un emprunt
function modifierEmprunt(id) {
  axios.get(`http://127.0.0.1:8080/api/emprunts/${id}`)
    .then((response) => {
      const emprunt = response.data;
      document.getElementById("livre").value = emprunt.livre.id;
      document.getElementById("utilisateur").value = emprunt.utilisateur.id;
      document.getElementById("dateEmprunt").value = emprunt.dateEmprunt;
      document.getElementById("dateRetour").value = emprunt.dateRetour;

      empruntEnModification = id;
      document.getElementById("formTitle").textContent = "Modifier l'Emprunt";
      document.getElementById("submitBtn").textContent = "Modifier Emprunt";
    })
    .catch((error) => {
      console.error("Erreur lors du chargement de l'emprunt :", error);
      showMessage("Erreur lors du chargement de l'emprunt.", "danger");
    });
}

// Fonction pour supprimer un emprunt
function supprimerEmprunt(id) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cet emprunt ?")) {
    axios.delete(`http://127.0.0.1:8080/api/emprunts/${id}`)
      .then(() => {
        showMessage("Emprunt supprimé avec succès.", "success");
        loadEmprunts();
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression de l'emprunt :", error);
        showMessage("Erreur lors de la suppression de l'emprunt.", "danger");
      });
  }
}
