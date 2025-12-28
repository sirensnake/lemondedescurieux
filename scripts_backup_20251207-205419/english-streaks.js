// english-streaks.js - Système de streaks quotidiens avancé avec notifications

// ===== CONFIGURATION STREAKS =====
const STREAK_CONFIG = {
  storage: {
    key: 'lemondedescurieux_english_streaks',
    reminders: 'lemondedescurieux_streak_reminders'
  },
  
  milestones: [
    { days: 3, reward: 25, badge: 'early_bird', emoji: '🐦', message: 'Bon début !' },
    { days: 7, reward: 50, badge: 'week_warrior', emoji: '🏆', message: 'Une semaine complète !' },
    { days: 14, reward: 100, badge: 'fortnight_fighter', emoji: '💎', message: 'Deux semaines de régularité !' },
    { days: 30, reward: 200, badge: 'month_master', emoji: '👑', message: 'Un mois entier ! Incroyable !' },
    { days: 50, reward: 300, badge: 'streak_legend', emoji: '🔥', message: 'Tu es une légende !' },
    { days: 100, reward: 500, badge: 'century_champion', emoji: '🎯', message: '100 jours ! Tu es extraordinaire !' }
  ],
  
  encouragements: {
    lost: [
      'Ce n\'est qu\'un début ! Recommence dès aujourd\'hui 💪',
      'Les champions se relèvent ! Allez, c\'est reparti ! 🚀',
      'Chaque expert a été un débutant. Continue ! ⭐',
      'L\'important c\'est de ne jamais abandonner ! 🎯'
    ],
    
    active: [
      'Tu es en feu ! Continue comme ça ! 🔥',
      'Quelle régularité ! Bravo ! 👏',
      'Tu progresses chaque jour ! Fantastique ! ⭐',
      'Rien ne peut t\'arrêter ! 🚀'
    ],
    
    milestone: [
      'INCROYABLE ! Tu as atteint un nouveau palier ! 🏆',
      'WOW ! Quel streak fantastique ! 💎',
      'Tu dépasses tes limites ! Bravo ! 👑',
      'Performance exceptionnelle ! Continue ! 🔥'
    ]
  },
  
  reminders: {
    evening: '🌅 N\'oublie pas ta leçon d\'anglais aujourd\'hui !',
    lateEvening: '🌙 Dernière chance pour maintenir ton streak !',
    motivational: '🚀 Curio t\'attend pour une nouvelle aventure en anglais !'
  }
};

// ===== CLASSE PRINCIPALE STREAK SYSTEM =====
class EnglishStreakSystem {
  constructor() {
    this.data = this.loadData();
    this.reminders = this.loadReminders();
    this.initializeNotifications();
  }
  
  // ===== GESTION DES DONNÉES =====
  
  loadData() {
    try {
      const saved = localStorage.getItem(STREAK_CONFIG.storage.key);
      if (saved) {
        const data = JSON.parse(saved);
        
        // Migration des anciennes versions si nécessaire
        return this.migrateData(data);
      }
    } catch (error) {
      console.error('Erreur chargement streak data:', error);
    }
    
    return this.createDefaultData();
  }
  
  createDefaultData() {
    return {
      current: 0,
      longest: 0,
      total: 0,
      lastActivityDate: null,
      lastNotificationDate: null,
      streakStartDate: null,
      milestonesBadges: [],
      weeklyGoal: 7,
      weeklyProgress: 0,
      lastWeekReset: this.getWeekStartDate(),
      freezeCount: 0, // Nombre de "streak freeze" utilisés
      freezeAvailable: 0, // Streak freeze disponibles
      history: [], // Historique des streaks
      motivation: {
        level: 'beginner', // beginner, intermediate, advanced, expert
        personalBest: 0,
        totalDaysLearned: 0
      }
    };
  }
  
  migrateData(data) {
    // Ajouter les nouvelles propriétés si elles n'existent pas
    const defaultData = this.createDefaultData();
    
    return {
      ...defaultData,
      ...data,
      motivation: {
        ...defaultData.motivation,
        ...(data.motivation || {})
      }
    };
  }
  
  saveData() {
    try {
      localStorage.setItem(STREAK_CONFIG.storage.key, JSON.stringify(this.data));
      
      // Trigger événement pour autres composants
      window.dispatchEvent(new CustomEvent('streakUpdated', {
        detail: {
          current: this.data.current,
          longest: this.data.longest,
          isNewRecord: this.data.current === this.data.longest
        }
      }));
      
    } catch (error) {
      console.error('Erreur sauvegarde streak data:', error);
    }
  }
  
