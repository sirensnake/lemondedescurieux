/**
 * Améliorations pour l'expérience sur appareils mobiles
 */
class MobileEnhancements {
    constructor() {
        this.isMobile = this.checkIfMobile();
        
        if (this.isMobile) {
            this.applyMobileOptimizations();
        }
    }
    
    checkIfMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
            || window.innerWidth <= 768;
    }
    
    applyMobileOptimizations() {
        // Ajuster la taille du texte
        this.adjustTextSize();
        
        // Améliorer les zones tactiles
        this.enhanceTouchTargets();
        
        // Optimiser la navigation
        this.optimizeNavigation();
        
        // Optimiser les images
        this.optimizeImages();
        
        // Gestion de l'orientation
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.adjustTextSize();
                this.enhanceTouchTargets();
            }, 300);
        });
    }
    
    adjustTextSize() {
        // Ajuster la taille du texte pour une meilleure lisibilité sur mobile
        const style = document.createElement('style');
        style.id = 'mobile-text-style';
        style.textContent = `
            body {
                font-size: 16px;
            }
            
            h1 {
                font-size: 24px;
            }
            
            h2 {
                font-size: 20px;
            }
            
            h3 {
                font-size: 18px;
            }
            
            .content {
                width: 90%;
                padding: 15px;
            }
            
            .quiz-option, .button, input, select {
                min-height: 44px;
                padding: 12px;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    enhanceTouchTargets() {
        // Agrandir les zones tactiles pour faciliter l'interaction
        const touchTargets = document.querySelectorAll('a, button, .quiz-option, input[type="checkbox"], input[type="radio"]');
        
        touchTargets.forEach(target => {
            // Seulement appliquer aux petits éléments
            const rect = target.getBoundingClientRect();
            
            if (rect.width < 44 || rect.height < 44) {
                target.style.minWidth = '44px';
                target.style.minHeight = '44px';
                target.style.display = 'inline-block';
                
                // Pour les liens de texte, ajouter un padding
                if (target.tagName === 'A' && !target.classList.contains('button')) {
                    target.style.padding = '5px';
                }
            }
        });
    }
    
    optimizeNavigation() {
        // Simplifier la navigation pour mobile
        const sidebar = document.querySelector('.sidebar');
        const content = document.querySelector('.content-container');
        
        if (sidebar && content) {
            // Permettre au menu de se fermer quand on clique sur le contenu
            content.addEventListener('click', () => {
                sidebar.classList.remove('open');
            });
        }
        
        // Ajouter un bouton de retour en haut
        this.addBackToTopButton();
    }
    
    addBackToTopButton() {
        const backToTopButton = document.createElement('button');
        backToTopButton.className = 'back-to-top';
        backToTopButton.innerHTML = '⬆️';
        backToTopButton.setAttribute('aria-label', 'Retour en haut de la page');
        backToTopButton.style.display = 'none';
        
        // Styles du bouton
        backToTopButton.style.position = 'fixed';
        backToTopButton.style.bottom = '20px';
        backToTopButton.style.right = '20px';
        backToTopButton.style.width = '50px';
        backToTopButton.style.height = '50px';
        backToTopButton.style.borderRadius = '50%';
        backToTopButton.style.backgroundColor = '#2a9d8f';
        backToTopButton.style.color = 'white';
        backToTopButton.style.border = 'none';
        backToTopButton.style.fontSize = '20px';
        backToTopButton.style.cursor = 'pointer';
        backToTopButton.style.zIndex = '1000';
        
        document.body.appendChild(backToTopButton);
        
        // Gestion de l'affichage du bouton
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
        });
        
        // Retour en haut au clic
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    optimizeImages() {
        // Remplacer les grandes images par des versions mobiles si disponibles
        const images = document.querySelectorAll('img[data-src-mobile]');
        
        images.forEach(img => {
            if (img.hasAttribute('data-src-mobile')) {
                const originalSrc = img.src;
                const mobileSrc = img.getAttribute('data-src-mobile');
                
                img.src = mobileSrc;
                img.setAttribute('data-src-desktop', originalSrc);
            }
        });
    }
}

// Initialiser les améliorations mobiles au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    new MobileEnhancements();
});