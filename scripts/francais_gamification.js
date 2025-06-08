/**
 * FRANCAIS_GAMIFICATION.JS
 * Système complet Duolingo-style pour section Français
 * Compatible avec localStorage existant "Le Monde des Curieux"
 */

class FrenchGameSystem {
    constructor() {
        this.storageKey = 'lemondedescurieux_french';
        this.globalProgressKey = 'userProgress'; // Compatibilité existante
        
        // Configuration par défaut
        this.config = {
            hearts: {
                maxHearts: 5,
                regenTimeMinutes: 30,
                lossOnError: 1
            },
            streaks: {
                requiredDaily: 1, // 1 activité minimum par jour
                notificationHour: 18 // Rappel à 18h
            },
            xp: {
                perQuestion: 10,
                streakBonus: 1.5,
                perfectBonus: 2.0,
                minimumPerLesson: 50
            },
            levels: {
                xpPerLevel: 100,
                maxLevel: 20
            }
        };
        
        this.data = this.loadData();
        this.initializeUI();
        this.startDailyCheck();
        
        console.log('🎮 Section Français Duolingo initialisée avec succès');
    }
    
    /**
     * GESTION DES DONNÉES
     */
    loadData() {
        const stored = localStorage.getItem(this.storageKey);
        const defaultData = {
            // Système cœurs/vies
            hearts: {
                current: this.config.hearts.maxHearts,
                lastLoss: null,
                regenStartTime: null
            },
            
            // Streaks quotidiens
            streaks: {
                current: 0,
                longest: 0,
                lastActivityDate: null,
                totalDays: 0
            },
            
            // Expérience et niveaux
            xp: {
                total: 0,
                currentLevel: 1,
                currentLevelXP: 0,
                nextLevelXP: this.config.levels.xpPerLevel
            },
            
            // Progression par activité
            activities: {
                conjugaison: { completed: 0, total: 10, unlocked: true },
                grammaire: { completed: 0, total: 8, unlocked: false },
                vocabulaire: { completed: 0, total: 12, unlocked: false },
                orthographe: { completed: 0, total: 15, unlocked: false },
                lecture: { completed: 0, total: 6, unlocked: false }
            },
            
            // Statistiques
            stats: {
                totalQuestions: 0,
                correctAnswers: 0,
                totalTime: 0,
                sessionsCompleted: 0,
                achievementsUnlocked: []
            },
            
            // Dernière session
            lastSession: null,
            createdAt: new Date().toISOString()
        };
        
        return stored ? { ...defaultData, ...JSON.parse(stored) } : defaultData;
    }
    
    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        this.updateGlobalProgress();
    }
    
    updateGlobalProgress() {
        // Intégration avec le système existant
        const globalProgress = JSON.parse(localStorage.getItem(this.globalProgressKey)) || {};
        
        if (!globalProgress.francais) {
            globalProgress.francais = {};
        }
        
        // Sync des données importantes
        globalProgress.francais.level = this.data.xp.currentLevel;
        globalProgress.francais.xp = this.data.xp.total;
        globalProgress.francais.streak = this.data.streaks.current;
        globalProgress.francais.activitiesCompleted = Object.values(this.data.activities)
            .reduce((sum, activity) => sum + activity.completed, 0);
        
        localStorage.setItem(this.globalProgressKey, JSON.stringify(globalProgress));
    }
    
    /**
     * SYSTÈME CŒURS/VIES
     */
    getCurrentHearts() {
        this.processHeartRegeneration();
        return this.data.hearts.current;
    }
    
    loseHeart() {
        if (this.data.hearts.current > 0) {
            this.data.hearts.current -= this.config.hearts.lossOnError;
            this.data.hearts.lastLoss = Date.now();
            
            // Démarrer régénération si c'est le premier cœur perdu
            if (this.data.hearts.current === this.config.hearts.maxHearts - 1) {
                this.data.hearts.regenStartTime = Date.now();
            }
            
            this.updateHeartsDisplay();
            this.saveData();
            
            // Animation cœur perdu
            this.animateHeartLoss();
            
            return this.data.hearts.current > 0;
        }
        return false;
    }
    
    processHeartRegeneration() {
        if (this.data.hearts.regenStartTime && this.data.hearts.current < this.config.hearts.maxHearts) {
            const elapsed = Date.now() - this.data.hearts.regenStartTime;
            const regenTime = this.config.hearts.regenTimeMinutes * 60 * 1000;
            const heartsToRegen = Math.floor(elapsed / regenTime);
            
            if (heartsToRegen > 0) {
                this.data.hearts.current = Math.min(
                    this.config.hearts.maxHearts,
                    this.data.hearts.current + heartsToRegen
                );
                
                if (this.data.hearts.current === this.config.hearts.maxHearts) {
                    this.data.hearts.regenStartTime = null;
                } else {
                    this.data.hearts.regenStartTime += heartsToRegen * regenTime;
                }
                
                this.updateHeartsDisplay();
                this.saveData();
            }
        }
    }
    
    getNextHeartTime() {
        if (!this.data.hearts.regenStartTime || this.data.hearts.current >= this.config.hearts.maxHearts) {
            return null;
        }
        
        const elapsed = Date.now() - this.data.hearts.regenStartTime;
        const regenTime = this.config.hearts.regenTimeMinutes * 60 * 1000;
        const timeToNext = regenTime - (elapsed % regenTime);
        
        return timeToNext;
    }
    
    /**
     * SYSTÈME STREAKS
     */
    recordActivity() {
        const today = new Date().toDateString();
        const lastActivity = this.data.streaks.lastActivityDate;
        
        if (lastActivity === today) {
            return false; // Déjà fait aujourd'hui
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastActivity === yesterday.toDateString()) {
            // Continuation du streak
            this.data.streaks.current++;
        } else if (lastActivity === null || this.isStreakBroken(lastActivity)) {
            // Nouveau streak ou broken
            this.data.streaks.current = 1;
        }
        
        // Mise à jour records
        this.data.streaks.longest = Math.max(this.data.streaks.longest, this.data.streaks.current);
        this.data.streaks.lastActivityDate = today;
        this.data.streaks.totalDays++;
        
        this.updateStreakDisplay();
        this.saveData();
        
        // Célébration milestone
        if (this.data.streaks.current % 7 === 0) {
            this.showStreakCelebration();
        }
        
        return true;
    }
    
    isStreakBroken(lastActivity) {
        const lastDate = new Date(lastActivity);
        const today = new Date();
        const diffTime = Math.abs(today - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays > 1;
    }
    
    /**
     * SYSTÈME XP/NIVEAUX
     */
    addXP(baseXP, isCorrect = true, isPerfect = false) {
        if (!isCorrect) return 0;
        
        let xp = baseXP;
        
        // Bonus streak
        if (this.data.streaks.current > 0) {
            xp *= this.config.xp.streakBonus;
        }
        
        // Bonus parfait
        if (isPerfect) {
            xp *= this.config.xp.perfectBonus;
        }
        
        xp = Math.round(xp);
        
        this.data.xp.total += xp;
        this.data.xp.currentLevelXP += xp;
        
        // Vérification niveau suivant
        while (this.data.xp.currentLevelXP >= this.data.xp.nextLevelXP && this.data.xp.currentLevel < this.config.levels.maxLevel) {
            this.levelUp();
        }
        
        this.updateXPDisplay();
        this.saveData();
        
        return xp;
    }
    
    levelUp() {
        this.data.xp.currentLevelXP -= this.data.xp.nextLevelXP;
        this.data.xp.currentLevel++;
        this.data.xp.nextLevelXP = this.config.levels.xpPerLevel * this.data.xp.currentLevel;
        
        // Débloquer nouvelle activité
        this.unlockNextActivity();
        
        // Animation level up
        this.showLevelUpCelebration();
    }
    
    unlockNextActivity() {
        const activities = ['conjugaison', 'grammaire', 'vocabulaire', 'orthographe', 'lecture'];
        const unlockedCount = activities.filter(activity => this.data.activities[activity].unlocked).length;
        
        if (unlockedCount < activities.length) {
            const nextActivity = activities[unlockedCount];
            this.data.activities[nextActivity].unlocked = true;
            this.showActivityUnlocked(nextActivity);
        }
    }
    
    /**
     * INTERFACE UTILISATEUR
     */
    initializeUI() {
        this.updateHeartsDisplay();
        this.updateStreakDisplay();
        this.updateXPDisplay();
        this.updateActivitiesDisplay();
        this.startHeartTimer();
    }
    
    updateHeartsDisplay() {
        const heartsContainer = document.getElementById('hearts-display');
        if (!heartsContainer) return;
        
        const currentHearts = this.getCurrentHearts();
        let heartsHTML = '';
        
        for (let i = 0; i < this.config.hearts.maxHearts; i++) {
            const isFilled = i < currentHearts;
            const heartClass = isFilled ? 'filled' : 'empty';
            heartsHTML += `<div class="heart ${heartClass}">❤️</div>`;
        }
        
        // Timer régénération
        const nextHeartTime = this.getNextHeartTime();
        if (nextHeartTime && currentHearts < this.config.hearts.maxHearts) {
            const minutes = Math.floor(nextHeartTime / (1000 * 60));
            const seconds = Math.floor((nextHeartTime % (1000 * 60)) / 1000);
            heartsHTML += `
                <div class="hearts-regeneration">
                    <span>⏱️</span>
                    <span class="hearts-timer">${minutes}:${seconds.toString().padStart(2, '0')}</span>
                </div>
            `;
        }
        
        heartsContainer.innerHTML = heartsHTML;
    }
    
    updateStreakDisplay() {
        const streakContainer = document.getElementById('streak-counter');
        if (!streakContainer) return;
        
        const streak = this.data.streaks.current;
        const isActive = streak > 0;
        
        streakContainer.innerHTML = `
            <div class="streak-flame ${isActive ? 'active' : ''}">${isActive ? '🔥' : '💨'}</div>
            <div class="streak-count">${streak}</div>
            <div class="streak-label">jour${streak > 1 ? 's' : ''} de suite</div>
        `;
        
        if (isActive) {
            streakContainer.classList.add('active');
        }
    }
    
    updateXPDisplay() {
        const xpContainer = document.getElementById('xp-bar');
        if (!xpContainer) return;
        
        const progress = (this.data.xp.currentLevelXP / this.data.xp.nextLevelXP) * 100;
        
        xpContainer.innerHTML = `
            <div class="xp-progress" style="width: ${progress}%"></div>
        `;
        
        const xpText = document.getElementById('xp-text');
        if (xpText) {
            xpText.textContent = `Niveau ${this.data.xp.currentLevel} • ${this.data.xp.currentLevelXP}/${this.data.xp.nextLevelXP} XP`;
        }
    }
    
    updateActivitiesDisplay() {
        Object.entries(this.data.activities).forEach(([activityName, activityData]) => {
            const card = document.querySelector(`.activity-${activityName}`);
            if (!card) return;
            
            // État débloqué/verrouillé
            if (activityData.unlocked) {
                card.classList.remove('locked');
            } else {
                card.classList.add('locked');
            }
            
            // Progression
            const progressBar = card.querySelector('.progress-fill');
            const progressText = card.querySelector('.progress-text');
            
            if (progressBar && progressText) {
                const progress = (activityData.completed / activityData.total) * 100;
                progressBar.style.width = `${progress}%`;
                progressText.textContent = `${activityData.completed}/${activityData.total}`;
            }
            
            // Statistiques
            const completedStat = card.querySelector('.stat-completed .stat-value');
            const totalStat = card.querySelector('.stat-total .stat-value');
            
            if (completedStat) completedStat.textContent = activityData.completed;
            if (totalStat) totalStat.textContent = activityData.total;
            
            // État complété
            if (activityData.completed >= activityData.total) {
                card.classList.add('completed');
            }
        });
    }
    
    /**
     * ANIMATIONS ET NOTIFICATIONS
     */
    animateHeartLoss() {
        const hearts = document.querySelectorAll('.heart.filled');
        if (hearts.length > 0) {
            const lastHeart = hearts[hearts.length - 1];
            lastHeart.classList.add('lost');
            
            setTimeout(() => {
                lastHeart.classList.remove('filled', 'lost');
                lastHeart.classList.add('empty');
            }, 500);
        }
    }
    
    showStreakCelebration() {
        const message = this.data.streaks.current === 7 ? 
            "🎉 Première semaine complète !" :
            `🔥 ${this.data.streaks.current} jours de suite ! Tu es en feu !`;
            
        this.showNotification("Streak Incroyable !", message, "🔥");
    }
    
    showLevelUpCelebration() {
        this.showNotification(
            "Niveau Supérieur !",
            `Félicitations ! Tu as atteint le niveau ${this.data.xp.currentLevel} !`,
            "⭐"
        );
    }
    
    showActivityUnlocked(activityName) {
        const activityNames = {
            conjugaison: "Conjugaison",
            grammaire: "Grammaire", 
            vocabulaire: "Vocabulaire",
            orthographe: "Orthographe",
            lecture: "Lecture"
        };
        
        this.showNotification(
            "Nouvelle Activité !",
            `${activityNames[activityName]} est maintenant débloquée !`,
            "🎯"
        );
    }
    
    showNotification(title, message, icon = "🎉") {
        const notification = document.createElement('div');
        notification.className = 'notification-overlay';
        notification.innerHTML = `
            <div class="notification">
                <div class="notification-icon">${icon}</div>
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
                <button class="french-btn french-btn-primary" onclick="this.closest('.notification-overlay').remove()">
                    Super ! 👍
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto-removal après 5 secondes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    /**
     * GESTION DES LEÇONS
     */
    startLesson(activityType, lessonId) {
        if (!this.data.activities[activityType]?.unlocked) {
            this.showNotification("Activité Verrouillée", "Continue tes autres activités pour débloquer celle-ci !", "🔒");
            return false;
        }
        
        if (this.getCurrentHearts() <= 0) {
            this.showNotification("Plus de Cœurs", "Attends que tes cœurs se régénèrent ou reviens plus tard !", "💔");
            return false;
        }
        
        this.currentLesson = {
            activityType,
            lessonId,
            startTime: Date.now(),
            questions: 0,
            correct: 0,
            perfect: true
        };
        
        return true;
    }
    
    answerQuestion(isCorrect) {
        if (!this.currentLesson) return;
        
        this.currentLesson.questions++;
        this.data.stats.totalQuestions++;
        
        if (isCorrect) {
            this.currentLesson.correct++;
            this.data.stats.correctAnswers++;
            
            // XP pour bonne réponse
            const xpGained = this.addXP(this.config.xp.perQuestion, true, false);
            this.showXPGain(xpGained);
        } else {
            this.currentLesson.perfect = false;
            
            // Perte de cœur
            const hasHearts = this.loseHeart();
            if (!hasHearts) {
                this.endLesson(true); // Fin forcée
                return false;
            }
        }
        
        return true;
    }
    
    completeLesson() {
        if (!this.currentLesson) return;
        
        const { activityType, questions, correct } = this.currentLesson;
        const score = Math.round((correct / questions) * 100);
        
        // XP de fin de leçon
        let bonusXP = this.config.xp.minimumPerLesson;
        if (this.currentLesson.perfect) {
            bonusXP = this.addXP(bonusXP, true, true);
        } else {
            bonusXP = this.addXP(bonusXP, true, false);
        }
        
        // Mise à jour progression
        this.data.activities[activityType].completed++;
        this.data.stats.sessionsCompleted++;
        this.data.stats.totalTime += Date.now() - this.currentLesson.startTime;
        
        // Enregistrer activité quotidienne
        this.recordActivity();
        
        this.saveData();
        this.updateActivitiesDisplay();
        
        // Résultats
        this.showLessonResults(score, bonusXP, this.currentLesson.perfect);
        
        this.currentLesson = null;
    }
    
    showXPGain(xp) {
        const xpIndicator = document.createElement('div');
        xpIndicator.className = 'xp-gain-indicator';
        xpIndicator.textContent = `+${xp} XP`;
        xpIndicator.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--gamification-xp);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: bold;
            z-index: 1000;
            animation: xpGainFloat 2s ease-out forwards;
        `;
        
        document.body.appendChild(xpIndicator);
        
        setTimeout(() => xpIndicator.remove(), 2000);
    }
    
    showLessonResults(score, xpGained, perfect) {
        let message = `Score: ${score}% • +${xpGained} XP`;
        if (perfect) message += " • Parfait ! 🌟";
        
        this.showNotification(
            "Leçon Terminée !",
            message,
            score >= 80 ? "🎉" : "👍"
        );
    }
    
    /**
     * UTILITAIRES
     */
    startDailyCheck() {
        // Vérification quotidienne streak
        setInterval(() => {
            this.checkDailyStreak();
        }, 60000); // Toutes les minutes
    }
    
    checkDailyStreak() {
        const now = new Date();
        const hour = now.getHours();
        
        // Rappel à 18h si pas d'activité aujourd'hui
        if (hour === this.config.streaks.notificationHour) {
            const today = now.toDateString();
            if (this.data.streaks.lastActivityDate !== today) {
                this.showNotification(
                    "N'oublie pas ton Français !",
                    "Fais au moins une activité pour maintenir ton streak ! 🔥",
                    "⏰"
                );
            }
        }
    }
    
    startHeartTimer() {
        setInterval(() => {
            this.updateHeartsDisplay();
        }, 1000);
    }
    
    /**
     * API PUBLIQUE POUR DEBUG
     */
    getStats() {
        return {
            hearts: this.getCurrentHearts(),
            streak: this.data.streaks.current,
            level: this.data.xp.currentLevel,
            totalXP: this.data.xp.total,
            activitiesUnlocked: Object.values(this.data.activities).filter(a => a.unlocked).length,
            accuracy: this.data.stats.totalQuestions > 0 ? 
                Math.round((this.data.stats.correctAnswers / this.data.stats.totalQuestions) * 100) : 0
        };
    }
    
    resetProgress() {
        if (confirm('⚠️ Supprimer toute la progression français ?')) {
            localStorage.removeItem(this.storageKey);
            location.reload();
        }
    }
    
    exportData() {
        const exportData = {
            ...this.data,
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `francais_progress_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialisation globale
let frenchGame;

document.addEventListener('DOMContentLoaded', () => {
    frenchGame = new FrenchGameSystem();
    
    // Exposition pour debug
    window.FrenchDebug = {
        getStats: () => frenchGame.getStats(),
        resetProgress: () => frenchGame.resetProgress(),
        exportData: () => frenchGame.exportData(),
        addXP: (amount) => frenchGame.addXP(amount, true, false),
        loseHeart: () => frenchGame.loseHeart(),
        getAppInstance: () => frenchGame
    };
});

// Styles CSS pour animations XP
const style = document.createElement('style');
style.textContent = `
    @keyframes xpGainFloat {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        50% {
            transform: translate(-50%, -60%) scale(1.2);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -70%) scale(1);
        }
    }
`;
document.head.appendChild(style);