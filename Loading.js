// Fonction pour simuler le chargement
window.addEventListener('load', function () {
    // Simule le chargement des données
    setTimeout(function () {
        // Cache le loader
        document.getElementById('loader').style.display = 'none';
        // Affiche le contenu
        document.getElementById('content').style.display = 'block';
    }, 700); // 2 secondes de chargement simulé
});