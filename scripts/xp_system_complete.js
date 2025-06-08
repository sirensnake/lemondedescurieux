/**
 * Système XP Complet pour Le Monde des Curieux
 * Intégration avec StreakManager et HeartSystem existants
 * Compatible avec localStorage et architecture modulaire existante
 */

class XPManager {
    constructor() {
        this.xpData = this.loadXPData();
        this.levelThresholds = this.initializeLevelThresholds();
        this.activityPoints = this.initializeActivityPoints();
        this.achievementMultipliers = this.initializeAchievementMultipliers();
        
        // Intégration avec systèmes existants
        this.streakManager = window.streakManager;
        this.heartSystem = window.heartSystem;
        
        this.initializeXPDisplay();
        this.bindEvents();
        
        console.log('💡 XP System initialisé avec succès:', this.xpData);
    }

    loadXPData() {
        const defaultXPData = {
            currentXP: 0,
            currentLevel: 1,
            totalXPEarned: 0,
            sessionsCompleted: 0,
            perfectSessions: 0,
            lastActivityDate: null,
            weeklyXP: 0,
            weekStartDate: this.getWeekStart(),
            achievements: [],
            xpHistory: []
        };
        
        const saved = JSON.parse(localStorage.getItem('lemondedescurieux_xp') || '{}');
        return { ...defaultXPData, ...saved };
    }

    saveXPData() {
        localStorage.setItem('lemondedescurieux_xp', JSON.stringify(this.xpData));
        this.updateXPDisplay();
        this.triggerXPEvents();
    }

    initializeLevelThresholds() {
        return {
            // Progression adaptée enfants 8-10 ans
            1: 0,     2: 200,   3: 400,   4: 600,   5: 800,
            6: 1200,  7: 1600,  8: 2000,  9: 2400,  10: 2800,
            11: 3400, 12: 4000, 13: 4600, 14: 5200, 15: 5800,
            16: 6600, 17: 7400, 18: 8200, 19: 9000, 20: 10000
        };
    }

    initializeActivityPoints() {
        return {
            // Points de base par type d'activité
            quiz_correct: 10,
            quiz_perfect: 20,
            lesson_completed: 15,
            mini_game_win: 25,
            streak_bonus: 5,
            heart_saved: 2,
            daily_challenge: 50,
            first_try_perfect: 30,
            
            // Bonus multiplicateurs
            difficulty_easy: 1.0,
            difficulty_medium: 1.2,
            difficulty_hard: 1.5,
            
            // Bonus séquences
            consecutive_correct: 5,
            session_no_errors: 25,
            daily_goal_reached: 40
        };
    }

    initializeAchievementMultipliers() {
        return {
            'first_day': 2.0,        // Premier jour = double XP
            'week_streak': 1.5,      // Semaine consécutive = +50%
            'perfect_week': 2.5,     // Semaine parfaite = +150%
            'month_active': 3.0,     // Mois actif = triple XP
            'quick_learner': 1.3,    // Réponses rapides = +30%
            'night_owl': 1.2,       // Études tardives = +20%
            'early_bird': 1.2       // Études matinales = +20%
        };
    }

    /**
     * FONCTION PRINCIPALE : Ajouter XP avec calculs automatiques
     */
    addXP(baseAmount, activityType, contextData = {}) {
        let finalXP = baseAmount;
        let bonusDetails = [];

        // 1. Bonus streak (intégration StreakManager)
        if (this.streakManager && this.streakManager.streakData.currentStreak > 0) {
            const streakBonus = Math.min(this.streakManager.streakData.currentStreak * 2, 50);
            finalXP += streakBonus;
            bonusDetails.push(`🔥 Streak ${this.streakManager.streakData.currentStreak}: +${streakBonus}XP`);
        }

        // 2. Bonus cœurs conservés (intégration HeartSystem)
        if (this.heartSystem && this.heartSystem.heartsData.currentHearts === 5) {
            const heartBonus = 10;
            finalXP += heartBonus;
            bonusDetails.push(`💖 Cœurs pleins: +${heartBonus}XP`);
        }

        // 3. Bonus performance (contextuel)
        if (contextData.perfect) {
            finalXP *= 2;
            bonusDetails.push(`⭐ Performance parfaite: x2`);
        }

        if (contextData.fastResponse && contextData.responseTime < 3000) {
            const speedBonus = 5;
            finalXP += speedBonus;
            bonusDetails.push(`⚡ Réponse rapide: +${speedBonus}XP`);
        }

        // 4. Bonus niveau de difficulté
        const difficultyMultiplier = this.activityPoints[`difficulty_${contextData.difficulty || 'medium'}`];
        finalXP = Math.floor(finalXP * difficultyMultiplier);

        // 5. Bonus achievements actifs
        const achievementMultiplier = this.calculateActiveAchievementMultiplier();
        if (achievementMultiplier > 1) {
            finalXP = Math.floor(finalXP * achievementMultiplier);
            bonusDetails.push(`🏆 Bonus achievements: x${achievementMultiplier.toFixed(1)}`);
        }

        // Mise à jour données
        const oldLevel = this.getCurrentLevel();
        this.xpData.currentXP += finalXP;
        this.xpData.totalXPEarned += finalXP;
        this.xpData.lastActivityDate = new Date().toISOString();
        this.xpData.sessionsCompleted++;
        
        // Gestion XP hebdomadaire
        this.updateWeeklyXP(finalXP);
        
        // Enregistrement historique
        this.recordXPGain(finalXP, activityType, bonusDetails);

        // Vérification level up
        const newLevel = this.getCurrentLevel();
        let levelUpData = null;
        if (newLevel > oldLevel) {
            levelUpData = this.handleLevelUp(oldLevel, newLevel);
        }

        this.saveXPData();

        // Retour des résultats pour animations
        return {
            xpGained: finalXP,
            totalXP: this.xpData.currentXP,
            currentLevel: newLevel,
            levelUp: levelUpData,
            bonusDetails: bonusDetails,
            nextLevelProgress: this.getNextLevelProgress()
        };
    }

