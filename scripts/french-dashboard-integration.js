/**
 * INTÉGRATION DASHBOARD - SECTION FRANÇAIS DUOLINGO
 * Module d'extension du dashboard existant pour inclure les métriques Français
 * Compatible avec le système localStorage existant
 */

class FrenchDashboardIntegration {
    constructor() {
        this.storageKey = 'lemondedescurieux_french_progress';
        this.globalProgressKey = 'userProgress';
        this.badgesKey = 'userBadges';
        
        // Événements personnalisés pour synchronisation
        this.events = {
            FRENCH_PROGRESS_UPDATED: 'frenchProgressUpdated',
            STREAK_UPDATED: 'streakUpdated',
            HEARTS_CHANGED: 'heartsChanged',
            XP_GAINED: 'xpGained',
            BADGE_EARNED: 'badgeEarned'
        };
        
        this.initializeEventListeners();
    }

    /**
     * Initialise les écouteurs d'événements pour synchronisation temps réel
     */
    initializeEventListeners() {
        // Écouter les événements de progression français
        document.addEventListener(this.events.FRENCH_PROGRESS_UPDATED, (e) => {
            this.updateGlobalProgress(e.detail);
            this.updateDashboardDisplay();
        });

        document.addEventListener(this.events.STREAK_UPDATED, (e) => {
            this.handleStreakUpdate(e.detail);
        });

        document.addEventListener(this.events.XP_GAINED, (e) => {
            this.handleXPGain(e.detail);
        });

        document.addEventListener(this.events.BADGE_EARNED, (e) => {
            this.handleBadgeEarned(e.detail);
        });
    }

    /**
     * Met à jour la progression globale avec les données français
     */
    updateGlobalProgress(frenchData) {
        const globalProgress = JSON.parse(localStorage.getItem(this.globalProgressKey)) || {};
        
        // Structure des données français dans la progression globale
        if (!globalProgress.francais) {
            globalProgress.francais = {
                activites: {},
                niveauActuel: 'cm1',
                tempsTotal: 0,
                derniereVisite: new Date().toISOString()
            };
        }

        // Mise à jour des métriques
        globalProgress.francais = {
            ...globalProgress.francais,
            activites: {
                ...globalProgress.francais.activites,
                ...frenchData.completedLessons
            },
            statistiques: {
                totalXP: frenchData.totalXP || 0,
                streakActuel: frenchData.currentStreak || 0,
                streakMaximal: frenchData.longestStreak || 0,
                tempsEtude: frenchData.studyTime || 0,
                precision: frenchData.averageAccuracy || 0,
                leçonsCompletes: Object.keys(frenchData.completedLessons || {}).length,
                coeursUtilises: frenchData.heartsUsed || 0,
                dernierNiveau: frenchData.lastLevel || 'cm1'
            },
            progression: this.calculateProgressionPercentage(frenchData),
            derniereVisite: new Date().toISOString()
        };

        localStorage.setItem(this.globalProgressKey, JSON.stringify(globalProgress));
        
        // Émettre événement pour autres modules
        this.dispatchEvent('globalProgressUpdated', globalProgress);
    }

    /**
     * Calcule le pourcentage de progression globale
     */
    calculateProgressionPercentage(frenchData) {
        const totalLessons = 65; // Total des leçons françaises disponibles
        const completedLessons = Object.keys(frenchData.completedLessons || {}).length;
        return Math.round((completedLessons / totalLessons) * 100);
    }

    /**
     * Gère les mises à jour de streak
     */
    handleStreakUpdate(streakData) {
        // Vérifier les badges de streak
        this.checkStreakBadges(streakData.currentStreak);
        
        // Mettre à jour l'affichage du dashboard principal
        const streakElement = document.getElementById('dashboard-streak-french');
        if (streakElement) {
            streakElement.textContent = streakData.currentStreak;
            
            // Animation de mise à jour
            streakElement.classList.add('streak-updated');
            setTimeout(() => {
                streakElement.classList.remove('streak-updated');
            }, 600);
        }

        // Notification streak milestone
        if (streakData.currentStreak > 0 && streakData.currentStreak % 7 === 0) {
            this.showStreakMilestoneNotification(streakData.currentStreak);
        }
    }

