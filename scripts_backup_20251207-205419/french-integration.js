/**
 * SCRIPT D'INTÉGRATION - SECTION FRANÇAIS DUOLINGO
 * 
 * Ce script initialise et connecte tous les composants :
 * - Application Duolingo française
 * - Base de données des leçons  
 * - Intégration dashboard
 * - Système de progression existant
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation Section Français Duolingo...');
    
    // Vérifier les dépendances
    if (!window.FrenchDuolingoApp) {
        console.error('❌ FrenchDuolingoApp non trouvé');
        return;
    }
    
    if (!window.FRENCH_LESSONS_DATABASE) {
        console.error('❌ Base de données leçons non trouvée');
        return;
    }
    
    // Initialiser l'application principale
    const frenchApp = new FrenchDuolingoApp();
    
    // Intégration dashboard si disponible
    let dashboardIntegration = null;
    if (window.FrenchDashboardIntegration) {
        dashboardIntegration = new FrenchDashboardIntegration();
        dashboardIntegration.initialize();
        console.log('✅ Dashboard intégré');
    }
    
    // Configuration globale de l'app
    frenchApp.configure({
        // Paramètres de difficulté
        difficulty: {
            adaptive: true,
            startLevel: 'cm1',
            maxAttempts: 3
        },
        
        // Paramètres des cœurs
        hearts: {
            maxHearts: 5,
            regenTime: 30 * 60 * 1000, // 30 minutes
            enabled: true
        },
        
        // Paramètres des streaks
        streaks: {
            enabled: true,
            showMotivation: true,
            milestoneRewards: [3, 7, 14, 30]
        },
        
        // Paramètres XP
        xp: {
            showAnimations: true,
            levelUpNotifications: true,
            shareableAchievements: true
        },
        
        // Paramètres de sauvegarde
        storage: {
            autoSave: true,
            backupFrequency: 10, // Sauvegarde toutes les 10 actions
            syncWithGlobal: true
        }
    });
    
    // Initialiser l'application
    frenchApp.initialize();
    
    // =====================================
    // GESTIONNAIRES D'ÉVÉNEMENTS GLOBAUX
    // =====================================
    
    // Synchronisation avec progression globale
    document.addEventListener('frenchProgressUpdated', function(e) {
        updateGlobalProgress(e.detail);
        
        // Mise à jour dashboard si disponible
        if (dashboardIntegration) {
            dashboardIntegration.updateFrenchDashboardData();
        }
    });
    
    // Gestion des badges
    document.addEventListener('badgeEarned', function(e) {
        showBadgeNotification(e.detail);
        updateBadgeDisplay(e.detail);
    });
    
    // Gestion des milestones streak
    document.addEventListener('streakMilestone', function(e) {
        showStreakCelebration(e.detail);
    });
    
    // Sauvegarde périodique
    setInterval(() => {
        frenchApp.saveProgress();
        console.log('💾 Sauvegarde automatique effectuée');
    }, 5 * 60 * 1000); // Toutes les 5 minutes
    
    // =====================================
    // FONCTIONS UTILITAIRES INTÉGRATION
    // =====================================
    
    /**
     * Met à jour la progression globale du site
     */
    function updateGlobalProgress(frenchData) {
        const globalProgress = JSON.parse(localStorage.getItem('userProgress')) || {};
        
        // Structure compatibilité avec système existant
        if (!globalProgress.francais) {
            globalProgress.francais = {
                activites: {},
                niveauActuel: 'cm1',
                tempsTotal: 0
            };
        }
        
        // Convertir données Duolingo vers format global
        const lessonsData = {};
        Object.entries(frenchData.completedLessons || {}).forEach(([lessonId, lessonData]) => {
            lessonsData[lessonId] = {
                completed: lessonData.completed,
                score: lessonData.bestScore || 0,
                attempts: lessonData.attempts || 1,
                timeSpent: lessonData.timeSpent || 0,
                lastAttempt: lessonData.completedAt || new Date().toISOString()
            };
        });
        
        globalProgress.francais.activites = lessonsData;
        globalProgress.francais.statistiques = {
            totalXP: frenchData.totalXP || 0,
            streak: frenchData.currentStreak || 0,
            precision: frenchData.averageAccuracy || 0,
            tempsEtude: frenchData.studyTime || 0
        };
        
        localStorage.setItem('userProgress', JSON.stringify(globalProgress));
        
        // Déclencher événement pour autres modules
        document.dispatchEvent(new CustomEvent('globalProgressUpdated', {
            detail: globalProgress
        }));
    }
    
    /**
     * Affiche notification de badge
     */
    function showBadgeNotification(badge) {
        // Créer notification animée
        const notification = document.createElement('div');
        notification.className = 'badge-notification';
        notification.innerHTML = `
            <div class="badge-popup">
                <div class="badge-icon">${badge.icon}</div>
                <div class="badge-text">
                    <h3>Nouveau badge !</h3>
                    <p>${badge.name}</p>
                    <small>${badge.description}</small>
                </div>
            </div>
        `;
        
        // Styles inline pour l'animation
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: linear-gradient(135deg, #f4a261, #e76f51);
            color: white;
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: badgeAppear 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards,
                       badgeDisappear 0.4s ease-out 2.5s forwards;
        `;
        
        // Ajouter styles CSS si pas déjà fait
        if (!document.getElementById('badge-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'badge-notification-styles';
            style.textContent = `
                @keyframes badgeAppear {
                    to {
                        transform: translate(-50%, -50%) scale(1);
                    }
                }
                @keyframes badgeDisappear {
                    to {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 0;
                    }
                }
                .badge-popup {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    text-align: left;
                }
                .badge-notification .badge-icon {
                    font-size: 3rem;
                }
                .badge-notification h3 {
                    margin: 0 0 0.5rem 0;
                    font-size: 1.2rem;
                }
                .badge-notification p {
                    margin: 0 0 0.25rem 0;
                    font-weight: bold;
                }
                .badge-notification small {
                    opacity: 0.9;
                    font-size: 0.9rem;
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Supprimer après animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
        
        // Son de notification si possible
        playNotificationSound('badge');
    }
    
    /**
     * Affiche célébration streak
     */
    function showStreakCelebration(streakData) {
        const { streak, isNewRecord } = streakData;
        
        // Effet confetti
        createConfettiEffect();
        
        // Notification streak
        const celebration = document.createElement('div');
        celebration.className = 'streak-celebration';
        celebration.innerHTML = `
            <div class="celebration-content">
                <div class="flame-animation">🔥</div>
                <h2>${streak} jours de suite !</h2>
                <p>${isNewRecord ? 'Nouveau record personnel !' : 'Continue comme ça !'}</p>
                ${streak % 7 === 0 ? '<div class="special-reward">🎁 Récompense spéciale débloquée !</div>' : ''}
            </div>
        `;
        
        celebration.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10001;
            animation: fadeIn 0.5s ease-out;
        `;
        
        document.body.appendChild(celebration);
        
        // Fermeture automatique après 3 secondes
        setTimeout(() => {
            celebration.style.animation = 'fadeOut 0.5s ease-out forwards';
            setTimeout(() => {
                if (celebration.parentNode) {
                    celebration.parentNode.removeChild(celebration);
                }
            }, 500);
        }, 3000);
        
        playNotificationSound('celebration');
    }
    
    /**
     * Crée effet confetti
     */
    function createConfettiEffect() {
        const colors = ['#f4a261', '#e76f51', '#2a9d8f', '#264653', '#e9c46a'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                position: fixed;
                top: -10px;
                left: ${Math.random() * 100}vw;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                animation: confetti-fall ${2 + Math.random() * 2}s linear forwards;
                z-index: 10002;
                border-radius: 50%;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 4000);
        }
        
        // Ajouter animation confetti si pas déjà fait
        if (!document.getElementById('confetti-styles')) {
            const style = document.createElement('style');
            style.id = 'confetti-styles';
            style.textContent = `
                @keyframes confetti-fall {
                    0% {
                        transform: translateY(-100vh) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                .celebration-content {
                    background: white;
                    padding: 3rem;
                    border-radius: 20px;
                    text-align: center;
                    max-width: 400px;
                }
                .flame-animation {
                    font-size: 4rem;
                    animation: bounce 0.8s infinite alternate;
                }
                @keyframes bounce {
                    from { transform: scale(1); }
                    to { transform: scale(1.1); }
                }
                .special-reward {
                    background: linear-gradient(135deg, #f4a261, #e76f51);
                    color: white;
                    padding: 0.8rem;
                    border-radius: 10px;
                    margin-top: 1rem;
                    font-weight: bold;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    /**
     * Joue son de notification si possible
     */
    function playNotificationSound(type) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            let frequency;
            switch (type) {
                case 'badge': frequency = 800; break;
                case 'celebration': frequency = 600; break;
                case 'success': frequency = 523; break;
                default: frequency = 440;
            }
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.log('Son non disponible:', error);
        }
    }
    
    /**
     * Met à jour affichage badges dans le dashboard
     */
    function updateBadgeDisplay(badge) {
        const badgeContainer = document.getElementById('french-badges-showcase');
        if (!badgeContainer) return;
        
        // Supprimer message "pas de badges" si présent
        const noBadges = badgeContainer.querySelector('.no-badges');
        if (noBadges) {
            noBadges.remove();
        }
        
        // Ajouter nouveau badge
        const badgeElement = document.createElement('div');
        badgeElement.className = 'badge-item new-badge';
        badgeElement.innerHTML = `
            <div class="badge-icon">${badge.icon}</div>
            <div class="badge-name">${badge.name}</div>
            <div class="badge-date">Aujourd'hui</div>
        `;
        
        badgeContainer.insertBefore(badgeElement, badgeContainer.firstChild);
        
        // Limiter à 3 badges visibles
        const badges = badgeContainer.querySelectorAll('.badge-item');
        if (badges.length > 3) {
            badges[badges.length - 1].remove();
        }
        
        // Animation d'apparition
        setTimeout(() => {
            badgeElement.classList.remove('new-badge');
        }, 1000);
    }
    
    // =====================================
    // FONCTIONS DE DEBUG ET MONITORING
    // =====================================
    
    /**
     * Fonctions de debug pour le développement
     */
    window.FrenchDebug = {
        getAppInstance: () => frenchApp,
        getCurrentProgress: () => frenchApp.getProgressData(),
        simulateStreak: (days) => frenchApp.setStreak(days),
        simulateXPGain: (amount) => frenchApp.addXP(amount),
        resetProgress: () => frenchApp.resetAllProgress(),
        exportData: () => frenchApp.exportProgressForAnalytics(),
        
        // Fonctions de test
        testBadgeNotification: () => {
            showBadgeNotification({
                id: 'test_badge',
                name: 'Badge de Test',
                description: 'Ceci est un test !',
                icon: '🧪'
            });
        },
        
        testStreakCelebration: () => {
            showStreakCelebration({
                streak: 7,
                isNewRecord: true
            });
        },
        
        // Analytics développeur
        getPerformanceMetrics: () => {
            const startTime = performance.mark ? performance.getEntriesByName('french-app-start')[0] : null;
            const currentTime = performance.now();
            
            return {
                loadTime: startTime ? currentTime - startTime.startTime : null,
                memoryUsage: navigator.memory ? navigator.memory.usedJSHeapSize : null,
                localStorage: {
                    used: JSON.stringify(localStorage).length,
                    quota: '5MB (estimated)'
                },
                activeFeatures: {
                    hearts: frenchApp.config.hearts.enabled,
                    streaks: frenchApp.config.streaks.enabled,
                    adaptiveDifficulty: frenchApp.config.difficulty.adaptive
                }
            };
        }
    };
    
    // =====================================
    // FINALISATION INITIALISATION
    // =====================================
    
    // Marquer temps de chargement pour debug
    if (performance.mark) {
        performance.mark('french-app-start');
    }
    
    // Initialisation réussie
    console.log('✅ Section Français Duolingo initialisée avec succès');
    console.log('🔧 Fonctions debug disponibles dans window.FrenchDebug');
    console.log('📊 Métriques:', window.FrenchDebug.getPerformanceMetrics());
    
    // Événement global pour signaler que l'app est prête
    document.dispatchEvent(new CustomEvent('frenchAppReady', {
        detail: {
            app: frenchApp,
            dashboardIntegration,
            features: ['hearts', 'streaks', 'xp', 'badges', 'adaptive-difficulty']
        }
    }));
    
    // Sauvegarde avant fermeture page
    window.addEventListener('beforeunload', function() {
        frenchApp.saveProgress();
    });
    
    // Gestion erreurs globales pour l'app française
    window.addEventListener('error', function(event) {
        if (event.filename && event.filename.includes('french')) {
            console.error('❌ Erreur Section Français:', event.error);
            
            // Tentative de sauvegarde d'urgence
            try {
                frenchApp.saveProgress();
                console.log('💾 Sauvegarde d\'urgence effectuée');
            } catch (saveError) {
                console.error('❌ Échec sauvegarde d\'urgence:', saveError);
            }
        }
    });
    
});

/**
 * FONCTIONS D'INITIALISATION ALTERNATIVES
 * Pour intégration dans différents contextes
 */

/**
 * Initialisation minimale (sans dashboard)
 */
function initializeFrenchAppMinimal() {
    const frenchApp = new FrenchDuolingoApp();
    frenchApp.initialize();
    return frenchApp;
}

/**
 * Initialisation pour tests unitaires
 */
function initializeFrenchAppTesting(mockConfig = {}) {
    const frenchApp = new FrenchDuolingoApp();
    frenchApp.configure({
        storage: { autoSave: false },
        ...mockConfig
    });
    frenchApp.initialize();
    return frenchApp;
}

/**
 * Export pour utilisation modulaire
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeFrenchAppMinimal,
        initializeFrenchAppTesting
    };
}