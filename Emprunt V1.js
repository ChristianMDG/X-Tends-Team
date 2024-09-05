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


  // Utilisation d'Axios pour envoyer la requête POST
  axios.post('http://127.0.0.1:8080/api/emprunts', emprunt)
    .then(response => {
      addEmpruntToTable(response.data);
      document.getElementById('empruntForm').reset(); // Réinitialise le formulaire
    })
    .catch(error => console.error('Erreur:', error));
});

function addEmpruntToTable(emprunt) {
  const tableBody = document.getElementById('empruntsTable').querySelector('tbody');
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
        <td>${emprunt.id}</td>
        <td>${emprunt.livre.id}</td>
        <td>${emprunt.utilisateur.id}</td>
        <td>${new Date(emprunt.dateEmprunt).toLocaleDateString('fr-FR')}</td>
        <td>${emprunt.dateRetour ? new Date(emprunt.dateRetour).toLocaleDateString('fr-FR') : 'Non retourné'}</td>
    `;
  tableBody.appendChild(newRow);
}

// Charger les emprunts existants au démarrage avec Axios
axios.get('http://127.0.0.1:8080/api/emprunts')
  .then(response => {
    response.data.forEach(emprunt => addEmpruntToTable(emprunt));
  })
  .catch(error => console.error('Erreur:', error));
