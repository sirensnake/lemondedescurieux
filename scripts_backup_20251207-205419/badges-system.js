// scripts/badge-system.js
class BadgeSystem {
  constructor() {
    this.badges = this.loadBadgeDefinitions();
    this.earnedBadges = this.loadEarnedBadges();
    this.initializeBadgeChecking();
  }
  
  loadBadgeDefinitions() {
    return {
      // Badges Progression
      'first_steps': {
        title: 'Premiers Pas',
        description: 'Compléter sa première activité',
        icon: '👶',
        condition: (progress) => Object.keys(progress.userProgress).length > 0
      },
      'streak_master': {
        title: 'Maître des Séries',
        description: 'Maintenir un streak de 7 jours',
        icon: '🔥',
        condition: (progress) => progress.streaks.currentStreak >= 7
      },
      'polyglot': {
        title: 'Polyglotte',
        description: 'Compléter 10 activités d\'anglais',
        icon: '🌍',
        condition: (progress) => this.countActivities(progress.userProgress.anglais) >= 10
      },
      // Badges Spéciaux
      'night_owl': {
        title: 'Chouette de Nuit',
        description: 'Étudier après 21h',
        icon: '🦉',
        condition: () => new Date().getHours() >= 21
      }
    };
  }
  
  checkAndAwardBadges() {
    const currentProgress = this.loadAllProgress();
    
    Object.entries(this.badges).forEach(([badgeId, badge]) => {
      if (!this.earnedBadges[badgeId] && badge.condition(currentProgress)) {
        this.awardBadge(badgeId);
      }
    });
  }
  
  awardBadge(badgeId) {
    this.earnedBadges[badgeId] = {
      earnedAt: new Date().toISOString(),
      notified: false
    };
    
    this.saveEarnedBadges();
    this.showBadgeNotification(badgeId);
  }
}