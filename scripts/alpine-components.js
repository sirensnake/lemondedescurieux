/**
 * ===============================================
 * COMPOSANTS ALPINE.JS MODULAIRES - PHASE 3
 * Le Monde des Curieux - Interface réactive
 * ===============================================
 */

// Configuration globale Alpine.js
window.AlpineConfig = {
    version: '3.0.0',
    debug: false,
    analytics: {
        enabled: true,
        endpoint: null, // Local storage seulement en Phase 3
        batchSize: 50
    },
    storage: {
        prefix: 'lemondedescurieux_',
        version: 'v3.0'
    },
    heart: {
        maxHearts: 5,
        recoveryTimeMinutes: 30,
        bonusEarnRate: 0.1 // 10% chance de bonus par activité parfaite
    },
    streak: {
        notificationHours: [9, 18], // Rappels à 9h et 18h
        weeklyGoal: 7
    }
};

/**
 * ===============================================
 * COMPOSANT DASHBOARD PRINCIPAL
 * ===============================================
 */
function dashboardApp() {
    return {
        // État réactif principal
        progressData: Alpine.reactive({
            totalActivities: 0,
            completedActivities: 0,
            currentStreak: 0,
            longestStreak: 0,
            totalTime: 0,
            avgSessionTime: 0,
            averageScore: 0,
            badges: [],
            level: 1,
            experiencePoints: 0,
            weeklyGoal: 5,
            lastActivity: null
        }),
        
        subjects: Alpine.reactive({
            mathematiques: {
                name: 'Mathématiques',
                icon: '🔢',
                progress: 0,
                completed: 0,
                total: 15,
                lastActivity: null,
                averageScore: 0,
                timeSpent: 0,
                streak: 0,
                difficulty: 'medium'
            },
            francais: {
                name: 'Français', 
                icon: '📝',
                progress: 0,
                completed: 0,
                total: 12,
                lastActivity: null,
                averageScore: 0,
                timeSpent: 0,
                streak: 0,
                difficulty: 'medium'
            },
            sciences: {
                name: 'Sciences',
                icon: '🔬',
                progress: 0,
                completed: 0,
                total: 10,
                lastActivity: null,
                averageScore: 0,
                timeSpent: 0,
                streak: 0,
                difficulty: 'easy'
            },
            anglais: {
                name: 'Anglais',
                icon: '🇬🇧',
                progress: 0,
                completed: 0,
                total: 18,
                lastActivity: null,
                averageScore: 0,
                timeSpent: 0,
                streak: 0,
                difficulty: 'hard'
            }
        }),
        
        // Configuration locale
        config: Alpine.reactive({
            theme: 'light',
            notifications: true,
            sound: true,
            language: 'fr',
            accessibility: false
        }),
        
        // État interface
        ui: Alpine.reactive({
            loading: false,
            modalOpen: false,
            currentModal: null,
            notifications: [],
            lastUpdate: null
        }),
        
        /**
         * Initialisation du composant
         */
        init() {
            console.log('🚀 Initialisation Dashboard Alpine.js Phase 3');
            
            // Chargement des données
            this.loadAllData();
            
            // Configuration analytics
            this.setupAnalytics();
            
            // Configuration événements
            this.setupEventListeners();
            
            // Mise à jour périodique
            this.startPeriodicUpdates();
            
            // Animations d'entrée
            this.triggerEntranceAnimations();
            
            // Premier tracking
            this.trackEvent('dashboard_initialized', {
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                screenResolution: `${screen.width}x${screen.height}`
            });
            
            console.log('✅ Dashboard initialisé avec succès');
        },
        
        /**
         * Chargement de toutes les données
         */
        loadAllData() {
            this.loadProgressData();
            this.loadSubjectsData();
            this.loadConfigData();
            this.calculateAllStats();
        },
        
        /**
         * Chargement données de progression
         */
        loadProgressData() {
            const stored = this.getStorageItem('progressData');
            if (stored) {
                Object.assign(this.progressData, stored);
            } else {
                // Données de démonstration pour nouveaux utilisateurs
                this.loadDemoProgressData();
            }
        },
        
        /**
         * Chargement données de démonstration
         */
        loadDemoProgressData() {
            Object.assign(this.progressData, {
                totalActivities: 55,
                completedActivities: 38,
                currentStreak: 12,
                longestStreak: 15,
                totalTime: 4800, // 80 minutes
                avgSessionTime: 18 * 60, // 18 minutes
                averageScore: 84.5,
                badges: ['premier_pas', 'semaine_complete', 'mathematicien', 'explorateur', 'perseverant'],
                level: 3,
                experiencePoints: 1247,
                weeklyGoal: 7,
                lastActivity: new Date().toISOString()
            });
            
            // Données démo pour les matières
            Object.assign(this.subjects.mathematiques, {
                progress: 87,
                completed: 13,
                averageScore: 92,
                timeSpent: 1800,
                streak: 5,
                lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
            });
            
            Object.assign(this.subjects.francais, {
                progress: 75,
                completed: 9,
                averageScore: 88,
                timeSpent: 1200,
                streak: 3,
                lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            });
            
            Object.assign(this.subjects.sciences, {
                progress: 60,
                completed: 6,
                averageScore: 78,
                timeSpent: 900,
                streak: 2,
                lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            });
            
            Object.assign(this.subjects.anglais, {
                progress: 50,
                completed: 9,
                averageScore: 82,
                timeSpent: 1500,
                streak: 4,
                lastActivity: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
            });
        },
        
        /**
         * Chargement données matières
         */
        loadSubjectsData() {
            const stored = this.getStorageItem('subjectsData');
            if (stored) {
                Object.assign(this.subjects, stored);
            }
            this.updateSubjectsProgress();
        },
        
        /**
         * Chargement configuration
         */
        loadConfigData() {
            const stored = this.getStorageItem('configData');
            if (stored) {
                Object.assign(this.config, stored);
            }
        },
        
        /**
         * Calcul de toutes les statistiques
         */
        calculateAllStats() {
            this.updateSubjectsProgress();
            this.calculateLevel();
            this.updateWeeklyProgress();
        },
        
        /**
         * Mise à jour progression matières
         */
        updateSubjectsProgress() {
            Object.keys(this.subjects).forEach(key => {
                const subject = this.subjects[key];
                if (subject.total > 0) {
                    subject.progress = Math.round((subject.completed / subject.total) * 100);
                }
            });
        },
        
        /**
         * Calcul du niveau utilisateur
         */
        calculateLevel() {
            // Formule: niveau = floor(sqrt(XP / 100)) + 1
            this.progressData.level = Math.floor(Math.sqrt(this.progressData.experiencePoints / 100)) + 1;
        },
        
        /**
         * Mise à jour progression hebdomadaire
         */
        updateWeeklyProgress() {
            // Calculé depuis les activités de la semaine
            const weeklyActivities = this.getWeeklyActivities();
            this.progressData.weeklyProgress = weeklyActivities.length;
        },
        
        /**
         * Configuration des analytics
         */
        setupAnalytics() {
            // Analytics basées sur localStorage en Phase 3
            if (!this.getStorageItem('analytics')) {
                this.setStorageItem('analytics', []);
            }
            
            // Configuration des événements automatiques
            this.setupAutoTracking();
        },
        
        /**
         * Configuration du tracking automatique
         */
        setupAutoTracking() {
            // Tracking des interactions utilisateur
            document.addEventListener('click', (e) => {
                if (e.target.matches('[data-track]')) {
                    const action = e.target.getAttribute('data-track');
                    this.trackEvent('user_interaction', {
                        action: action,
                        element: e.target.tagName.toLowerCase(),
                        timestamp: new Date().toISOString()
                    });
                }
            });
            
            // Tracking du temps de session
            this.sessionStartTime = Date.now();
            window.addEventListener('beforeunload', () => {
                const sessionDuration = Date.now() - this.sessionStartTime;
                this.trackEvent('session_end', {
                    duration: Math.round(sessionDuration / 1000),
                    timestamp: new Date().toISOString()
                });
            });
        },
        
        /**
         * Configuration des événements
         */
        setupEventListeners() {
            // Sauvegarde automatique toutes les 30 secondes
            setInterval(() => {
                this.saveAllData();
            }, 30000);
            
            // Gestion de la visibilité de la page
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.trackEvent('page_hidden', { timestamp: new Date().toISOString() });
                } else {
                    this.trackEvent('page_visible', { timestamp: new Date().toISOString() });
                }
            });
        },
        
        /**
         * Mises à jour périodiques
         */
        startPeriodicUpdates() {
            // Mise à jour des données toutes les minutes
            setInterval(() => {
                this.ui.lastUpdate = new Date().toISOString();
                this.calculateAllStats();
            }, 60000);
        },
        
        /**
         * Animations d'entrée
         */
        triggerEntranceAnimations() {
            setTimeout(() => {
                const elements = document.querySelectorAll('.alpine-animate-up');
                elements.forEach((el, index) => {
                    el.style.animationDelay = `${index * 100}ms`;
                    el.classList.add('animate-in');
                });
            }, 100);
        },
        
        /**
         * Getters réactifs
         */
        get completionPercentage() {
            return this.progressData.totalActivities > 0 
                ? Math.round((this.progressData.completedActivities / this.progressData.totalActivities) * 100)
                : 0;
        },
        
        get nextLevelXP() {
            const currentLevelXP = Math.pow(this.progressData.level - 1, 2) * 100;
            const nextLevelXP = Math.pow(this.progressData.level, 2) * 100;
            return nextLevelXP - currentLevelXP;
        },
        
        get currentLevelProgress() {
            const currentLevelXP = Math.pow(this.progressData.level - 1, 2) * 100;
            const nextLevelXP = Math.pow(this.progressData.level, 2) * 100;
            const progress = ((this.progressData.experiencePoints - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
            return Math.max(0, Math.min(100, Math.round(progress)));
        },
        
        get weeklyProgressPercentage() {
            return Math.round((this.progressData.weeklyProgress / this.progressData.weeklyGoal) * 100);
        },
        
        get favoriteSubject() {
            return Object.entries(this.subjects)
                .sort(([,a], [,b]) => b.timeSpent - a.timeSpent)[0]?.[1]?.name || 'Aucun';
        },
        
        /**
         * Méthodes utilitaires
         */
        formatTime(seconds) {
            if (!seconds) return '0min';
            
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            
            if (hours > 0) {
                return `${hours}h ${minutes}min`;
            }
            return `${minutes}min`;
        },
        
        formatDate(dateString) {
            if (!dateString) return 'Jamais';
            
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now - date;
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) return 'Aujourd\'hui';
            if (diffDays === 1) return 'Hier';
            if (diffDays < 7) return `Il y a ${diffDays} jours`;
            
            return date.toLocaleDateString('fr-FR');
        },
        
        getCurrentDateMessage() {
            const hour = new Date().getHours();
            const messages = {
                morning: ['Bonne matinée d\'apprentissage !', 'Prêt pour une nouvelle journée ?', 'L\'aventure commence !'],
                afternoon: ['Bon après-midi d\'apprentissage !', 'Continue sur ta lancée !', 'Tu progresses bien !'],
                evening: ['Bonne soirée d\'apprentissage !', 'Dernière ligne droite !', 'Termine en beauté !']
            };
            
            let timeOfDay;
            if (hour < 12) timeOfDay = 'morning';
            else if (hour < 18) timeOfDay = 'afternoon';
            else timeOfDay = 'evening';
            
            const messagesArray = messages[timeOfDay];
            return messagesArray[Math.floor(Math.random() * messagesArray.length)];
        },
        
        getPerformanceMessage() {
            const score = this.progressData.averageScore;
            if (score >= 95) return 'Parfait ! Tu es un champion ! 🏆';
            if (score >= 90) return 'Excellent travail ! 🌟';
            if (score >= 85) return 'Très bien ! Continue ! 👍';
            if (score >= 80) return 'Bon travail ! 📈';
            if (score >= 70) return 'En progression ! 💪';
            return 'Continue tes efforts ! 🎯';
        },
        
        getDifficultyColor(difficulty) {
            const colors = {
                easy: 'var(--success-color)',
                medium: 'var(--warning-color)',
                hard: 'var(--danger-color)'
            };
            return colors[difficulty] || colors.medium;
        },
        
        getWeeklyActivities() {
            // Simulation des activités de la semaine
            const now = new Date();
            const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
            
            // Retourner les activités de la semaine depuis les analytics
            const analytics = this.getStorageItem('analytics') || [];
            return analytics.filter(event => {
                const eventDate = new Date(event.timestamp);
                return eventDate >= weekStart && event.name === 'activity_completed';
            });
        },
        
        /**
         * Actions utilisateur
         */
        markActivityComplete(subject, activityId, score = 100, duration = 300) {
            // Mise à jour des données
            this.subjects[subject].completed++;
            this.subjects[subject].timeSpent += duration;
            this.subjects[subject].lastActivity = new Date().toISOString();
            this.subjects[subject].averageScore = Math.round(
                (this.subjects[subject].averageScore + score) / 2
            );
            
            // Mise à jour progression globale
            this.progressData.completedActivities++;
            this.progressData.totalTime += duration;
            this.progressData.experiencePoints += Math.round(score / 10);
            this.progressData.lastActivity = new Date().toISOString();
            
            // Mise à jour streak
            this.updateStreak();
            
            // Recalcul des stats
            this.calculateAllStats();
            
            // Sauvegarde
            this.saveAllData();
            
            // Analytics
            this.trackEvent('activity_completed', {
                subject: subject,
                activityId: activityId,
                score: score,
                duration: duration,
                streak: this.progressData.currentStreak
            });
            
            // Vérification badges
            this.checkBadges();
            
            // Notification
            this.showNotification(`Activité terminée ! +${Math.round(score/10)} XP`, 'success');
        },
        
        updateStreak() {
            const today = new Date().toDateString();
            const lastActivity = this.progressData.lastActivity ? 
                new Date(this.progressData.lastActivity).toDateString() : null;
            
            if (lastActivity !== today) {
                const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
                
                if (lastActivity === yesterday) {
                    this.progressData.currentStreak++;
                } else {
                    this.progressData.currentStreak = 1;
                }
                
                if (this.progressData.currentStreak > this.progressData.longestStreak) {
                    this.progressData.longestStreak = this.progressData.currentStreak;
                }
            }
        },
        
        checkBadges() {
            const newBadges = [];
            
            // Badge premier pas
            if (this.progressData.completedActivities >= 1 && !this.progressData.badges.includes('premier_pas')) {
                newBadges.push('premier_pas');
            }
            
            // Badge semaine complète
            if (this.progressData.currentStreak >= 7 && !this.progressData.badges.includes('semaine_complete')) {
                newBadges.push('semaine_complete');
            }
            
            // Badge mathématicien
            if (this.subjects.mathematiques.completed >= 10 && !this.progressData.badges.includes('mathematicien')) {
                newBadges.push('mathematicien');
            }
            
            // Badge explorateur
            if (Object.values(this.subjects).every(s => s.completed > 0) && !this.progressData.badges.includes('explorateur')) {
                newBadges.push('explorateur');
            }
            
            // Badge persévérant
            if (this.progressData.longestStreak >= 30 && !this.progressData.badges.includes('perseverant')) {
                newBadges.push('perseverant');
            }
            
            // Ajouter nouveaux badges
            if (newBadges.length > 0) {
                this.progressData.badges.push(...newBadges);
                this.showBadgeNotification(newBadges);
            }
        },
        
        showBadgeNotification(badges) {
            badges.forEach(badge => {
                const badgeNames = {
                    'premier_pas': 'Premier Pas',
                    'semaine_complete': 'Semaine Complète',
                    'mathematicien': 'Mathématicien',
                    'explorateur': 'Explorateur',
                    'perseverant': 'Persévérant'
                };
                
                this.showNotification(`🏆 Nouveau badge : ${badgeNames[badge]}!`, 'badge');
            });
        },
        
        continueLastActivity() {
            // Trouver la dernière activité
            const lastSubject = Object.entries(this.subjects)
                .sort(([,a], [,b]) => new Date(b.lastActivity || 0) - new Date(a.lastActivity || 0))[0];
            
            if (lastSubject) {
                this.trackEvent('continue_last_activity', { subject: lastSubject[0] });
                // Redirection vers l'activité (à implémenter)
                this.showNotification(`Redirection vers ${lastSubject[1].name}...`, 'info');
            }
        },
        
        startQuickQuiz() {
            // Sélection quiz adaptatif basé sur les performances
            const weakestSubject = Object.entries(this.subjects)
                .sort(([,a], [,b]) => a.averageScore - b.averageScore)[0];
            
            if (weakestSubject) {
                this.trackEvent('quick_quiz_started', { subject: weakestSubject[0] });
                this.showNotification(`Quiz ${weakestSubject[1].name} démarré !`, 'info');
            }
        },
        
        openSubjectModal(subjectKey) {
            this.ui.currentModal = subjectKey;
            this.ui.modalOpen = true;
            this.trackEvent('subject_modal_opened', { subject: subjectKey });
        },
        
        closeModal() {
            this.ui.modalOpen = false;
            this.ui.currentModal = null;
        },
        
        showAchievements() {
            this.trackEvent('achievements_viewed');
            // Ouvrir modal des réalisations (à implémenter)
            this.showNotification('Modal réalisations à venir !', 'info');
        },
        
        exportProgress() {
            const exportData = {
                progress: this.progressData,
                subjects: this.subjects,
                config: this.config,
                analytics: this.getStorageItem('analytics'),
                exportDate: new Date().toISOString(),
                version: AlpineConfig.storage.version
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
                type: 'application/json' 
            });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `progression-curieux-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            this.trackEvent('progress_exported');
            this.showNotification('Progression exportée !', 'success');
        },
        
        /**
         * Système de notifications
         */
        showNotification(message, type = 'info', duration = 3000) {
            const notification = {
                id: Date.now(),
                message: message,
                type: type,
                timestamp: new Date().toISOString()
            };
            
            this.ui.notifications.push(notification);
            
            // Auto-suppression
            setTimeout(() => {
                this.removeNotification(notification.id);
            }, duration);
        },
        
        removeNotification(id) {
            const index = this.ui.notifications.findIndex(n => n.id === id);
            if (index > -1) {
                this.ui.notifications.splice(index, 1);
            }
        },
        
        /**
         * Gestion du stockage
         */
        getStorageItem(key) {
            try {
                const item = localStorage.getItem(AlpineConfig.storage.prefix + key);
                return item ? JSON.parse(item) : null;
            } catch (error) {
                console.error('Erreur lecture storage:', error);
                return null;
            }
        },
        
        setStorageItem(key, value) {
            try {
                localStorage.setItem(
                    AlpineConfig.storage.prefix + key, 
                    JSON.stringify(value)
                );
                return true;
            } catch (error) {
                console.error('Erreur écriture storage:', error);
                return false;
            }
        },
        
        saveAllData() {
            this.setStorageItem('progressData', this.progressData);
            this.setStorageItem('subjectsData', this.subjects);
            this.setStorageItem('configData', this.config);
        },
        
        /**
         * Analytics et tracking
         */
        trackEvent(eventName, data = {}) {
            if (!AlpineConfig.analytics.enabled) return;
            
            const event = {
                name: eventName,
                data: data,
                timestamp: new Date().toISOString(),
                sessionId: this.getSessionId(),
                url: window.location.href,
                userAgent: navigator.userAgent
            };
            
            // Stockage local
            const analytics = this.getStorageItem('analytics') || [];
            analytics.push(event);
            
            // Limitation taille
            if (analytics.length > 1000) {
                analytics.splice(0, analytics.length - 1000);
            }
            
            this.setStorageItem('analytics', analytics);
            
            if (AlpineConfig.debug) {
                console.log('📊 Analytics:', eventName, data);
            }
        },
        
        getSessionId() {
            let sessionId = sessionStorage.getItem('alpine_session_id');
            if (!sessionId) {
                sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                sessionStorage.setItem('alpine_session_id', sessionId);
            }
            return sessionId;
        },
        
        getAnalyticsReport(days = 7) {
            const analytics = this.getStorageItem('analytics') || [];
            const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
            
            const recentEvents = analytics.filter(event => 
                new Date(event.timestamp) >= cutoff
            );
            
            return {
                totalEvents: recentEvents.length,
                uniqueSessions: [...new Set(recentEvents.map(e => e.sessionId))].length,
                eventsByType: recentEvents.reduce((acc, event) => {
                    acc[event.name] = (acc[event.name] || 0) + 1;
                    return acc;
                }, {}),
                dailyActivity: this.groupEventsByDay(recentEvents)
            };
        },
        
        groupEventsByDay(events) {
            return events.reduce((acc, event) => {
                const day = event.timestamp.split('T')[0];
                acc[day] = (acc[day] || 0) + 1;
                return acc;
            }, {});
        }
    }
}

/**
 * ===============================================
 * COMPOSANT SYSTÈME DE CŒURS
 * ===============================================
 */
function heartSystem() {
    return {
        hearts: Alpine.reactive(5),
        maxHearts: Alpine.reactive(AlpineConfig.heart.maxHearts),
        bonusHearts: Alpine.reactive(0),
        recoveryTime: AlpineConfig.heart.recoveryTimeMinutes,
        lastRecovery: null,
        recoveryTimer: null,
        
        init() {
            console.log('💝 Initialisation système de cœurs');
            this.loadHeartState();
            this.startRecoveryTimer();
            this.setupHeartAnimations();
        },
        
        loadHeartState() {
            const saved = JSON.parse(localStorage.getItem(AlpineConfig.storage.prefix + 'heartSystem') || '{}');
            
            this.hearts = saved.hearts ?? this.maxHearts;
            this.bonusHearts = saved.bonusHearts ?? 0;
            this.lastRecovery = saved.lastRecovery ? new Date(saved.lastRecovery) : null;
            
            // Récupération passive
            this.calculatePassiveRecovery();
        },
        
        calculatePassiveRecovery() {
            if (!this.lastRecovery || this.hearts >= this.maxHearts) return;
            
            const now = new Date();
            const timeDiff = now - this.lastRecovery;
            const minutesPassed = Math.floor(timeDiff / (1000 * 60));
            const heartsToRecover = Math.floor(minutesPassed / this.recoveryTime);
            
            if (heartsToRecover > 0) {
                const recovered = Math.min(heartsToRecover, this.maxHearts - this.hearts);
                this.hearts += recovered;
                this.lastRecovery = new Date(this.lastRecovery.getTime() + recovered * this.recoveryTime * 60000);
                this.saveHeartState();
                
                if (recovered > 0) {
                    this.showHeartRecoveryNotification(recovered);
                }
            }
        },
        
        loseHeart() {
            if (this.hearts > 0) {
                this.hearts--;
                this.lastRecovery = new Date();
                this.saveHeartState();
                this.animateHeartLoss();
                
                // Analytics
                this.trackHeartEvent('heart_lost', { remainingHearts: this.hearts });
                
                if (this.hearts === 0) {
                    this.handleNoHeartsLeft();
                }
                
                return true;
            }
            return false;
        },
        
        gainHeart() {
            if (this.hearts < this.maxHearts) {
                this.hearts++;
                this.saveHeartState();
                this.animateHeartGain();
                this.trackHeartEvent('heart_gained', { totalHearts: this.hearts });
                return true;
            }
            return false;
        },
        
        useBonusHeart() {
            if (this.bonusHearts > 0 && this.hearts < this.maxHearts) {
                this.bonusHearts--;
                this.hearts++;
                this.saveHeartState();
                this.animateHeartGain();
                this.trackHeartEvent('bonus_heart_used', { bonusRemaining: this.bonusHearts });
            }
        },
        
        earnBonusHeart() {
            this.bonusHearts++;
            this.saveHeartState();
            this.trackHeartEvent('bonus_heart_earned', { totalBonus: this.bonusHearts });
            this.showBonusHeartNotification();
        },
        
        handleNoHeartsLeft() {
            // Proposition d'options de récupération
            this.trackHeartEvent('no_hearts_left');
            // Interface de récupération à implémenter
        },
        
        startRecoveryTimer() {
            // Timer toutes les minutes
            this.recoveryTimer = setInterval(() => {
                if (this.hearts < this.maxHearts && this.lastRecovery) {
                    const now = new Date();
                    const timeDiff = now - this.lastRecovery;
                    const minutesPassed = Math.floor(timeDiff / (1000 * 60));
                    
                    if (minutesPassed >= this.recoveryTime) {
                        this.gainHeart();
                        this.lastRecovery = new Date();
                    }
                }
            }, 60000);
        },
        
        setupHeartAnimations() {
            // CSS animations pour les cœurs
            const style = document.createElement('style');
            style.textContent = `
                @keyframes heartLoss {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.3); opacity: 0.7; }
                    100% { transform: scale(0.8); opacity: 0.3; }
                }
                @keyframes heartGain {
                    0% { transform: scale(0.5); opacity: 0.5; }
                    50% { transform: scale(1.2); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        },
        
        animateHeartLoss() {
            const heartElements = document.querySelectorAll('.alpine-heart');
            if (heartElements[this.hearts]) {
                heartElements[this.hearts].style.animation = 'heartLoss 0.5s ease';
                setTimeout(() => {
                    heartElements[this.hearts].style.animation = '';
                }, 500);
            }
        },
        
        animateHeartGain() {
            const heartElements = document.querySelectorAll('.alpine-heart');
            if (heartElements[this.hearts - 1]) {
                heartElements[this.hearts - 1].style.animation = 'heartGain 0.5s ease';
                setTimeout(() => {
                    heartElements[this.hearts - 1].style.animation = '';
                }, 500);
            }
        },
        
        saveHeartState() {
            const state = {
                hearts: this.hearts,
                bonusHearts: this.bonusHearts,
                lastRecovery: this.lastRecovery ? this.lastRecovery.toISOString() : null
            };
            localStorage.setItem(AlpineConfig.storage.prefix + 'heartSystem', JSON.stringify(state));
        },
        
        trackHeartEvent(eventName, data = {}) {
            // Analytics spécifiques aux cœurs
            const event = {
                name: 'heart_system_' + eventName,
                data: {
                    ...data,
                    currentHearts: this.hearts,
                    maxHearts: this.maxHearts,
                    bonusHearts: this.bonusHearts
                },
                timestamp: new Date().toISOString()
            };
            
            // Stockage analytics
            const analytics = JSON.parse(localStorage.getItem(AlpineConfig.storage.prefix + 'analytics') || '[]');
            analytics.push(event);
            localStorage.setItem(AlpineConfig.storage.prefix + 'analytics', JSON.stringify(analytics));
        },
        
        showHeartRecoveryNotification(recovered) {
            // Notification via système global
            if (window.dashboardApp) {
                window.dashboardApp.showNotification(`💝 ${recovered} cœur(s) récupéré(s) !`, 'success');
            }
        },
        
        showBonusHeartNotification() {
            if (window.dashboardApp) {
                window.dashboardApp.showNotification('✨ Cœur bonus gagné !', 'bonus');
            }
        },
        
        // Getters réactifs
        get canPlay() {
            return this.hearts > 0;
        },
        
        get nextRecoveryTime() {
            if (!this.lastRecovery || this.hearts >= this.maxHearts) return null;
            
            const nextRecovery = new Date(this.lastRecovery.getTime() + this.recoveryTime * 60000);
            const now = new Date();
            const timeLeft = nextRecovery - now;
            
            if (timeLeft <= 0) return '0:00';
            
            const minutes = Math.floor(timeLeft / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        },
        
        get recoveryProgress() {
            if (!this.lastRecovery || this.hearts >= this.maxHearts) return 0;
            
            const now = new Date();
            const timeDiff = now - this.lastRecovery;
            const progress = (timeDiff / (this.recoveryTime * 60000)) * 100;
            return Math.min(100, Math.max(0, progress));
        }
    }
}

// Export des composants pour utilisation globale
window.dashboardApp = dashboardApp;
window.heartSystem = heartSystem;
window.AlpineConfig = AlpineConfig;

// Log de chargement
console.log('✅ Composants Alpine.js Phase 3 chargés');
