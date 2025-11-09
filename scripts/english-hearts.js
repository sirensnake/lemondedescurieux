
// Système de cœurs/vies style Duolingo
class EnglishHeartsSystem {
  constructor() {
    this.maxHearts = 5;
    this.heartRegenTime = 30 * 60 * 1000; // 30 minutes
    this.heartsData = this.loadHearts();
    this.regenInterval = null;
    this.startRegenTimer();

// english-hearts.js - Système cœurs/vies avec récupération temporelle et animations

// ===== CONFIGURATION CŒURS =====
const HEARTS_CONFIG = {
  storage: {
    key: 'lemondedescurieux_english_hearts',
    purchaseHistory: 'lemondedescurieux_heart_purchases'
  },
  
  gameplay: {
    maxHearts: 5,
    regenTimeMinutes: 30, // Temps pour régénérer 1 cœur
    maxRegenTime: 150, // Temps total pour régénération complète (5 * 30min)
    gracePeriodMinutes: 5, // Période de grâce après perte du dernier cœur
    
    // Prix boutique virtuelle (en XP)
    shopPrices: {
      singleHeart: 50,    // 1 cœur = 50 XP
      fullHearts: 200,    // 5 cœurs = 200 XP  
      infiniteLife: 500   // 1h de vie infinie = 500 XP
    }
  },
  
  animations: {
    heartLoss: 600,      // Durée animation perte cœur (ms)
    heartGain: 400,      // Durée animation gain cœur (ms)
    heartBeat: 1200,     // Durée battement cœur (ms)
    shakeIntensity: 5    // Intensité shake sur erreur
  },
  
  messages: {
    heartLoss: [
      'Oups ! Réessaie, tu vas y arriver ! 💪',
      'Pas de panique, on apprend de ses erreurs ! 🎯',
      'Continue, chaque erreur te rapproche du succès ! ⭐',
      'Tu es sur la bonne voie ! 🚀'
    ],
    
    lastHeart: [
      'Attention ! C\'est ton dernier cœur ! ⚠️',
      'Sois prudent, plus qu\'un cœur ! 💔',
      'Concentration maximale ! ❤️',
      'Tu peux le faire ! Dernier cœur ! 🎯'
    ],
    
    noHearts: [
      'Plus de cœurs ! Attends qu\'ils se régénèrent ou utilise tes XP 💎',
      'Pause obligatoire ! Reviens dans quelques minutes ⏰',
      'Tes cœurs se régénèrent... Patience ! 🕐',
      'Moment parfait pour réviser tes leçons ! 📚'
    ],
    
    heartRegen: [
      'Un cœur a été régénéré ! ❤️',
      'Cœur rechargé ! Tu peux continuer ! 💚',
      'Ta patience a payé ! +1 cœur ! ⭐',
      'Prêt à reprendre ? Nouveau cœur ! 🚀'
    ],
    
    fullHearts: [
      'Tous tes cœurs sont rechargés ! 💖',
      'Prêt pour de nouvelles aventures ! 🔥',
      'Énergie au maximum ! C\'est parti ! ⚡',
      'Tu es de retour en force ! 🏆'
    ]
  },
  
  powerUps: {
    invincibility: {
      duration: 60 * 60 * 1000, // 1 heure en ms
      cost: 500,
      icon: '⭐',
      name: 'Bouclier Doré',
      description: 'Aucune perte de cœur pendant 1h'
    },
    
    doubleHearts: {
      duration: 30 * 60 * 1000, // 30 minutes
      cost: 300,
      icon: '💎',
      name: 'Cœurs Doubles', 
      description: '10 cœurs pendant 30min'
    },
    
    fastRegen: {
      duration: 60 * 60 * 1000, // 1 heure
      cost: 200,
      icon: '⚡',
      name: 'Récupération Rapide',
      description: 'Régénération x3 plus rapide'
    }
  }
};

// ===== CLASSE PRINCIPALE HEARTS SYSTEM =====
class EnglishHeartsSystem {
  constructor() {
    this.data = this.loadData();
    this.activePowerUps = this.loadActivePowerUps();
    this.regenTimer = null;
    this.purchaseHistory = this.loadPurchaseHistory();
    
    // Démarrer processus de régénération
    this.startRegeneration();
    
    // Event listeners
    this.setupEventListeners();

  }
  
  // ===== GESTION DES DONNÉES =====
  
  loadData() {
    try {
      const saved = localStorage.getItem(HEARTS_CONFIG.storage.key);
      if (saved) {
        const data = JSON.parse(saved);
        return this.migrateData(data);
      }
    } catch (error) {
      console.error('Erreur chargement hearts data:', error);
    }
    
    return this.createDefaultData();
  }
  
  createDefaultData() {
    return {
      current: 5,
      lastLossTime: null,
      regenStartTime: null,
      totalHeartsLost: 0,
      totalHeartsRegened: 0,
      totalHeartsPurchased: 0,
      
      // Statistiques détaillées
      stats: {
        dailyLosses: {},
        averageLossesPerSession: 0,
        longestSessionWithoutLoss: 0,
        currentSessionLosses: 0,
        lastResetDate: new Date().toDateString()
      },
      
      // États spéciaux
      gracePeriodEnd: null,  // Fin période de grâce
      lastWarningShown: null, // Dernière fois qu'on a montré l'avertissement
      
      // Préférences utilisateur
      preferences: {
        animations: true,
        soundEffects: true,
        notificationsEnabled: true,
        autoRegenNotification: true
      }
    };
  }
  
  migrateData(data) {
    const defaultData = this.createDefaultData();
    
    return {
      ...defaultData,
      ...data,
      stats: {
        ...defaultData.stats,
        ...(data.stats || {})
      },
      preferences: {
        ...defaultData.preferences,
        ...(data.preferences || {})
      }
    };
  }
  
  saveData() {
    try {
      localStorage.setItem(HEARTS_CONFIG.storage.key, JSON.stringify(this.data));
      
      // Émettre événement pour autres composants
      window.dispatchEvent(new CustomEvent('heartsUpdated', {
        detail: {
          current: this.data.current,
          max: this.getMaxHearts(),
          regenTime: this.getTimeUntilNextRegen(),
          isRegenerating: this.isRegenerating()
        }
      }));
      
    } catch (error) {
      console.error('Erreur sauvegarde hearts data:', error);
    }
  }
  
  // ===== LOGIQUE PRINCIPALE =====
  
  loseHeart(reason = 'incorrect_answer') {
    // Vérifier invincibilité
    if (this.hasActivePowerUp('invincibility')) {
      console.log('⭐ Perte de cœur bloquée par bouclier doré');
      return {
        success: false,
        blocked: true,
        message: 'Bouclier doré activé ! Aucune perte de cœur ! ⭐',
        current: this.data.current
      };
    }
    
    if (this.data.current <= 0) {
      return {
        success: false,
        message: 'Aucun cœur à perdre',
        current: 0,
        canContinue: false
      };
    }
    
    const wasLastHeart = this.data.current === 1;
    
    // Perdre le cœur
    this.data.current--;
    this.data.lastLossTime = Date.now();
    this.data.totalHeartsLost++;
    this.data.stats.currentSessionLosses++;
    
    // Démarrer régénération si première perte
    if (this.data.current === HEARTS_CONFIG.gameplay.maxHearts - 1 && !this.data.regenStartTime) {
      this.data.regenStartTime = Date.now();
      console.log('⏰ Démarrage régénération automatique');
    }
    
    // Période de grâce si dernier cœur
    if (this.data.current === 0) {
      this.data.gracePeriodEnd = Date.now() + (HEARTS_CONFIG.gameplay.gracePeriodMinutes * 60 * 1000);
      console.log(`⏳ Période de grâce de ${HEARTS_CONFIG.gameplay.gracePeriodMinutes}min activée`);
    }
    
    // Mettre à jour stats quotidiennes
    this.updateDailyStats();
    
    this.saveData();
    
    // Animation de perte
    this.triggerLossAnimation();
    
    // Son/vibration si supporté
    this.playLossEffects();
    
    const result = {
      success: true,
      current: this.data.current,
      wasLastHeart,
      canContinue: this.data.current > 0 || this.isInGracePeriod(),
      message: this.getLossMessage(),
      gracePeriodEnd: this.data.gracePeriodEnd,
      regenTime: this.getTimeUntilNextRegen()
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

    console.log(`💔 Cœur perdu (${reason}): ${this.data.current}/${this.getMaxHearts()}`);
    
    return result;
  }
  
  gainHeart(reason = 'regeneration') {
    const maxHearts = this.getMaxHearts();
    
    if (this.data.current >= maxHearts) {
      return {
        success: false,
        message: 'Cœurs déjà au maximum',
        current: this.data.current
      };
    }
    
    this.data.current++;
    this.data.totalHeartsRegened++;
    
    // Réinitialiser période de grâce
    if (this.data.current > 0) {
      this.data.gracePeriodEnd = null;
    }
    
    // Arrêter régénération si plein
    if (this.data.current >= maxHearts) {
      this.data.regenStartTime = null;
      console.log('💖 Cœurs pleins - arrêt régénération');
    }
    
    this.saveData();
    
    // Animation de gain
    this.triggerGainAnimation();
    
    // Notification si activée
    if (this.data.preferences.autoRegenNotification && reason === 'regeneration') {
      this.showRegenNotification();
    }
    
    const result = {
      success: true,
      current: this.data.current,
      isFullyCharged: this.data.current >= maxHearts,
      message: this.getGainMessage(),
      reason
    };
    
    console.log(`❤️ Cœur gagné (${reason}): ${this.data.current}/${maxHearts}`);
    
    return result;
  }
  
  // ===== SYSTÈME RÉGÉNÉRATION =====
  
  startRegeneration() {
    if (this.regenTimer) {
      clearInterval(this.regenTimer);
    }
    
    this.regenTimer = setInterval(() => {
      this.processRegeneration();
    }, 1000); // Vérifier chaque seconde
    
    console.log('⏰ Timer régénération démarré');
  }
  
  processRegeneration() {
    const maxHearts = this.getMaxHearts();
    
    if (this.data.current >= maxHearts || !this.data.regenStartTime) {
      return;
    }
    
    const now = Date.now();
    const elapsed = now - this.data.regenStartTime;
    const regenInterval = this.getRegenInterval();
    
    // Calculer combien de cœurs devraient être régénérés
    const heartsToRegen = Math.floor(elapsed / regenInterval);
    
    if (heartsToRegen > 0) {
      const startingHearts = this.data.current;
      const newHeartCount = Math.min(maxHearts, startingHearts + heartsToRegen);
      
      if (newHeartCount > startingHearts) {
        // Gagner les cœurs régénérés
        for (let i = startingHearts; i < newHeartCount; i++) {
          this.gainHeart('regeneration');
        }
        
        // Ajuster le temps de départ pour le prochain cycle
        this.data.regenStartTime += heartsToRegen * regenInterval;
        
        // Si complètement régénéré, arrêter
        if (newHeartCount >= maxHearts) {
          this.data.regenStartTime = null;
        }

      }
    }
  }
  
  getRegenInterval() {
    // Vérifier power-up récupération rapide
    if (this.hasActivePowerUp('fastRegen')) {
      return (HEARTS_CONFIG.gameplay.regenTimeMinutes * 60 * 1000) / 3; // 3x plus rapide
    }
    
    return HEARTS_CONFIG.gameplay.regenTimeMinutes * 60 * 1000; // Temps normal
  }
  
  getTimeUntilNextRegen() {
    if (this.data.current >= this.getMaxHearts() || !this.data.regenStartTime) {
      return null;
    }
    
    const now = Date.now();
    const elapsed = now - this.data.regenStartTime;
    const regenInterval = this.getRegenInterval();
    const timeUntilNext = regenInterval - (elapsed % regenInterval);
    
    return Math.max(0, timeUntilNext);
  }
  
  getTimeUntilFullRegen() {
    if (this.data.current >= this.getMaxHearts()) {
      return 0;
    }
    
    const heartsNeeded = this.getMaxHearts() - this.data.current;
    const regenInterval = this.getRegenInterval();
    const timeUntilNext = this.getTimeUntilNextRegen() || 0;
    
    return timeUntilNext + ((heartsNeeded - 1) * regenInterval);
  }
  
  isRegenerating() {
    return this.data.regenStartTime !== null && this.data.current < this.getMaxHearts();
  }
  
  // ===== PÉRIODE DE GRÂCE =====
  
  isInGracePeriod() {
    if (!this.data.gracePeriodEnd) return false;
    
    const now = Date.now();
    const inGrace = now < this.data.gracePeriodEnd;
    
    if (!inGrace && this.data.gracePeriodEnd) {
      // Période expirée
      this.data.gracePeriodEnd = null;
      this.saveData();
    }
    
    return inGrace;
  }
  
  getGracePeriodTimeLeft() {
    if (!this.isInGracePeriod()) return 0;
    
    return Math.max(0, this.data.gracePeriodEnd - Date.now());
  }
  
  // ===== POWER-UPS SYSTÈME =====
  
  loadActivePowerUps() {
    try {
      const saved = localStorage.getItem('lemondedescurieux_english_powerups');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      return {};
    }
  }
  
  saveActivePowerUps() {
    try {
      localStorage.setItem('lemondedescurieux_english_powerups', JSON.stringify(this.activePowerUps));
    } catch (error) {
      console.error('Erreur sauvegarde power-ups:', error);
    }
  }
  
  activatePowerUp(type, duration = null) {
    const config = HEARTS_CONFIG.powerUps[type];
    if (!config) return false;
    
    const now = Date.now();
    const endTime = now + (duration || config.duration);
    
    this.activePowerUps[type] = {
      startTime: now,
      endTime: endTime,
      config: config
    };
    
    // Effets spéciaux selon le type
    if (type === 'doubleHearts') {
      // Donner cœurs supplémentaires temporaires
      this.data.current = Math.min(10, this.data.current + 5);
    }
    
    this.saveActivePowerUps();
    this.saveData();
    
    console.log(`⭐ Power-up activé: ${config.name} pour ${duration/60000}min`);
    
    return true;
  }
  
  hasActivePowerUp(type) {
    const powerUp = this.activePowerUps[type];
    if (!powerUp) return false;
    
    const now = Date.now();
    const isActive = now < powerUp.endTime;
    
    if (!isActive) {
      // Nettoyer power-up expiré
      delete this.activePowerUps[type];
      this.saveActivePowerUps();
      

      this.saveHearts();
      this.updateHeartsDisplay();
      this.updateRegenTimer();
      
      // Retourner true si on peut continuer, false si game over
      return this.heartsData.currentHearts > 0;

      // Effets de fin selon le type
      if (type === 'doubleHearts') {
        this.data.current = Math.min(5, this.data.current);
        this.saveData();
      }
    }
    
    return isActive;
  }
  
  getPowerUpTimeLeft(type) {
    const powerUp = this.activePowerUps[type];
    if (!powerUp || !this.hasActivePowerUp(type)) return 0;
    
    return Math.max(0, powerUp.endTime - Date.now());
  }
  
  getMaxHearts() {
    // Cœurs doubles = 10 cœurs max
    if (this.hasActivePowerUp('doubleHearts')) {
      return 10;
    }
    
    return HEARTS_CONFIG.gameplay.maxHearts;
  }
  
  // ===== BOUTIQUE VIRTUELLE =====
  
  loadPurchaseHistory() {
    try {
      const saved = localStorage.getItem(HEARTS_CONFIG.storage.purchaseHistory);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  }
  
  savePurchaseHistory() {
    try {
      localStorage.setItem(HEARTS_CONFIG.storage.purchaseHistory, JSON.stringify(this.purchaseHistory));
    } catch (error) {
      console.error('Erreur sauvegarde historique achats:', error);
    }
  }
  
  purchaseHeart(userXP, cost = null) {
    const price = cost || HEARTS_CONFIG.gameplay.shopPrices.singleHeart;
    
    if (userXP < price) {
      return {
        success: false,
        message: `Pas assez d'XP ! Il faut ${price} XP.`,
        required: price,
        current: userXP
      };
    }
    
    if (this.data.current >= this.getMaxHearts()) {
      return {
        success: false,
        message: 'Tes cœurs sont déjà pleins !',
        current: this.data.current
      };
    }
    
    // Effectuer l'achat
    this.data.current++;
    this.data.totalHeartsPurchased++;
    
    // Enregistrer l'achat
    this.purchaseHistory.push({
      type: 'single_heart',
      cost: price,
      timestamp: new Date().toISOString(),
      heartsAfter: this.data.current
    });
    
    this.saveData();
    this.savePurchaseHistory();
    
    // Animation spéciale achat
    this.triggerPurchaseAnimation();
    
    console.log(`💎 Cœur acheté pour ${price} XP`);
    
    return {
      success: true,
      message: 'Cœur acheté ! ❤️',
      cost: price,
      current: this.data.current,
      xpSpent: price
    };
  }
  
  purchaseFullHearts(userXP) {
    const price = HEARTS_CONFIG.gameplay.shopPrices.fullHearts;
    
    if (userXP < price) {
      return {
        success: false,
        message: `Pas assez d'XP ! Il faut ${price} XP.`,
        required: price
      };
    }
    
    const maxHearts = this.getMaxHearts();
    if (this.data.current >= maxHearts) {
      return {
        success: false,
        message: 'Tes cœurs sont déjà pleins !',
        current: this.data.current
      };
    }
    
    const heartsGained = maxHearts - this.data.current;
    this.data.current = maxHearts;
    this.data.totalHeartsPurchased += heartsGained;
    this.data.regenStartTime = null; // Arrêter régénération
    this.data.gracePeriodEnd = null; // Annuler période de grâce
    
    // Enregistrer l'achat
    this.purchaseHistory.push({
      type: 'full_hearts',
      cost: price,
      timestamp: new Date().toISOString(),
      heartsGained: heartsGained
    });
    
    this.saveData();
    this.savePurchaseHistory();
    
    // Animation spéciale
    this.triggerFullChargeAnimation();
    
    console.log(`💎 Tous les cœurs achetés pour ${price} XP`);
    
    return {
      success: true,
      message: 'Tous tes cœurs sont rechargés ! 💖',
      cost: price,
      heartsGained: heartsGained,
      current: this.data.current
    };
  }
  
  purchasePowerUp(type, userXP) {
    const config = HEARTS_CONFIG.powerUps[type];
    if (!config) return { success: false, message: 'Power-up inconnu' };
    
    if (userXP < config.cost) {
      return {
        success: false,
        message: `Pas assez d'XP ! Il faut ${config.cost} XP.`,
        required: config.cost
      };
    }
    
    if (this.hasActivePowerUp(type)) {
      return {
        success: false,
        message: `${config.name} déjà actif !`
      };
    }
    
    // Activer le power-up
    this.activatePowerUp(type);
    
    // Enregistrer l'achat
    this.purchaseHistory.push({
      type: 'powerup_' + type,
      cost: config.cost,
      timestamp: new Date().toISOString(),
      duration: config.duration
    });
    
    this.savePurchaseHistory();
    
    console.log(`⭐ Power-up ${config.name} acheté pour ${config.cost} XP`);
    
    return {
      success: true,
      message: `${config.name} activé ! ${config.description}`,
      cost: config.cost,
      duration: config.duration
    };
  }
  
  // ===== ANIMATIONS ET EFFETS =====
  
  setupEventListeners() {
    // Écouter événements depuis d'autres systèmes
    window.addEventListener('heartsLoss', (event) => {
      this.triggerLossAnimation();
    });
    
    window.addEventListener('heartsGain', (event) => {
      this.triggerGainAnimation();
    });
  }
  
  triggerLossAnimation() {
    if (!this.data.preferences.animations) return;
    
    // Déclencher animation CSS
    const heartsDisplay = document.querySelectorAll('.hearts-display .heart');
    
    heartsDisplay.forEach((heart, index) => {
      if (index === this.data.current) { // Cœur qui vient d'être perdu
        heart.classList.add('heart-losing');
        heart.style.animation = `heartLoss ${HEARTS_CONFIG.animations.heartLoss}ms ease-out`;
        
        setTimeout(() => {
          heart.classList.remove('heart-losing');
          heart.style.animation = '';
        }, HEARTS_CONFIG.animations.heartLoss);
      }
    });
    
    // Shake global si dernier cœur
    if (this.data.current === 0) {
      this.triggerScreenShake();
    }
  }
  
  triggerGainAnimation() {
    if (!this.data.preferences.animations) return;
    
    const heartsDisplay = document.querySelectorAll('.hearts-display .heart');
    
    heartsDisplay.forEach((heart, index) => {
      if (index === this.data.current - 1) { // Cœur qui vient d'être gagné
        heart.classList.add('heart-gaining');
        heart.style.animation = `heartGain ${HEARTS_CONFIG.animations.heartGain}ms ease-out`;
        
        setTimeout(() => {
          heart.classList.remove('heart-gaining');
          heart.style.animation = '';
        }, HEARTS_CONFIG.animations.heartGain);
      }
    });
  }
  
  triggerPurchaseAnimation() {
    // Animation spéciale pour achat avec XP
    const heartsDisplay = document.querySelector('.hearts-display');
    if (heartsDisplay) {
      heartsDisplay.classList.add('purchase-effect');
      setTimeout(() => {
        heartsDisplay.classList.remove('purchase-effect');
      }, 1000);
    }
  }
  
  triggerFullChargeAnimation() {
    // Animation de charge complète
    const heartsDisplay = document.querySelector('.hearts-display');
    if (heartsDisplay) {
      heartsDisplay.classList.add('full-charge-effect');
      setTimeout(() => {
        heartsDisplay.classList.remove('full-charge-effect');
      }, 2000);
    }
  }
  
  triggerScreenShake() {
    if (!this.data.preferences.animations) return;
    
    const body = document.body;
    body.style.animation = `screenShake 0.6s ease-out`;
    
    setTimeout(() => {
      body.style.animation = '';
    }, 600);
  }
  
  playLossEffects() {
    if (!this.data.preferences.soundEffects) return;
    
    // Vibration sur mobile si supporté
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
    
    // Son de perte (placeholder)
    this.playSound('heart-loss');
  }
  
  playSound(type) {
    // Placeholder pour système audio
    try {
      const audio = new Audio(`/sounds/${type}.mp3`);
      audio.volume = 0.3;
      audio.play().catch(e => console.log('Audio non disponible'));
    } catch (error) {
      // Son non disponible
    }
  }
  
  // ===== MESSAGES ET RETOURS =====
  
  getLossMessage() {
    if (this.data.current === 0) {
      return this.getRandomFromArray(HEARTS_CONFIG.messages.noHearts);
    } else if (this.data.current === 1) {
      return this.getRandomFromArray(HEARTS_CONFIG.messages.lastHeart);
    } else {
      return this.getRandomFromArray(HEARTS_CONFIG.messages.heartLoss);
    }
  }
  
  getGainMessage() {
    if (this.data.current >= this.getMaxHearts()) {
      return this.getRandomFromArray(HEARTS_CONFIG.messages.fullHearts);
    } else {
      return this.getRandomFromArray(HEARTS_CONFIG.messages.heartRegen);
    }
  }
  
  showRegenNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Le Monde des Curieux 🦊', {
        body: 'Un cœur a été régénéré ! Tu peux continuer tes leçons ❤️',
        icon: '/images/curio-heart.png',
        tag: 'heart-regen'
      });
    }
  }
  
  getRandomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  // ===== STATISTIQUES =====
  
  updateDailyStats() {
    const today = new Date().toDateString();
    
    if (!this.data.stats.dailyLosses[today]) {
      this.data.stats.dailyLosses[today] = 0;
    }
    
    this.data.stats.dailyLosses[today]++;
    
    // Nettoyer anciennes données (garder 30 jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    Object.keys(this.data.stats.dailyLosses).forEach(date => {
      if (new Date(date) < thirtyDaysAgo) {
        delete this.data.stats.dailyLosses[date];
      }
    });
  }
  
  getStatsData() {
    return {
      current: this.data.current,
      max: this.getMaxHearts(),
      totalLost: this.data.totalHeartsLost,
      totalRegened: this.data.totalHeartsRegened,
      totalPurchased: this.data.totalHeartsPurchased,
      currentSessionLosses: this.data.stats.currentSessionLosses,
      regenTimeLeft: this.getTimeUntilNextRegen(),
      fullRegenTime: this.getTimeUntilFullRegen(),
      isRegenerating: this.isRegenerating(),
      gracePeriodLeft: this.getGracePeriodTimeLeft(),
      activePowerUps: Object.keys(this.activePowerUps).filter(type => this.hasActivePowerUp(type)),
      dailyStats: this.data.stats.dailyLosses
    };
  }
  
  // ===== UTILITAIRES =====
  
  formatTime(milliseconds) {
    if (!milliseconds || milliseconds <= 0) return '0:00';
    
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  
  canPlayLesson() {
    return this.data.current > 0 || this.isInGracePeriod();
  }
  
  // ===== API PUBLIQUE =====
  
  getCurrentHearts() {
    return this.data.current;
  }
  
  getMaxHeartsCount() {
    return this.getMaxHearts();
  }
  
  // ===== MAINTENANCE =====
  
  resetStats() {
    if (confirm('Réinitialiser toutes les statistiques de cœurs ?')) {
      this.data.stats = this.createDefaultData().stats;
      this.data.totalHeartsLost = 0;
      this.data.totalHeartsRegened = 0;
      this.data.totalHeartsPurchased = 0;
      this.saveData();
      console.log('📊 Stats cœurs réinitialisées');
      return true;

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

  exportData() {
    return {
      version: '1.0',
      exported: new Date().toISOString(),
      hearts: this.data,
      powerUps: this.activePowerUps,
      purchases: this.purchaseHistory
    };
  }
  
  importData(exportedData) {
    try {
      if (exportedData.version && exportedData.hearts) {
        this.data = this.migrateData(exportedData.hearts);
        this.activePowerUps = exportedData.powerUps || {};
        this.purchaseHistory = exportedData.purchases || [];
        
        this.saveData();
        this.saveActivePowerUps();
        this.savePurchaseHistory();
        
        console.log('📥 Données cœurs importées');
        return true;
      }
    } catch (error) {
      console.error('Erreur import cœurs:', error);

    }
    return false;
  }
  
  // ===== CLEANUP =====
  
  destroy() {
    if (this.regenTimer) {
      clearInterval(this.regenTimer);
      this.regenTimer = null;
    }
    
    console.log('🧹 Hearts system nettoyé');
  }
}


// Export pour utilisation en module ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnglishHeartsSystem;
}

// Instance globale pour compatibilité
window.EnglishHeartsSystem = EnglishHeartsSystem;

// ===== EXPORT GLOBAL =====
window.EnglishHeartsSystem = EnglishHeartsSystem;

// Initialisation automatique
window.englishHearts = new EnglishHeartsSystem();

// Cleanup automatique au déchargement
window.addEventListener('beforeunload', () => {
  if (window.englishHearts) {
    window.englishHearts.destroy();
  }
});

console.log('❤️ English Hearts System loaded successfully');
console.log('💗 Current hearts:', window.englishHearts.getCurrentHearts());

