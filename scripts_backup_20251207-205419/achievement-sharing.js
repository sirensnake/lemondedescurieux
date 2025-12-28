// Dans scripts/achievement-sharing.js
class AchievementSharing {
    constructor() {
      this.achievements = this.loadAchievements();
    }
    
    loadAchievements() {
      return JSON.parse(localStorage.getItem('userAchievements')) || [];
    }
    
    generateSharingCode(achievementId) {
      const achievement = this.achievements.find(a => a.id === achievementId);
      if (!achievement) return null;
      
      // Création du code de partage
      const shareData = {
        type: 'achievement',
        id: achievement.id,
        title: achievement.title,
        score: achievement.score,
        date: achievement.completedAt,
        user: this.getAnonymousUserCode()
      };
      
      // Encodage
      return btoa(JSON.stringify(shareData));
    }
    
    getAnonymousUserCode() {
      // Génération d'un code anonyme basé sur le profil
    }
    
    validateSharingCode(code) {
      // Validation et décodage du code
    }
  }