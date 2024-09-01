// script.js

const API_URL = 'http://localhost:8080/api/auteurs';

document.addEventListener('DOMContentLoaded', () => {
    loadAuteurs();

    document.getElementById('auteur-form').addEventListener('submit', saveAuteur);
    document.getElementById('cancel-update').addEventListener('click', resetForm);
});

function loadAuteurs() {
    fetch(API_URL)
        .then(response => response.json())
        .then(auteurs => {
            const list = document.getElementById('auteurs-list');
            list.innerHTML = '';
            auteurs.forEach(auteur => {
                const auteurItem = document.createElement('div');
                auteurItem.className = 'auteur-item';
                auteurItem.innerHTML = `
                    <span>${auteur.nom} ${auteur.prenom}</span>
                    <div>
                        <button onclick="editAuteur(${auteur.id})">Modifier</button>
                        <button onclick="deleteAuteur(${auteur.id})">Supprimer</button>
                    </div>
                `;
                list.appendChild(auteurItem);
            });
        })
        .catch(error => console.error('Erreur:', error));
}

function saveAuteur(event) {
    event.preventDefault();

    const id = document.getElementById('auteur-id').value;
    const nom = document.getElementById('nom').value;
    const prenom = document.getElementById('prenom').value;

    const auteur = { nom, prenom };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(auteur),
    })
        .then(() => {
            loadAuteurs();
            resetForm();
        })
        .catch(error => console.error('Erreur:', error));
}

function editAuteur(id) {
    fetch(`${API_URL}/${id}`)
        .then(response => response.json())
        .then(auteur => {
            document.getElementById('auteur-id').value = auteur.id;
            document.getElementById('nom').value = auteur.nom;
            document.getElementById('prenom').value = auteur.prenom;
            document.getElementById('form-title').textContent = 'Modifier Auteur';
            document.getElementById('cancel-update').style.display = 'inline-block';
        })
        .catch(error => console.error('Erreur:', error));
}

function deleteAuteur(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet auteur ?')) {
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        })
            .then(() => loadAuteurs())
            .catch(error => console.error('Erreur:', error));
    }
}

function resetForm() {
    document.getElementById('auteur-id').value = '';
    document.getElementById('nom').value = '';
    document.getElementById('prenom').value = '';
    document.getElementById('form-title').textContent = 'Ajouter un Auteur';
    document.getElementById('cancel-update').style.display = 'none';
}
