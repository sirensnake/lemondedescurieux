/**
 * Footer Unifié - Le Monde des Curieux
 * Charge automatiquement le footer dans toutes les pages
 */

function loadUnifiedFooter() {
    fetch('components/footer.html')
        .then(response => response.text())
        .then(html => {
            // Insérer le footer à la fin du body
            document.body.insertAdjacentHTML('beforeend', html);
        })
        .catch(error => console.error('Erreur chargement footer:', error));
}

// Charger automatiquement au chargement de la page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadUnifiedFooter);
} else {
    loadUnifiedFooter();
}
