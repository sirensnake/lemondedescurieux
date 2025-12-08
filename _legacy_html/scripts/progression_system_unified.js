// scripts/progression_system_unified.js - Système complet de progression
class UnifiedProgressionSystem {
    constructor() {
        this.userProfile = this.loadUserProfile();
        this.achievements = this.loadAchievements();
        this.streakSystem = new AdvancedStreakSystem();
        this.badgeSystem = new CompleteBadgeSystem();
        this.levelSystem = new AdaptiveLevelSystem();
        this.notificationSystem = new SmartNotificationSystem();
        
        this.initializeSystem();
    }

    loadUserProfile() {
        return JSON.parse(localStorage.getItem('unified_user_profile')) || {
            createdAt: new Date().toISOString(),
            totalXP: 0,
            globalLevel: 1,
            sectionsProgress: {
                francais: { level: 1, xp: 0, unlockedActivities: ['grammaire'] },
                english: { level: 1, xp: 0, unlockedActivities: ['basic_words'] },
                maths: { level: 1, xp: 0, unlockedActivities: ['addition'] },
                sciences: { level: 1, xp: 0, unlockedActivities: [] }
            },
            preferences: {
                difficulty: 'normal',
                notifications: true,
                soundEffects: true,
                theme: 'minecraft'
            },
            statistics: {
                totalActivitiesCompleted: 0,
                perfectScoresCount: 0,
                totalTimeSpent: 0, // en minutes
                favoriteSection: null,
                weakestSection: null
            }
        };
    }

    loadAchievements() {
        return JSON.parse(localStorage.getItem('user_achievements')) || {
            earned: [],
            progress: {},
            milestones: {}
        };
    }

    // === SYSTÈME DE STREAKS AVANCÉ ===
    class AdvancedStreakSystem {
        constructor() {
            this.streakData = this.loadStreakData();
            this.streakTypes = {
                daily: { name: "Quotidien", multiplier: 1, maxDays: 365 },
                weekly: { name: "Hebdomadaire", multiplier: 3, maxWeeks: 52 },
                perfect: { name: "Parfait", multiplier: 5, resetOnError: true }
            };
        }

        loadStreakData() {
            return JSON.parse(localStorage.getItem('advanced_streaks')) || {
                daily: {
                    current: 0,
                    longest: 0,
                    lastActivity: null,
                    freezeTokens: 3,
                    weekendDoubleXP: false
                },
                weekly: {
                    current: 0,
                    longest: 0,
                    activitiesThisWeek: 0,
                    targetPerWeek: 5
                },
                perfect: {
                    current: 0,
                    longest: 0,
                    lastPerfectDate: null
                }
            };
        }

        recordActivity(section, score = 100, isPerfect = false) {
            const today = new Date().toDateString();
            const now = new Date();

            // Streak quotidien
            this.updateDailyStreak(today);
            
            // Streak hebdomadaire
            this.updateWeeklyStreak();
            
            // Streak parfait
            if (isPerfect) {
                this.updatePerfectStreak(today);
            } else if (this.streakData.perfect.current > 0) {
                this.resetPerfectStreak();
            }

            this.saveStreakData();
            this.checkStreakMilestones();
            
            return {
                dailyStreak: this.streakData.daily.current,
                weeklyStreak: this.streakData.weekly.current,
                perfectStreak: this.streakData.perfect.current,
                bonusXP: this.calculateStreakBonus(section, score)
            };
        }

        updateDailyStreak(today) {
            const lastActivity = this.streakData.daily.lastActivity;
            
            if (lastActivity === today) {
                return; // Déjà compté aujourd'hui
            }

            if (lastActivity === null) {
                // Premier jour
                this.streakData.daily.current = 1;
            } else {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toDateString();

                if (lastActivity === yesterdayStr) {
                    // Continuation du streak
                    this.streakData.daily.current++;
                } else {
                    // Streak cassé, recommencer
                    this.streakData.daily.current = 1;
                }
            }

            this.streakData.daily.lastActivity = today;
            this.streakData.daily.longest = Math.max(
                this.streakData.daily.longest,
                this.streakData.daily.current
            );
        }

        calculateStreakBonus(section, baseScore) {
            let bonusMultiplier = 1;
            
            // Bonus streak quotidien
            if (this.streakData.daily.current >= 3) {
                bonusMultiplier += 0.1 * Math.min(this.streakData.daily.current, 10);
            }
            
            // Bonus weekend
            const isWeekend = [0, 6].includes(new Date().getDay());
            if (isWeekend && this.streakData.daily.weekendDoubleXP) {
                bonusMultiplier *= 2;
            }
            
            // Bonus streak parfait
            if (this.streakData.perfect.current > 0) {
                bonusMultiplier += 0.05 * this.streakData.perfect.current;
            }

            return Math.round(baseScore * (bonusMultiplier - 1));
        }