    getCurrentLevel() {
        const currentXP = this.xpData.currentXP;
        let level = 1;
        
        for (let [lvl, threshold] of Object.entries(this.levelThresholds)) {
            if (currentXP >= threshold) {
                level = parseInt(lvl);
            } else {
                break;
            }
        }
        
        return level;
    }

    getNextLevelProgress() {
        const currentLevel = this.getCurrentLevel();
        const currentXP = this.xpData.currentXP;
        const currentThreshold = this.levelThresholds[currentLevel];
        const nextThreshold = this.levelThresholds[currentLevel + 1];
        
        if (!nextThreshold) {
            return { 
                progress: 100, 
                remaining: 0, 
                total: currentXP,
                isMaxLevel: true 
            };
        }
        
        const progressXP = currentXP - currentThreshold;
        const neededXP = nextThreshold - currentThreshold;
        const progressPercent = Math.floor((progressXP / neededXP) * 100);
        
        return {
            progress: progressPercent,
            remaining: nextThreshold - currentXP,
            total: neededXP,
            isMaxLevel: false
        };
    }

    handleLevelUp(oldLevel, newLevel) {
        const levelUpData = {
            oldLevel,
            newLevel,
            rewards: this.calculateLevelRewards(newLevel),
            timestamp: new Date().toISOString()
        };

        // Bonus level up (récupération cœurs, streak protection)
        if (this.heartSystem) {
            this.heartSystem.heartsData.currentHearts = 5; // Récupération complète
            this.heartSystem.saveHearts();
        }

        // Achievement level milestones
        this.checkLevelAchievements(newLevel);
        
        // Animation level up
        this.showLevelUpAnimation(levelUpData);
        
        console.log('🎉 LEVEL UP!', levelUpData);
        return levelUpData;
    }

    calculateLevelRewards(level) {
        const rewards = [];
        
        if (level % 5 === 0) {
            rewards.push('🎁 Bonus mystère débloqué!');
        }
        
        if (level === 10) {
            rewards.push('🌟 Mode Expert débloqué!');
        }
        
        if (level === 15) {
            rewards.push('👑 Statut Maître des Curieux!');
        }
        
        return rewards;
    }

    updateWeeklyXP(xpGained) {
        const currentWeekStart = this.getWeekStart();
        
        if (this.xpData.weekStartDate !== currentWeekStart) {
            // Nouvelle semaine
            this.xpData.weeklyXP = xpGained;
            this.xpData.weekStartDate = currentWeekStart;
        } else {
            this.xpData.weeklyXP += xpGained;
        }
    }

    calculateActiveAchievementMultiplier() {
        let multiplier = 1.0;
        
        // Vérifications basées sur patterns d'utilisation
        const now = new Date();
        const hour = now.getHours();
        
        if (hour >= 6 && hour <= 8) {
            multiplier *= this.achievementMultipliers.early_bird;
        }
        
        if (hour >= 20 && hour <= 22) {
            multiplier *= this.achievementMultipliers.night_owl;
        }
        
        if (this.streakManager && this.streakManager.streakData.currentStreak >= 7) {
            multiplier *= this.achievementMultipliers.week_streak;
        }
        
        return multiplier;
    }

    recordXPGain(xp, activityType, bonusDetails) {
        this.xpData.xpHistory.push({
            timestamp: new Date().toISOString(),
            xpGained: xp,
            activityType,
            bonusDetails,
            totalXPAfter: this.xpData.currentXP
        });
        
        // Limiter historique à 100 entrées
        if (this.xpData.xpHistory.length > 100) {
            this.xpData.xpHistory = this.xpData.xpHistory.slice(-100);
        }
    }