    /**
     * Gère les gains d'XP
     */
    handleXPGain(xpData) {
        const currentProgress = JSON.parse(localStorage.getItem(this.globalProgressKey)) || {};
        const currentFrenchXP = currentProgress.francais?.statistiques?.totalXP || 0;
        const newTotalXP = currentFrenchXP + xpData.amount;

        // Vérifier les badges XP
        this.checkXPBadges(newTotalXP);

        // Animation d'XP gain sur le dashboard
        this.animateXPGain(xpData.amount);

        // Mettre à jour la barre d'XP globale
        this.updateGlobalXPBar(newTotalXP);
    }

    /**
     * Vérifie et attribue les badges de streak
     */
    checkStreakBadges(currentStreak) {
        const badges = JSON.parse(localStorage.getItem(this.badgesKey)) || {};
        const newBadges = [];

        const streakBadges = [
            { id: 'french_streak_3', name: 'Débutant Assidu', threshold: 3, icon: '🔥' },
            { id: 'french_streak_7', name: 'Une Semaine !', threshold: 7, icon: '🏆' },
            { id: 'french_streak_14', name: 'Deux Semaines !', threshold: 14, icon: '💎' },
            { id: 'french_streak_30', name: 'Un Mois !', threshold: 30, icon: '👑' },
            { id: 'french_streak_100', name: 'Centurion !', threshold: 100, icon: '⚡' }
        ];

        streakBadges.forEach(badge => {
            if (currentStreak >= badge.threshold && !badges[badge.id]) {
                badges[badge.id] = {
                    ...badge,
                    earned: true,
                    earnedDate: new Date().toISOString(),
                    category: 'streak_francais'
                };
                newBadges.push(badge);
            }
        });

        if (newBadges.length > 0) {
            localStorage.setItem(this.badgesKey, JSON.stringify(badges));
            newBadges.forEach(badge => {
                this.dispatchEvent(this.events.BADGE_EARNED, badge);
            });
        }
    }

    /**
     * Vérifie et attribue les badges XP
     */
    checkXPBadges(totalXP) {
        const badges = JSON.parse(localStorage.getItem(this.badgesKey)) || {};
        const newBadges = [];

        const xpBadges = [
            { id: 'french_xp_100', name: 'Premier Pas', threshold: 100, icon: '🌱' },
            { id: 'french_xp_500', name: 'En Route', threshold: 500, icon: '🚶' },
            { id: 'french_xp_1000', name: 'Marcheur', threshold: 1000, icon: '🏃' },
            { id: 'french_xp_2500', name: 'Coureur', threshold: 2500, icon: '🏃‍♂️' },
            { id: 'french_xp_5000', name: 'Champion', threshold: 5000, icon: '🏆' },
            { id: 'french_xp_10000', name: 'Légende', threshold: 10000, icon: '👑' }
        ];

        xpBadges.forEach(badge => {
            if (totalXP >= badge.threshold && !badges[badge.id]) {
                badges[badge.id] = {
                    ...badge,
                    earned: true,
                    earnedDate: new Date().toISOString(),
                    category: 'xp_francais'
                };
                newBadges.push(badge);
            }
        });

        if (newBadges.length > 0) {
            localStorage.setItem(this.badgesKey, JSON.stringify(badges));
            newBadges.forEach(badge => {
                this.dispatchEvent(this.events.BADGE_EARNED, badge);
            });
        }
    }

    /**
     * Ajoute la section français au dashboard existant
     */
    addFrenchSectionToDashboard() {
        const dashboardContainer = document.getElementById('dashboard-content') || document.querySelector('.dashboard-main');
        
        if (!dashboardContainer) {
            console.warn('Dashboard container not found - creating standalone section');
            return this.createStandaloneFrenchDashboard();
        }

        const frenchSection = this.createFrenchDashboardSection();
        
        // Insérer après la section progression générale
        const progressSection = dashboardContainer.querySelector('.progress-overview');
        if (progressSection) {
            progressSection.insertAdjacentElement('afterend', frenchSection);
        } else {
            dashboardContainer.appendChild(frenchSection);
        }

        this.updateFrenchDashboardData();
    }