        useStreakFreeze() {
            if (this.streakData.daily.freezeTokens > 0) {
                this.streakData.daily.freezeTokens--;
                
                // Maintenir le streak artificellement
                const today = new Date().toDateString();
                this.streakData.daily.lastActivity = today;
                
                this.saveStreakData();
                return true;
            }
            return false;
        }

        getStreakStatus() {
            const today = new Date();
            const lastActivity = new Date(this.streakData.daily.lastActivity);
            const daysSinceActivity = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
            
            let status = 'active';
            let urgency = 'none';
            
            if (daysSinceActivity >= 1) {
                status = 'at_risk';
                urgency = 'high';
            } else if (today.getHours() >= 20 && !this.streakData.daily.lastActivity === today.toDateString()) {
                status = 'reminder';
                urgency = 'medium';
            }
            
            return {
                status,
                urgency,
                current: this.streakData.daily.current,
                canUseFreeze: this.streakData.daily.freezeTokens > 0,
                timeUntilMidnight: this.getTimeUntilMidnight()
            };
        }
    }

    // === SYSTÈME DE BADGES COMPLET ===
    class CompleteBadgeSystem {
        constructor() {
            this.badgeDefinitions = this.loadBadgeDefinitions();
            this.earnedBadges = this.loadEarnedBadges();
        }

        loadBadgeDefinitions() {
            return {
                // Badges de progression
                first_steps: {
                    title: "Premiers Pas",
                    description: "Complète ta première activité",
                    icon: "👶",
                    rarity: "common",
                    xpReward: 50,
                    condition: (stats) => stats.totalActivitiesCompleted >= 1
                },
                
                dedicated_learner: {
                    title: "Apprenant Dévoué", 
                    description: "Maintiens un streak de 7 jours",
                    icon: "🔥",
                    rarity: "uncommon",
                    xpReward: 200,
                    condition: (stats) => stats.streaks.daily.current >= 7
                },
                
                perfect_week: {
                    title: "Semaine Parfaite",
                    description: "Obtiens 100% sur toutes les activités pendant 7 jours",
                    icon: "⭐",
                    rarity: "rare",
                    xpReward: 500,
                    condition: (stats) => stats.streaks.perfect.current >= 7
                },

                // Badges par matière
                french_master: {
                    title: "Maître du Français",
                    description: "Atteins le niveau 10 en français",
                    icon: "🇫🇷",
                    rarity: "epic",
                    xpReward: 1000,
                    condition: (stats) => stats.sectionsProgress.francais.level >= 10
                },
                
                english_expert: {
                    title: "Expert Anglais",
                    description: "Apprends 500 mots de vocabulaire anglais",
                    icon: "🇬🇧",
                    rarity: "epic", 
                    xpReward: 1000,
                    condition: (stats) => stats.vocabulary.english >= 500
                },
                
                math_wizard: {
                    title: "Magicien des Maths",
                    description: "Résous 1000 calculs mentaux",
                    icon: "🧙‍♂️",
                    rarity: "legendary",
                    xpReward: 2000,
                    condition: (stats) => stats.mathCalculations >= 1000
                },

                // Badges spéciaux
                speed_demon: {
                    title: "Démon de la Vitesse",
                    description: "Réponds en moins de 3 secondes 50 fois",
                    icon: "⚡",
                    rarity: "rare",
                    xpReward: 300,
                    condition: (stats) => stats.speedAnswers >= 50
                },
                
                night_owl: {
                    title: "Chouette de Nuit",
                    description: "Étudie après 21h",
                    icon: "🦉",
                    rarity: "uncommon",
                    xpReward: 100,
                    condition: (stats) => new Date().getHours() >= 21
                },
                
                early_bird: {
                    title: "Lève-tôt",
                    description: "Étudie avant 7h",
                    icon: "🐦",
                    rarity: "uncommon", 
                    xpReward: 100,
                    condition: (stats) => new Date().getHours() <= 7
                },

                // Badges sociaux/communauté
                helpful_friend: {
                    title: "Ami Serviable",
                    description: "Partage 10 codes de progression",
                    icon: "🤝",
                    rarity: "rare",
                    xpReward: 250,
                    condition: (stats) => stats.sharesCount >= 10
                },
                
                teacher_pet: {
                    title: "Chouchou du Prof",
                    description: "Utilisé par un enseignant en classe",
                    icon: "🍎",
                    rarity: "epic",
                    xpReward: 500,
                    condition: (stats) => stats.classroomUsage === true
                }
            };
        }

