/**
 * Script d'accessibilité consolidé pour Le Monde des Curieux
 * Gestion de la taille du texte, du contraste et du mode sombre
 */

// S'assurer que le script ne s'exécute qu'une seule fois
if (!window.accessibilityInitialized) {
    window.accessibilityInitialized = true;
    
    // Fonction d'initialisation principale
    function initAccessibilityFeatures() {
      console.log('Initialisation des fonctionnalités d\'accessibilité...');
      
      // Taille du texte
      initTextSize();
      
      // Contraste
      initContrast();
      
      // Mode sombre
      initDarkMode();
    }
    
    // Initialisation de la taille du texte
    function initTextSize() {
      const textSizeToggle = document.getElementById('text-size-toggle');
      if (!textSizeToggle) {
        console.warn('Bouton de taille de texte non trouvé');
        return;
      }
      
      // Récupérer la préférence sauvegardée
      const largeText = localStorage.getItem('largeText') === 'true';
      if (largeText) {
        document.body.classList.add('large-text');
        textSizeToggle.textContent = 'A-';
        textSizeToggle.setAttribute('aria-label', 'Réduire la taille du texte');
      }
      
      // Ajouter l'écouteur d'événement
      textSizeToggle.addEventListener('click', function() {
        console.log('Clic sur le bouton de taille de texte');
        const isLarge = document.body.classList.toggle('large-text');
        localStorage.setItem('largeText', isLarge);
        
        // Mettre à jour le bouton
        this.textContent = isLarge ? 'A-' : 'A+';
        this.setAttribute('aria-label', isLarge ? 'Réduire la taille du texte' : 'Agrandir le texte');
      });
    }
    
    // Initialisation du contraste
    function initContrast() {
      const contrastToggle = document.getElementById('contrast-toggle');
      if (!contrastToggle) {
        console.warn('Bouton de contraste non trouvé');
        return;
      }
      
      // Récupérer la préférence sauvegardée
      const highContrast = localStorage.getItem('highContrast') === 'true';
      if (highContrast) {
        document.body.classList.add('high-contrast');
        contrastToggle.textContent = 'C-';
        contrastToggle.setAttribute('aria-label', 'Désactiver le contraste élevé');
      }
      
      // Ajouter l'écouteur d'événement
      contrastToggle.addEventListener('click', function() {
        console.log('Clic sur le bouton de contraste');
        const isHighContrast = document.body.classList.toggle('high-contrast');
        localStorage.setItem('highContrast', isHighContrast);
        
        // Mettre à jour le bouton
        this.textContent = isHighContrast ? 'C-' : 'C+';
        this.setAttribute('aria-label', isHighContrast ? 'Désactiver le contraste élevé' : 'Activer le contraste élevé');
      });
    }
    
    // Initialisation du mode sombre
    function initDarkMode() {
      const darkModeToggle = document.getElementById('dark-mode-toggle');
      if (!darkModeToggle) {
        console.warn('Bouton de mode sombre non trouvé');
        return;
      }
      
      // Récupérer la préférence utilisateur ou la préférence système
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const savedMode = localStorage.getItem('darkMode');
      const isDarkMode = savedMode === 'true' || (savedMode === null && prefersDarkMode);
      
      // Appliquer le mode sombre si préféré ou sauvegardé
      if (isDarkMode) {
        document.body.classList.add('dark-mode');
        updateDarkModeButton(true);
      }
      
      // Ajouter l'écouteur d'événement
      darkModeToggle.addEventListener('click', function() {
        console.log('Clic sur le bouton de mode sombre');
        const isDarkMode = document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        updateDarkModeButton(isDarkMode);
      });
    }
    
    // Mise à jour de l'apparence du bouton de mode sombre
    function updateDarkModeButton(isDarkMode) {
      const button = document.getElementById('dark-mode-toggle');
      if (button) {
        button.innerHTML = isDarkMode ? '☀️' : '🌙';
        button.setAttribute('aria-label', isDarkMode ? 'Désactiver le mode sombre' : 'Activer le mode sombre');
      }
    }
    
    // Initialiser quand le DOM est prêt
    if (document.readyState === 'loading') {
      if (document.readyState !== 'loading') {
        initAccessibilityFeatures();
      } else {
        document.addEventListener('DOMContentLoaded', initAccessibilityFeatures);
      }
      
    } else {
      // Si le DOM est déjà chargé (cas rare mais possible)
      initAccessibilityFeatures();
    }
  }