// Mise à jour scripts/hover_indicator.js
class TouchMindmapHandler {
  constructor() {
    this.initializeTouchHandlers();
    this.touchStartTime = 0;
    this.touchThreshold = 150; // ms pour différencier tap/hold
  }
  
  initializeTouchHandlers() {
    const areas = document.querySelectorAll('map[name="matieresmap"] area');
    const mindmapImg = document.querySelector('.mindmap');
    
    areas.forEach(area => {
      // Gestion tactile moderne
      area.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.touchStartTime = Date.now();
        this.showTouchIndicator(area);
      }, { passive: false });
      
      area.addEventListener('touchend', (e) => {
        e.preventDefault();
        const touchDuration = Date.now() - this.touchStartTime;
        
        if (touchDuration < this.touchThreshold) {
          // Tap rapide = navigation
          window.location.href = area.href;
        } else {
          // Hold = prévisualisation
          this.showPreview(area);
        }
        
        this.hideTouchIndicator();
      }, { passive: false });
    });
  }
  
  showTouchIndicator(area) {
    const coords = area.coords.split(',').map(Number);
    const indicator = document.getElementById('touch-indicator') || this.createTouchIndicator();
    
    // Animation de feedback tactile
    indicator.style.left = `${coords[0]}px`;
    indicator.style.top = `${coords[1]}px`;
    indicator.classList.add('active');
  }
}