    /**
     * Crée la section français pour le dashboard
     */
    createFrenchDashboardSection() {
        const section = document.createElement('div');
        section.className = 'dashboard-section french-section';
        section.innerHTML = `
            <div class="section-header">
                <h2 class="section-title">
                    <span class="section-icon">🇫🇷</span>
                    Maîtrise du Français
                </h2>
                <div class="quick-access">
                    <a href="francais_duolingo_section.html" class="btn-quick-access">
                        Continuer l'apprentissage
                    </a>
                </div>
            </div>

            <div class="french-metrics-grid">
                <!-- Streak & Hearts -->
                <div class="metric-card streak-card">
                    <div class="metric-icon">🔥</div>
                    <div class="metric-value" id="dashboard-streak-french">0</div>
                    <div class="metric-label">Jours de suite</div>
                    <div class="metric-detail">
                        Record: <span id="longest-streak-french">0</span> jours
                    </div>
                </div>

                <div class="metric-card hearts-card">
                    <div class="metric-icon">❤️</div>
                    <div class="metric-value" id="dashboard-hearts-french">5</div>
                    <div class="metric-label">Cœurs restants</div>
                    <div class="metric-detail" id="heart-timer-dashboard">
                        Plein dans 0h
                    </div>
                </div>

                <!-- XP & Progression -->
                <div class="metric-card xp-card">
                    <div class="metric-icon">⚡</div>
                    <div class="metric-value" id="dashboard-xp-french">0</div>
                    <div class="metric-label">Points d'expérience</div>
                    <div class="xp-progress-bar">
                        <div class="xp-progress-fill" id="xp-progress-french"></div>
                    </div>
                </div>

                <div class="metric-card accuracy-card">
                    <div class="metric-icon">🎯</div>
                    <div class="metric-value" id="dashboard-accuracy-french">0%</div>
                    <div class="metric-label">Précision moyenne</div>
                    <div class="metric-detail">
                        <span id="lessons-completed-french">0</span> leçons complétées
                    </div>
                </div>
            </div>

            <!-- Progression par unité -->
            <div class="units-progress">
                <h3>Progression par unité</h3>
                <div class="units-grid">
                    <div class="unit-progress" data-unit="grammaire">
                        <div class="unit-info">
                            <div class="unit-icon">📚</div>
                            <div class="unit-name">Grammaire</div>
                        </div>
                        <div class="unit-progress-bar">
                            <div class="unit-progress-fill" style="width: 0%"></div>
                        </div>
                        <div class="unit-stats">0/30 leçons</div>
                    </div>

                    <div class="unit-progress" data-unit="orthographe">
                        <div class="unit-info">
                            <div class="unit-icon">📝</div>
                            <div class="unit-name">Orthographe</div>
                        </div>
                        <div class="unit-progress-bar">
                            <div class="unit-progress-fill" style="width: 0%"></div>
                        </div>
                        <div class="unit-stats">0/20 leçons</div>
                    </div>

                    <div class="unit-progress" data-unit="expression">
                        <div class="unit-info">
                            <div class="unit-icon">🎭</div>
                            <div class="unit-name">Expression</div>
                        </div>
                        <div class="unit-progress-bar">
                            <div class="unit-progress-fill" style="width: 0%"></div>
                        </div>
                        <div class="unit-stats">0/15 leçons</div>
                    </div>
                </div>
            </div>

            <!-- Badges récents -->
            <div class="recent-badges">
                <h3>Derniers badges français</h3>
                <div class="badges-showcase" id="french-badges-showcase">
                    <div class="no-badges">Commence ton apprentissage pour gagner des badges !</div>
                </div>
            </div>

            <!-- Prochaine leçon recommandée -->
            <div class="next-lesson-card">
                <h3>Prochaine leçon recommandée</h3>
                <div class="recommended-lesson" id="recommended-lesson-french">
                    <div class="lesson-preview">
                        <div class="lesson-icon">🏃</div>
                        <div class="lesson-info">
                            <div class="lesson-title">Verbes au présent</div>
                            <div class="lesson-description">Apprends à conjuguer les verbes du 1er groupe</div>
                            <div class="lesson-duration">⏱️ 10-15 minutes</div>
                        </div>
                    </div>
                    <button class="btn-start-lesson" onclick="window.location.href='francais_duolingo_section.html'">
                        Commencer
                    </button>
                </div>
            </div>
        `;

        return section;
    }

