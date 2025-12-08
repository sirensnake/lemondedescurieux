// Composant système de cœurs (vies) style Duolingo
export function heartSystem() {
  return {
    // État
    hearts: 5,
    maxHearts: 5,
    bonusHearts: 0,
    recoveryTime: 30, // minutes
    lastRecovery: null,
    recoveryTimer: null,
    
    // Initialisation
    init() {
      this.loadHeartState();
      this.startRecoveryTimer();
      
      // Analytics
      this.$analytics.track('heart_system_loaded', {
        hearts: this.hearts,
        bonusHearts: this.bonusHearts
      });
    },
    
    // Charger l'état depuis le storage
    loadHeartState() {
      const saved = this.$storage.get('heartSystem');
      
      if (saved) {
        this.hearts = saved.hearts ?? this.maxHearts;
        this.bonusHearts = saved.bonusHearts ?? 0;
        this.lastRecovery = saved.lastRecovery ? new Date(saved.lastRecovery) : null;
        
        // Calculer la récupération passive
        this.calculatePassiveRecovery();
      }
    },
    
    // Calculer les cœurs récupérés pendant l'absence
    calculatePassiveRecovery() {
      if (!this.lastRecovery || this.hearts >= this.maxHearts) return;
      
      const now = new Date();
      const timeDiff = now - this.lastRecovery;
      const minutesPassed = Math.floor(timeDiff / (1000 * 60));
      const heartsToRecover = Math.floor(minutesPassed / this.recoveryTime);
      
      if (heartsToRecover > 0) {
        const recovered = Math.min(heartsToRecover, this.maxHearts - this.hearts);
        this.hearts += recovered;
        
        // Mettre à jour le temps de dernière récupération
        const recoveredMinutes = recovered * this.recoveryTime;
        this.lastRecovery = new Date(this.lastRecovery.getTime() + recoveredMinutes * 60000);
        
        this.saveHeartState();
        
        // Notification
        if (recovered > 0) {
          this.$dispatch('notify', {
            message: `💝 ${recovered} cœur${recovered > 1 ? 's' : ''} récupéré${recovered > 1 ? 's' : ''} !`,
            type: 'success'
          });
        }
      }
    },
    
    // Perdre un cœur
    loseHeart() {
      if (this.hearts > 0) {
        this.hearts--;
        this.lastRecovery = new Date();
        this.saveHeartState();
        
        // Animation
        this.animateHeartLoss();
        
        // Analytics
        this.$analytics.track('heart_lost', {
          remainingHearts: this.hearts,
          hasBonus: this.bonusHearts > 0
        });
        
        // Vérifier si plus de cœurs
        if (this.hearts === 0) {
          this.handleNoHeartsLeft();
        }
        
        return true;
      }
      return false;
    },
    
    // Gagner un cœur
    gainHeart(isBonus = false) {
      if (isBonus) {
        this.bonusHearts++;
        this.$dispatch('notify', {
          message: '✨ Cœur bonus gagné !',
          type: 'success'
        });
      } else if (this.hearts < this.maxHearts) {
        this.hearts++;
        this.animateHeartGain();
      }
      
      this.saveHeartState();
      
      // Analytics
      this.$analytics.track('heart_gained', {
        type: isBonus ? 'bonus' : 'regular',
        totalHearts: this.hearts,
        bonusHearts: this.bonusHearts
      });
    },
    
    // Utiliser un cœur bonus
    useBonusHeart() {
      if (this.bonusHearts > 0 && this.hearts < this.maxHearts) {
        this.bonusHearts--;
        this.hearts++;
        this.saveHeartState();
        
        this.animateHeartGain();
        
        this.$dispatch('notify', {
          message: '✨ Cœur bonus utilisé !',
          type: 'info'
        });
        
        // Analytics
        this.$analytics.track('bonus_heart_used', {
          remainingBonus: this.bonusHearts
        });
      }
    },
    
    // Gérer l'absence de cœurs
    handleNoHeartsLeft() {
      // Options possibles
      const options = [];
      
      if (this.bonusHearts > 0) {
        options.push({
          text: `Utiliser un cœur bonus (${this.bonusHearts} disponible${this.bonusHearts > 1 ? 's' : ''})`,
          action: () => this.useBonusHeart()
        });
      }
      
      options.push({
        text: `Attendre ${this.recoveryTime} minutes`,
        action: () => {
          this.$dispatch('notify', {
            message: `⏳ Prochain cœur dans ${this.recoveryTime} minutes`,
            type: 'info'
          });
        }
      });
      
      // Afficher les options dans un modal
      const content = `
        <div class="no-hearts-modal">
          <h4>😢 Plus de cœurs !</h4>
          <p>Tu as utilisé tous tes cœurs. Que veux-tu faire ?</p>
          <div class="heart-options">
            ${options.map((option, index) => `
              <button class="heart-option-btn" @click="handleHeartOption(${index})">
                ${option.text}
              </button>
            `).join('')}
          </div>
        </div>
      `;
      
      // Stocker les options pour l'action
      window.heartOptions = options;
      window.handleHeartOption = (index) => {
        options[index].action();
        Alpine.store('modal').closeModal();
      };
      
      Alpine.store('modal').showModal('Plus de cœurs !', content);
    },
    
    // Timer de récupération
    startRecoveryTimer() {
      // Vérifier toutes les minutes
      this.recoveryTimer = setInterval(() => {
        if (this.hearts < this.maxHearts && this.lastRecovery) {
          const now = new Date();
          const timeDiff = now - this.lastRecovery;
          const minutesPassed = Math.floor(timeDiff / (1000 * 60));
          
          if (minutesPassed >= this.recoveryTime) {
            this.gainHeart();
            this.lastRecovery = new Date();
            
            this.$dispatch('notify', {
              message: '💝 Un cœur récupéré !',
              type: 'success'
            });
          }
        }
      }, 60000); // Toutes les minutes
    },
    
    // Animations
    animateHeartLoss() {
      const heartElements = document.querySelectorAll('.heart');
      if (heartElements[this.hearts]) {
        heartElements[this.hearts].classList.add('heart-loss-animation');
        setTimeout(() => {
          heartElements[this.hearts].classList.remove('heart-loss-animation');
        }, 500);
      }
    },
    
    animateHeartGain() {
      const heartElements = document.querySelectorAll('.heart');
      if (heartElements[this.hearts - 1]) {
        heartElements[this.hearts - 1].classList.add('heart-gain-animation');
        setTimeout(() => {
          heartElements[this.hearts - 1].classList.remove('heart-gain-animation');
        }, 500);
      }
    },
    
    // Sauvegarder l'état
    saveHeartState() {
      const state = {
        hearts: this.hearts,
        bonusHearts: this.bonusHearts,
        lastRecovery: this.lastRecovery ? this.lastRecovery.toISOString() : null,
        lastSave: new Date().toISOString()
      };
      
      this.$storage.set('heartSystem', state);
    },
    
    // Debug - simuler perte de cœur
    debugHeart(heartNumber) {
      if (heartNumber <= this.hearts) {
        this.loseHeart();
      }
    },
    
    // Getters
    get canPlay() {
      return this.hearts > 0 || this.bonusHearts > 0;
    },
    
    get nextRecoveryTime() {
      if (!this.lastRecovery || this.hearts >= this.maxHearts) return null;
      
      const nextRecovery = new Date(this.lastRecovery.getTime() + this.recoveryTime * 60000);
      const now = new Date();
      const timeLeft = nextRecovery - now;
      
      if (timeLeft <= 0) return '0:00';
      
      const minutes = Math.floor(timeLeft / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    },
    
    get recoveryProgress() {
      if (!this.lastRecovery || this.hearts >= this.maxHearts) return 0;
      
      const now = new Date();
      const timeDiff = now - this.lastRecovery;
      const progress = (timeDiff / (this.recoveryTime * 60000)) * 100;
      
      return Math.min(100, Math.max(0, progress));
    },
    
    // Méthode pour acheter des cœurs (future fonctionnalité)
    purchaseHearts(amount) {
      // Simuler l'achat de cœurs bonus
      this.bonusHearts += amount;
      this.saveHeartState();
      
      this.$dispatch('notify', {
        message: `✨ ${amount} cœurs bonus ajoutés !`,
        type: 'success'
      });
      
      // Analytics
      this.$analytics.track('hearts_purchased', {
        amount: amount,
        totalBonus: this.bonusHearts
      });
    }
  };
}