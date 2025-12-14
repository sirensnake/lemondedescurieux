// =============================================
// DASHBOARD GLOBAL - COLLECTE & AFFICHAGE
// Agrège toutes les données de progression
// =============================================

console.log('📊 Dashboard Global loading...');

// Définition des sections
const SECTIONS = {
  francais: {
    id: 'francais',
    name: 'Français',
    icon: '📚',
    color: '#10b981',
    totalExercises: 19,
    url: 'francais_duolingo_section.html'
  },
  maths: {
    id: 'maths',
    name: 'Mathématiques',
    icon: '🔢',
    color: '#8b5cf6',
    totalExercises: 17,
    url: 'maths_duolingo_section.html'
  },
  english: {
    id: 'english',
    name: 'Anglais',
    icon: '🇬🇧',
    color: '#3b82f6',
    totalExercises: 20,
    url: 'english_duolingo_section.html'
  },
  histoire: {
    id: 'histoire',
    name: 'Histoire',
    icon: '🏛️',
    color: '#f59e0b',
    totalExercises: 16,
    url: 'histoire_duolingo_section.html'
  },
  sciences: {
    id: 'sciences',
    name: 'Sciences',
    icon: '🔬',
    color: '#10b981',
    totalExercises: 16,
    url: 'sciences_duolingo_section.html'
  },
  programmation: {
    id: 'programmation',
    name: 'Programmation',
    icon: '💻',
    color: '#8b5cf6',
    totalExercises: 16,
    url: 'programmation_duolingo_section.html'
  }
};

// Badges disponibles
const BADGES = [
  { id: 'first_steps', icon: '🎯', name: 'Premiers Pas', condition: (data) => data.totalExercises >= 1 },
  { id: 'explorer', icon: '🗺️', name: 'Explorateur', condition: (data) => data.sectionsStarted >= 3 },
  { id: 'polyglot', icon: '🌍', name: 'Polyglotte', condition: (data) => data.sections.english?.completed >= 10 },
  { id: 'mathematician', icon: '🧮', name: 'Mathématicien', condition: (data) => data.sections.maths?.completed >= 10 },
  { id: 'writer', icon: '✍️', name: 'Écrivain', condition: (data) => data.sections.francais?.completed >= 10 },
  { id: 'scientist', icon: '🔬', name: 'Scientifique', condition: (data) => data.sections.sciences?.completed >= 10 },
  { id: 'coder', icon: '💻', name: 'Codeur', condition: (data) => data.sections.programmation?.completed >= 5 },
  { id: 'historian', icon: '📜', name: 'Historien', condition: (data) => data.sections.histoire?.completed >= 10 },
  { id: 'streak_3', icon: '🔥', name: 'Série 3 jours', condition: (data) => data.streak >= 3 },
  { id: 'streak_7', icon: '🔥🔥', name: 'Série 7 jours', condition: (data) => data.streak >= 7 },
  { id: 'streak_30', icon: '🔥🔥🔥', name: 'Série 30 jours', condition: (data) => data.streak >= 30 },
  { id: 'perfectionist', icon: '⭐', name: 'Perfectionniste', condition: (data) => data.successRate >= 90 }
];

class GlobalDashboard {
  constructor() {
    console.log('📊 Constructor GlobalDashboard');
    this.data = this.collectAllData();
    this.init();
  }

  collectAllData() {
    console.log('🔍 Collecting data from localStorage...');
    
    const data = {
      streak: 0,
      totalXP: 0,
      hearts: 5,
      totalExercises: 0,
      totalCompleted: 0,
      sectionsStarted: 0,
      sections: {},
      lastActivity: null,
      successRate: 0
    };

    // Collecter données par section
    Object.values(SECTIONS).forEach(section => {
      const sectionData = {
        completed: 0,
        total: section.totalExercises,
        xp: 0,
        lastAccess: null
      };

      // Essayer de charger données spécifiques
      const stored = localStorage.getItem(`${section.id}_progress`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          sectionData.completed = parsed.completed || 0;
          sectionData.xp = parsed.xp || 0;
          sectionData.lastAccess = parsed.lastAccess || null;
          
          if (sectionData.completed > 0) {
            data.sectionsStarted++;
          }
        } catch (e) {
          console.warn(`⚠️ Error parsing ${section.id}_progress:`, e);
        }
      }

      data.sections[section.id] = sectionData;
      data.totalCompleted += sectionData.completed;
      data.totalXP += sectionData.xp;
    });

