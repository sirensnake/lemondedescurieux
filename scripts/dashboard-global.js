// =============================================
// DASHBOARD GLOBAL - VERSION CORRIGÉE
// =============================================

console.log('📊 Dashboard Global loading...');

const SECTIONS = {
  francais: { id: 'francais', name: 'Français', icon: '📚', color: '#10b981', totalExercises: 19, url: '#' },
  maths: { id: 'maths', name: 'Mathématiques', icon: '🔢', color: '#8b5cf6', totalExercises: 17, url: '#' },
  english: { id: 'english', name: 'Anglais', icon: '🇬🇧', color: '#3b82f6', totalExercises: 20, url: '#' },
  histoire: { id: 'histoire', name: 'Histoire', icon: '🏛️', color: '#f59e0b', totalExercises: 16, url: '#' },
  sciences: { id: 'sciences', name: 'Sciences', icon: '🔬', color: '#10b981', totalExercises: 16, url: '#' },
  programmation: { id: 'programmation', name: 'Programmation', icon: '💻', color: '#8b5cf6', totalExercises: 16, url: '#' }
};

const BADGES_CONFIG = [
  { id: 'first_steps', icon: '🎯', name: 'Premiers Pas', condition: (data) => data.totalXP >= 50 },
  { id: 'explorer', icon: '🗺️', name: 'Explorateur', condition: (data) => data.sectionsStarted >= 2 },
  { id: 'master', icon: '💎', name: 'Maître', condition: (data) => data.totalXP >= 500 }
];

class GlobalDashboard {
  constructor() {
    this.data = this.collectAllData();
    this.init();
  }

  collectAllData() {
    const xp = parseInt(localStorage.getItem('curio_xp')) || 0;
    const missions = JSON.parse(localStorage.getItem('curio_missions_completed')) || [];
    const badgesObtenus = JSON.parse(localStorage.getItem('curio_badges')) || [];
    
    return {
      streak: parseInt(localStorage.getItem('curio_streak')) || 0,
      totalXP: xp,
      hearts: 5,
      totalExercises: missions.length,
      successRate: missions.length > 0 ? 100 : 0,
      sectionsStarted: missions.length, // Approximation
      badgesCount: badgesObtenus.length,
      studyTime: Math.floor(xp / 10) // Simulation temps étude
    };
  }

  init() {
    this.renderGlobalStats();
    this.renderDetailedStats();
    this.renderBadges();
  }

  renderGlobalStats() {
    if(document.getElementById('global-streak')) document.getElementById('global-streak').textContent = this.data.streak;
    if(document.getElementById('global-xp')) document.getElementById('global-xp').textContent = this.data.totalXP;
    if(document.getElementById('global-hearts')) document.getElementById('global-hearts').textContent = this.data.hearts;
    if(document.getElementById('global-badges')) document.getElementById('global-badges').textContent = this.data.badgesCount;
  }

  renderDetailedStats() {
    const elements = {
      'total-exercises': this.data.totalExercises,
      'success-rate': this.data.successRate + '%',
      'study-time': this.data.studyTime + ' min',
      'completion-rate': Math.min(100, Math.round((this.data.totalXP / 1000) * 100)) + '%'
    };

    for (const [id, value] of Object.entries(elements)) {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    }
  }

  renderBadges() {
    const container = document.getElementById('badges-grid');
    if (!container) return;
    
    const badgesObtenus = JSON.parse(localStorage.getItem('curio_badges')) || [];
    
    if (badgesObtenus.length === 0) {
        container.innerHTML = "<p>Termine des missions pour gagner des badges !</p>";
    } else {
        container.innerHTML = badgesObtenus.map(emoji => `
            <div class="badge-item">
                <div class="badge-icon" style="font-size:3em;">${emoji}</div>
            </div>
        `).join('');
    }
  }

  exportProgress() {
    window.print();
  }

  resetProgress() {
    if (confirm('⚠️ Réinitialiser toute la progression ?')) {
      localStorage.clear();
      location.reload();
    }
  }
}

// Lancement
document.addEventListener('DOMContentLoaded', () => {
  window.dashboard = new GlobalDashboard();
});