        checkAndAwardBadges(userStats) {
            const newBadges = [];
            
            Object.entries(this.badgeDefinitions).forEach(([badgeId, badge]) => {
                if (!this.earnedBadges.includes(badgeId) && badge.condition(userStats)) {
                    this.awardBadge(badgeId);
                    newBadges.push(badge);
                }
            });
            
            return newBadges;
        }

        awardBadge(badgeId) {
            const badge = this.badgeDefinitions[badgeId];
            if (!badge) return false;
            
            this.earnedBadges.push({
                id: badgeId,
                ...badge,
                earnedAt: new Date().toISOString(),
                notified: false
            });
            
            this.saveEarnedBadges();
            
            // Déclencher notification
            if (this.notificationSystem) {
                this.notificationSystem.showBadgeEarned(badge);
            }
            
            return true;
        }

        getBadgesByRarity(rarity) {
            return this.earnedBadges.filter(badge => 
                this.badgeDefinitions[badge.id]?.rarity === rarity
            );
        }

        getCompletionRate() {
            const totalBadges = Object.keys(this.badgeDefinitions).length;
            const earnedCount = this.earnedBadges.length;
            return Math.round((earnedCount / totalBadges) * 100);
        }
    }

    // === SYSTÈME DE NOTIFICATIONS INTELLIGENT ===
    class SmartNotificationSystem {
        constructor() {
            this.notificationQueue = [];
            this.userPreferences = this.loadNotificationPreferences();
            this.lastNotification = null;
        }

        loadNotificationPreferences() {
            return JSON.parse(localStorage.getItem('notification_preferences')) || {
                streakReminders: true,
                badgeNotifications: true,
                levelUpCelebrations: true,
                encouragements: true,
                dailyReminder: { enabled: true, time: "19:00" },
                weeklyReport: { enabled: true, day: "sunday" }
            };
        }

        scheduleStreakReminder() {
            if (!this.userPreferences.streakReminders) return;
            
            const streakStatus = this.streakSystem.getStreakStatus();
            
            if (streakStatus.urgency === 'high') {
                this.showNotification({
                    type: 'streak_warning',
                    title: '🔥 Streak en danger !',
                    message: `Ton streak de ${streakStatus.current} jours va se perdre ! Fais une activité rapidement.`,
                    action: { text: 'Sauver mon streak', callback: 'openApp' },
                    priority: 'high'
                });
            } else if (streakStatus.urgency === 'medium') {
                this.showNotification({
                    type: 'streak_reminder',
                    title: '⏰ N\'oublie pas ton streak !',
                    message: `Plus que ${streakStatus.timeUntilMidnight} pour maintenir ton streak de ${streakStatus.current} jours.`,
                    action: { text: 'Continuer', callback: 'openApp' },
                    priority: 'medium'
                });
            }
        }

        showBadgeEarned(badge) {
            if (!this.userPreferences.badgeNotifications) return;
            
            this.showNotification({
                type: 'badge_earned',
                title: '🏆 Nouveau badge !',
                message: `Tu as gagné le badge "${badge.title}" ! +${badge.xpReward} XP`,
                action: { text: 'Voir mes badges', callback: 'openBadges' },
                priority: 'high',
                animation: 'celebration'
            });
        }

        showLevelUp(section, newLevel) {
            if (!this.userPreferences.levelUpCelebrations) return;
            
            this.showNotification({
                type: 'level_up',
                title: '🎉 Niveau supérieur !',
                message: `Félicitations ! Tu atteins le niveau ${newLevel} en ${section} !`,
                action: { text: 'Continuer', callback: 'openSection', params: section },
                priority: 'high',
                animation: 'level_up'
            });
        }

        showEncouragement(context) {
            if (!this.userPreferences.encouragements) return;
            
            const encouragements = {
                after_mistake: [
                    "💪 Pas grave ! On apprend de ses erreurs.",
                    "🌟 Continue, tu y es presque !",
                    "🚀 Chaque erreur est un pas vers la réussite !"
                ],
                low_streak: [
                    "🔥 Redémarre ton streak aujourd'hui !",
                    "⭐ Un nouveau départ, c'est toujours possible !",
                    "🎯 Fixe-toi un petit objectif pour aujourd'hui !"
                ],
                return_user: [
                    "👋 Content de te revoir !",
                    "🎊 Prêt pour de nouvelles aventures ?",
                    "📚 Tes leçons t'attendent !"
                ]
            };
            
            const messages = encouragements[context] || encouragements.return_user;
            const message = messages[Math.floor(Math.random() * messages.length)];
            
            this.showNotification({
                type: 'encouragement',
                title: message.split(' ')[0],
                message: message.substring(message.indexOf(' ') + 1),
                priority: 'low',
                autoHide: true
            });
        }

