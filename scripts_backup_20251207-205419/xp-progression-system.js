// scripts/xp-progression-system.js
class XPProgressionSystem {
  constructor() {
    this.data = this.loadProgress();
    this.levelThresholds = this.calculateThresholds();
  }
  
  /**
   * Charge la progression depuis localStorage
   * @returns {Object} Données de progression
   */
  loadProgress() {
    try {
      const saved = localStorage.getItem('xpProgressData');
      if (saved) {
        const data = JSON.parse(saved);
        console.log('[XP System] Progression chargée:', data);
        return data;
      }
    } catch (error) {
      console.error('[XP System] Erreur chargement:', error);
    }
    
    // Données par défaut
    return {
      level: 1,
      xp: 0,
      totalXP: 0,
      xpForNextLevel: 200
    };
  }
  
  /**
   * Sauvegarde la progression dans localStorage
   * ⚠️ MÉTHODE CRITIQUE - C'était ça qui manquait !
   */
  saveProgress() {
    try {
      localStorage.setItem('xpProgressData', JSON.stringify(this.data));
      console.log('[XP System] ✅ Progression sauvegardée:', this.data);
    } catch (error) {
      console.error('[XP System] ❌ Erreur sauvegarde:', error);
      // Continue sans crash si localStorage plein/désactivé
    }
  }
  
  /**
   * Calcule les seuils XP pour chaque niveau
   * @returns {Array} Tableau des seuils
   */
  calculateThresholds() {
    const thresholds = [];
    
    // Niveau 1-5 : 200 XP/niveau
    for (let i = 1; i <= 5; i++) {
      thresholds[i] = 200 * i;
    }
    
    // Niveau 6-10 : 400 XP/niveau supplémentaires
    for (let i = 6; i <= 10; i++) {
      thresholds[i] = thresholds[5] + (400 * (i - 5));
    }
    
    // Niveau 11+ : 800 XP/niveau supplémentaires
    for (let i = 11; i <= 50; i++) {
      thresholds[i] = thresholds[10] + (800 * (i - 10));
    }
    
    return thresholds;
  }
  
  /**
   * Attribue des XP avec bonus contextuels
   * @param {number} baseXP - XP de base
   * @param {Object} context - Contexte (streak, perfect score, etc.)
   */
  awardXP(baseXP, context = {}) {
    let finalXP = baseXP;
    
    // Bonus streaks (+50%)
    if (context.hasActiveStreak) {
      finalXP = Math.floor(finalXP * 1.5);
      console.log('[XP System] 🔥 Bonus Streak +50%');
    }
    
    // Bonus performance parfaite (x2)
    if (context.perfectScore) {
      finalXP *= 2;
      console.log('[XP System] ⭐ Bonus Perfect Score x2');
    }
    
    console.log(`[XP System] Attribution: ${baseXP} XP → ${finalXP} XP (après bonus)`);
    
    this.addXP(finalXP);
    this.checkLevelUp();
    
    // ✅ SAUVEGARDE AUTOMATIQUE (fix du bug)
    this.saveProgress();
  }
  
  /**
   * Ajoute des XP au total
   * @param {number} amount - Quantité XP à ajouter
   */
  addXP(amount) {
    this.data.xp += amount;
    this.data.totalXP += amount;
    
    console.log(`[XP System] Nouveau total: ${this.data.xp}/${this.data.xpForNextLevel} XP (Total: ${this.data.totalXP})`);
  }
  
  /**
   * Vérifie et gère les level-up
   */
  checkLevelUp() {
    while (this.data.xp >= this.data.xpForNextLevel) {
      this.levelUp();
    }
  }
  
  /**
   * Gère le passage au niveau suivant
   */
  levelUp() {
    const oldLevel = this.data.level;
    this.data.level++;
    this.data.xp -= this.data.xpForNextLevel;
    
    // Calcul nouveau seuil
    if (this.data.level <= 5) {
      this.data.xpForNextLevel = 200;
    } else if (this.data.level <= 10) {
      this.data.xpForNextLevel = 400;
    } else {
      this.data.xpForNextLevel = 800;
    }
    
    console.log(`[XP System] 🎉 LEVEL UP! ${oldLevel} → ${this.data.level}`);
    
    // Animation level-up
    this.celebrateLevelUp();
    
    // ✅ SAUVEGARDE AUTOMATIQUE (fix du bug)
    this.saveProgress();
  }
  
  /**
   * Animation de célébration level-up
   */
  celebrateLevelUp() {
    // Dispatch event pour animations externes
    window.dispatchEvent(new CustomEvent('xp:levelup', {
      detail: { 
        level: this.data.level,
        xpForNext: this.data.xpForNextLevel
      }
    }));
    
    // Animation visuelle si élément existe
    const xpDisplay = document.getElementById('xp-display');
    if (xpDisplay) {
      xpDisplay.classList.add('level-up-animation');
      setTimeout(() => {
        xpDisplay.classList.remove('level-up-animation');
      }, 1000);
    }
  }
  
  /**
   * Réinitialise la progression (pour tests)
   */
  reset() {
    this.data = {
      level: 1,
      xp: 0,
      totalXP: 0,
      xpForNextLevel: 200
    };
    this.saveProgress();
    console.log('[XP System] 🔄 Progression réinitialisée');
  }
  
  /**
   * API Debug pour tests
   */
  getStatus() {
    return {
      ...this.data,
      percentToNextLevel: Math.floor((this.data.xp / this.data.xpForNextLevel) * 100)
    };
  }
}

// Export pour utilisation globale
if (typeof window !== 'undefined') {
  window.XPProgressionSystem = XPProgressionSystem;
}
