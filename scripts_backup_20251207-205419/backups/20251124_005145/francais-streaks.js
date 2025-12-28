/* ============================================================================
   SYSTÈME DE STREAKS - FRANÇAIS
   Fichier: scripts/francais-streaks.js
   ============================================================================ */

class FrenchStreaks {
  constructor() {
    this.storageKey = 'francais_streak_data';
    this.data = this.loadStreakData();
    console.log('✅ FrenchStreaks initialisé');
  }
  
  loadStreakData() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Données par défaut
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      totalActivities: 0
    };
  }
  
  saveStreakData() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }
  
  recordActivity() {
    const today = new Date().toDateString();
    
    if (this.data.lastActivityDate === today) {
      // Déjà fait aujourd'hui
      return this.data.currentStreak;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (this.data.lastActivityDate === yesterday.toDateString()) {
      // Continuation du streak
      this.data.currentStreak += 1;
    } else {
      // Nouveau streak ou cassé
      this.data.currentStreak = 1;
    }
    
    this.data.lastActivityDate = today;
    this.data.totalActivities += 1;
    
    // Mettre à jour le meilleur streak
    if (this.data.currentStreak > this.data.longestStreak) {
      this.data.longestStreak = this.data.currentStreak;
    }
    
    this.saveStreakData();
    
    // Mettre à jour l'affichage
    this.updateDisplay();
    
    return this.data.currentStreak;
  }
  
  getCurrentStreak() {
    return this.data.currentStreak;
  }
  
  getBestStreak() {
    return this.data.longestStreak;
  }
  
  updateDisplay() {
    const streakElement = document.getElementById('streak-count');
    if (streakElement) {
      streakElement.textContent = this.data.currentStreak;
    }
  }
  
  resetStreak() {
    this.data.currentStreak = 0;
    this.data.lastActivityDate = null;
    this.saveStreakData();
    this.updateDisplay();
  }
}

// Export global
window.FrancaisStreaks = FrancaisStreaks;
// Export global
if (typeof window !== 'undefined') {
  window.FrenchStreaks = FrenchStreaks;
  console.log('✅ FrenchStreaks loaded');
}
