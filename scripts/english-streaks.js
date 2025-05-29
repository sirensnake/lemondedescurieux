// Système de streaks pour la section Anglais - Duolingo style
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
      streakFreezeUsed: false,
      totalDaysActive: 0
    };
  }
  
  saveStreaks() {
    localStorage.setItem('englishStreaks', JSON.stringify(this.streakData));
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
    this.streakData.totalDaysActive++;
    
    this.saveStreaks();
    this.updateStreakDisplay();
    this.checkStreakMilestones();
  }
  
  isStreakBroken(lastActivity) {
    const lastDate = new Date(lastActivity);
    const today = new Date();
    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 1;
  }
  
  checkStreakStatus() {
    const today = new Date().toDateString();
    const lastActivity = this.streakData.lastActivityDate;
    
    if (lastActivity === today) {
      return 'completed'; // Déjà fait aujourd'hui
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastActivity === yesterday.toDateString()) {
      return 'active'; // Streak actif, activité à faire aujourd'hui
    }
    
    return 'broken'; // Streak cassé
  }
  
  initializeUI() {
    // Créer l'élément s'il n'existe pas
    if (!document.getElementById('streak-counter')) {
      const header = document.querySelector('.game-header');
      if (header) {
        const streakDiv = document.createElement('div');
        streakDiv.id = 'streak-counter';
        header.appendChild(streakDiv);
      }
    }
    
    this.updateStreakDisplay();
  }
  
  updateStreakDisplay() {
    const streakElement = document.getElementById('streak-counter');
    if (streakElement) {
      const status = this.checkStreakStatus();
      const streakClass = status === 'broken' ? 'streak-broken' : '';
      
      streakElement.innerHTML = `
        <div class="streak-flame ${streakClass}">🔥</div>
        <div class="streak-count">${this.streakData.currentStreak}</div>
        <div class="streak-label">jours de suite</div>
      `;
      
      // Ajouter une animation si c'est un nouveau record
      if (this.streakData.currentStreak === this.streakData.longestStreak && 
          this.streakData.currentStreak > 0) {
        streakElement.classList.add('celebration');
        setTimeout(() => streakElement.classList.remove('celebration'), 3000);
      }
    }
  }
  
  checkStreakMilestones() {
    const milestones = [3, 7, 14, 30, 50, 100];
    const current = this.streakData.currentStreak;
    
    if (milestones.includes(current)) {
      this.showStreakMilestone(current);
      // Déclencher un événement pour les badges
      window.dispatchEvent(new CustomEvent('streakMilestone', { 
        detail: { days: current } 
      }));
    }
  }
  
  showStreakMilestone(days) {
    // Créer une notification de milestone
    const notification = document.createElement('div');
    notification.className = 'streak-milestone-notification';
    notification.innerHTML = `
      <div class="milestone-content">
        <div class="milestone-icon">🏆</div>
        <div class="milestone-text">
          <h3>Félicitations !</h3>
          <p>${days} jours de suite !</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Retirer après 3 secondes
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
  
  useStreakFreeze() {
    if (!this.streakData.streakFreezeUsed && this.streakData.currentStreak > 0) {
      this.streakData.streakFreezeUsed = true;
      this.saveStreaks();
      return true;
    }
    return false;
  }
  
  resetStreakFreeze() {
    // Réinitialiser le freeze chaque semaine
    this.streakData.streakFreezeUsed = false;
    this.saveStreaks();
  }
}