  // ===== LOGIQUE STREAK PRINCIPAL =====
  
  recordActivity() {
    const today = this.getTodayString();
    const yesterday = this.getYesterdayString();
    
    // Déjà fait aujourd'hui ?
    if (this.data.lastActivityDate === today) {
      console.log('📅 Activité déjà enregistrée aujourd\'hui');
      return {
        success: true,
        streak: this.data.current,
        message: 'Activité déjà comptée aujourd\'hui !',
        alreadyRecorded: true
      };
    }
    
    let streakBroken = false;
    let isNewStreak = false;
    
    // Vérifier continuité
    if (this.data.lastActivityDate === yesterday) {
      // Continuité parfaite
      this.data.current++;
      console.log(`🔥 Streak continué: ${this.data.current} jours`);
      
    } else if (this.data.lastActivityDate === null) {
      // Premier jour ever
      this.data.current = 1;
      this.data.streakStartDate = today;
      isNewStreak = true;
      console.log('🎯 Premier streak démarré !');
      
    } else {
      // Streak cassé, vérifier freeze disponible
      if (this.data.freezeAvailable > 0 && this.shouldOfferFreeze()) {
        // Proposer utilisation freeze
        return this.offerStreakFreeze();
      } else {
        // Streak cassé définitivement
        this.handleBrokenStreak();
        streakBroken = true;
        this.data.current = 1;
        this.data.streakStartDate = today;
        console.log('💔 Streak cassé, nouveau streak démarré');
      }
    }
    
    // Mettre à jour données globales
    this.data.lastActivityDate = today;
    this.data.total++;
    this.data.motivation.totalDaysLearned++;
    
    // Nouveau record ?
    if (this.data.current > this.data.longest) {
      this.data.longest = this.data.current;
      this.data.motivation.personalBest = this.data.current;
      console.log(`🏆 NOUVEAU RECORD ! ${this.data.longest} jours`);
    }
    
    // Mettre à jour progression hebdomadaire
    this.updateWeeklyProgress();
    
    // Vérifier milestones
    const milestoneRewards = this.checkMilestones();
    
    // Gagner streak freeze selon progression
    this.updateStreakFreezes();
    
    // Mettre à jour niveau motivation
    this.updateMotivationLevel();
    
    this.saveData();
    
    // Préparer résultat
    const result = {
      success: true,
      streak: this.data.current,
      isNewRecord: this.data.current === this.data.longest,
      isNewStreak,
      streakBroken,
      milestoneRewards,
      message: this.getStreakMessage(streakBroken, isNewStreak),
      encouragement: this.getEncouragement(),
      freezeAvailable: this.data.freezeAvailable
    };
    
    // Planifier prochains rappels
    this.scheduleReminders();
    
    return result;
  }
  
  handleBrokenStreak() {
    // Sauvegarder dans l'historique
    if (this.data.current > 0) {
      this.data.history.push({
        duration: this.data.current,
        startDate: this.data.streakStartDate,
        endDate: this.data.lastActivityDate,
        reason: 'missed_day'
      });
    }
    
    console.log(`📊 Streak de ${this.data.current} jours ajouté à l'historique`);
  }
  
  shouldOfferFreeze() {
    // Offrir freeze seulement si streak > 3 jours
    return this.data.current >= 3;
  }
  
  offerStreakFreeze() {
    return {
      success: false,
      offerFreeze: true,
      current: this.data.current,
      freezeAvailable: this.data.freezeAvailable,
      message: `Tu as manqué hier... Utiliser un Streak Freeze pour sauver tes ${this.data.current} jours ?`
    };
  }
  
  useStreakFreeze() {
    if (this.data.freezeAvailable <= 0) {
      return { success: false, message: 'Aucun Streak Freeze disponible' };
    }
    
    this.data.freezeAvailable--;
    this.data.freezeCount++;
    
    // Remplir le jour manqué
    const yesterday = this.getYesterdayString();
    this.data.lastActivityDate = yesterday;
    
    this.saveData();
    
    console.log(`❄️ Streak Freeze utilisé ! ${this.data.freezeAvailable} restants`);
    
    return {
      success: true,
      message: `Streak sauvé ! Tu as maintenant ${this.data.freezeAvailable} Streak Freeze restants.`,
      current: this.data.current,
      freezeAvailable: this.data.freezeAvailable
    };
  }
  
  // ===== SYSTÈME MILESTONES =====
  
