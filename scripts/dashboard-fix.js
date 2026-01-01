// =============================================
// DASHBOARD GLOBAL - VERSION AVEC CÉLÉBRATIONS
// =============================================

console.log('📊 Dashboard Global loading with Celebrations...');

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
      badgesCount: badgesObtenus.length,
      studyTime: Math.floor(xp / 10) 
    };
  }

  init() {
    this.renderGlobalStats();
    this.renderDetailedStats();
    this.renderBadges();
    this.checkCelebration(); // Déclenche le feu d'artifice si palier atteint
  }

  renderGlobalStats() {
    // Synchronisation avec les IDs présents dans dashboard_global.html
    const xpEl = document.getElementById('global-xp');
    const badgeEl = document.getElementById('global-badges-count');
    
    if (xpEl) xpEl.textContent = this.data.totalXP;
    if (badgeEl) badgeEl.textContent = this.data.badgesCount;
  }

  renderDetailedStats() {
    const elements = {
      'total-exercises': this.data.totalExercises,
      'success-rate': this.data.successRate + '%'
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
        container.innerHTML = "<p style='font-size:8px; color:#bdc3c7;'>Termine des missions pour gagner des badges !</p>";
    } else {
        container.innerHTML = badgesObtenus.map(emoji => `
            <div style="font-size:25px; background:rgba(255,255,255,0.1); padding:10px; border-radius:50%; border:2px solid #f1c40f;">
                ${emoji}
            </div>
        `).join('');
    }
  }

  // --- LOGIQUE DE CÉLÉBRATION ---

  checkCelebration() {
    const count = this.data.totalExercises;
    
    // On fête toutes les 5 missions
    if (count > 0 && count % 5 === 0) {
      const lastCelebrated = localStorage.getItem('curio_last_celebration') || 0;
      
      // On ne fête que si on n'a pas déjà fêté ce palier précis
      if (parseInt(lastCelebrated) !== count) {
        this.launchFireworks();
        this.showPopup(count);
        localStorage.setItem('curio_last_celebration', count);
      }
    }
  }

  launchFireworks() {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      // Salve Gauche
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#f1c40f', '#2ecc71', '#3498db']
      });
      // Salve Droite
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#f1c40f', '#2ecc71', '#3498db']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }

  showPopup(count) {
    const popup = document.createElement('div');
    popup.className = 'celebration-popup'; // Utilise le style CSS que nous avons créé
    popup.innerHTML = `
      <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #2c3e50; border: 6px solid #f1c40f; padding: 30px; z-index: 200000; text-align: center; box-shadow: 0 0 0 999px rgba(0,0,0,0.8); font-family: 'Press Start 2P', cursive;">
        <h2 style="color: #f1c40f; font-size: 16px; margin-bottom: 20px;">FÉLICITATIONS !</h2>
        <p style="color: white; font-size: 10px; line-height: 1.6;">Tu as accompli ${count} missions !</p>
        <p style="color: #2ecc71; font-size: 10px; margin-top: 15px;">Ton parcours est exemplaire !</p>
        <button onclick="this.parentElement.parentElement.remove()" style="margin-top: 25px; background: #2ecc71; color: white; border: none; border-bottom: 4px solid #27ae60; padding: 10px 20px; font-family: 'Press Start 2P', cursive; font-size: 8px; cursor: pointer;">CONTINUER</button>
      </div>
    `;
    document.body.appendChild(popup);
  }
}

// Lancement automatique
document.addEventListener('DOMContentLoaded', () => {
  window.dashboard = new GlobalDashboard();
});