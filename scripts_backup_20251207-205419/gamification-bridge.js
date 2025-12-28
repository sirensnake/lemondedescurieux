/**
 * GAMIFICATION BRIDGE
 * Communication centralisée Streaks + Hearts + XP
 */

class GamificationBridge {
    constructor() {
        this.systems = {
            streaks: window.streakSystem,
            hearts: window.heartSystem,
            xp: window.xpSystem
        };
        
        this.activityLog = this.loadActivityLog();
        this.setupEventListeners();
    }
    
    // ========================================
    // ACTIVITÉ COMPLÉTÉE - Point d'entrée principal
    // ========================================
    
    onActivityComplete(activity) {
        console.log('🎮 Activité complétée:', activity);
        
        const { 
            type,           // 'quiz', 'exercise', 'lesson'
            subject,        // 'francais', 'english', 'maths'
            score,          // 0-100
            timeSpent,      // en secondes
            perfect         // boolean
        } = activity;
        
        // 1. Calculer XP de base
        let baseXP = this.calculateBaseXP(activity);
        
        // 2. Mettre à jour streak
        if (this.systems.streaks) {
            this.systems.streaks.recordActivity();
        }
        
        // 3. Perdre cœur si échec
        if (score < 50 && this.systems.hearts) {
            const hasHearts = this.systems.hearts.loseHeart();
            if (!hasHearts) {
                this.handleNoHeartsLeft();
                return; // Arrêter si plus de cœurs
            }
        }
        
        // 4. Attribution XP avec bonus
        if (this.systems.xp) {
            const context = {
                hasActiveStreak: this.systems.streaks?.streakData.currentStreak > 0,
                perfectScore: perfect || score === 100,
                comboCount: this.getComboCount(),
                fastCompletion: timeSpent < 60
            };
            
            this.systems.xp.awardXP(baseXP, context);
        }
        
        // 5. Logger l'activité
        this.logActivity(activity);
        
        // 6. Vérifier achievements
        this.checkAchievements();
        
        // 7. Broadcast événement global
        window.dispatchEvent(new CustomEvent('gamification-updated', {
            detail: { activity, systems: this.getSystemsState() }
        }));
    }
    
    // ========================================
    // CALCUL XP BASE
    // ========================================
    
    calculateBaseXP(activity) {
        const baseValues = {
            'quiz': 20,
            'exercise': 15,
            'lesson': 10,
            'game': 25
        };
        
        let xp = baseValues[activity.type] || 10;
        
        // Bonus selon score
        if (activity.score >= 90) xp *= 1.5;
        else if (activity.score >= 70) xp *= 1.2;
        
        // Bonus rapidité
        if (activity.timeSpent < 60) xp += 5;
        
        return Math.round(xp);
    }
    
    // ========================================
    // GESTION CŒURS ÉPUISÉS
    // ========================================
    
    handleNoHeartsLeft() {
        console.log('💔 Plus de cœurs disponibles');
        
        // Afficher modal
        const modal = document.createElement('div');
        modal.className = 'no-hearts-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>💔 Plus de cœurs !</h2>
                <p>Tes cœurs se régénèrent automatiquement.</p>
                <p>Prochaine régénération dans : <span id="regen-timer"></span></p>
                <div class="modal-actions">
                    <button onclick="this.closest('.no-hearts-modal').remove()">
                        OK, j'attends
                    </button>
                    <button onclick="window.location.href='index.html'">
                        Retour accueil
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Mettre à jour timer
        this.updateRegenTimer();
    }
    
    updateRegenTimer() {
        const timer = document.getElementById('regen-timer');
        if (!timer || !this.systems.hearts) return;
        
        const regenTime = this.systems.hearts.heartsData.regenStartTime;
        if (!regenTime) return;
        
        const interval = setInterval(() => {
            const now = Date.now();
            const elapsed = now - regenTime;
            const remaining = (30 * 60 * 1000) - elapsed; // 30 min
            
            if (remaining <= 0) {
                timer.textContent = 'Maintenant !';
                clearInterval(interval);
                return;
            }
            
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            timer.textContent = `${minutes}m ${seconds}s`;
        }, 1000);
    }
    
    // ========================================
    // COMBO SYSTÈME
    // ========================================
    
    getComboCount() {
        const now = Date.now();
        const recentWindow = 5 * 60 * 1000; // 5 minutes
        
        const recent = this.activityLog.filter(a => 
            now - a.timestamp < recentWindow
        );
        
        return recent.length;
    }
    
    // ========================================
    // LOGGING ACTIVITÉS
    // ========================================
    
    logActivity(activity) {
        this.activityLog.push({
            ...activity,
            timestamp: Date.now()
        });
        
        // Garder seulement les 50 dernières
        if (this.activityLog.length > 50) {
            this.activityLog = this.activityLog.slice(-50);
        }
        
        localStorage.setItem('recent_activities', JSON.stringify(this.activityLog));
    }
    
    loadActivityLog() {
        return JSON.parse(localStorage.getItem('recent_activities') || '[]');
    }
    
    // ========================================
    // ACHIEVEMENTS
    // ========================================
    
    checkAchievements() {
        const state = this.getSystemsState();
        
        // Exemples d'achievements
        if (state.streak >= 7 && !this.hasAchievement('week_warrior')) {
            this.unlockAchievement('week_warrior', '🔥 Guerrier de la Semaine', 'Maintenir un streak de 7 jours');
        }
        
        if (state.level >= 10 && !this.hasAchievement('level_10')) {
            this.unlockAchievement('level_10', '⭐ Niveau 10', 'Atteindre le niveau 10');
        }
        
        if (this.activityLog.filter(a => a.perfect).length >= 10 && !this.hasAchievement('perfectionist')) {
            this.unlockAchievement('perfectionist', '💯 Perfectionniste', '10 activités parfaites');
        }
    }
    
    hasAchievement(id) {
        const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
        return achievements.includes(id);
    }
    
    unlockAchievement(id, title, description) {
        const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
        achievements.push(id);
        localStorage.setItem('achievements', JSON.stringify(achievements));
        
        // Afficher notification
        this.showAchievementNotification(title, description);
        
        // Bonus XP
        if (this.systems.xp) {
            this.systems.xp.awardXP(50, { achievement: true });
        }
    }
    
    showAchievementNotification(title, description) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <h3>🏆 Achievement Débloqué !</h3>
                <h4>${title}</h4>
                <p>${description}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease-in forwards';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }
    
    // ========================================
    // ÉTAT GLOBAL
    // ========================================
    
    getSystemsState() {
        return {
            streak: this.systems.streaks?.streakData.currentStreak || 0,
            hearts: this.systems.hearts?.heartsData.currentHearts || 5,
            level: this.systems.xp?.data.currentLevel || 1,
            xp: this.systems.xp?.data.currentXP || 0,
            totalActivities: this.activityLog.length,
            perfectCount: this.activityLog.filter(a => a.perfect).length
        };
    }
    
    // ========================================
    // EVENT LISTENERS
    // ========================================
    
    setupEventListeners() {
        // Écouter les boutons "Valider" dans les quiz
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-validate-activity]')) {
                const activityData = JSON.parse(e.target.dataset.validateActivity);
                this.onActivityComplete(activityData);
            }
        });
    }
}

// Initialisation automatique
window.addEventListener('load', () => {
    setTimeout(() => {
        if (window.streakSystem || window.heartSystem || window.xpSystem) {
            window.gamificationBridge = new GamificationBridge();
            console.log('✅ GamificationBridge initialisé');
        }
    }, 1000);
});