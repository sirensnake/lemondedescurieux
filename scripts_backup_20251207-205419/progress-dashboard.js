// Nouveau fichier: scripts/progress-dashboard.js
class ProgressDashboard {
  constructor() {
    this.progressData = this.loadAllProgress();
    this.initializeDashboard();
  }
  
  loadAllProgress() {
    return {
      userProgress: JSON.parse(localStorage.getItem('userProgress')) || {},
      badges: JSON.parse(localStorage.getItem('userBadges')) || {},
      streaks: JSON.parse(localStorage.getItem('englishStreaks')) || {},
      totalXP: this.calculateTotalXP()
    };
  }
  
  initializeDashboard() {
    this.createProgressChart();
    this.createStreakVisualization();
    this.createBadgeDisplay();
    this.createStatsSummary();
  }
  
  createProgressChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    const subjects = ['Maths', 'Français', 'Anglais', 'Sciences', 'Histoire'];
    const completion = subjects.map(subject => this.getSubjectCompletion(subject));
    
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: subjects,
        datasets: [{
          label: 'Progression par matière',
          data: completion,
          backgroundColor: 'rgba(42, 157, 143, 0.3)',
          borderColor: 'rgba(42, 157, 143, 1)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }
}