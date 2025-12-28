/* ============================================================================
   SYSTÈME DE CŒURS/VIES - FRANÇAIS
   Fichier: scripts/francais-hearts.js
   ============================================================================ */

class FrenchHearts {
  constructor() {
    this.storageKey = 'francais_hearts_data';
    this.maxHearts = 5;
    this.regenTime = 30 * 60 * 1000; // 30 minutes en millisecondes
    this.data = this.loadHeartsData();
    this.startRegeneration();
    console.log('✅ FrenchHearts initialisé');
  }
  
  loadHeartsData() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      const data = JSON.parse(stored);
      this.processRegeneration(data);
      return data;
    }
    
    return {
      currentHearts: this.maxHearts,
      lastHeartLoss: null,
      lastRegenCheck: Date.now()
    };
  }
  
  saveHeartsData() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }
  
  processRegeneration(data) {
    if (data.currentHearts >= this.maxHearts) {
      return; // Déjà au maximum
    }
    
    const now = Date.now();
    const timeSinceLastCheck = now - (data.lastRegenCheck || now);
    const heartsToRegen = Math.floor(timeSinceLastCheck / this.regenTime);
    
    if (heartsToRegen > 0) {
      data.currentHearts = Math.min(this.maxHearts, data.currentHearts + heartsToRegen);
      data.lastRegenCheck = now;
    }
  }
  
  startRegeneration() {
    setInterval(() => {
      if (this.data.currentHearts < this.maxHearts) {
        this.data.currentHearts = Math.min(this.maxHearts, this.data.currentHearts + 1);
        this.data.lastRegenCheck = Date.now();
        this.saveHeartsData();
        this.updateDisplay();
      }
    }, this.regenTime);
  }
  
  loseHeart() {
    if (this.data.currentHearts > 0) {
      this.data.currentHearts -= 1;
      this.data.lastHeartLoss = Date.now();
      this.data.lastRegenCheck = Date.now();
      this.saveHeartsData();
      this.updateDisplay();
      
      // Animation de perte
      this.animateHeartLoss();
      
      return this.data.currentHearts > 0; // true si peut continuer
    }
    return false;
  }
  
  gainHeart() {
    if (this.data.currentHearts < this.maxHearts) {
      this.data.currentHearts += 1;
      this.saveHeartsData();
      this.updateDisplay();
    }
  }
  
  getCurrentHearts() {
    return this.data.currentHearts;
  }
  
  getMaxHearts() {
    return this.maxHearts;
  }
  
  updateDisplay() {
    const heartsContainer = document.getElementById('hearts-container');
    if (!heartsContainer) return;
    
    heartsContainer.innerHTML = '';
    
    for (let i = 0; i < this.maxHearts; i++) {
      const heart = document.createElement('div');
      heart.className = i < this.data.currentHearts ? 'heart filled' : 'heart empty';
      heart.textContent = '❤️';
      heartsContainer.appendChild(heart);
    }
  }
  
  animateHeartLoss() {
    // Animation simple de perte de cœur
    const hearts = document.querySelectorAll('.heart.filled');
    if (hearts.length > 0) {
      const lastHeart = hearts[hearts.length - 1];
      lastHeart.classList.add('lost');
      setTimeout(() => {
        lastHeart.classList.remove('lost');
      }, 600);
    }
  }
  
  resetHearts() {
    this.data.currentHearts = this.maxHearts;
    this.data.lastHeartLoss = null;
    this.data.lastRegenCheck = Date.now();
    this.saveHeartsData();
    this.updateDisplay();
  }
  
  getTimeToNextHeart() {
    if (this.data.currentHearts >= this.maxHearts) {
      return 0;
    }
    
    const timeSinceLastCheck = Date.now() - this.data.lastRegenCheck;
    return Math.max(0, this.regenTime - timeSinceLastCheck);
  }
}

// Export global
window.FrancaisHearts = FrancaisHearts;
// Export global
if (typeof window !== 'undefined') {
  window.FrenchHearts = FrenchHearts;
  console.log('✅ FrenchHearts loaded');
}
