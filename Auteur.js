// URL de base de votre API
const baseURL = "http://localhost:8080/api/auteurs";

// Fonction pour ajouter un nouvel auteur
async function addAuteur(auteur) {
  try {
    const response = await axios.post(baseURL, auteur);
    alert("Auteur ajouté avec succès!");
    getAuteurs(); // Recharger la liste des auteurs après l'ajout
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'auteur:", error);
    alert("Une erreur est survenue lors de l'ajout de l'auteur.");
  }
}

// Fonction pour récupérer et afficher la liste des auteurs
async function getAuteurs() {
  try {
    const response = await axios.get(baseURL);
    const auteurs = response.data;
    displayAuteurs(auteurs);
  } catch (error) {
    console.error("Erreur lors de la récupération des auteurs:", error);
    alert("Une erreur est survenue lors de la récupération des auteurs.");
  }
}

// Fonction pour supprimer un auteur par son ID
async function deleteAuteur(id) {
  try {
    await axios.delete(`${baseURL}/${id}`);
    alert("Auteur supprimé avec succès!");
    getAuteurs(); // Recharger la liste des auteurs après la suppression
  } catch (error) {
    console.error("Erreur lors de la suppression de l'auteur:", error);
    alert("Une erreur est survenue lors de la suppression de l'auteur.");
  }
}

