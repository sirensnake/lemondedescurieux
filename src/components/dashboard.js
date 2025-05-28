export function dashboardApp() {
  return {
    // État initial
    userName: localStorage.getItem('lemondedescurieux_userName') || '',
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
      }
    },
    
    init() {
      this.loadProgress();
      this.calculateStats();
    },
    
    get completionPercentage() {
      const total = Object.values(this.subjects).reduce((sum, s) => sum + s.total, 0);
      const completed = Object.values(this.subjects).reduce((sum, s) => sum + s.completed, 0);
      return Math.round((completed / total) * 100);
    },
    
    getCurrentDateMessage() {
      const hour = new Date().getHours();
      if (hour < 12) return 'Bonne matinée d\'apprentissage !';
      if (hour < 18) return 'Bon après-midi d\'apprentissage !';
      return 'Bonne soirée d\'apprentissage !';
    },
    
    formatTime(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
    },
    
    loadProgress() {
      // Charger depuis localStorage
      const saved = this.$storage.get('progress');
      if (saved) {
        Object.assign(this, saved);
      }
    },
    
    calculateStats() {
      // Calculer les statistiques
      Object.values(this.subjects).forEach(subject => {
        if (subject.total > 0) {
          subject.progress = Math.round((subject.completed / subject.total) * 100);
        }
      });
    },
    
    openSubject(key) {
      const subject = this.subjects[key];
      if (subject.unlocked) {
        window.location.href = `/${key}_section.html`;
      } else {
        this.$dispatch('notify', {
          message: 'Cette matière sera bientôt disponible !',
          type: 'warning'
        });
      }
    },
    
    continueLastActivity() {
      // Logique pour continuer la dernière activité
      console.log('Continuer dernière activité');
    },
    
    startDailyChallenge() {
      // Logique pour le défi du jour
      console.log('Défi du jour');
    },
    
    showLeaderboard() {
      // Afficher le classement
      console.log('Classement');
    },
    
    get weeklyProgressData() {
      // Données pour le graphique
      const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
      const data = [20, 35, 40, 25, 50, 30, 45]; // Données de démo
      
      return {
        labels: days,
        datasets: [{
          label: 'Points XP',
          data: data,
          borderColor: '#2a9d8f',
          backgroundColor: 'rgba(42, 157, 143, 0.1)',
          tension: 0.4
        }]
      };
    },
    
    get hasProgress() {
      return this.completionPercentage > 0;
    },
    
    get canContinue() {
      // Vérifier s'il y a une activité à continuer
      return true; // Pour la démo
    }
  };
}