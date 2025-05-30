// Système de cœurs/vies style Duolingo
class EnglishHeartsSystem {
  constructor() {
    this.maxHearts = 5;
    this.heartRegenTime = 30 * 60 * 1000; // 30 minutes
    this.heartsData = this.loadHearts();
    this.regenInterval = null;
    this.startRegenTimer();
  }
  
  loadHearts() {
    const data = JSON.parse(localStorage.getItem('englishHearts')) || {
      currentHearts: 5,
      lastHeartLoss: null,
      regenStartTime: null
    };
    
    // Régénération automatique au chargement
    this.processHeartRegeneration(data);
    return data;
  }
  
  saveHearts() {
    localStorage.setItem('englishHearts', JSON.stringify(this.heartsData));
  }
  
  processHeartRegeneration(data) {
    if (data.currentHearts < this.maxHearts && data.regenStartTime) {
      const elapsed = Date.now() - data.regenStartTime;
      const heartsToRegen = Math.floor(elapsed / this.heartRegenTime);
      
      if (heartsToRegen > 0) {
        data.currentHearts = Math.min(
          data.currentHearts + heartsToRegen,
          this.maxHearts
        );
        
        if (data.currentHearts === this.maxHearts) {
          data.regenStartTime = null;
        } else {
          // Réinitialiser le timer pour le prochain cœur
          data.regenStartTime = Date.now();
        }
        
        this.saveHearts();
      }
    }
    return data;
  }
  
  startRegenTimer() {
    // Vérifier la régénération toutes les minutes
    this.regenInterval = setInterval(() => {
      this.heartsData = this.processHeartRegeneration(this.heartsData);
      this.updateHeartsDisplay();
      this.updateRegenTimer();
    }, 60000); // 1 minute
  }
  
  loseHeart() {
    if (this.heartsData.currentHearts > 0) {
      this.heartsData.currentHearts--;
      this.heartsData.lastHeartLoss = Date.now();
      
      // Démarrer la régénération si c'était le premier cœur perdu
      if (this.heartsData.currentHearts === this.maxHearts - 1) {
        this.heartsData.regenStartTime = Date.now();
      }
      
      this.saveHearts();
      this.updateHeartsDisplay();
      this.updateRegenTimer();
      
      // Retourner true si on peut continuer, false si game over
      return this.heartsData.currentHearts > 0;
    }
    return false;
  }
  
  gainHeart() {
    if (this.heartsData.currentHearts < this.maxHearts) {
      this.heartsData.currentHearts++;
      
      // Arrêter la régénération si on est au max
      if (this.heartsData.currentHearts === this.maxHearts) {
        this.heartsData.regenStartTime = null;
      }
      
      this.saveHearts();
      this.updateHeartsDisplay();
      this.updateRegenTimer();
    }
  }
  
  updateHeartsDisplay() {
    const heartsContainer = document.getElementById('hearts-display');
    if (!heartsContainer) return;
    
    let heartsHTML = '<div class="hearts-container">';
    
    // Afficher les cœurs
    for (let i = 0; i < this.maxHearts; i++) {
      const isFilled = i < this.heartsData.currentHearts;
      heartsHTML += `<div class="heart ${isFilled ? 'filled' : 'empty'}">
        ${isFilled ? '❤️' : '💔'}
      </div>`;
    }
    
    heartsHTML += '</div>';
    
    // Ajouter le timer de régénération si nécessaire
    if (this.heartsData.currentHearts < this.maxHearts && this.heartsData.regenStartTime) {
      heartsHTML += '<div class="regen-timer" id="regen-timer"></div>';
    }
    
    heartsContainer.innerHTML = heartsHTML;
    
    // Mettre à jour le timer immédiatement
    this.updateRegenTimer();
  }
  
  updateRegenTimer() {
    const timerElement = document.getElementById('regen-timer');
    if (!timerElement || !this.heartsData.regenStartTime) return;
    
    const elapsed = Date.now() - this.heartsData.regenStartTime;
    const remaining = this.heartRegenTime - (elapsed % this.heartRegenTime);
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    timerElement.textContent = `Prochain ❤️ dans ${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  
  initializeUI() {
    // Créer l'élément s'il n'existe pas
    if (!document.getElementById('hearts-display')) {
      const header = document.querySelector('.game-header');
      if (header) {
        const heartsDiv = document.createElement('div');
        heartsDiv.id = 'hearts-display';
        heartsDiv.className = 'hearts-display-container';
        header.appendChild(heartsDiv);
      }
    }
    
    this.updateHeartsDisplay();
    
    // Mettre à jour le timer toutes les secondes pour un affichage fluide
    setInterval(() => this.updateRegenTimer(), 1000);
  }
  
  // Nettoyer les intervals quand l'objet est détruit
  destroy() {
    if (this.regenInterval) {
      clearInterval(this.regenInterval);
    }
  }
}

// Export pour utilisation en module ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnglishHeartsSystem;
}

// Instance globale pour compatibilité
window.EnglishHeartsSystem = EnglishHeartsSystem;