// Fonction pour afficher les auteurs dans le tableau
function displayAuteurs(auteurs) {
  const auteursTableBody = document.querySelector("#auteursTable tbody");
  auteursTableBody.innerHTML = "";

  auteurs.forEach((auteur) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                    <td>${auteur.nom}</td>
                    <td>${auteur.prenom}</td>
                    <td>${auteur.livres
                      .map((livre) => livre.titre)
                      .join(", ")}</td>
                    <td>
                        <button onclick="deleteAuteur(${
                          auteur.id
                        })">Supprimer</button>
                    </td>
                `;
    auteursTableBody.appendChild(row);
  });
}

// Gérer la soumission du formulaire
document
  .getElementById("auteurForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const nom = document.getElementById("nom").value;
    const prenom = document.getElementById("prenom").value;

    const auteur = {
      nom: nom,
      prenom: prenom,
    };

    addAuteur(auteur);

    // Réinitialiser le formulaire
    document.getElementById("auteurForm").reset();
  });

// Charger la liste des auteurs au chargement de la page
window.onload = function () {
  getAuteurs();
};
document.addEventListener("DOMContentLoaded", function () {
  getAuteurs();
});

function getAuteurs() {
  axios
    .get("http://localhost:8080/api/auteurs")
    .then(function (response) {
      const auteurs = response.data;
      const tableBody = document.querySelector("#auteursTable tbody");
      tableBody.innerHTML = ""; // Vider le tableau avant de le remplir

      auteurs.forEach(function (auteur) {
        const row = document.createElement("tr");

        // Ajouter le nom de l'auteur
        const nomCell = document.createElement("td");
        nomCell.textContent = auteur.nom;
        row.appendChild(nomCell);

        // Ajouter le prénom de l'auteur
        const prenomCell = document.createElement("td");
        prenomCell.textContent = auteur.prenom;
        row.appendChild(prenomCell);

        // Ajouter la liste des livres
        const livresCell = document.createElement("td");
        if (auteur.livres && auteur.livres.length > 0) {
          const livresList = auteur.livres
            .map((livre) => livre.titre)
            .join(", ");
          livresCell.textContent = livresList;
        } else {
          livresCell.textContent = "Aucun livre";
        }
        row.appendChild(livresCell);

        // Ajouter les actions (ex. : modifier, supprimer)
        const actionsCell = document.createElement("td");
        actionsCell.innerHTML = `
                    
                    <button onclick="deleteAuteur(${auteur.id})">Supprimer</button>
                `;
        row.appendChild(actionsCell);

        tableBody.appendChild(row);
      });
    })
    .catch(function (error) {
      console.error("Erreur lors de la récupération des auteurs:", error);
    });
}


        // Fonction pour basculer l'affichage du menu
        function toggleMenu() {
            var navbar = document.getElementById('navbar');
            navbar.style.display = (navbar.style.display === 'flex') ? 'none' : 'flex';
        }

        // Fonction pour afficher la section correspondante et masquer les autres
        function showSection(sectionId) {
            var sections = document.querySelectorAll('.section');
            sections.forEach(function (section) {
                section.classList.remove('active');
                section.classList.add('d-none');
            });
            document.getElementById(sectionId).classList.remove('d-none');
            document.getElementById(sectionId).classList.add('active');
            // Masquer le menu après sélection
            toggleMenu();
        }

        // Fonction pour ajouter un nouvel auteur
        async function addAuteur(auteur) {
            try {
                const response = await axios.post(baseURL, auteur);
                alert("Auteur ajouté avec succès!");
                getAuteurs(); // Recharger la liste des auteurs après l'ajout
            } catch (error) {
                console.error("Erreur lors de l'ajout de l'auteur:", error);
                alert("Une erreur est survenue lors de l'ajout de l'auteur.");
            }
        }

        // Fonction pour récupérer et afficher la liste des auteurs
        async function getAuteurs() {
            try {
                const response = await axios.get(baseURL);
                const auteurs = response.data;
                displayAuteurs(auteurs);
            } catch (error) {
                console.error("Erreur lors de la récupération des auteurs:", error);
                alert("Une erreur est survenue lors de la récupération des auteurs.");
            }
        }

        // Fonction pour afficher les auteurs dans le tableau
        function displayAuteurs(auteurs) {
            const auteursTableBody = document.querySelector("#auteursTable tbody");
            auteursTableBody.innerHTML = "";

            auteurs.forEach((auteur) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${auteur.nom}</td>
                    <td>${auteur.prenom}</td>
                    <td>${auteur.livres.map((livre) => livre.titre).join(", ")}</td>
                    <td>
                        <button class="btn btn-warning" onclick="editAuteur(${auteur.id})">Modifier</button>
                        <button class="btn btn-danger" onclick="deleteAuteur(${auteur.id})">Supprimer</button>
                    </td>
                `;
                auteursTableBody.appendChild(row);
            });
        }

        // Fonction pour ouvrir le formulaire avec les données de l'auteur à modifier
        function editAuteur(id) {
            axios.get(`${baseURL}/${id}`)
                .then(response => {
                    const auteur = response.data;

                    // Pré-remplir le formulaire avec les informations de l'auteur
                    document.getElementById("nom").value = auteur.nom;
                    document.getElementById("prenom").value = auteur.prenom;

                    // Changer le texte du bouton et l'événement de soumission pour "Modifier"
                    document.getElementById("formTitle").textContent = "Modifier Auteur";
                    document.getElementById("submitBtn").textContent = "Modifier";
                    document.getElementById("submitBtn").onclick = function () {
                        updateAuteur(id);
                    };

                    // Afficher la section du formulaire
                    showSection('formSection');
                })
                .catch(error => {
                    console.error("Erreur lors de la récupération de l'auteur:", error);
                    alert("Une erreur est survenue lors de la récupération des informations de l'auteur.");
                });
        }

        // Fonction pour mettre à jour l'auteur
        function updateAuteur(id) {
            const nom = document.getElementById("nom").value;
            const prenom = document.getElementById("prenom").value;

            const auteur = {
                nom: nom,
                prenom: prenom
            };

            axios.put(`${baseURL}/${id}`, auteur)
                .then(response => {
                    alert("Auteur modifié avec succès!");
                    getAuteurs(); // Recharger la liste des auteurs
                    resetForm(); // Réinitialiser le formulaire
                })
                .catch(error => {
                    console.error("Erreur lors de la mise à jour de l'auteur:", error);
                    alert("Une erreur est survenue lors de la mise à jour de l'auteur.");
                });
        }

        // Fonction pour supprimer un auteur par son ID
        async function deleteAuteur(id) {
            try {
                await axios.delete(`${baseURL}/${id}`);
                alert("Auteur supprimé avec succès!");
                getAuteurs(); // Recharger la liste des auteurs après la suppression
            } catch (error) {
                console.error("Erreur lors de la suppression de l'auteur:", error);
                alert("Une erreur est survenue lors de la suppression de l'auteur.");
            }
        }

        // Réinitialiser le formulaire et revenir à l'état initial
        function resetForm() {
            document.getElementById("auteurForm").reset();
            document.getElementById("formTitle").textContent = "Ajouter un Auteur";
            document.getElementById("submitBtn").textContent = "Ajouter";
            document.getElementById("submitBtn").onclick = function (event) {
                event.preventDefault();
                addAuteur({
                    nom: document.getElementById("nom").value,
                    prenom: document.getElementById("prenom").value
                });
            };
        }

        // Charger la liste des auteurs au démarrage
        window.onload = function () {
            getAuteurs();
};
        
 