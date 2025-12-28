// scripts/accessibility-controller.js
class AccessibilityController {
    constructor() {
        this.preferences = this.loadPreferences();
        this.init();
    }
    
    init() {
        this.createAccessibilityPanel();
        this.applyPreferences();
        this.setupKeyboardShortcuts();
    }
    
    loadPreferences() {
        return JSON.parse(localStorage.getItem('accessibilityPrefs')) || {
            highContrast: false,
            dyslexiaFont: false,
            reducedMotion: false,
            textSize: 'medium'
        };
    }
    
    savePreferences() {
        localStorage.setItem('accessibilityPrefs', JSON.stringify(this.preferences));
    }
    
    createAccessibilityPanel() {
        const panel = document.createElement('div');
        panel.className = 'accessibility-panel';
        panel.id = 'accessibility-panel';
        panel.setAttribute('role', 'region');
        panel.setAttribute('aria-label', 'Panneau d\'accessibilité');
        
        panel.innerHTML = `
            <h3>♿ Accessibilité</h3>
            
            <div class="accessibility-control">
                <label>Contraste élevé</label>
                <button 
                    id="toggle-contrast" 
                    onclick="accessibilityController.toggleHighContrast()"
                    aria-pressed="${this.preferences.highContrast}"
                >
                    ${this.preferences.highContrast ? '✓ Activé' : 'Désactivé'}
                </button>
            </div>
            
            <div class="accessibility-control">
                <label>Police adaptée dyslexie</label>
                <button 
                    id="toggle-dyslexia" 
                    onclick="accessibilityController.toggleDyslexiaFont()"
                    aria-pressed="${this.preferences.dyslexiaFont}"
                >
                    ${this.preferences.dyslexiaFont ? '✓ Activée' : 'Désactivée'}
                </button>
            </div>
            
            <div class="accessibility-control">
                <label>Réduire animations</label>
                <button 
                    id="toggle-motion" 
                    onclick="accessibilityController.toggleReducedMotion()"
                    aria-pressed="${this.preferences.reducedMotion}"
                >
                    ${this.preferences.reducedMotion ? '✓ Activé' : 'Désactivé'}
                </button>
            </div>
            
            <div class="accessibility-control">
                <label>Taille du texte</label>
                <select 
                    id="text-size" 
                    onchange="accessibilityController.changeTextSize(this.value)"
                    aria-label="Sélectionner la taille du texte"
                >
                    <option value="small" ${this.preferences.textSize === 'small' ? 'selected' : ''}>Petit</option>
                    <option value="medium" ${this.preferences.textSize === 'medium' ? 'selected' : ''}>Moyen</option>
                    <option value="large" ${this.preferences.textSize === 'large' ? 'selected' : ''}>Grand</option>
                    <option value="xlarge" ${this.preferences.textSize === 'xlarge' ? 'selected' : ''}>Très grand</option>
                </select>
            </div>
        `;
        
        // Bouton toggle
        const toggle = document.createElement('button');
        toggle.className = 'accessibility-toggle';
        toggle.innerHTML = '♿';
        toggle.setAttribute('aria-label', 'Ouvrir le panneau d\'accessibilité');
        toggle.onclick = () => this.togglePanel();
        
        document.body.appendChild(panel);
        document.body.appendChild(toggle);
    }
    
    togglePanel() {
        const panel = document.getElementById('accessibility-panel');
        panel.classList.toggle('open');
    }
    
    applyPreferences() {
        if (this.preferences.highContrast) {
            document.body.classList.add('high-contrast');
        }
        
        if (this.preferences.dyslexiaFont) {
            document.body.classList.add('dyslexia-friendly');
        }
        
        if (this.preferences.reducedMotion) {
            document.body.classList.add('reduced-motion');
        }
        
        document.body.classList.add(`text-size-${this.preferences.textSize}`);
    }
    
    toggleHighContrast() {
        this.preferences.highContrast = !this.preferences.highContrast;
        document.body.classList.toggle('high-contrast');
        this.savePreferences();
        this.updateButtonState('toggle-contrast', this.preferences.highContrast);
    }
    
    toggleDyslexiaFont() {
        this.preferences.dyslexiaFont = !this.preferences.dyslexiaFont;
        document.body.classList.toggle('dyslexia-friendly');
        this.savePreferences();
        this.updateButtonState('toggle-dyslexia', this.preferences.dyslexiaFont);
    }
    
    toggleReducedMotion() {
        this.preferences.reducedMotion = !this.preferences.reducedMotion;
        document.body.classList.toggle('reduced-motion');
        this.savePreferences();
        this.updateButtonState('toggle-motion', this.preferences.reducedMotion);
    }
    
    changeTextSize(size) {
        // Retirer anciennes classes
        document.body.classList.remove('text-size-small', 'text-size-medium', 'text-size-large', 'text-size-xlarge');
        
        // Ajouter nouvelle
        document.body.classList.add(`text-size-${size}`);
        this.preferences.textSize = size;
        this.savePreferences();
    }
    
    updateButtonState(buttonId, isActive) {
        const button = document.getElementById(buttonId);
        button.textContent = isActive ? '✓ Activé' : 'Désactivé';
        button.setAttribute('aria-pressed', isActive);
        button.classList.toggle('active', isActive);
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + A : Ouvrir panneau accessibilité
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                this.togglePanel();
            }
            
            // Alt + C : Toggle contraste
            if (e.altKey && e.key === 'c') {
                e.preventDefault();
                this.toggleHighContrast();
            }
        });
    }
}

// Initialisation
let accessibilityController;
document.addEventListener('DOMContentLoaded', () => {
    accessibilityController = new AccessibilityController();
});