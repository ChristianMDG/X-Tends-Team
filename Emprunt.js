
//js

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

// Emprunt.js

document.addEventListener('DOMContentLoaded', function () {
  // Références aux éléments du DOM
  const empruntForm = document.getElementById('empruntForm');
  const empruntsTable = document.getElementById('empruntsTable').getElementsByTagName('tbody')[0];

  let emprunts = [];
  let editingIndex = -1;

  // Gestionnaire d'événements pour le formulaire de soumission
  empruntForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const livreId = document.getElementById('livreId').value;
    const utilisateurId = document.getElementById('utilisateurId').value;
    const dateEmprunt = document.getElementById('dateEmprunt').value;
    const dateRetour = document.getElementById('dateRetour').value;

    const emprunt = {
      livreId,
      utilisateurId,
      dateEmprunt,
      dateRetour: dateRetour || 'Pas encore retourné'
    };

    if (editingIndex === -1) {
      // Ajout d'un nouvel emprunt
      emprunts.push(emprunt);
    } else {
      // Modification d'un emprunt existant
      emprunts[editingIndex] = emprunt;
      editingIndex = -1;
    }

    // Réinitialiser le formulaire
    empruntForm.reset();

    // Mettre à jour la liste des emprunts
    afficherEmprunts();
  });

  // Fonction pour afficher la liste des emprunts
  function afficherEmprunts() {
    // Vider le tableau
    empruntsTable.innerHTML = '';

    // Afficher chaque emprunt dans le tableau
    emprunts.forEach(function (emprunt, index) {
      const row = empruntsTable.insertRow();

      row.insertCell(0).textContent = index + 1;
      row.insertCell(1).textContent = emprunt.livreId;
      row.insertCell(2).textContent = emprunt.utilisateurId;
      row.insertCell(3).textContent = emprunt.dateEmprunt;
      row.insertCell(4).textContent = emprunt.dateRetour;

      // Boutons pour modifier ou supprimer un emprunt
      const actionsCell = row.insertCell(5);
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Modifier';
      editBtn.className = 'btn btn-warning btn-sm mr-2';
      editBtn.onclick = function () {
        modifierEmprunt(index);
      };

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Supprimer';
      deleteBtn.className = 'btn btn-danger btn-sm';
      deleteBtn.onclick = function () {
        supprimerEmprunt(index);
      };

      actionsCell.appendChild(editBtn);
      actionsCell.appendChild(deleteBtn);
    });
  }

  // Fonction pour modifier un emprunt
  function modifierEmprunt(index) {
    const emprunt = emprunts[index];

    document.getElementById('livreId').value = emprunt.livreId;
    document.getElementById('utilisateurId').value = emprunt.utilisateurId;
    document.getElementById('dateEmprunt').value = emprunt.dateEmprunt;
    document.getElementById('dateRetour').value = emprunt.dateRetour !== 'Pas encore retourné' ? emprunt.dateRetour : '';

    editingIndex = index;
  }

  // Fonction pour supprimer un emprunt
  function supprimerEmprunt(index) {
    emprunts.splice(index, 1);
    afficherEmprunts();
  }
});

Emprunt.js

