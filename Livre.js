let livreEnModification = null; // Variable pour stocker l'ID du livre en cours de modification

// Fonction pour basculer l'affichage du menu
function toggleMenu() {
  const navbar = document.getElementById("navbar");
  navbar.style.display = (navbar.style.display === "none" || navbar.style.display === "") ? "block" : "none";
}

// Fonction pour afficher la section correspondante et masquer les autres
function showSection(sectionId) {
  const sections = document.querySelectorAll(".section");
  sections.forEach(section => {
    section.classList.remove("active");
  });
  document.getElementById(sectionId).classList.add("active");
}

// Gestion de la soumission du formulaire
document.getElementById("livreForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const titre = document.getElementById("titre").value;
  const isbn = document.getElementById("isbn").value;
  const datePublication = document.getElementById("datePublication").value;
  const disponible = document.getElementById("disponible").checked;
  const auteur = document.getElementById("auteur").value;

  if (livreEnModification) {
    // Modifier un livre existant
    axios.put(`http://127.0.0.1:8080/api/livres/${livreEnModification}`, {
      titre: titre,
      isbn: isbn,
      datePublication: datePublication,
      disponible: disponible,
      auteurId: auteur,
    })
      .then((response) => {
        const rows = document.querySelectorAll("#livresTable tbody tr");
        rows.forEach((row) => {
          if (row.getAttribute("data-id") == livreEnModification) {
            row.children[0].textContent = response.data.titre;
            row.children[1].textContent = response.data.isbn;
            row.children[2].textContent = response.data.datePublication;
            row.children[3].textContent = response.data.disponible ? "Oui" : "Non";
            row.children[4].textContent = response.data.auteur ? response.data.auteur.nom : "Auteur inconnu";
          }
        });

        livreEnModification = null; // Réinitialiser la variable
        document.getElementById("submitBtn").textContent = "Ajouter Livre";
        showMessage("Livre modifié avec succès!", "success");
        this.reset();
      })
      .catch((error) => {
        showMessage("Erreur lors de la modification du livre.", "danger");
        console.error("Erreur lors de la modification du livre :", error);
      });
  } else {
    // Ajouter un nouveau livre
    axios.post("http://127.0.0.1:8080/api/livres", {
      titre: titre,
      isbn: isbn,
      datePublication: datePublication,
      disponible: disponible,
      auteurId: auteur,
    })
      .then((response) => {
        const tableBody = document.getElementById("livresTable").getElementsByTagName("tbody")[0];
        const newRow = tableBody.insertRow();

        const auteurNom = response.data.auteur ? response.data.auteur.nom : "Auteur inconnu";

        newRow.setAttribute("data-id", response.data.id);
        newRow.innerHTML = `
          <td>${response.data.titre}</td>
          <td>${response.data.isbn}</td>
          <td>${response.data.datePublication}</td>
          <td>${response.data.disponible ? "Oui" : "Non"}</td>
          <td>${auteurNom}</td>
          <td>
            <button class="btn btn-sm" onclick="modifierLivre(${response.data.id})">Modifier</button>
            <button class="btn btn-danger btn-sm" onclick="supprimerLivre(${response.data.id}, this)">Supprimer</button>
          </td>
        `;

        this.reset();
        showMessage("Livre ajouté avec succès!", "success");
      })
      .catch((error) => {
        showMessage("Erreur lors de l'ajout du livre.", "danger");
        console.error("Erreur lors de l'ajout du livre :", error);
      });
  }
});

function supprimerLivre(livreId, button) {
  axios.delete(`http://127.0.0.1:8080/api/livres/${livreId}`)
    .then(() => {
      const row = button.parentNode.parentNode;
      row.parentNode.removeChild(row);
      showMessage("Livre supprimé avec succès!", "success");
    })
    .catch((error) => {
      showMessage("Erreur lors de la suppression du livre.", "danger");
      console.error("Erreur lors de la suppression du livre :", error);
    });
}

function modifierLivre(livreId) {
  axios.get(`http://127.0.0.1:8080/api/livres/${livreId}`)
    .then((response) => {
      const livre = response.data;
      livreEnModification = livreId;

      document.getElementById("titre").value = livre.titre;
      document.getElementById("isbn").value = livre.isbn;
      document.getElementById("datePublication").value = livre.datePublication;
      document.getElementById("disponible").checked = livre.disponible;
      document.getElementById("auteur").value = livre.auteur ? livre.auteur.id : "";

      document.getElementById("submitBtn").textContent = "Modifier Livre";
      showSection("formSection");
    })
    .catch((error) => {
      showMessage("Erreur lors de la récupération des données du livre.", "danger");
      console.error("Erreur lors de la récupération des données du livre :", error);
    });
}

// Fonction pour afficher un message d'alerte
function showMessage(message, type) {
  const alertMessage = document.getElementById("alertMessage");
  if (alertMessage) {
    alertMessage.textContent = message;
    alertMessage.className = `alert alert-${type}`;
    alertMessage.classList.remove("d-none");

    setTimeout(() => {
      alertMessage.classList.add("d-none");
    }, 3000);
  } else {
    console.warn("Element 'alertMessage' not found.");
  }
}

// Charger la liste des auteurs et des livres au démarrage
window.onload = function () {
  axios.get("http://127.0.0.1:8080/api/auteurs")
    .then((response) => {
      if (response.data && response.data.length > 0) {
        const auteurSelect = document.getElementById("auteur");
        response.data.forEach((auteur) => {
          const option = document.createElement("option");
          option.value = auteur.id;
          option.textContent = `${auteur.nom} ${auteur.prenom}`;
          auteurSelect.appendChild(option);
        });
      } else {
        showMessage("Aucun auteur disponible.", "warning");
      }
    })
    .catch((error) => {
      showMessage("Erreur lors du chargement des auteurs.", "danger");
      console.error("Erreur lors du chargement des auteurs :", error);
    });

  axios.get("http://127.0.0.1:8080/api/livres")
    .then((response) => {
      if (response.data && response.data.length > 0) {
        const tableBody = document.getElementById("livresTable").getElementsByTagName("tbody")[0];
        response.data.forEach((livre) => {
          const newRow = tableBody.insertRow();

          const auteurNom = livre.auteur ? livre.auteur.nom : "Auteur inconnu";

          newRow.setAttribute("data-id", livre.id);
          newRow.innerHTML = `
            <td>${livre.titre}</td>
            <td>${livre.isbn}</td>
            <td>${livre.datePublication}</td>
            <td>${livre.disponible ? "Oui" : "Non"}</td>
            <td>${auteurNom}</td>
            <td>
              <button class="btn btn-sm" onclick="modifierLivre(${livre.id})">Modifier</button>
              <button class="btn btn-danger btn-sm" onclick="supprimerLivre(${livre.id}, this)">Supprimer</button>
            </td>
          `;
        });
      } else {
        showMessage("Aucun livre disponible.", "warning");
      }
    })
    .catch((error) => {
      showMessage("Erreur lors du chargement des livres.", "danger");
      console.error("Erreur lors du chargement des livres :", error);
    });
};
