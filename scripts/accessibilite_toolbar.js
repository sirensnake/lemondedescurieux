/**
 * Barre d'outils d'accessibilité complète pour Le Monde des Curieux
 */
class AccessibilityToolbar {
    constructor() {
        this.state = {
            largeText: localStorage.getItem('large-text') === 'true',
            highContrast: localStorage.getItem('high-contrast') === 'true',
            reducedMotion: localStorage.getItem('reduced-motion') === 'true',
            readAssist: localStorage.getItem('read-assist') === 'true'
        };
        
        this.createToolbar();
        this.applySettings();
        
        // Raccourcis clavier
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
    }
    
    createToolbar() {
        // Créer la barre d'outils
        const toolbar = document.createElement('div');
        toolbar.className = 'accessibility-toolbar';
        toolbar.setAttribute('role', 'toolbar');
        toolbar.setAttribute('aria-label', 'Options d\'accessibilité');
        
        // Titre
        const title = document.createElement('div');
        title.className = 'accessibility-title';
        title.textContent = 'Accessibilité';
        toolbar.appendChild(title);
        
        // Boutons
        const buttons = [
            {
                id: 'text-size',
                icon: 'A',
                label: 'Taille du texte',
                action: this.toggleLargeText.bind(this)
            },
            {
                id: 'contrast',
                icon: 'C',
                label: 'Contraste',
                action: this.toggleHighContrast.bind(this)
            },
            {
                id: 'motion',
                icon: '✓',
                label: 'Réduire les animations',
                action: this.toggleReducedMotion.bind(this)
            },
            {
                id: 'read-assist',
                icon: '📖',
                label: 'Aide à la lecture',
                action: this.toggleReadAssist.bind(this)
            }
        ];
        
        // Créer les boutons
        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.id = `accessibility-${button.id}`;
            btn.className = 'accessibility-button';
            btn.setAttribute('aria-label', button.label);
            btn.setAttribute('title', button.label);
            btn.innerHTML = button.icon;
            btn.addEventListener('click', button.action);
            toolbar.appendChild(btn);
        });
        
        // Bouton pour fermer/ouvrir la barre
        const toggleButton = document.createElement('button');
        toggleButton.className = 'accessibility-toggle';
        toggleButton.setAttribute('aria-label', 'Options d\'accessibilité');
        toggleButton.innerHTML = '♿';
        toggleButton.addEventListener('click', () => {
            toolbar.classList.toggle('open');
        });
        
        // Ajouter la barre et le bouton au document
        document.body.appendChild(toolbar);
        document.body.appendChild(toggleButton);
        
        // Sauvegarder les références
        this.toolbar = toolbar;
        this.toggleButton = toggleButton;
    }
    
    applySettings() {
        // Appliquer la taille du texte
        if (this.state.largeText) {
            document.body.classList.add('large-text');
            document.getElementById('accessibility-text-size').classList.add('active');
        }
        
        // Appliquer le contraste élevé
        if (this.state.highContrast) {
            document.body.classList.add('high-contrast');
            document.getElementById('accessibility-contrast').classList.add('active');
        }
        
        // Appliquer la réduction des animations
        if (this.state.reducedMotion) {
            document.body.classList.add('reduced-motion');
            document.getElementById('accessibility-motion').classList.add('active');
        }
        
        // Appliquer l'aide à la lecture
        if (this.state.readAssist) {
            document.body.classList.add('read-assist');
            document.getElementById('accessibility-read-assist').classList.add('active');
        }
    }
    
    toggleLargeText() {
        this.state.largeText = !this.state.largeText;
        localStorage.setItem('large-text', this.state.largeText);
        document.body.classList.toggle('large-text');
        document.getElementById('accessibility-text-size').classList.toggle('active');
        this.announceChange(this.state.largeText ? 'Texte agrandi activé' : 'Texte agrandi désactivé');
    }
    
    toggleHighContrast() {
        this.state.highContrast = !this.state.highContrast;
        localStorage.setItem('high-contrast', this.state.highContrast);
        document.body.classList.toggle('high-contrast');
        document.getElementById('accessibility-contrast').classList.toggle('active');
        this.announceChange(this.state.highContrast ? 'Contraste élevé activé' : 'Contraste élevé désactivé');
    }
    
    toggleReducedMotion() {
        this.state.reducedMotion = !this.state.reducedMotion;
        localStorage.setItem('reduced-motion', this.state.reducedMotion);
        document.body.classList.toggle('reduced-motion');
        document.getElementById('accessibility-motion').classList.toggle('active');
        this.announceChange(this.state.reducedMotion ? 'Animations réduites activées' : 'Animations réduites désactivées');
    }
    
    toggleReadAssist() {
        this.state.readAssist = !this.state.readAssist;
        localStorage.setItem('read-assist', this.state.readAssist);
        document.body.classList.toggle('read-assist');
        document.getElementById('accessibility-read-assist').classList.toggle('active');
        this.announceChange(this.state.readAssist ? 'Aide à la lecture activée' : 'Aide à la lecture désactivée');
        
        // Si l'aide à la lecture est activée, ajouter l'effet de surlignage au survol
        if (this.state.readAssist) {
            this.addReadingHighlight();
        } else {
            this.removeReadingHighlight();
        }
    }
    
    addReadingHighlight() {
        // Ajouter un style pour l'aide à la lecture
        const style = document.createElement('style');
        style.id = 'read-assist-style';
        style.textContent = `
            body.read-assist p:hover,
            body.read-assist li:hover,
            body.read-assist h1:hover,
            body.read-assist h2:hover,
            body.read-assist h3:hover {
                background-color: #ffff99;
                cursor: pointer;
            }
            
            body.read-assist {
                line-height: 1.8;
                word-spacing: 0.2em;
                letter-spacing: 0.05em;
            }
        `;
        document.head.appendChild(style);
    }
    
    removeReadingHighlight() {
        const style = document.getElementById('read-assist-style');
        if (style) {
            style.remove();
        }
    }
    
    handleKeyboardShortcuts(event) {
        // Alt+A pour activer/désactiver la barre d'accessibilité
        if (event.altKey && event.key === 'a') {
            this.toolbar.classList.toggle('open');
        }
        
        // Alt+T pour la taille du texte
        if (event.altKey && event.key === 't') {
            this.toggleLargeText();
        }
        
        // Alt+C pour le contraste
        if (event.altKey && event.key === 'c') {
            this.toggleHighContrast();
        }
        
        // Alt+M pour les animations
        if (event.altKey && event.key === 'm') {
            this.toggleReducedMotion();
        }
        
        // Alt+R pour l'aide à la lecture
        if (event.altKey && event.key === 'r') {
            this.toggleReadAssist();
        }
    }
    
    announceChange(message) {
        // Créer ou réutiliser la région live
        let liveRegion = document.getElementById('accessibility-live');
        
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'accessibility-live';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('class', 'sr-only');
            document.body.appendChild(liveRegion);
        }
        
        // Mettre à jour le message
        liveRegion.textContent = message;
    }
}

// Initialiser la barre d'outils au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    new AccessibilityToolbar();
});