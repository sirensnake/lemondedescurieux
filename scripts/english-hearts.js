// Intégration dans scripts/english-hearts.js
class EnglishHeartsSystem {
  constructor() {
    this.heartsData = this.loadHearts();
    this.maxHearts = 5;
    this.heartRegenTime = 30 * 60 * 1000; // 30 minutes
  }
  
  loadHearts() {
    const data = JSON.parse(localStorage.getItem('englishHearts')) || {
      currentHearts: 5,
      lastHeartLoss: null,
      regenStartTime: null
    };
    
    // Régénération automatique
    this.processHeartRegeneration(data);
    return data;
  }
  
  loseHeart() {
    if (this.heartsData.currentHearts > 0) {
      this.heartsData.currentHearts--;
      this.heartsData.lastHeartLoss = Date.now();
      
      if (this.heartsData.currentHearts === this.maxHearts - 1) {
        this.heartsData.regenStartTime = Date.now();
      }
      
      this.saveHearts();
      this.updateHeartsDisplay();
      
      return this.heartsData.currentHearts > 0;
    }
    return false;
  }
  
  // Interface cœurs animée
  updateHeartsDisplay() {
    const heartsContainer = document.getElementById('hearts-display');
    if (heartsContainer) {
      let heartsHTML = '';
      for (let i = 0; i < this.maxHearts; i++) {
        const isFilled = i < this.heartsData.currentHearts;
        heartsHTML += `<div class="heart ${isFilled ? 'filled' : 'empty'}">❤️</div>`;
      }
      heartsContainer.innerHTML = heartsHTML;
    }
  }
}