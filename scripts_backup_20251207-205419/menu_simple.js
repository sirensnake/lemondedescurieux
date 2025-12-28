/* ============================================================================
   MENU SIMPLE - Le Monde des Curieux
   Fichier: scripts/menu_simple.js
   ============================================================================ */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🍔 Menu simple initialisé');
    
    // Gestion du menu latéral
    const menuToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            console.log('Menu toggled');
        });
        
        // Fermer le menu si clic en dehors
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }
    
    // Masquer le loader après initialisation
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.display = 'none';
            console.log('✅ Loader masqué par menu_simple.js');
        }
    }, 1000);
});

// Export pour debug
window.MenuSimple = {
    version: '1.0.0',
    initialized: true
};