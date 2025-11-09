// Composant gestionnaire de streak (série de jours consécutifs)
export function streakManager() {
  return {
    // État
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: null,
    freezeProtection: 0,
    weeklyGoal: 7,
    monthlyCalendar: {},
    
    // Initialisation
    init() {
      this.loadStreakData();
      this.checkStreakStatus();
      this.generateMonthlyCalendar();
      
      // Analytics
      this.$analytics.track('streak_manager_loaded', {
        currentStreak: this.currentStreak,
        hasFreeze: this.freezeProtection > 0
      });
    },
    
    // Charger les données
    loadStreakData() {
      const saved = this.$storage.get('streakData');
      
      if (saved) {
        this.currentStreak = saved.currentStreak || 0;
        this.longestStreak = saved.longestStreak || 0;
        this.lastActivityDate = saved.lastActivityDate ? new Date(saved.lastActivityDate) : null;
        this.freezeProtection = saved.freezeProtection || 0;
        this.monthlyCalendar = saved.monthlyCalendar || {};
      }
    },
    
    // Vérifier le statut du streak
    checkStreakStatus() {
      if (!this.lastActivityDate) return;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastActivity = new Date(this.lastActivityDate);
      lastActivity.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) {
        // Activité aujourd'hui - streak maintenu
        return;
      } else if (daysDiff === 1) {
        // Hier - streak toujours valide si on fait une activité aujourd'hui
        return;
      } else if (daysDiff === 2 && this.freezeProtection > 0) {
        // Protection contre la perte de streak
        this.useFreeze();
      } else if (daysDiff > 1) {
        // Streak perdu
        this.loseStreak();
      }
    },
    
    // Mettre à jour le streak
    updateStreak() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (!this.lastActivityDate) {
        // Première activité
        this.currentStreak = 1;
      } else {
        const lastActivity = new Date(this.lastActivityDate);
        lastActivity.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 0) {
          // Déjà fait aujourd'hui
          return { maintained: true, increased: false };
        } else if (daysDiff === 1) {
          // Jour suivant - augmenter le streak
          this.currentStreak++;
          
          // Nouveau record ?
          if (this.currentStreak > this.longestStreak) {
            this.longestStreak = this.currentStreak;
            this.celebrateNewRecord();
          }
          
          // Milestones
          this.checkMilestones();
          
          return { maintained: true, increased: true };
        } else {
          // Streak était perdu, recommencer
          this.currentStreak = 1;
          return { maintained: false, increased: false };
        }
      }
      
      this.lastActivityDate = today;
      this.markCalendarDay(today);
      this.saveStreakData();
      
      return { maintained: true, increased: true };
    },
    
    // Perdre le streak
    loseStreak() {
      const lostStreak = this.currentStreak;
      this.currentStreak = 0;
      
      this.$dispatch('notify', {
        message: `😢 Tu as perdu ton streak de ${lostStreak} jours !`,
        type: 'warning',
        duration: 5000
      });
      
      // Analytics
      this.$analytics.track('streak_lost', {
        lostStreak: lostStreak,
        hadFreeze: this.freezeProtection > 0
      });
      
      this.saveStreakData();
    },
    
    // Utiliser une protection
    useFreeze() {
      if (this.freezeProtection > 0) {
        this.freezeProtection--;
        
        this.$dispatch('notify', {
          message: `🛡️ Protection utilisée ! Ton streak est sauvé !`,
          type: 'info'
        });
        
        // Analytics
        this.$analytics.track('freeze_used', {
          remainingFreezes: this.freezeProtection,
          currentStreak: this.currentStreak
        });
        
        this.saveStreakData();
      }
    },
    
    // Acheter une protection
    purchaseFreeze() {
      // Simuler l'achat d'une protection
      this.freezeProtection++;
      
      this.$dispatch('notify', {
        message: `🛡️ Protection achetée ! Total : ${this.freezeProtection}`,
        type: 'success'
      });
      
      // Analytics
      this.$analytics.track('freeze_purchased', {
        totalFreezes: this.freezeProtection
      });
      
      this.saveStreakData();
    },
    
    // Vérifier les milestones
    checkMilestones() {
      const milestones = [7, 14, 30, 50, 100, 365];
      
      if (milestones.includes(this.currentStreak)) {
        this.celebrateMilestone(this.currentStreak);
      }
    },
    
    // Célébrer un milestone
    celebrateMilestone(days) {
      const messages = {
        7: 'Une semaine complète !',
        14: 'Deux semaines sans interruption !',
        30: 'Un mois entier !',
        50: '50 jours d\'affilée !',
        100: 'Centenaire ! 100 jours !',
        365: 'Une année complète ! Incroyable !'
      };
      
      this.$dispatch('notify', {
        message: `🎉 ${messages[days]} Streak de ${days} jours !`,
        type: 'success',
        duration: 6000
      });
      
      // Badge spécial
      const badge = `streak_${days}`;
      this.$dispatch('badge-earned', { badge });
      
      // Analytics
      this.$analytics.track('streak_milestone', {
        milestone: days,
        currentStreak: this.currentStreak
      });
    },
    
    // Célébrer un nouveau record
    celebrateNewRecord() {
      this.$dispatch('notify', {
        message: `🏆 Nouveau record personnel ! ${this.currentStreak} jours d'affilée !`,
        type: 'success',
        duration: 5000
      });
      
      // Analytics
      this.$analytics.track('streak_record', {
        newRecord: this.currentStreak,
        previousRecord: this.longestStreak - 1
      });
    },
    
    // Générer le calendrier du mois
    generateMonthlyCalendar() {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      const calendar = [];
      const startPadding = firstDay.getDay() || 7; // Dimanche = 7
      
      // Jours du mois précédent
      for (let i = startPadding - 1; i > 0; i--) {
        calendar.push({
          date: new Date(year, month, 1 - i),
          isCurrentMonth: false,
          hasActivity: false
        });
      }
      
      // Jours du mois actuel
      for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        const dateKey = this.getDateKey(date);
        
        calendar.push({
          date: date,
          isCurrentMonth: true,
          hasActivity: this.monthlyCalendar[dateKey] || false,
          isToday: this.isToday(date),
          isFuture: date > today
        });
      }
      
      // Compléter la dernière semaine
      const remaining = 42 - calendar.length; // 6 semaines * 7 jours
      for (let i = 1; i <= remaining; i++) {
        calendar.push({
          date: new Date(year, month + 1, i),
          isCurrentMonth: false,
          hasActivity: false
        });
      }
      
      return calendar;
    },
    
    // Marquer un jour dans le calendrier
    markCalendarDay(date) {
      const key = this.getDateKey(date);
      this.monthlyCalendar[key] = true;
    },
    
    // Utilitaires
    getDateKey(date) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
    
    isToday(date) {
      const today = new Date();
      return date.toDateString() === today.toDateString();
    },
    
    // Sauvegarder les données
    saveStreakData() {
      const data = {
        currentStreak: this.currentStreak,
        longestStreak: this.longestStreak,
        lastActivityDate: this.lastActivityDate ? this.lastActivityDate.toISOString() : null,
        freezeProtection: this.freezeProtection,
        monthlyCalendar: this.monthlyCalendar,
        lastSave: new Date().toISOString()
      };
      
      this.$storage.set('streakData', data);
    },
    
    // Getters
    get streakBonus() {
      // Bonus XP basé sur le streak
      if (this.currentStreak >= 7) return 1.5;
      if (this.currentStreak >= 3) return 1.2;
      if (this.currentStreak >= 1) return 1.1;
      return 1.0;
    },
    
    get weekProgress() {
      // Progression vers l'objectif hebdomadaire
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      let daysThisWeek = 0;
      const today = new Date();
      
      for (let i = 0; i < 7; i++) {
        const checkDate = new Date(weekStart);
        checkDate.setDate(checkDate.getDate() + i);
        
        if (checkDate <= today) {
          const key = this.getDateKey(checkDate);
          if (this.monthlyCalendar[key]) {
            daysThisWeek++;
          }
        }
      }
      
      return {
        current: daysThisWeek,
        goal: this.weeklyGoal,
        percentage: Math.round((daysThisWeek / this.weeklyGoal) * 100)
      };
    },
    
    get motivationalMessage() {
      if (this.currentStreak === 0) {
        return "Commence ton streak aujourd'hui !";
      } else if (this.currentStreak < 3) {
        return "Continue, tu es sur la bonne voie !";
      } else if (this.currentStreak < 7) {
        return "Presque une semaine complète !";
      } else if (this.currentStreak < 30) {
        return "Tu es en feu ! Continue comme ça !";
      } else if (this.currentStreak < 100) {
        return "Impressionnant ! Tu es un vrai champion !";
      } else {
        return "Légendaire ! Tu es inarrêtable !";
      }
    }
  };
}