  checkMilestones() {
    const rewards = [];
    
    STREAK_CONFIG.milestones.forEach(milestone => {
      // Nouveau milestone atteint ?
      if (this.data.current === milestone.days && 
          !this.data.milestonesBadges.includes(milestone.badge)) {
        
        this.data.milestonesBadges.push(milestone.badge);
        
        rewards.push({
          days: milestone.days,
          xpReward: milestone.reward,
          badge: milestone.badge,
          emoji: milestone.emoji,
          message: milestone.message,
          isNewMilestone: true
        });
        
        console.log(`🏆 Milestone atteint: ${milestone.days} jours !`);
      }
    });
    
    return rewards;
  }
  
  // ===== STREAK FREEZES =====
  
  updateStreakFreezes() {
    // Gagner un freeze tous les 7 jours de streak
    const freezeEarned = Math.floor(this.data.current / 7);
    const currentFreezes = this.data.freezeAvailable;
    
    // Maximum 3 freezes stockés
    this.data.freezeAvailable = Math.min(3, freezeEarned);
    
    if (this.data.freezeAvailable > currentFreezes) {
      console.log(`❄️ Nouveau Streak Freeze gagné ! Total: ${this.data.freezeAvailable}`);
    }
  }
  
  // ===== PROGRESSION HEBDOMADAIRE =====
  
  updateWeeklyProgress() {
    const currentWeekStart = this.getWeekStartDate();
    
    // Nouvelle semaine ?
    if (currentWeekStart !== this.data.lastWeekReset) {
      this.data.weeklyProgress = 1; // Premier jour de la nouvelle semaine
      this.data.lastWeekReset = currentWeekStart;
    } else {
      this.data.weeklyProgress++;
    }
    
    console.log(`📊 Progression hebdomadaire: ${this.data.weeklyProgress}/${this.data.weeklyGoal}`);
  }
  
  getWeeklyCompletionRate() {
    return Math.min(100, (this.data.weeklyProgress / this.data.weeklyGoal) * 100);
  }
  
  // ===== NIVEAU MOTIVATION =====
  
  updateMotivationLevel() {
    const total = this.data.motivation.totalDaysLearned;
    
    let newLevel = 'beginner';
    if (total >= 100) newLevel = 'expert';
    else if (total >= 50) newLevel = 'advanced';
    else if (total >= 20) newLevel = 'intermediate';
    
    if (newLevel !== this.data.motivation.level) {
      this.data.motivation.level = newLevel;
      console.log(`🎯 Nouveau niveau de motivation: ${newLevel}`);
    }
  }
  
  getMotivationLevel() {
    return this.data.motivation.level;
  }
  
  // ===== MESSAGES ET ENCOURAGEMENTS =====
  
  getStreakMessage(broken = false, isNew = false) {
    if (broken) {
      return this.getRandomFromArray(STREAK_CONFIG.encouragements.lost);
    }
    
    if (isNew) {
      return 'Premier jour de ton nouveau streak ! 🎯';
    }
    
    // Messages selon longueur du streak
    if (this.data.current >= 30) {
      return `${this.data.current} jours ! Tu es une machine ! 🤖`;
    } else if (this.data.current >= 14) {
      return `${this.data.current} jours de suite ! Impressionnant ! 💎`;
    } else if (this.data.current >= 7) {
      return `Une semaine complète ! Bravo ! 🏆`;
    } else if (this.data.current >= 3) {
      return `${this.data.current} jours ! Tu prends le rythme ! 🔥`;
    } else {
      return `${this.data.current} jour${this.data.current > 1 ? 's' : ''} ! Continue ! ⭐`;
    }
  }
  
  getEncouragement() {
    const milestoneClose = this.getNextMilestone();
    
    if (milestoneClose && milestoneClose.daysLeft <= 2) {
      return `Plus que ${milestoneClose.daysLeft} jour${milestoneClose.daysLeft > 1 ? 's' : ''} pour ${milestoneClose.days} jours ! 🎯`;
    }
    
    return this.getRandomFromArray(STREAK_CONFIG.encouragements.active);
  }
  
  getNextMilestone() {
    const next = STREAK_CONFIG.milestones.find(m => m.days > this.data.current);
    
    if (next) {
      return {
        days: next.days,
        daysLeft: next.days - this.data.current,
        reward: next.reward,
        emoji: next.emoji
      };
    }
    
    return null;
  }
  
  // ===== SYSTÈME NOTIFICATIONS =====
  
