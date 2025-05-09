/**
 * Module d'accessibilité pour Le Monde des Curieux
 * Gère les fonctionnalités d'accessibilité comme la taille du texte,
 * le contraste élevé, et d'autres améliorations pour tous les utilisateurs.
 */
document.addEventListener('DOMContentLoaded', function() {
    // État initial
    const state = {
        largeText: localStorage.getItem('large-text') === 'true',
        highContrast: localStorage.getItem('high-contrast') === 'true',
        focusVisible: localStorage.getItem('focus-visible') !== 'false',
        reduced: localStorage.getItem('reduced-motion') === 'true'
    };
    
    // Sélectionner les boutons d'accessibilité, avec fallback gracieux
    const textSizeButton = document.getElementById('text-size-toggle');
    const contrastButton = document.getElementById('contrast-toggle');
    const focusButton = document.getElementById('focus-toggle');
    const motionButton = document.getElementById('motion-toggle');
    
    // Appliquer les paramètres initiaux
    applyAccessibilitySettings();
    
    // Ajouter des événements de clic aux boutons existants
    if (textSizeButton) {
        textSizeButton.addEventListener('click', toggleLargeText);
    }
    
    if (contrastButton) {
        contrastButton.addEventListener('click', toggleHighContrast);
    }
    
    // Configurer les nouveaux boutons s'ils existent
    if (focusButton) {
        focusButton.addEventListener('click', toggleFocusVisible);
    }
    
    if (motionButton) {
        motionButton.addEventListener('click', toggleReducedMotion);
    }
    
    // Ajouter des raccourcis clavier pour l'accessibilité
    document.addEventListener('keydown', handleAccessibilityShortcuts);
    
    // Créer la barre d'accessibilité si elle n'existe pas déjà
    ensureAccessibilityToolbar();
    
    /**
     * Applique tous les paramètres d'accessibilité basés sur l'état actuel
     */
    function applyAccessibilitySettings() {
        // Appliquer la taille du texte
        if (state.largeText) {
            document.body.classList.add('large-text');
            updateButtonState(textSizeButton, true, 'Réduire la taille du texte');
        } else {
            document.body.classList.remove('large-text');
            updateButtonState(textSizeButton, false, 'Agrandir la taille du texte');
        }
        
        // Appliquer le contraste élevé
        if (state.highContrast) {
            document.body.classList.add('high-contrast');
            updateButtonState(contrastButton, true, 'Désactiver le contraste élevé');
        } else {
            document.body.classList.remove('high-contrast');
            updateButtonState(contrastButton, false, 'Activer le contraste élevé');
        }
        
        // Appliquer la visibilité du focus
        if (state.focusVisible) {
            document.body.classList.remove('hide-focus');
            updateButtonState(focusButton, true, 'Masquer l\'indicateur de focus');
        } else {
            document.body.classList.add('hide-focus');
            updateButtonState(focusButton, false, 'Afficher l\'indicateur de focus');
        }
        
        // Appliquer le mouvement réduit
        if (state.reduced) {
            document.body.classList.add('reduced-motion');
            updateButtonState(motionButton, true, 'Activer les animations');
        } else {
            document.body.classList.remove('reduced-motion');
            updateButtonState(motionButton, false, 'Réduire les animations');
        }
        
        // Déclencher un événement pour notifier d'autres scripts
        document.dispatchEvent(new CustomEvent('accessibilityChanged', { detail: state }));
    }
    
    /**
     * Met à jour l'état visuel et les attributs d'un bouton d'accessibilité
     */
    function updateButtonState(button, isActive, newTitle) {
        if (!button) return;
        
        if (isActive) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
        
        button.setAttribute('aria-pressed', isActive);
        button.setAttribute('title', newTitle);
        button.setAttribute('aria-label', newTitle);
    }
    
    /**
     * Bascule le mode texte agrandi
     */
    function toggleLargeText() {
        state.largeText = !state.largeText;
        localStorage.setItem('large-text', state.largeText);
        applyAccessibilitySettings();
        
        // Annoncer le changement aux technologies d'assistance
        announceChange(state.largeText ? 
            'Texte agrandi activé' : 'Texte agrandi désactivé');
    }
    
    /**
     * Bascule le mode contraste élevé
     */
    function toggleHighContrast() {
        state.highContrast = !state.highContrast;
        localStorage.setItem('high-contrast', state.highContrast);
        applyAccessibilitySettings();
        
        announceChange(state.highContrast ? 
            'Contraste élevé activé' : 'Contraste élevé désactivé');
    }
    
    /**
     * Bascule la visibilité de l'indicateur de focus
     */
    function toggleFocusVisible() {
        state.focusVisible = !state.focusVisible;
        localStorage.setItem('focus-visible', state.focusVisible);
        applyAccessibilitySettings();
        
        announceChange(state.focusVisible ? 
            'Indicateur de focus visible' : 'Indicateur de focus masqué');
    }
    
    /**
     * Bascule le mode de mouvement réduit
     */
    function toggleReducedMotion() {
        state.reduced = !state.reduced;
        localStorage.setItem('reduced-motion', state.reduced);
        applyAccessibilitySettings();
        
        announceChange(state.reduced ? 
            'Animations réduites' : 'Animations activées');
    }
    
    /**
     * Gère les raccourcis clavier pour l'accessibilité
     */
    function handleAccessibilityShortcuts(event) {
        // Alt + a pour la barre d'accessibilité
        if (event.altKey && event.key === 'a') {
            event.preventDefault();
            toggleAccessibilityToolbar();
        }
        
        // Alt + t pour la taille du texte
        if (event.altKey && event.key === 't') {
            event.preventDefault();
            toggleLargeText();
        }
        
        // Alt + c pour le contraste
        if (event.altKey && event.key === 'c') {
            event.preventDefault();
            toggleHighContrast();
        }
    }
    
    /**
     * Annonce un changement aux technologies d'assistance
     */
    function announceChange(message) {
        // Créer ou réutiliser la région live
        let liveRegion = document.getElementById('accessibility-live');
        
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'accessibility-live';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('class', 'sr-only');
            liveRegion.style.position = 'absolute';
            liveRegion.style.width = '1px';
            liveRegion.style.height = '1px';
            liveRegion.style.margin = '-1px';
            liveRegion.style.padding = '0';
            liveRegion.style.overflow = 'hidden';
            liveRegion.style.clip = 'rect(0, 0, 0, 0)';
            liveRegion.style.whiteSpace = 'nowrap';
            liveRegion.style.border = '0';
            document.body.appendChild(liveRegion);
        }
        
        // Mettre à jour le message
        liveRegion.textContent = message;
    }
    
    /**
     * S'assure que la barre d'outils d'accessibilité est présente
     */
    function ensureAccessibilityToolbar() {
        // Vérifier si la barre d'accessibilité existe déjà
        if (document.querySelector('.accessibility-tools')) {
            return;
        }
        
        // Créer la barre d'outils d'accessibilité
        const toolbar = document.createElement('div');
        toolbar.className = 'accessibility-tools';
        toolbar.setAttribute('role', 'toolbar');
        toolbar.setAttribute('aria-label', 'Options d\'accessibilité');
        
        // Bouton pour la taille du texte
        if (!textSizeButton) {
            const newTextSizeButton = createAccessibilityButton(
                'text-size-toggle',
                'A',
                'Agrandir le texte',
                toggleLargeText
            );
            toolbar.appendChild(newTextSizeButton);
        }
        
        // Bouton pour le contraste
        if (!contrastButton) {
            const newContrastButton = createAccessibilityButton(
                'contrast-toggle',
                'C',
                'Mode contraste élevé',
                toggleHighContrast
            );
            toolbar.appendChild(newContrastButton);
        }
        
        // Bouton pour l'indicateur de focus
        if (!focusButton) {
            const newFocusButton = createAccessibilityButton(
                'focus-toggle',
                'F',
                'Afficher l\'indicateur de focus',
                toggleFocusVisible
            );
            toolbar.appendChild(newFocusButton);
        }
        
        // Bouton pour les animations
        if (!motionButton) {
            const newMotionButton = createAccessibilityButton(
                'motion-toggle',
                'M',
                'Réduire les animations',
                toggleReducedMotion
            );
            toolbar.appendChild(newMotionButton);
        }
        
        // Ajouter la barre d'outils au document
        document.body.appendChild(toolbar);
        
        // Mettre à jour les références
        if (!textSizeButton) textSizeButton = document.getElementById('text-size-toggle');
        if (!contrastButton) contrastButton = document.getElementById('contrast-toggle');
        if (!focusButton) focusButton = document.getElementById('focus-toggle');
        if (!motionButton) motionButton = document.getElementById('motion-toggle');
        
        // Appliquer l'état initial
        applyAccessibilitySettings();
    }
    
    /**
     * Crée un bouton d'accessibilité
     */
    function createAccessibilityButton(id, text, title, clickHandler) {
        const button = document.createElement('button');
        button.id = id;
        button.className = 'accessibility-button';
        button.textContent = text;
        button.setAttribute('title', title);
        button.setAttribute('aria-label', title);
        button.addEventListener('click', clickHandler);
        return button;
    }
    
    /**
     * Ajoute/supprime une feuille de style pour améliorer l'accessibilité
     */
    function addAccessibilityStyles() {
        // Vérifier si les styles existent déjà
        if (document.getElementById('accessibility-styles')) {
            return;
        }
        
        // Créer l'élément de style
        const style = document.createElement('style');
        style.id = 'accessibility-styles';
        
        // Ajouter les styles CSS
        style.textContent = `
            /* Style pour masquer visuellement tout en gardant accessible pour les lecteurs d'écran */
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                margin: -1px;
                padding: 0;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
            
            /* Amélioration de la visibilité du focus pour l'accessibilité au clavier */
            :focus {
                outline: 3px solid #4CAF50 !important;
                outline-offset: 2px !important;
            }
            
            /* Masquer l'indicateur de focus si demandé */
            body.hide-focus :focus {
                outline: none !important;
            }
            
            /* Animation réduite pour les personnes sensibles */
            body.reduced-motion * {
                animation-duration: 0.001s !important;
                transition-duration: 0.001s !important;
            }
        `;
        
        // Ajouter au document
        document.head.appendChild(style);
    }
    
    // Ajouter les styles d'accessibilité
    addAccessibilityStyles();
});