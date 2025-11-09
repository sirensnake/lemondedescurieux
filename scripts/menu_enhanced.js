/**
 * menu_enhanced.js - Menu latéral interactif amélioré
 * Le Monde des Curieux
 */

// Fonction principale pour gérer le menu latéral
function enhancedSidebar() {
    // Sélectionner les éléments
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    
    // Créer un overlay pour l'effet d'ombrage lors de l'ouverture du menu
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    // Ajouter un en-tête au menu
    const header = document.createElement('div');
    header.className = 'sidebar-header';
    header.innerHTML = '<h3>Navigation</h3>';
    sidebar.insertBefore(header, sidebar.firstChild);
    
    // Ajouter des classes pour les icônes
    const menuLinks = sidebar.querySelectorAll('a');
    menuLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      // Affecter les bonnes classes selon l'URL
      if (href === 'index.html') link.classList.add('accueil');
      else if (href === 'mindmap.html') link.classList.add('mindmap');
      else if (href.includes('maths')) link.classList.add('maths');
      else if (href.includes('sciences')) link.classList.add('sciences');
      else if (href.includes('histoire')) link.classList.add('histoire');
      else if (href.includes('francais')) link.classList.add('francais');
      else if (href.includes('english')) link.classList.add('english');
      else if (href.includes('programmation')) link.classList.add('programmation');
      else if (href.includes('echecs')) link.classList.add('echecs');
      else if (href.includes('philosophie')) link.classList.add('philosophie');
      else if (href.includes('ressources')) link.classList.add('ressources');
      else if (href.includes('infos')) link.classList.add('infos');
      else if (href.includes('ia')) link.classList.add('ia');
      else if (href.includes('parcours')) link.classList.add('parcours');
    });
    
    // Ajouter des séparateurs entre catégories
    const matieresMainItems = ['maths_section.html', 'sciences_section.html', 'histoire_section.html', 
                              'francais_section.html', 'english_section.html', 'programmation_section.html'];
    const matieresSecondaires = ['echecs_section.html', 'philosophie_section.html', 'ressources_section.html'];
    
    sidebar.querySelectorAll('li a').forEach(link => {
      const href = link.getAttribute('href');
      // Ajouter des séparateurs
      if (href === matieresMainItems[0] || href === matieresSecondaires[0] || href === 'infos_section.html') {
        const divider = document.createElement('div');
        divider.className = 'category-divider';
        link.parentNode.parentNode.insertBefore(divider, link.parentNode);
      }
    });
    
    // État du menu (fermé par défaut)
    let isOpen = false;
    
    // Fonction pour ouvrir le menu
    function openMenu() {
      sidebar.classList.add('open');
      overlay.classList.add('active');
      toggleBtn.innerHTML = '✕';
      toggleBtn.style.transform = 'rotate(90deg)';
      isOpen = true;
    }
    
    // Fonction pour fermer le menu
    function closeMenu() {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
      toggleBtn.innerHTML = '☰';
      toggleBtn.style.transform = 'rotate(0deg)';
      isOpen = false;
    }
    
    // Gestionnaire d'événement pour le bouton
    toggleBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
    
    // Fermer le menu en cliquant sur l'overlay
    overlay.addEventListener('click', closeMenu);
    
    // Ajouter un effet au survol des liens
    menuLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        const icon = link.querySelector('i');
        if (icon) {
          icon.style.transform = 'scale(1.2)';
        }
      });
      
      link.addEventListener('mouseleave', () => {
        const icon = link.querySelector('i');
        if (icon) {
          icon.style.transform = 'scale(1)';
        }
      });
    });
    
    // Initialisation - s'assurer que le menu commence fermé
    closeMenu();
    
    // Marquer le lien actif dans le menu
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    menuLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      if (href === currentPage || 
          (currentPage === '' && href === 'index.html') ||
          (href.includes('_section') && currentPage.includes(href.replace('_section.html', '')))) {
        link.classList.add('active');
        
        // Faire défiler pour voir le lien actif
        setTimeout(() => {
          link.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    });
    
    // Ajouter un raccourci clavier pour ouvrir/fermer le menu (touche M)
    document.addEventListener('keydown', function(e) {
      if (e.key.toLowerCase() === 'm') {
        if (isOpen) {
          closeMenu();
        } else {
          openMenu();
        }
      }
      
      // Fermer le menu avec Escape
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    });
    
    // Retourner les fonctions pour utilisation externe si nécessaire
    return {
      open: openMenu,
      close: closeMenu,
      toggle: function() {
        isOpen ? closeMenu() : openMenu();
      }
    };
  }
  
  // Initialiser quand le DOM est prêt
  document.addEventListener('DOMContentLoaded', function() {
    // Créer et initialiser le menu
    window.sidebarManager = enhancedSidebar();
    
    console.log('Menu latéral amélioré initialisé');
  });