  initializeNotifications() {
    // Demander permission notifications
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Permission notifications:', permission);
      });
    }
  }
  
  scheduleReminders() {
    // Annuler anciens rappels
    this.clearReminders();
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Rappel soirée (18h)
    const eveningReminder = new Date(tomorrow);
    eveningReminder.setHours(18, 0, 0, 0);
    
    // Rappel tardif (21h)
    const lateReminder = new Date(tomorrow);
    lateReminder.setHours(21, 0, 0, 0);
    
    this.scheduleNotification(eveningReminder, STREAK_CONFIG.reminders.evening);
    this.scheduleNotification(lateReminder, STREAK_CONFIG.reminders.lateEvening);
  }
  
  scheduleNotification(date, message) {
    const now = new Date();
    const delay = date.getTime() - now.getTime();
    
    if (delay > 0) {
      const timeoutId = setTimeout(() => {
        this.showNotification(message);
      }, delay);
      
      // Sauvegarder pour pouvoir annuler
      this.reminders.timeouts = this.reminders.timeouts || [];
      this.reminders.timeouts.push(timeoutId);
    }
  }
  
  showNotification(message) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Le Monde des Curieux 🦊', {
        body: message,
        icon: '/images/curio-notification.png',
        tag: 'streak-reminder',
        requireInteraction: false
      });
    }
  }
  
  clearReminders() {
    if (this.reminders.timeouts) {
      this.reminders.timeouts.forEach(id => clearTimeout(id));
      this.reminders.timeouts = [];
    }
  }
  
  loadReminders() {
    try {
      const saved = localStorage.getItem(STREAK_CONFIG.storage.reminders);
      return saved ? JSON.parse(saved) : { timeouts: [] };
    } catch (error) {
      return { timeouts: [] };
    }
  }
  
  // ===== UTILITAIRES DATE =====
  
  getTodayString() {
    return new Date().toDateString();
  }
  
  getYesterdayString() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toDateString();
  }
  
  getWeekStartDate() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = dimanche
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Semaine commence lundi
    
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    
    return monday.toDateString();
  }
  
  getDaysSinceDate(dateString) {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }
  
  getRandomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  // ===== API PUBLIQUE =====
  
  getCurrentStreak() {
    return this.data.current;
  }
  
  getLongestStreak() {
    return this.data.longest;
  }
  
  getStreakData() {
    return {
      current: this.data.current,
      longest: this.data.longest,
      total: this.data.total,
      weeklyProgress: this.data.weeklyProgress,
      weeklyGoal: this.data.weeklyGoal,
      weeklyCompletionRate: this.getWeeklyCompletionRate(),
      freezeAvailable: this.data.freezeAvailable,
      nextMilestone: this.getNextMilestone(),
      motivationLevel: this.getMotivationLevel(),
      history: this.data.history
    };
  }
  
  // ===== ANALYTICS ET STATS =====
  
  getAnalytics() {
    return {
      currentStreak: this.data.current,
      longestStreak: this.data.longest,
      totalDaysLearned: this.data.motivation.totalDaysLearned,
      averageWeeklyDays: this.calculateAverageWeeklyDays(),
      streakHistory: this.data.history,
      milestonesBadges: this.data.milestonesBadges,
      freezeUsed: this.data.freezeCount,
      motivationLevel: this.data.motivation.level
    };
  }
  
  calculateAverageWeeklyDays() {
    if (this.data.history.length === 0) return 0;
    
    const totalDays = this.data.history.reduce((sum, streak) => sum + streak.duration, 0);
    const totalWeeks = Math.max(1, Math.floor(totalDays / 7));
    
    return Math.round((totalDays / totalWeeks) * 10) / 10;
  }
  
  // ===== RÉINITIALISATION ET MAINTENANCE =====
  
  resetStreak() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser complètement les streaks ?')) {
      this.handleBrokenStreak(); // Sauvegarder dans historique
      this.data = this.createDefaultData();
      this.saveData();
      console.log('🔄 Streak system réinitialisé');
      return true;
    }
    return false;
  }
  
  exportData() {
    return {
      version: '1.0',
      exported: new Date().toISOString(),
      data: this.data
    };
  }
  
  importData(exportedData) {
    try {
      if (exportedData.version && exportedData.data) {
        this.data = this.migrateData(exportedData.data);
        this.saveData();
        console.log('📥 Données streak importées avec succès');
        return true;
      }
    } catch (error) {
      console.error('Erreur import données streak:', error);
    }
    return false;
  }
}

// ===== EXPORT GLOBAL =====
window.EnglishStreakSystem = EnglishStreakSystem;

// Initialisation automatique
window.englishStreaks = new EnglishStreakSystem();

console.log('🔥 English Streak System loaded successfully');
console.log('📊 Current streak:', window.englishStreaks.getCurrentStreak());