    /**
     * Met à jour les données affichées dans le dashboard français
     */
    updateFrenchDashboardData() {
        const frenchData = JSON.parse(localStorage.getItem(this.storageKey)) || {};
        const globalProgress = JSON.parse(localStorage.getItem(this.globalProgressKey)) || {};
        const frenchProgress = globalProgress.francais || {};

        // Mise à jour des métriques principales
        this.updateElement('dashboard-streak-french', frenchData.currentStreak || 0);
        this.updateElement('longest-streak-french', frenchData.longestStreak || 0);
        this.updateElement('dashboard-hearts-french', frenchData.currentHearts || 5);
        this.updateElement('dashboard-xp-french', frenchData.totalXP || 0);
        this.updateElement('dashboard-accuracy-french', `${frenchData.averageAccuracy || 0}%`);
        this.updateElement('lessons-completed-french', Object.keys(frenchData.completedLessons || {}).length);

        // Mise à jour des barres de progression
        this.updateProgressBars(frenchData);

        // Mise à jour des badges
        this.updateFrenchBadgesDisplay();

        // Mise à jour timer cœurs
        this.updateHeartTimer(frenchData);

        // Mise à jour leçon recommandée
        this.updateRecommendedLesson(frenchData);
    }

    /**
     * Met à jour les barres de progression des unités
     */
    updateProgressBars(frenchData) {
        const unitProgressions = this.calculateUnitProgressions(frenchData);
        
        Object.entries(unitProgressions).forEach(([unit, data]) => {
            const unitElement = document.querySelector(`[data-unit="${unit}"]`);
            if (unitElement) {
                const progressBar = unitElement.querySelector('.unit-progress-fill');
                const statsElement = unitElement.querySelector('.unit-stats');
                
                if (progressBar) {
                    progressBar.style.width = `${data.percentage}%`;
                }
                if (statsElement) {
                    statsElement.textContent = `${data.completed}/${data.total} leçons`;
                }
            }
        });

        // Barre XP globale
        const xpProgressBar = document.getElementById('xp-progress-french');
        if (xpProgressBar) {
            const xpPercentage = Math.min(100, ((frenchData.totalXP || 0) % 1000) / 10);
            xpProgressBar.style.width = `${xpPercentage}%`;
        }
    }

    /**
     * Calcule les progressions par unité
     */
    calculateUnitProgressions(frenchData) {
        const unitDefinitions = {
            grammaire: { total: 30, lessons: ['verbes-present', 'verbes-passe', 'verbes-futur', 'adjectifs', 'adverbes'] },
            orthographe: { total: 20, lessons: ['homonymes', 'accords', 'pluriels', 'majuscules'] },
            expression: { total: 15, lessons: ['descriptions', 'raconter', 'argumenter'] }
        };

        const completedLessons = frenchData.completedLessons || {};
        const progressions = {};

        Object.entries(unitDefinitions).forEach(([unit, definition]) => {
            const completed = definition.lessons.filter(lesson => 
                completedLessons[lesson] && completedLessons[lesson].completed
            ).length;
            
            progressions[unit] = {
                completed,
                total: definition.total,
                percentage: Math.round((completed / definition.total) * 100)
            };
        });

        return progressions;
    }

    /**
     * Met à jour l'affichage des badges français
     */
    updateFrenchBadgesDisplay() {
        const badges = JSON.parse(localStorage.getItem(this.badgesKey)) || {};
        const frenchBadges = Object.values(badges).filter(badge => 
            badge.category && badge.category.includes('francais')
        ).sort((a, b) => new Date(b.earnedDate) - new Date(a.earnedDate)).slice(0, 3);

        const showcaseElement = document.getElementById('french-badges-showcase');
        if (!showcaseElement) return;

        if (frenchBadges.length === 0) {
            showcaseElement.innerHTML = '<div class="no-badges">Commence ton apprentissage pour gagner des badges !</div>';
            return;
        }

        showcaseElement.innerHTML = frenchBadges.map(badge => `
            <div class="badge-item">
                <div class="badge-icon">${badge.icon}</div>
                <div class="badge-name">${badge.name}</div>
                <div class="badge-date">${this.formatDate(badge.earnedDate)}</div>
            </div>
        `).join('');
    }

