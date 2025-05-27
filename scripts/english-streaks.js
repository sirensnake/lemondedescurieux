// Nouveau fichier: scripts/english-streaks.js
class EnglishStreakSystem {
  constructor() {
    this.streakData = this.loadStreaks();
    this.initializeUI();
  }
  
  loadStreaks() {
    return JSON.parse(localStorage.getItem('englishStreaks')) || {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      streakFreezeUsed: false
    };
  }
  
  recordActivity() {
    const today = new Date().toDateString();
    const lastActivity = this.streakData.lastActivityDate;
    
    if (lastActivity === today) {
      return; // Déjà fait aujourd'hui
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastActivity === yesterday.toDateString()) {
      // Continuation du streak
      this.streakData.currentStreak++;
    } else if (lastActivity === null || this.isStreakBroken(lastActivity)) {
      // Nouveau streak ou broken
      this.streakData.currentStreak = 1;
    }
    
    this.streakData.longestStreak = Math.max(
      this.streakData.longestStreak, 
      this.streakData.currentStreak
    );
    this.streakData.lastActivityDate = today;
    
    this.saveStreaks();
    this.updateStreakDisplay();
  }
  
  // Interface visuelle streak
  updateStreakDisplay() {
    const streakElement = document.getElementById('streak-counter');
    if (streakElement) {
      streakElement.innerHTML = `
        <div class="streak-flame">🔥</div>
        <div class="streak-count">${this.streakData.currentStreak}</div>
        <div class="streak-label">jours de suite</div>
      `;
    }
  }
}