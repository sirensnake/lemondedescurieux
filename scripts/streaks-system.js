/**
 * STREAK SYSTEM - Le Monde des Curieux
 * Système de streaks quotidiens compatible Duolingo
 * 
 * Fonctionnalités :
 * - Détection activité quotidienne
 * - Calcul streaks consécutifs
 * - Sauvegarde localStorage
 * - Notifications et encouragements
 * - Statistiques avancées
 */

class StreakSystem {
    constructor() {
        this.storageKey = 'lemondedescurieux_streaks';
        this.achievementKey = 'lemondedescurieux_achievements';
        
        // Configuration streaks
        this.config = {
            timeZone: 'Europe/Paris',
            graceHours: 6, // Heures de grâce après minuit
            notificationInterval: 2 * 60 * 60 * 1000, // 2h en millisecondes
            maxNotifications: 3 // Max notifications par jour
        };
        
        // Initialisation
        this.data = this.loadStreakData();
        this.initializeSystem();
    }

    /**
     * Chargement des données de streak depuis localStorage
     */
    loadStreakData() {
        const saved = localStorage.getItem(this.storageKey);
        
        const defaultData = {
            currentStreak: 0,
            longestStreak: 0,
            totalDays: 0,
            lastActivityDate: null,
            lastActivityTime: null,
            todayActivityCount: 0,
            weeklyStats: [],
            monthlyStats: [],
            freezeCount: 0,
            achievements: [],
            notifications: {
                lastSent: null,
                sentToday: 0
            }
        };

        if (saved) {
            const parsed = JSON.parse(saved);
            // Migration de données si nécessaire
            return { ...defaultData, ...parsed };
        }

        return defaultData;
    }