    /**
     * Met à jour le timer de récupération des cœurs
     */
    updateHeartTimer(frenchData) {
        const timerElement = document.getElementById('heart-timer-dashboard');
        if (!timerElement) return;

        const currentHearts = frenchData.currentHearts || 5;
        if (currentHearts >= 5) {
            timerElement.textContent = 'Plein';
            return;
        }

        const lastHeartLoss = frenchData.lastHeartLoss;
        if (!lastHeartLoss) {
            timerElement.textContent = 'Plein dans 0h';
            return;
        }

        const heartRegenTime = 30 * 60 * 1000; // 30 minutes
        const nextHeartTime = new Date(lastHeartLoss).getTime() + heartRegenTime;
        const now = Date.now();
        const timeUntilNext = Math.max(0, nextHeartTime - now);

        if (timeUntilNext > 0) {
            const minutes = Math.ceil(timeUntilNext / (60 * 1000));
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            
            if (hours > 0) {
                timerElement.textContent = `Prochain dans ${hours}h${remainingMinutes}m`;
            } else {
                timerElement.textContent = `Prochain dans ${remainingMinutes}m`;
            }
        } else {
            timerElement.textContent = 'Plein';
        }
    }

    /**
     * Met à jour la recommandation de leçon
     */
    updateRecommendedLesson(frenchData) {
        const recommendedElement = document.getElementById('recommended-lesson-french');
        if (!recommendedElement) return;

        const completedLessons = frenchData.completedLessons || {};
        const nextLesson = this.determineNextLesson(completedLessons);

        if (nextLesson) {
            recommendedElement.querySelector('.lesson-title').textContent = nextLesson.title;
            recommendedElement.querySelector('.lesson-description').textContent = nextLesson.description;
            recommendedElement.querySelector('.lesson-icon').textContent = nextLesson.icon;
        }
    }

    /**
     * Détermine la prochaine leçon recommandée
     */
    determineNextLesson(completedLessons) {
        const lessonSequence = [
            { id: 'verbes-present', title: 'Verbes au présent', description: 'Conjugaison des verbes du 1er groupe', icon: '🏃' },
            { id: 'verbes-passe', title: 'Verbes au passé', description: 'Le passé composé et l\'imparfait', icon: '🕰️' },
            { id: 'homonymes', title: 'Les homonymes', description: 'Distinguer les mots qui se prononcent pareil', icon: '👥' },
            { id: 'accords', title: 'Les accords', description: 'Accord du verbe avec le sujet', icon: '🤝' },
            { id: 'descriptions', title: 'Décrire', description: 'Apprendre à bien décrire', icon: '🎨' }
        ];

        // Trouver la première leçon non complétée
        for (const lesson of lessonSequence) {
            if (!completedLessons[lesson.id] || !completedLessons[lesson.id].completed) {
                return lesson;
            }
        }

        // Si toutes les leçons de base sont complétées, recommander une révision
        return {
            id: 'revision',
            title: 'Révision générale',
            description: 'Révise tes acquis pour consolider',
            icon: '📖'
        };
    }