    /**
     * INTERFACE UTILISATEUR - Affichage XP
     */
    initializeXPDisplay() {
        this.createXPElements();
        this.updateXPDisplay();
    }

    createXPElements() {
        // Vérifier si éléments existent déjà
        if (document.getElementById('xp-display-main')) return;

        // Container principal XP (pour header)
        const xpContainer = document.createElement('div');
        xpContainer.id = 'xp-display-main';
        xpContainer.className = 'xp-display-container';
        xpContainer.innerHTML = `
            <div class="xp-level-badge">
                <span class="level-number" id="level-number">1</span>
                <span class="level-label">Niveau</span>
            </div>
            <div class="xp-progress-section">
                <div class="xp-bar-container">
                    <div class="xp-bar" id="xp-progress-bar">
                        <div class="xp-bar-fill" id="xp-bar-fill"></div>
                    </div>
                    <span class="xp-text" id="xp-text">0/200 XP</span>
                </div>
            </div>
            <div class="xp-weekly-display">
                <span class="weekly-xp" id="weekly-xp">0 XP cette semaine</span>
            </div>
        `;

        // Injecter dans header existant ou créer
        const headerTarget = document.querySelector('.game-header, .section-header, .main-header') || 
                           document.querySelector('header') || 
                           document.body.firstElementChild;
        
        if (headerTarget) {
            headerTarget.appendChild(xpContainer);
        }

        // CSS intégré pour compatibilité
        this.injectXPStyles();
    }

    updateXPDisplay() {
        const level = this.getCurrentLevel();
        const progress = this.getNextLevelProgress();
        
        // Mise à jour éléments
        const levelElement = document.getElementById('level-number');
        const xpTextElement = document.getElementById('xp-text');
        const xpBarFill = document.getElementById('xp-bar-fill');
        const weeklyXPElement = document.getElementById('weekly-xp');
        
        if (levelElement) levelElement.textContent = level;
        
        if (xpTextElement) {
            if (progress.isMaxLevel) {
                xpTextElement.textContent = `${this.xpData.currentXP} XP - Niveau Max!`;
            } else {
                xpTextElement.textContent = `${this.xpData.currentXP}/${this.levelThresholds[level + 1]} XP`;
            }
        }
        
        if (xpBarFill) {
            xpBarFill.style.width = `${progress.progress}%`;
            xpBarFill.style.transition = 'width 0.8s ease-in-out';
        }
        
        if (weeklyXPElement) {
            weeklyXPElement.textContent = `${this.xpData.weeklyXP} XP cette semaine`;
        }
    }

    showLevelUpAnimation(levelUpData) {
        // Animation célébration level up
        const animation = document.createElement('div');
        animation.className = 'level-up-animation';
        animation.innerHTML = `
            <div class="level-up-content">
                <h2>🎉 NIVEAU ${levelUpData.newLevel} !</h2>
                <p>Félicitations ! Tu progresses vraiment bien !</p>
                <div class="rewards">
                    ${levelUpData.rewards.map(reward => `<div class="reward">${reward}</div>`).join('')}
                </div>
                <button class="continue-btn" onclick="this.parentElement.parentElement.remove()">
                    Continuer
                </button>
            </div>
        `;
        
        document.body.appendChild(animation);
        
        // Auto-suppression après 5 secondes
        setTimeout(() => {
            if (animation.parentElement) {
                animation.remove();
            }
        }, 5000);
    }

