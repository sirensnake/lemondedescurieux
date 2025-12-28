// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    // Récupérer les éléments du menu
    var sidebar = document.querySelector('.sidebar');
    var toggleButton = document.querySelector('.sidebar-toggle');
    
    // Vérifier que les éléments existent
    if (!sidebar || !toggleButton) {
      console.error('Éléments du menu introuvables');
      return;
    }
    
    // Cacher le menu au démarrage
    sidebar.style.left = '-250px';
    
    // Ajouter l'événement de clic au bouton
    toggleButton.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Basculer la position du menu
      if (sidebar.style.left === '0px') {
        sidebar.style.left = '-250px';
      } else {
        sidebar.style.left = '0px';
      }
    });
    
    // Fermer le menu si on clique ailleurs
    document.addEventListener('click', function(e) {
      if (sidebar.style.left === '0px' && 
          e.target !== toggleButton && 
          !sidebar.contains(e.target)) {
        sidebar.style.left = '-250px';
      }
    });
    
    // Activer le lien correspondant à la page actuelle
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    var links = sidebar.querySelectorAll('a');
    
    links.forEach(function(link) {
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
      }
    });
  });