    // Calculer total d'exercices
    data.totalExercises = Object.values(SECTIONS).reduce((sum, s) => sum + s.totalExercises, 0);

    // Calculer taux de réussite
    if (data.totalCompleted > 0) {
      data.successRate = Math.round((data.totalCompleted / data.totalExercises) * 100);
    }

    // Streak (simulé pour démo)
    const streakData = localStorage.getItem('global_streak');
    if (streakData) {
      try {
        data.streak = JSON.parse(streakData).currentStreak || 0;
      } catch (e) {
        data.streak = 0;
      }
    }

    console.log('✅ Data collected:', data);
    return data;
  }

  init() {
    this.renderGlobalStats();
    this.renderRadarChart();
    this.renderSectionsCards();
    this.renderRecentActivity();
    this.renderBadges();
    this.renderDailyGoals();
    this.renderDetailedStats();
  }

  renderGlobalStats() {
    document.getElementById('global-streak').textContent = this.data.streak;
    document.getElementById('global-xp').textContent = this.data.totalXP;
    document.getElementById('global-hearts').textContent = this.data.hearts;
    
    // Calculer badges obtenus
    const earnedBadges = BADGES.filter(badge => badge.condition(this.data));
    document.getElementById('global-badges').textContent = earnedBadges.length;
  }

  renderRadarChart() {
    const canvas = document.getElementById('radar-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(centerX, centerY) - 60;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sections à afficher
    const sections = Object.values(SECTIONS);
    const angles = sections.map((_, i) => (i * 2 * Math.PI) / sections.length - Math.PI / 2);

    // Dessiner grilles concentriques
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      const radius = (maxRadius * i) / 5;
      angles.forEach((angle, index) => {
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.closePath();
      ctx.stroke();
    }

    // Dessiner axes
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    angles.forEach(angle => {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + maxRadius * Math.cos(angle),
        centerY + maxRadius * Math.sin(angle)
      );
      ctx.stroke();
    });

    // Calculer progression par section
    const progressions = sections.map(section => {
      const sectionData = this.data.sections[section.id];
      return sectionData.completed / section.totalExercises;
    });

    // Dessiner progression
    ctx.fillStyle = 'rgba(102, 126, 234, 0.3)';
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    angles.forEach((angle, index) => {
      const radius = maxRadius * progressions[index];
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Points de données
    ctx.fillStyle = '#667eea';
    angles.forEach((angle, index) => {
      const radius = maxRadius * progressions[index];
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Labels
    ctx.fillStyle = '#1e293b';
    ctx.font = '10px "Press Start 2P"';
    ctx.textAlign = 'center';
    sections.forEach((section, index) => {
      const angle = angles[index];
      const labelRadius = maxRadius + 30;
      const x = centerX + labelRadius * Math.cos(angle);
      const y = centerY + labelRadius * Math.sin(angle);
      
      // Icon + nom
      ctx.fillText(section.icon, x, y - 10);
      ctx.font = '8px "Press Start 2P"';
      ctx.fillText(section.name, x, y + 10);
      ctx.font = '10px "Press Start 2P"';
      
      // Pourcentage
      const percent = Math.round(progressions[index] * 100);
      ctx.fillStyle = section.color;
      ctx.fillText(percent + '%', x, y + 25);
      ctx.fillStyle = '#1e293b';
    });
  }

  renderSectionsCards() {
    const container = document.getElementById('sections-cards');
    if (!container) return;

    container.innerHTML = '';

    Object.values(SECTIONS).forEach(section => {
      const sectionData = this.data.sections[section.id];
      const progress = Math.round((sectionData.completed / section.totalExercises) * 100);

      const card = document.createElement('div');
      card.className = 'section-card';
      card.style.borderColor = section.color;
      card.onclick = () => window.location.href = section.url;

      card.innerHTML = `
        <div class="section-header">
          <div class="section-icon">${section.icon}</div>
          <div class="section-progress">${progress}%</div>
        </div>
        <div class="section-title">${section.name}</div>
        <div class="section-stats">
          ${sectionData.completed}/${section.totalExercises} exercices • ${sectionData.xp} XP
        </div>
        <div class="section-progress-bar">
          <div class="section-progress-fill" style="width: ${progress}%; background: ${section.color};"></div>
        </div>
      `;

      container.appendChild(card);
    });
  }

  renderRecentActivity() {
    const container = document.getElementById('activity-timeline');
    if (!container) return;

    // Activités simulées pour démo
    const activities = [
      { icon: '📚', title: 'Leçon de Français complétée', time: 'Il y a 2 heures' },
      { icon: '🔢', title: 'Quiz de Mathématiques réussi', time: 'Hier à 15h30' },
      { icon: '🇬🇧', title: '10 nouveaux mots d\'Anglais', time: 'Hier à 10h00' },
      { icon: '🏆', title: 'Badge "Explorateur" obtenu !', time: 'Il y a 2 jours' },
      { icon: '🔥', title: 'Série de 3 jours maintenue', time: 'Il y a 3 jours' }
    ];

    container.innerHTML = activities.map(activity => `
      <div class="activity-item">
        <div class="activity-icon">${activity.icon}</div>
        <div class="activity-content">
          <div class="activity-title">${activity.title}</div>
          <div class="activity-time">${activity.time}</div>
        </div>
      </div>
    `).join('');
  }

  renderBadges() {
    const container = document.getElementById('badges-grid');
    if (!container) return;

    container.innerHTML = BADGES.map(badge => {
      const earned = badge.condition(this.data);
      return `
        <div class="badge-item ${earned ? '' : 'badge-locked'}">
          <div class="badge-icon">${badge.icon}</div>
          <div class="badge-name">${badge.name}</div>
        </div>
      `;
    }).join('');
  }

  renderDailyGoals() {
    const container = document.getElementById('goals-list');
    if (!container) return;

    const goals = [
      { text: 'Compléter 1 leçon', reward: '+10 XP', completed: this.data.totalCompleted > 0 },
      { text: 'Maintenir ton streak', reward: '+5 XP', completed: this.data.streak > 0 },
      { text: 'Essayer 2 matières différentes', reward: '+15 XP', completed: this.data.sectionsStarted >= 2 },
      { text: 'Obtenir 100% sur un exercice', reward: '+20 XP', completed: false }
    ];

    container.innerHTML = goals.map(goal => `
      <div class="goal-item">
        <div class="goal-checkbox ${goal.completed ? 'completed' : ''}"></div>
        <div class="goal-text">${goal.text}</div>
        <div class="goal-reward">${goal.reward}</div>
      </div>
    `).join('');
  }

  renderDetailedStats() {
    document.getElementById('total-exercises').textContent = this.data.totalCompleted;
    document.getElementById('success-rate').textContent = this.data.successRate + '%';
    
    // Temps d'étude simulé
    const studyHours = Math.round(this.data.totalCompleted * 0.25); // 15min par exercice
    document.getElementById('study-time').textContent = studyHours + 'h';
    
    // Taux de complétion global
    const completionRate = Math.round((this.data.totalCompleted / this.data.totalExercises) * 100);
    document.getElementById('completion-rate').textContent = completionRate + '%';
  }

  exportProgress() {
    alert('📄 Fonctionnalité d\'export PDF en cours de développement !\n\nTon parcours sera bientôt exportable pour le partager avec tes parents ou enseignants.');
  }

  resetProgress() {
    if (confirm('⚠️ Es-tu sûr de vouloir réinitialiser toute ta progression ?\n\nCette action est irréversible !')) {
      // Supprimer toutes les données localStorage
      Object.keys(SECTIONS).forEach(key => {
        localStorage.removeItem(`${key}_progress`);
      });
      localStorage.removeItem('global_streak');
      
      alert('🔄 Progression réinitialisée !');
      location.reload();
    }
  }
}

console.log('✅ GlobalDashboard loaded');
const dashboard = new GlobalDashboard();
