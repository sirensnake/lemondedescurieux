// scripts/device_detector.js
/**
 * Utilitaire pour détecter le type d'appareil
 * et adapter l'interface en conséquence
 */
class DeviceDetector {
    constructor() {
        this.isMobile = this.checkIfMobile();
        this.isTablet = this.checkIfTablet();
        this.isTouchDevice = this.checkIfTouchDevice();
        
        // Ajouter des classes au body pour le ciblage CSS
        this.applyClasses();
        
        // Afficher la barre de debug en mode développement
        if (this.shouldShowDebugBar()) {
            this.createDebugBar();
        }
    }
    
    /**
     * Vérifie si l'appareil est un mobile
     * @returns {boolean}
     */
    checkIfMobile() {
        return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
            || (window.innerWidth <= 768);
    }
    
    /**
     * Vérifie si l'appareil est une tablette
     * @returns {boolean}
     */
    checkIfTablet() {
        return /iPad|Tablet|Nexus 7/i.test(navigator.userAgent) 
            || (window.innerWidth <= 1024 && window.innerWidth > 768);
    }
    
    /**
     * Vérifie si l'appareil a un écran tactile
     * @returns {boolean}
     */
    checkIfTouchDevice() {
        return ('ontouchstart' in window) || 
            (navigator.maxTouchPoints > 0) || 
            (navigator.msMaxTouchPoints > 0);
    }
    
    /**
     * Applique des classes au body
     */
    applyClasses() {
        if (this.isMobile) document.body.classList.add('is-mobile');
        if (this.isTablet) document.body.classList.add('is-tablet');
        if (this.isTouchDevice) document.body.classList.add('is-touch');
    }
    
    /**
     * Vérifie si on doit afficher la barre de debug
     * @returns {boolean}
     */
    shouldShowDebugBar() {
        // Mode développement détecté par l'URL localhost ou par un paramètre debug=true
        return window.location.hostname === 'localhost' 
            || window.location.hostname === '127.0.0.1'
            || window.location.search.includes('debug=true');
    }
    
    /**
     * Crée une barre de debug pour le développement
     */
    createDebugBar() {
        const debugBar = document.createElement('div');
        debugBar.className = 'device-debug-bar';
        debugBar.innerHTML = `
            <div>Appareil: ${this.isMobile ? '📱 Mobile' : this.isTablet ? '📱 Tablette' : '💻 Desktop'}</div>
            <div>Tactile: ${this.isTouchDevice ? '✅ Oui' : '❌ Non'}</div>
            <div>Largeur: <span id="screen-width">${window.innerWidth}px</span></div>
        `;
        
        // Ajouter des styles
        const style = document.createElement('style');
        style.textContent = `
            .device-debug-bar {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                display: flex;
                justify-content: space-around;
                padding: 8px;
                font-size: 12px;
                z-index: 9999;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(debugBar);
        
        // Mettre à jour la largeur lors du redimensionnement
        window.addEventListener('resize', () => {
            document.getElementById('screen-width').textContent = `${window.innerWidth}px`;
        });
    }
    
    /**
     * Optimise les images pour l'appareil actuel
     */
    optimizeImages() {
        // Sélectionner toutes les images avec l'attribut data-src-mobile
        const images = document.querySelectorAll('img[data-src-mobile]');
        
        images.forEach(img => {
            if (this.isMobile && img.hasAttribute('data-src-mobile')) {
                img.src = img.getAttribute('data-src-mobile');
            } else if (this.isTablet && img.hasAttribute('data-src-tablet')) {
                img.src = img.getAttribute('data-src-tablet');
            }
        });
    }
}

// Initialiser le détecteur
const deviceDetector = new DeviceDetector();

// Optimiser les images après le chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    deviceDetector.optimizeImages();
});