// Composant principal Dashboard Alpine.js
export function dashboardApp() {
  return {
    // État initial
    userName: '',
    level: 1,
    totalTime: 0,
    badges: [],
    subjects: {
      maths: {
        name: 'Mathématiques',
        icon: '🔢',
        color: '#2a9d8f',
        progress: 0,
        completed: 0,
        total: 15,
        unlocked: true
      },
      francais: {
        name: 'Français',
        icon: '📝',
        color: '#e9c46a',
        progress: 0,
        completed: 0,
        total: 12,
        unlocked: true
      },
      anglais: {
        name: 'Anglais',
        icon: '🇬🇧',
        color: '#e76f51',
        progress: 0,
        completed: 0,
        total: 18,
        unlocked: true
      },
      sciences: {
        name: 'Sciences',
        icon: '🔬',
        color: '#06d6a0',
        progress: 0,
        completed: 0,
        total: 10,
        unlocked: false
      },
      histoire: {
        name: 'Histoire',
        icon: '🏛️',
        color: '#ffd166',
        progress: 0,
        completed: 0,
        total: 8,
        unlocked: false
      },
      programmation: {
        name: 'Programmation',
        icon: '💻',
        color: '#f25c54',
        progress: 0,
        completed: 0,
        total: 12,
        unlocked: false
      }
    },
    
    // Initialisation
    init() {
      this.loadProgress();
      this.calculateStats();
      this.checkUnlocks();
      
      // Analytics
      this.$analytics.track('dashboard_loaded', {
        level: this.level,
        totalProgress: this.completionPercentage
      });
    },
    
    // Getters calculés
    get completionPercentage() {
      const total = Object.values(this.subjects).reduce((sum, s) => sum + s.total, 0);
      const completed = Object.values(this.subjects).reduce((sum, s) => sum + s.completed, 0);
      return total > 0 ? Math.round((completed / total) * 100) : 0;
    },
    
    get nextLevelXP() {
      return Math.pow(this.level, 2) * 100;
    },
    
    get currentXP() {
      return Object.values(this.subjects).reduce((sum, s) => sum + (s.completed * 10), 0);
    },
    
    get xpProgress() {
      const prevLevel = Math.pow(this.level - 1, 2) * 100;
      const progress = ((this.currentXP - prevLevel) / (this.nextLevelXP - prevLevel)) * 100;
      return Math.max(0, Math.min(100, progress));
    },
    
    // Méthodes
    getCurrentDateMessage() {
      const hour = new Date().getHours();
      const messages = {
        morning: [
          'Bonne matinée d\'apprentissage !',
          'Prêt pour une nouvelle aventure ?',
          'Le savoir t\'attend !'
        ],
        afternoon: [
          'Bon après-midi d\'apprentissage !',
          'Continue sur ta lancée !',
          'Tu progresses bien !'
        ],
        evening: [
          'Bonne soirée d\'apprentissage !',
          'Dernière ligne droite !',
          'Termine en beauté !'
        ]
      };
      
      let timeOfDay;
      if (hour < 12) timeOfDay = 'morning';
      else if (hour < 18) timeOfDay = 'afternoon';
      else timeOfDay = 'evening';
      
      const messageArray = messages[timeOfDay];
      return messageArray[Math.floor(Math.random() * messageArray.length)];
    },
    
    formatTime(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
    },
    
    loadProgress() {
      // Charger depuis localStorage
      const saved = this.$storage.get('userProgress');
      if (saved) {
        this.userName = saved.userName || '';
        this.level = saved.level || 1;
        this.totalTime = saved.totalTime || 0;
        this.badges = saved.badges || [];
        
        // Mise à jour des matières
        if (saved.subjects) {
          Object.keys(saved.subjects).forEach(key => {
            if (this.subjects[key]) {
              Object.assign(this.subjects[key], saved.subjects[key]);
            }
          });
        }
      }
    },
    
    saveProgress() {
      const data = {
        userName: this.userName,
        level: this.level,
        totalTime: this.totalTime,
        badges: this.badges,
        subjects: this.subjects,
        lastSave: new Date().toISOString()
      };
      
      this.$storage.set('userProgress', data);
    },
    
    calculateStats() {
      // Calculer les statistiques pour chaque matière
      Object.values(this.subjects).forEach(subject => {
        if (subject.total > 0) {
          subject.progress = Math.round((subject.completed / subject.total) * 100);
        }
      });
      
      // Mettre à jour le niveau
      const xp = this.currentXP;
      let newLevel = 1;
      while (Math.pow(newLevel, 2) * 100 <= xp) {
        newLevel++;
      }
      
      if (newLevel > this.level) {
        this.levelUp(newLevel);
      }
      
      this.level = newLevel;
    },
    
    checkUnlocks() {
      // Débloquer les matières selon la progression
      const totalCompleted = Object.values(this.subjects)
        .filter(s => s.unlocked)
        .reduce((sum, s) => sum + s.completed, 0);
      
      // Sciences : débloquer après 10 activités
      if (totalCompleted >= 10 && !this.subjects.sciences.unlocked) {
        this.unlockSubject('sciences');
      }
      
      // Histoire : débloquer après 20 activités
      if (totalCompleted >= 20 && !this.subjects.histoire.unlocked) {
        this.unlockSubject('histoire');
      }
      
      // Programmation : débloquer après 30 activités
      if (totalCompleted >= 30 && !this.subjects.programmation.unlocked) {
        this.unlockSubject('programmation');
      }
    },
    
    unlockSubject(key) {
      this.subjects[key].unlocked = true;
      
      // Notification
      this.$dispatch('notify', {
        message: `🎉 Nouvelle matière débloquée : ${this.subjects[key].name} !`,
        type: 'success',
        duration: 5000
      });
      
      // Badge
      const badgeName = `unlock_${key}`;
      if (!this.badges.includes(badgeName)) {
        this.badges.push(badgeName);
      }
      
      // Analytics
      this.$analytics.track('subject_unlocked', {
        subject: key,
        totalUnlocked: Object.values(this.subjects).filter(s => s.unlocked).length
      });
      
      this.saveProgress();
    },
    
    levelUp(newLevel) {
      // Animation et notification de niveau
      this.$dispatch('notify', {
        message: `🎊 Félicitations ! Tu es maintenant niveau ${newLevel} !`,
        type: 'success',
        duration: 5000
      });
      
      // Badge de niveau
      const levelBadge = `level_${newLevel}`;
      if (!this.badges.includes(levelBadge)) {
        this.badges.push(levelBadge);
      }
      
      // Analytics
      this.$analytics.track('level_up', {
        oldLevel: this.level,
        newLevel: newLevel,
        totalXP: this.currentXP
      });
    },
    
    openSubject(key) {
      const subject = this.subjects[key];
      
      if (!subject.unlocked) {
        this.$dispatch('notify', {
          message: `🔒 Cette matière sera débloquée plus tard !`,
          type: 'warning'
        });
        return;
      }
      
      // Navigation vers la section
      const sectionMap = {
        maths: 'maths_section.html',
        francais: 'francais_section.html',
        anglais: 'english_section.html',
        sciences: 'sciences_section.html',
        histoire: 'histoire_section.html',
        programmation: 'programmation_section.html'
      };
      
      const url = sectionMap[key];
      if (url) {
        // Sauvegarder avant de naviguer
        this.saveProgress();
        window.location.href = url;
      }
    },
    
    continueLastActivity() {
      // Trouver la dernière activité
      const lastActivity = this.$storage.get('lastActivity');
      
      if (lastActivity) {
        window.location.href = lastActivity.url;
      } else {
        this.$dispatch('notify', {
          message: 'Commence par choisir une matière !',
          type: 'info'
        });
      }
    },
    
    startDailyChallenge() {
      // Créer un défi aléatoire
      const subjects = Object.entries(this.subjects)
        .filter(([_, s]) => s.unlocked)
        .map(([key, _]) => key);
      
      const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
      
      this.$dispatch('notify', {
        message: `🎯 Défi du jour : ${this.subjects[randomSubject].name} !`,
        type: 'info'
      });
      
      // Rediriger vers une activité aléatoire de cette matière
      setTimeout(() => {
        this.openSubject(randomSubject);
      }, 1500);
    },
    
    showLeaderboard() {
      // Afficher le classement (simulé pour l'instant)
      const leaderboard = [
        { name: this.userName || 'Toi', xp: this.currentXP, rank: 1 },
        { name: 'Emma', xp: 850, rank: 2 },
        { name: 'Lucas', xp: 720, rank: 3 },
        { name: 'Léa', xp: 650, rank: 4 },
        { name: 'Nathan', xp: 580, rank: 5 }
      ];
      
      // Trier par XP
      leaderboard.sort((a, b) => b.xp - a.xp);
      
      // Mettre à jour les rangs
      leaderboard.forEach((player, index) => {
        player.rank = index + 1;
      });
      
      // Créer le contenu HTML
      const content = `
        <div class="leaderboard">
          <h4>🏆 Classement de la semaine</h4>
          <div class="leaderboard-list">
            ${leaderboard.map(player => `
              <div class="leaderboard-item ${player.name === (this.userName || 'Toi') ? 'current-user' : ''}">
                <span class="rank">#${player.rank}</span>
                <span class="name">${player.name}</span>
                <span class="xp">${player.xp} XP</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      
      // Afficher dans le modal
      Alpine.store('modal').showModal('Classement', content);
    },
    
    // Données pour le graphique
    get weeklyProgressData() {
      // Récupérer les données de la semaine
      const weekData = this.$storage.get('weeklyProgress') || {};
      const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
      const today = new Date().getDay();
      const adjustedToday = today === 0 ? 6 : today - 1; // Dimanche = 6
      
      // Créer les données avec des valeurs par défaut
      const data = days.map((day, index) => {
        if (index <= adjustedToday) {
          return weekData[day] || 0;
        }
        return 0;
      });
      
      return {
        labels: days,
        datasets: [{
          label: 'Points XP',
          data: data,
          borderColor: '#2a9d8f',
          backgroundColor: 'rgba(42, 157, 143, 0.1)',
          tension: 0.4,
          fill: true
        }]
      };
    },
    
    get hasProgress() {
      return this.completionPercentage > 0;
    },
    
    get canContinue() {
      return this.$storage.get('lastActivity') !== null;
    }
  };
}