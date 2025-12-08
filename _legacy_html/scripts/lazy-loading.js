// scripts/lazy-loading.js
class IntelligentLazyLoader {
  constructor() {
    this.observedElements = new Map();
    this.initializeObserver();
  }
  
  initializeObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadContent(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px' // Précharger 50px avant
    });
    
    // Observer tous les éléments .lazy-load
    document.querySelectorAll('.lazy-load').forEach(el => {
      this.observer.observe(el);
    });
  }
}