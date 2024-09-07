let utilisateurEnModification = null; // Variable pour stocker l'ID de l'emprunt en cours de modification

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

// Fonction pour ajouter ou mettre à jour un emprunt
document.getElementById('empruntForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const livreId = document.getElementById('livreId').value;
  const utilisateurId = document.getElementById('utilisateurId').value;
  const dateEmprunt = new Date().toISOString().split('T')[0]; // Format 'yyyy-MM-dd'
  const dateRetour = document.getElementById('dateRetour').value || null;

  const emprunt = {
    livre: { id: livreId },
    utilisateur: { id: utilisateurId },
    dateEmprunt: dateEmprunt,
    dateRetour: dateRetour
  };

  if (utilisateurEnModification) {
    // Modifier l'emprunt existant
    axios.put(`http://127.0.0.1:8080/api/emprunts/${utilisateurEnModification}`, emprunt)
      .then(response => {
        location.reload(); // Recharger la page pour afficher les changements
      })
      .catch(error => console.error('Erreur lors de la modification de l\'emprunt:', error));
  } else {
    // Ajouter un nouvel emprunt
    axios.post('http://127.0.0.1:8080/api/emprunts', emprunt)
      .then(response => {
        addEmpruntToTable(response.data);
        document.getElementById('empruntForm').reset(); // Réinitialise le formulaire
      })
      .catch(error => console.error('Erreur lors de l\'ajout de l\'emprunt:', error));
  }

  // Réinitialiser l'état
  utilisateurEnModification = null;
  document.querySelector('button[type="submit"]').textContent = 'Ajouter Emprunt';
});

// Fonction pour ajouter un emprunt à la table
function addEmpruntToTable(emprunt) {
  const tableBody = document.getElementById('empruntsTable').querySelector('tbody');

  if (!tableBody) {
    console.error('Erreur: Le tableau des emprunts n\'a pas de <tbody>.');
    return;
  }

  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${emprunt.id}</td>
    <td>${emprunt.livre.id}</td>
    <td>${emprunt.utilisateur.id}</td>
    <td>${new Date(emprunt.dateEmprunt).toLocaleDateString('fr-FR')}</td>
    <td>${emprunt.dateRetour ? new Date(emprunt.dateRetour).toLocaleDateString('fr-FR') : 'Non retourné'}</td>
    <td>
      <button class="btn btn-danger btn-sm" onclick="deleteEmprunt(${emprunt.id}, this)">Supprimer</button>
    </td>
  `;
  tableBody.appendChild(newRow);
}

// Fonction pour modifier un emprunt
function editEmprunt(empruntId) {
  axios.get(`http://127.0.0.1:8080/api/emprunts/${empruntId}`)
    .then(response => {
      const emprunt = response.data;
      document.getElementById('livreId').value = emprunt.livre.id;
      document.getElementById('utilisateurId').value = emprunt.utilisateur.id;
      document.getElementById('dateRetour').value = emprunt.dateRetour ? emprunt.dateRetour.split('T')[0] : '';

      // Stocker l'ID de l'emprunt en cours de modification
      utilisateurEnModification = empruntId;

      // Changer le texte du bouton du formulaire en "Modifier"
      document.querySelector('button[type="submit"]').textContent = 'Modifier Emprunt';
    })
    .catch(error => console.error('Erreur lors de la récupération de l\'emprunt:', error));
}

// Fonction pour supprimer un emprunt
function deleteEmprunt(empruntId, button) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet emprunt ?')) {
    axios.delete(`http://127.0.0.1:8080/api/emprunts/${empruntId}`)
      .then(() => {
        const row = button.closest('tr');
        row.remove(); // Supprimer la ligne du tableau
        alert('Emprunt supprimé avec succès.');
      })
      .catch(error => console.error('Erreur lors de la suppression:', error));
  }
}

// Charger les emprunts existants au démarrage avec Axios
axios.get('http://127.0.0.1:8080/api/emprunts')
  .then(response => {
    console.log(response.data); // Debug the response to check the structure
    if (Array.isArray(response.data)) {
      response.data.forEach(emprunt => addEmpruntToTable(emprunt));
    } else {
      console.error('Erreur: La réponse ne contient pas un tableau.', response.data);
    }
  })
  .catch(error => console.error('Erreur lors de la récupération des emprunts:', error));

// Fonction pour réinitialiser le formulaire
function resetForm() {
  document.getElementById('empruntForm').reset();
  utilisateurEnModification = null;
  document.querySelector('button[type="submit"]').textContent = 'Ajouter Emprunt';
}
