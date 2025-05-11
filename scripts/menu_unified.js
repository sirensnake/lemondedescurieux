/**
 * menu_unified.js - Script unifié pour le menu latéral
 * Le Monde des Curieux
 */

// S'exécute immédiatement pour cacher le menu sans attendre le chargement complet
(function() {
    var sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.style.left = '-250px';
    }
  })();
  
  // Configuration complète après chargement du DOM
  document.addEventListener('DOMContentLoaded', function() {
    // Récupérer les éléments nécessaires
    var sidebar = document.querySelector('.sidebar');
    var toggleButton = document.querySelector('.sidebar-toggle');
    
    if (!sidebar || !toggleButton) {
      console.error('Éléments du menu introuvables');
      return;
    }
    
    // Vérifier que le menu est bien caché initialement
    if (sidebar.style.left !== '-250px') {
      sidebar.style.left = '-250px';
    }
    
    // Configurer le bouton pour basculer le menu
    toggleButton.addEventListener('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
      
      console.log('Toggle button clicked, current sidebar position:', sidebar.style.left);
      
      // Basculer l'état du menu
      if (sidebar.style.left === '0px') {
        sidebar.style.left = '-250px';
      } else {
        sidebar.style.left = '0px';
      }
    });
    
    // Fermer le menu en cliquant ailleurs
    document.addEventListener('click', function(event) {
      if (sidebar.style.left === '0px' && 
          !sidebar.contains(event.target) && 
          event.target !== toggleButton) {
        sidebar.style.left = '-250px';
      }
    });
    
    // Marquer la page active dans le menu
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    var links = sidebar.querySelectorAll('a');
    
    links.forEach(function(link) {
      // Retirer d'abord toutes les classes active
      link.classList.remove('active');
      
      // Ajouter la classe au lien correspondant à la page actuelle
      var href = link.getAttribute('href');
      if (href === currentPage || 
          (currentPage === '' && href === 'index.html') ||
          (href.includes('_section') && currentPage.includes(href.replace('_section.html', '')))) {
        link.classList.add('active');
      }
    });
  
    // Débogage
    console.log('Menu latéral initialisé avec succès');
    console.log('Page actuelle:', currentPage);
  });