    /**
     * Sauvegarde des données dans localStorage
     */
    saveStreakData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            console.log('💾 Streak data saved successfully');
        } catch (error) {
            console.error('❌ Error saving streak data:', error);
        }
    }

    /**
     * Initialisation du système au chargement de page
     */
    initializeSystem() {
        console.log('🔥 Streak System initialized');
        
        // Vérifier la continuité du streak
        this.checkStreakContinuity();
        
        // Mettre à jour l'affichage
        this.updateStreakDisplay();
        
        // Programmer les notifications
        this.scheduleNotifications();
        
        // Listeners pour l'activité
        this.setupActivityListeners();
    }

    /**
     * Obtention de la date actuelle au format YYYY-MM-DD
     */
    getCurrentDate() {
        const now = new Date();
        const parisTime = new Date(now.toLocaleString("en-US", {timeZone: this.config.timeZone}));
        
        // Si il est avant 6h du matin, considérer comme jour précédent
        if (parisTime.getHours() < this.config.graceHours) {
            parisTime.setDate(parisTime.getDate() - 1);
        }
        
        return parisTime.toISOString().split('T')[0];
    }

    /**
     * Obtention du timestamp actuel
     */
    getCurrentTimestamp() {
        return new Date().toISOString();
    }

    /**
     * Vérification de la continuité du streak
     */
    checkStreakContinuity() {
        const today = this.getCurrentDate();
        const lastActivity = this.data.lastActivityDate;
        
        if (!lastActivity) {
            // Première utilisation
            console.log('🆕 First time user - streak ready to start');
            return;
        }

        const lastDate = new Date(lastActivity);
        const currentDate = new Date(today);
        const daysDiff = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));

        if (daysDiff === 0) {
            // Même jour - streak continue
            console.log('✅ Same day activity - streak continues');
        } else if (daysDiff === 1) {
            // Jour suivant - streak peut continuer si activité
            console.log('⏰ Next day - streak ready to continue');
        } else if (daysDiff > 1) {
            // Streak cassé
            console.log('💔 Streak broken - resetting to 0');
            this.data.currentStreak = 0;
            this.saveStreakData();
            this.showStreakLostNotification(daysDiff);
        }
    }

    /**
     * Enregistrement d'une activité
     */
    recordActivity(activityType = 'general', details = {}) {
        const today = this.getCurrentDate();
        const now = this.getCurrentTimestamp();
        
        // Vérifier si c'est la première activité du jour
        const isFirstActivityToday = this.data.lastActivityDate !== today;
        
        if (isFirstActivityToday) {
            // Nouvelle journée d'activité
            this.handleNewDayActivity(today, now, activityType, details);
        } else {
            // Activité supplémentaire dans la journée
            this.handleSameDayActivity(now, activityType, details);
        }
        
        // Sauvegarder et mettre à jour l'affichage
        this.saveStreakData();
        this.updateStreakDisplay();
        
        // Vérifier les achievements
        this.checkAchievements();
        
        return {
            streak: this.data.currentStreak,
            isNewDay: isFirstActivityToday,
            totalToday: this.data.todayActivityCount
        };
    }

    /**
     * Gestion nouvelle journée d'activité
     */
    handleNewDayActivity(today, now, activityType, details) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (this.data.lastActivityDate === yesterdayStr) {
            // Streak continue
            this.data.currentStreak += 1;
            console.log(`🔥 Streak continued! Day ${this.data.currentStreak}`);
            this.showStreakContinuedNotification();
        } else if (this.data.lastActivityDate === null) {
            // Premier jour
            this.data.currentStreak = 1;
            console.log('🎉 First streak day started!');
            this.showFirstStreakNotification();
        } else {
            // Streak recommence
            this.data.currentStreak = 1;
            console.log('🔄 Streak restarted!');
            this.showStreakRestartNotification();
        }
        
        // Mettre à jour les statistiques
        this.data.lastActivityDate = today;
        this.data.lastActivityTime = now;
        this.data.todayActivityCount = 1;
        this.data.totalDays += 1;
        
        // Record du plus long streak
        if (this.data.currentStreak > this.data.longestStreak) {
            this.data.longestStreak = this.data.currentStreak;
            console.log(`🏆 New longest streak record: ${this.data.longestStreak} days!`);
        }
        
        // Ajouter aux statistiques hebdomadaires
        this.updateWeeklyStats(today, activityType);
    }

    /**
     * Gestion activité supplémentaire même jour
     */
    handleSameDayActivity(now, activityType, details) {
        this.data.lastActivityTime = now;
        this.data.todayActivityCount += 1;
        console.log(`➕ Additional activity today (${this.data.todayActivityCount} total)`);
    }

    /**
     * Mise à jour statistiques hebdomadaires
     */
    updateWeeklyStats(date, activityType) {
        const weekStart = this.getWeekStart(new Date(date));
        
        let weekStats = this.data.weeklyStats.find(w => w.weekStart === weekStart);
        if (!weekStats) {
            weekStats = {
                weekStart: weekStart,
                daysActive: 0,
                totalActivities: 0,
                subjects: {}
            };
            this.data.weeklyStats.push(weekStats);
        }
        
        weekStats.daysActive += 1;
        weekStats.totalActivities += 1;
        
        if (!weekStats.subjects[activityType]) {
            weekStats.subjects[activityType] = 0;
        }
        weekStats.subjects[activityType] += 1;
        
        // Garder seulement les 12 dernières semaines
        this.data.weeklyStats = this.data.weeklyStats
            .sort((a, b) => new Date(b.weekStart) - new Date(a.weekStart))
            .slice(0, 12);
    }

    /**
     * Obtenir le début de semaine (lundi)
     */
    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajuster pour lundi
        return new Date(d.setDate(diff)).toISOString().split('T')[0];
    }

    /**
     * Mise à jour de l'affichage des streaks
     */
    updateStreakDisplay() {
        // Mise à jour tous les éléments streak-counter
        const streakElements = document.querySelectorAll('.streak-counter');
        
        streakElements.forEach(element => {
            this.updateStreakElement(element);
        });
        
        // Mise à jour éléments spéciaux s'ils existent
        this.updateStreakBadges();
        this.updateProgressIndicators();
    }

    /**
     * Mise à jour des indicateurs de progression
     */
    updateProgressIndicators() {
        const progressIndicators = document.querySelectorAll('.progress-indicator, .streak-progress');
        
        progressIndicators.forEach(indicator => {
            const streak = this.data.currentStreak;
            const nextMilestone = this.getNextMilestone(streak);
            
            if (nextMilestone) {
                const progress = (streak / nextMilestone) * 100;
                indicator.style.width = `${Math.min(progress, 100)}%`;
            }
        });
    }

    /**
     * Obtenir le prochain milestone
     */
    getNextMilestone(currentStreak) {
        const milestones = [3, 7, 14, 30, 50, 100];
        return milestones.find(milestone => milestone > currentStreak) || null;
    }

    /**
     * Mise à jour d'un élément streak spécifique
     */
    updateStreakElement(element) {
        const streak = this.data.currentStreak;
        const isPlural = streak > 1;
        
        // Déterminer la langue basée sur l'URL ou contexte
        const lang = window.location.href.includes('english') ? 'en' : 'fr';
        
        let text;
        if (lang === 'en') {
            text = `🔥 ${streak} day${isPlural ? 's' : ''}`;
        } else {
            text = `🔥 ${streak} jour${isPlural ? 's' : ''}`;
        }
        
        element.textContent = text;
        
        // Ajouter des classes CSS pour animations
        if (streak >= 7) {
            element.classList.add('streak-week');
        }
        if (streak >= 30) {
            element.classList.add('streak-month');
        }
        if (streak >= 100) {
            element.classList.add('streak-legendary');
        }
    }

    /**
     * Mise à jour des badges de streak
     */
    updateStreakBadges() {
        const badgeContainer = document.querySelector('.streak-badges');
        if (!badgeContainer) return;
        
        const milestones = [7, 14, 30, 50, 100];
        const streak = this.data.currentStreak;
        
        badgeContainer.innerHTML = '';
        
        milestones.forEach(milestone => {
            const badge = document.createElement('div');
            badge.className = `streak-badge ${streak >= milestone ? 'earned' : 'locked'}`;
            badge.innerHTML = `
                <div class="badge-icon">${this.getStreakMilestoneIcon(milestone)}</div>
                <div class="badge-label">${milestone} jours</div>
            `;
            badgeContainer.appendChild(badge);
        });
    }

    /**
     * Icônes pour milestones de streak
     */
    getStreakMilestoneIcon(milestone) {
        const icons = {
            7: '🔥',
            14: '🌟',
            30: '💎',
            50: '👑',
            100: '🏆'
        };
        return icons[milestone] || '🔥';
    }

    /**
     * Configuration des listeners d'activité
     */
    setupActivityListeners() {
        // Listener pour les clics sur activités
        document.addEventListener('click', (e) => {
            if (e.target.matches('.activity-button, .start-lesson-btn, .activity-card')) {
                this.recordActivity('interaction', {
                    type: 'click',
                    target: e.target.className,
                    timestamp: this.getCurrentTimestamp()
                });
            }
        });
        
        // Listener pour complétion de quiz
        window.addEventListener('quiz-completed', (e) => {
            this.recordActivity('quiz', {
                score: e.detail.score,
                subject: e.detail.subject,
                perfect: e.detail.perfect
            });
        });
        
        // Listener pour navigation entre sections
        window.addEventListener('section-visited', (e) => {
            this.recordActivity('navigation', {
                section: e.detail.section,
                from: e.detail.from
            });
        });
    }

    /**
     * Vérification des achievements liés aux streaks
     */
    checkAchievements() {
        const achievements = [
            {
                id: 'streak_3',
                name: 'Bon Départ',
                description: '3 jours de suite',
                condition: () => this.data.currentStreak >= 3,
                icon: '🔥'
            },
            {
                id: 'streak_7',
                name: 'Une Semaine !',
                description: '7 jours consécutifs',
                condition: () => this.data.currentStreak >= 7,
                icon: '📅'
            },
            {
                id: 'streak_30',
                name: 'Marathonien',
                description: '30 jours de suite',
                condition: () => this.data.currentStreak >= 30,
                icon: '🏃‍♂️'
            },
            {
                id: 'longest_streak',
                name: 'Record Personnel',
                description: 'Nouveau record de streak',
                condition: () => this.data.currentStreak === this.data.longestStreak && this.data.currentStreak > 1,
                icon: '🏆'
            }
        ];
        
        achievements.forEach(achievement => {
            if (achievement.condition() && !this.data.achievements.includes(achievement.id)) {
                this.unlockAchievement(achievement);
            }
        });
    }

    /**
     * Déblocage d'un achievement
     */
    unlockAchievement(achievement) {
        this.data.achievements.push(achievement.id);
        console.log(`🏆 Achievement unlocked: ${achievement.name}`);
        
        // Notification visuelle
        this.showAchievementNotification(achievement);
        
        // Sauvegarder
        this.saveStreakData();
    }

    /**
     * Notifications de streak
     */
    showStreakContinuedNotification() {
        this.showNotification({
            type: 'streak-continued',
            title: '🔥 Streak Continué !',
            message: `${this.data.currentStreak} jours consécutifs !`,
            style: 'success'
        });
    }

    showFirstStreakNotification() {
        this.showNotification({
            type: 'first-streak',
            title: '🎉 Premier Jour !',
            message: 'Ton aventure d\'apprentissage commence !',
            style: 'celebration'
        });
    }

    showStreakRestartNotification() {
        this.showNotification({
            type: 'streak-restart',
            title: '🔄 Nouveau Départ !',
            message: 'C\'est reparti pour un nouveau streak !',
            style: 'info'
        });
    }

    showStreakLostNotification(daysMissed) {
        this.showNotification({
            type: 'streak-lost',
            title: '💔 Streak Perdu',
            message: `${daysMissed} jour${daysMissed > 1 ? 's' : ''} d'absence. Recommençons !`,
            style: 'warning'
        });
    }

    showAchievementNotification(achievement) {
        this.showNotification({
            type: 'achievement',
            title: `🏆 ${achievement.name}`,
            message: achievement.description,
            style: 'achievement',
            icon: achievement.icon
        });
    }

    /**
     * Système de notification unifié
     */
    showNotification({type, title, message, style = 'info', icon = null, duration = 4000}) {
        // Éviter trop de notifications
        if (this.data.notifications.sentToday >= this.config.maxNotifications) {
            return;
        }
        
        const notification = document.createElement('div');
        notification.className = `streak-notification ${style}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-header">
                    ${icon ? `<span class="notification-icon">${icon}</span>` : ''}
                    <span class="notification-title">${title}</span>
                </div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // Styles inline pour assurer l'affichage
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 3px solid #2a9d8f;
            border-radius: 15px;
            padding: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 300px;
            animation: slideInRight 0.5s ease;
        `;
        
        // Fermeture automatique
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.5s ease';
                setTimeout(() => notification.remove(), 500);
            }
        }, duration);
        
        // Fermeture manuelle
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        document.body.appendChild(notification);
        
        // Compter la notification
        this.data.notifications.sentToday += 1;
        this.data.notifications.lastSent = this.getCurrentTimestamp();
    }

    /**
     * Programmation des notifications de rappel
     */
    scheduleNotifications() {
        // Vérifier si on doit envoyer un rappel
        const today = this.getCurrentDate();
        const hasActivityToday = this.data.lastActivityDate === today;
        
        if (!hasActivityToday) {
            const now = new Date();
            const currentHour = now.getHours();
            
            // Envoyer rappel si après 18h et pas d'activité
            if (currentHour >= 18 && this.data.notifications.sentToday === 0) {
                setTimeout(() => {
                    this.showReminderNotification();
                }, 5000); // 5 secondes après chargement
            }
        }
    }

    showReminderNotification() {
        let message;
        
        if (this.data.currentStreak === 0) {
            message = "Prêt pour une nouvelle aventure d'apprentissage ?";
        } else {
            message = `Ne perds pas ton streak de ${this.data.currentStreak} jour${this.data.currentStreak > 1 ? 's' : ''} !`;
        }
        
        this.showNotification({
            type: 'reminder',
            title: '⏰ Petit Rappel',
            message: message,
            style: 'reminder',
            duration: 6000
        });
    }

    /**
     * API publique pour utilisation externe
     */
    getStreakData() {
        return {
            current: this.data.currentStreak,
            longest: this.data.longestStreak,
            total: this.data.totalDays,
            todayCount: this.data.todayActivityCount,
            weeklyStats: this.data.weeklyStats,
            achievements: this.data.achievements
        };
    }

    /**
     * Simulation d'activité (pour tests)
     */
    simulateActivity(daysAgo = 0) {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        const dateStr = date.toISOString().split('T')[0];
        
        this.data.lastActivityDate = dateStr;
        this.data.lastActivityTime = date.toISOString();
        
        if (daysAgo === 0) {
            this.recordActivity('simulation');
        } else {
            this.checkStreakContinuity();
            this.updateStreakDisplay();
        }
    }

    /**
     * Reset du streak (pour tests ou admin)
     */
    resetStreak() {
        this.data.currentStreak = 0;
        this.data.lastActivityDate = null;
        this.data.todayActivityCount = 0;
        this.saveStreakData();
        this.updateStreakDisplay();
        console.log('🔄 Streak reset to 0');
    }

    /**
     * Debug et informations
     */
    debug() {
        console.log('🔥 STREAK SYSTEM DEBUG');
        console.log('Current Date:', this.getCurrentDate());
        console.log('Data:', this.data);
        console.log('Weekly Stats:', this.data.weeklyStats);
        console.log('Achievements:', this.data.achievements);
    }
}

// Initialisation automatique quand le script est chargé
window.addEventListener('DOMContentLoaded', () => {
    // Créer l'instance globale
    window.StreakSystem = new StreakSystem();
    
    // API globale pour debugging
    window.debugStreak = () => window.StreakSystem.debug();
    window.simulateStreak = (days) => window.StreakSystem.simulateActivity(days);
    window.resetStreak = () => window.StreakSystem.resetStreak();
    
    console.log('🔥 Streak System ready! Use debugStreak() for info');
});

// Export pour utilisation en module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StreakSystem;
}