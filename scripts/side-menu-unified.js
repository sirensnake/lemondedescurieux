/**
 * Menu Latéral Sobre - Le Monde des Curieux
 * Version identique à index.html
 */

// Toggle menu
function toggleSideMenu() {
    const menu = document.getElementById('sideMenu');
    if (menu) {
        menu.classList.toggle('open');
    }
}

// Alias pour compatibilité avec index.html
function toggleMenu() {
    toggleSideMenu();
}

// Fermer le menu en cliquant à côté
document.addEventListener('click', function(e) {
    const menu = document.getElementById('sideMenu');
    const btn = document.querySelector('.menu-toggle-btn, .menu-btn');
    
    if (menu && menu.classList.contains('open') && 
        e.target !== menu && 
        !menu.contains(e.target) && 
        e.target !== btn) {
        menu.classList.remove('open');
    }
});

// Fermer avec Échap
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const menu = document.getElementById('sideMenu');
        if (menu && menu.classList.contains('open')) {
            menu.classList.remove('open');
        }
    }
});

// Marquer l'item actif selon la page actuelle
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();
    const menuLinks = document.querySelectorAll('.side-menu a');
    
    menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
});

// Charger le menu automatiquement
function loadSideMenu() {
    fetch('components/side-menu.html')
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('afterbegin', html);
            
            // Marquer l'item actif
            const currentPage = window.location.pathname.split('/').pop();
            const menuLinks = document.querySelectorAll('.side-menu a');
            
            menuLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === currentPage) {
                    link.classList.add('active');
                }
            });
        })
        .catch(error => console.error('Erreur chargement menu:', error));
}