    /**
     * Utilitaires
     */
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }

    dispatchEvent(eventName, detail) {
        document.dispatchEvent(new CustomEvent(eventName, { detail }));
    }

    /**
     * Animations d'interface
     */
    animateXPGain(amount) {
        const xpElement = document.getElementById('dashboard-xp-french');
        if (!xpElement) return;

        // Créer animation de gain XP
        const gainElement = document.createElement('div');
        gainElement.className = 'xp-gain-animation';
        gainElement.textContent = `+${amount} XP`;
        gainElement.style.cssText = `
            position: absolute;
            color: #f4a261;
            font-weight: bold;
            font-size: 1.2rem;
            pointer-events: none;
            z-index: 1000;
            animation: xpGainFloat 2s ease-out forwards;
        `;

        const rect = xpElement.getBoundingClientRect();
        gainElement.style.left = rect.left + 'px';
        gainElement.style.top = rect.top + 'px';

        document.body.appendChild(gainElement);

        // Supprimer après animation
        setTimeout(() => {
            if (gainElement.parentNode) {
                gainElement.parentNode.removeChild(gainElement);
            }
        }, 2000);

        // Ajouter CSS pour l'animation si pas déjà présent
        if (!document.getElementById('xp-gain-styles')) {
            const style = document.createElement('style');
            style.id = 'xp-gain-styles';
            style.textContent = `
                @keyframes xpGainFloat {
                    0% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-50px);
                    }
                }
                .streak-updated {
                    animation: streakPulse 0.6s ease-out;
                }
                @keyframes streakPulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    showStreakMilestoneNotification(streakCount) {
        // Créer notification de milestone
        const notification = document.createElement('div');
        notification.className = 'streak-milestone-notification';
        notification.innerHTML = `
            <div class="milestone-content">
                <div class="milestone-icon">🎉</div>
                <div class="milestone-text">
                    <strong>${streakCount} jours de suite !</strong>
                    <p>Continue comme ça, champion !</p>
                </div>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #f4a261, #e76f51);
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            z-index: 1001;
            animation: slideInRight 0.5s ease-out, slideOutRight 0.5s ease-out 3s forwards;
        `;

        document.body.appendChild(notification);

        // Supprimer après 3.5 secondes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3500);

        // Ajouter styles pour les animations de notification
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                .milestone-content {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .milestone-icon {
                    font-size: 2rem;
                }
                .milestone-text strong {
                    display: block;
                    font-size: 1.1rem;
                    margin-bottom: 0.2rem;
                }
                .milestone-text p {
                    margin: 0;
                    font-size: 0.9rem;
                    opacity: 0.9;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Export des données pour analyse
     */
    exportFrenchProgressForAnalytics() {
        const frenchData = JSON.parse(localStorage.getItem(this.storageKey)) || {};
        const globalProgress = JSON.parse(localStorage.getItem(this.globalProgressKey)) || {};
        const badges = JSON.parse(localStorage.getItem(this.badgesKey)) || {};

        const analyticsData = {
            section: 'francais',
            timestamp: new Date().toISOString(),
            metrics: {
                totalXP: frenchData.totalXP || 0,
                currentStreak: frenchData.currentStreak || 0,
                longestStreak: frenchData.longestStreak || 0,
                averageAccuracy: frenchData.averageAccuracy || 0,
                studyTime: frenchData.studyTime || 0,
                heartsUsed: frenchData.heartsUsed || 0,
                lessonsCompleted: Object.keys(frenchData.completedLessons || {}).length,
                lastLevel: frenchData.lastLevel || 'cm1'
            },
            progression: this.calculateUnitProgressions(frenchData),
            badges: Object.values(badges).filter(badge => 
                badge.category && badge.category.includes('francais')
            ).length,
            engagement: {
                totalSessions: frenchData.totalSessions || 0,
                averageSessionTime: frenchData.averageSessionTime || 0,
                lastActivity: frenchData.lastActivity || null
            }
        };

        return analyticsData;
    }

    /**
     * Initialisation complète du module
     */
    initialize() {
        // Ajouter la section français au dashboard
        this.addFrenchSectionToDashboard();
        
        // Démarrer les mises à jour périodiques
        this.startPeriodicUpdates();
        
        // Écouter les changements de visibilité pour les mises à jour
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.updateFrenchDashboardData();
            }
        });

        console.log('✅ French Dashboard Integration initialized');
    }

    /**
     * Mises à jour périodiques (timer cœurs, etc.)
     */
    startPeriodicUpdates() {
        // Mettre à jour le timer des cœurs toutes les minutes
        setInterval(() => {
            const frenchData = JSON.parse(localStorage.getItem(this.storageKey)) || {};
            this.updateHeartTimer(frenchData);
        }, 60000);

        // Mettre à jour les données générales toutes les 5 minutes
        setInterval(() => {
            this.updateFrenchDashboardData();
        }, 300000);
    }
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FrenchDashboardIntegration;
} else {
    window.FrenchDashboardIntegration = FrenchDashboardIntegration;
}

/**
 * UTILISATION :
 * 
 * // Dans le fichier principal du dashboard
 * document.addEventListener('DOMContentLoaded', function() {
 *     const frenchIntegration = new FrenchDashboardIntegration();
 *     frenchIntegration.initialize();
 * });
 */