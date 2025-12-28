// scripts/mobile-touch-handler.js
class MobileOptimizer {
  constructor() {
    this.isTouchDevice = 'ontouchstart' in window;
    this.initTouchEnhancements();
  }
  
  initTouchEnhancements() {
    if (!this.isTouchDevice) return;
    
    // Zones tactiles élargies (44x44px minimum iOS/Android)
    document.querySelectorAll('.interactive-element').forEach(el => {
      el.style.minWidth = '44px';
      el.style.minHeight = '44px';
      el.style.padding = '12px';
    });
    
    // Feedback visuel tactile
    this.addTouchFeedback();
    
    // Optimisation mindmap tactile
    this.optimizeMindmapTouch();
  }
  
  addTouchFeedback() {
    document.addEventListener('touchstart', (e) => {
      if (e.target.classList.contains('interactive-element')) {
        e.target.classList.add('touch-active');
        
        // Vibration haptique si supportée
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
      }
    });
    
    document.addEventListener('touchend', (e) => {
      document.querySelectorAll('.touch-active').forEach(el => {
        el.classList.remove('touch-active');
      });
    });
  }
  
  optimizeMindmapTouch() {
    const mindmapAreas = document.querySelectorAll('map[name="matieresmap"] area');
    
    mindmapAreas.forEach(area => {
      // Gérer tap vs hold
      let touchStartTime = 0;
      
      area.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touchStartTime = Date.now();
        this.showTouchIndicator(area);
      }, { passive: false });
      
      area.addEventListener('touchend', (e) => {
        e.preventDefault();
        const touchDuration = Date.now() - touchStartTime;
        
        if (touchDuration < 200) {
          // Tap rapide = navigation
          window.location.href = area.href;
        } else {
          // Hold = preview
          this.showPreview(area);
        }
      }, { passive: false });
    });
  }
}

// Initialisation auto
document.addEventListener('DOMContentLoaded', () => {
  window.mobileOptimizer = new MobileOptimizer();
});