        showNotification(notification) {
            // Implementation dépendante du contexte (browser notifications, in-app, etc.)
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(notification.title, {
                    body: notification.message,
                    icon: '/images/logo-notification.png',
                    badge: '/images/badge-icon.png'
                });
            }
            
            // Notification in-app
            this.showInAppNotification(notification);
        }

        showInAppNotification(notification) {
            // Créer notification in-app avec animation
            const notificationElement = document.createElement('div');
            notificationElement.className = `notification ${notification.type} ${notification.priority}`;
            notificationElement.innerHTML = `
                <div class="notification-content">
                    <h4>${notification.title}</h4>
                    <p>${notification.message}</p>
                    ${notification.action ? `
                        <button class="notification-action" onclick="${notification.action.callback}(${notification.action.params || ''})">
                            ${notification.action.text}
                        </button>
                    ` : ''}
                </div>
                <button class="notification-close">×</button>
            `;
            
            document.body.appendChild(notificationElement);
            
            // Auto-hide si spécifié
            if (notification.autoHide) {
                setTimeout(() => {
                    notificationElement.remove();
                }, 5000);
            }
            
            // Gestionnaire de fermeture
            notificationElement.querySelector('.notification-close').addEventListener('click', () => {
                notificationElement.remove();
            });
        }
    }

    // === API PUBLIQUE ===
    recordActivity(section, activityType, score, timeSpent, isPerfect = false) {
        const result = {
            section,
            activityType,
            score,
            timeSpent,
            isPerfect,
            timestamp: new Date().toISOString()
        };
        
        // Enregistrer l'activité
        this.userProfile.sectionsProgress[section].xp += score;
        this.userProfile.totalXP += score;
        this.userProfile.statistics.totalActivitiesCompleted++;
        this.userProfile.statistics.totalTimeSpent += timeSpent;
        
        if (isPerfect) {
            this.userProfile.statistics.perfectScoresCount++;
        }
        
        // Vérifier niveau up
        const newLevel = this.levelSystem.checkLevelUp(section, this.userProfile.sectionsProgress[section].xp);
        if (newLevel > this.userProfile.sectionsProgress[section].level) {
            this.userProfile.sectionsProgress[section].level = newLevel;
            this.notificationSystem.showLevelUp(section, newLevel);
        }
        
        // Enregistrer streak
        const streakResult = this.streakSystem.recordActivity(section, score, isPerfect);
        
        // Vérifier badges
        const newBadges = this.badgeSystem.checkAndAwardBadges(this.userProfile);
        
        // Sauvegarder
        this.saveUserProfile();
        
        return {
            ...result,
            ...streakResult,
            newLevel: newLevel > this.userProfile.sectionsProgress[section].level ? newLevel : null,
            newBadges,
            totalXP: this.userProfile.totalXP
        };
    }

    getProgressSummary() {
        return {
            totalXP: this.userProfile.totalXP,
            globalLevel: this.levelSystem.calculateGlobalLevel(this.userProfile.totalXP),
            sections: this.userProfile.sectionsProgress,
            streaks: this.streakSystem.streakData,
            badges: {
                earned: this.badgeSystem.earnedBadges.length,
                total: Object.keys(this.badgeSystem.badgeDefinitions).length,
                completion: this.badgeSystem.getCompletionRate()
            },
            statistics: this.userProfile.statistics
        };
    }

    exportProgress() {
        return {
            profile: this.userProfile,
            achievements: this.achievements,
            streaks: this.streakSystem.streakData,
            badges: this.badgeSystem.earnedBadges,
            exportedAt: new Date().toISOString(),
            version: "1.0.0"
        };
    }

    saveUserProfile() {
        localStorage.setItem('unified_user_profile', JSON.stringify(this.userProfile));
    }
}

// Instance globale
const progressionSystem = new UnifiedProgressionSystem();

// Export
if (typeof window !== 'undefined') {
    window.UnifiedProgressionSystem = UnifiedProgressionSystem;
    window.progressionSystem = progressionSystem;
}