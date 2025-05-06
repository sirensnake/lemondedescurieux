// Script pour les fonctionnalités d'accessibilité
document.addEventListener('DOMContentLoaded', function() {
    const textSizeButton = document.getElementById('text-size-toggle');
    const contrastButton = document.getElementById('contrast-toggle');
    
    // Charger les préférences sauvegardées
    if (localStorage.getItem('large-text') === 'true') {
        document.body.classList.add('large-text');
    }
    
    if (localStorage.getItem('high-contrast') === 'true') {
        document.body.classList.add('high-contrast');
    }
    
    // Fonctions des boutons
    textSizeButton.addEventListener('click', function() {
        document.body.classList.toggle('large-text');
        localStorage.setItem('large-text', document.body.classList.contains('large-text'));
    });
    
    contrastButton.addEventListener('click', function() {
        document.body.classList.toggle('high-contrast');
        localStorage.setItem('high-contrast', document.body.classList.contains('high-contrast'));
    });
});