    injectXPStyles() {
        if (document.getElementById('xp-system-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'xp-system-styles';
        styles.textContent = `
            .xp-display-container {
                display: flex;
                align-items: center;
                gap: 15px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 10px 20px;
                border-radius: 15px;
                color: white;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                margin: 10px 0;
                flex-wrap: wrap;
            }
            
            .xp-level-badge {
                display: flex;
                flex-direction: column;
                align-items: center;
                background: rgba(255,255,255,0.2);
                padding: 8px 12px;
                border-radius: 10px;
                min-width: 60px;
            }
            
            .level-number {
                font-size: 24px;
                font-weight: bold;
                line-height: 1;
            }
            
            .level-label {
                font-size: 12px;
                opacity: 0.9;
            }
            
            .xp-progress-section {
                flex: 1;
                min-width: 200px;
            }
            
            .xp-bar-container {
                position: relative;
            }
            
            .xp-bar {
                background: rgba(255,255,255,0.3);
                height: 20px;
                border-radius: 10px;
                overflow: hidden;
                position: relative;
            }
            
            .xp-bar-fill {
                background: linear-gradient(90deg, #00ff88, #00cc6a);
                height: 100%;
                border-radius: 10px;
                transition: width 0.8s ease-in-out;
                box-shadow: 0 0 10px rgba(0,255,136,0.5);
            }
            
            .xp-text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 12px;
                font-weight: bold;
                text-shadow: 0 1px 2px rgba(0,0,0,0.5);
                z-index: 1;
            }
            
            .weekly-xp {
                font-size: 14px;
                opacity: 0.9;
                white-space: nowrap;
            }
            
            .level-up-animation {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.5s ease-in-out;
            }
            
            .level-up-content {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                color: white;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                animation: bounceIn 0.8s ease-out;
            }
            
            .level-up-content h2 {
                margin: 0 0 20px 0;
                font-size: 2.5em;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            }
            
            .rewards {
                margin: 20px 0;
            }
            
            .reward {
                background: rgba(255,255,255,0.2);
                padding: 8px 16px;
                margin: 5px 0;
                border-radius: 8px;
                font-size: 1.1em;
            }
            
            .continue-btn {
                background: #00ff88;
                color: #333;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 1.1em;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .continue-btn:hover {
                background: #00cc6a;
                transform: translateY(-2px);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes bounceIn {
                0% { transform: scale(0.3) translateY(-50px); opacity: 0; }
                50% { transform: scale(1.05) translateY(-25px); opacity: 0.8; }
                70% { transform: scale(0.9) translateY(-10px); opacity: 0.9; }
                100% { transform: scale(1) translateY(0); opacity: 1; }
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .xp-display-container {
                    flex-direction: column;
                    text-align: center;
                    gap: 10px;
                }
                
                .xp-progress-section {
                    width: 100%;
                }
                
                .level-up-content {
                    margin: 20px;
                    padding: 30px 20px;
                }
                
                .level-up-content h2 {
                    font-size: 2em;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    bindEvents() {
        // Événements personnalisés pour intégration
        document.addEventListener('heartLost', () => {
            // Réduire légèrement XP lors perte cœur pour encourager précision
            this.addXP(-2, 'heart_penalty', { penalty: true });
        });

        document.addEventListener('streakUpdated', (event) => {
            if (event.detail && event.detail.newStreak > event.detail.oldStreak) {
                // Bonus streak automatique
                this.addXP(10, 'streak_bonus', { 
                    streakLevel: event.detail.newStreak 
                });
            }
        });
    }

    triggerXPEvents() {
        // Déclencher événements pour autres systèmes
        const event = new CustomEvent('xpUpdated', {
            detail: {
                currentXP: this.xpData.currentXP,
                currentLevel: this.getCurrentLevel(),
                weeklyXP: this.xpData.weeklyXP
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * UTILITAIRES
     */
    getWeekStart() {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Lundi = début
        const monday = new Date(now.setDate(diff));
        monday.setHours(0, 0, 0, 0);
        return monday.toISOString().split('T')[0];
    }

    checkLevelAchievements(level) {
        // Intégration avec système de badges existant
        if (window.badgeSystem) {
            if (level >= 5) window.badgeSystem.awardBadge('level_5_reached');
            if (level >= 10) window.badgeSystem.awardBadge('level_10_reached');
            if (level >= 15) window.badgeSystem.awardBadge('level_15_reached');
        }
    }

    /**
     * API DEBUG & TESTING
     */
    debug = {
        addTestXP: (amount = 50) => {
            return this.addXP(amount, 'debug_test', { debug: true });
        },
        
        simulateLevelUp: () => {
            const currentLevel = this.getCurrentLevel();
            const nextThreshold = this.levelThresholds[currentLevel + 1];
            if (nextThreshold) {
                const needed = nextThreshold - this.xpData.currentXP + 10;
                return this.addXP(needed, 'debug_levelup', { debug: true });
            }
        },
        
        resetXP: () => {
            this.xpData.currentXP = 0;
            this.xpData.totalXPEarned = 0;
            this.saveXPData();
            console.log('🔄 XP reset to 0');
        },
        
        getStats: () => {
            return {
                currentLevel: this.getCurrentLevel(),
                currentXP: this.xpData.currentXP,
                nextLevelProgress: this.getNextLevelProgress(),
                weeklyXP: this.xpData.weeklyXP,
                totalEarned: this.xpData.totalXPEarned,
                sessionsCompleted: this.xpData.sessionsCompleted
            };
        }
    };
}

// Auto-initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    window.xpManager = new XPManager();
    
    // API globale pour faciliter l'intégration
    window.XPDebug = window.xpManager.debug;
    
    console.log('🎮 Système XP complet initialisé!');
    console.log('💡 Test rapide: XPDebug.addTestXP(100)');
    console.log('📊 Statistiques: XPDebug.getStats()');
});