/**
 * Système XP Dynamique Complet - Le Monde des Curieux
 * Intégration avec Hearts + Streaks existants
 * Compatible localStorage architecture actuelle
 */

class XPManager {
    constructor() {
        this.currentSection = null;
        this.xpData = this.loadXPData();
        this.levelThresholds = [0, 200, 600, 1200, 2000, 3200, 4800, 6800, 9200, 12000, 15200]; // Progression équilibrée
        this.multipliers = {
            perfect: 2.0,      // Score parfait
            streak: 1.5,       // Bonus streak actif
            firstTime: 1.3,    // Première fois activité
            speed: 1.2,        // Completion rapide
            chain: 1.1         // Activités enchaînées
        };
        
        this.initializeXPSystem();
    }

    loadXPData() {
        const defaultData = {
            totalXP: 0,
            currentLevel: 1,
            xpThisLevel: 0,
            sectionsXP: {},
            achievements: [],
            lastActivity: null,
            multiplierHistory: []
        };
        
        return JSON.parse(localStorage.getItem('lemondedescurieux_xp')) || defaultData;
    }

    saveXPData() {
        localStorage.setItem('lemondedescurieux_xp', JSON.stringify(this.xpData));
        this.updateDisplays();
        this.checkLevelUp();
        this.checkAchievements();
    }

    initializeXPSystem() {
        // Intégration avec systèmes existants
        this.integrateWithHeartSystem();
        this.integrateWithStreakSystem();
        this.createXPInterface();
    }

    /**
     * Calcul XP avec système de multiplicateurs avancé
     */
    calculateXP(baseXP, context = {}) {
        let finalXP = baseXP;
        let appliedMultipliers = [];

        // Bonus performance parfaite
        if (context.perfect) {
            finalXP *= this.multipliers.perfect;
            appliedMultipliers.push('🎯 Parfait!');
        }

        // Bonus streak actif
        if (this.hasActiveStreak()) {
            finalXP *= this.multipliers.streak;
            appliedMultipliers.push('🔥 Série!');
        }

        // Bonus première fois
        if (context.firstTime) {
            finalXP *= this.multipliers.firstTime;
            appliedMultipliers.push('🆕 Découverte!');
        }

        // Bonus vitesse
        if (context.completionTime && context.completionTime < context.expectedTime * 0.8) {
            finalXP *= this.multipliers.speed;
            appliedMultipliers.push('⚡ Rapide!');
        }

        // Bonus enchaînement d'activités
        if (this.isChainedActivity()) {
            finalXP *= this.multipliers.chain;
            appliedMultipliers.push('🔗 Enchaînement!');
        }

        return {
            finalXP: Math.round(finalXP),
            baseXP,
            appliedMultipliers
        };
    }

    /**
     * Ajouter XP avec animation et feedback
     */
    addXP(baseXP, context = {}) {
        const xpCalculation = this.calculateXP(baseXP, context);
        const previousLevel = this.getCurrentLevel();

        // Mise à jour données
        this.xpData.totalXP += xpCalculation.finalXP;
        
        // XP par section
        if (this.currentSection) {
            if (!this.xpData.sectionsXP[this.currentSection]) {
                this.xpData.sectionsXP[this.currentSection] = 0;
            }
            this.xpData.sectionsXP[this.currentSection] += xpCalculation.finalXP;
        }

        this.xpData.lastActivity = {
            timestamp: new Date().toISOString(),
            xpGained: xpCalculation.finalXP,
            section: this.currentSection,
            multipliers: xpCalculation.appliedMultipliers
        };

        this.saveXPData();
        
        // Animation gain XP
        this.showXPGainAnimation(xpCalculation);
        
        // Vérification level up
        const newLevel = this.getCurrentLevel();
        if (newLevel > previousLevel) {
            this.triggerLevelUpAnimation(previousLevel, newLevel);
        }

        return xpCalculation;
    }

    getCurrentLevel() {
        for (let i = this.levelThresholds.length - 1; i >= 0; i--) {
            if (this.xpData.totalXP >= this.levelThresholds[i]) {
                return i + 1;
            }
        }
        return 1;
    }

    getXPForNextLevel() {
        const currentLevel = this.getCurrentLevel();
        if (currentLevel >= this.levelThresholds.length) {
            return null; // Niveau maximum atteint
        }
        
        const nextLevelThreshold = this.levelThresholds[currentLevel];
        return nextLevelThreshold - this.xpData.totalXP;
    }

    getProgressPercentage() {
        const currentLevel = this.getCurrentLevel();
        if (currentLevel >= this.levelThresholds.length) {
            return 100;
        }

        const currentLevelStart = this.levelThresholds[currentLevel - 1];
        const nextLevelStart = this.levelThresholds[currentLevel];
        const progressInLevel = this.xpData.totalXP - currentLevelStart;
        const levelRange = nextLevelStart - currentLevelStart;

        return Math.round((progressInLevel / levelRange) * 100);
    }

    /**
     * Intégration avec système de cœurs existant
     */
    integrateWithHeartSystem() {
        // Hook dans le système de cœurs pour bonus/malus XP
        const originalLoseHeart = window.EnglishHeartsSystem?.prototype?.loseHeart || window.FrenchHeartsSystem?.prototype?.loseHeart;
        
        if (originalLoseHeart) {
            window.EnglishHeartsSystem.prototype.loseHeart = function() {
                const result = originalLoseHeart.call(this);
                
                // Malus XP pour erreur (optionnel, peut être désactivé)
                if (window.xpManager && !result) { // Plus de cœurs
                    window.xpManager.addXP(-5, { type: 'heart_lost', section: 'penalty' });
                }
                
                return result;
            };
        }
    }

    /**
     * Intégration avec système de streaks existant
     */
    integrateWithStreakSystem() {
        // Vérification streak pour multiplicateur
        this.hasActiveStreak = () => {
            const streakData = JSON.parse(localStorage.getItem('englishStreaks')) || 
                               JSON.parse(localStorage.getItem('frenchStreaks')) || {};
            return streakData.currentStreak > 0;
        };

        this.isChainedActivity = () => {
            const lastActivity = this.xpData.lastActivity;
            if (!lastActivity) return false;
            
            const timeSinceLastActivity = Date.now() - new Date(lastActivity.timestamp).getTime();
            return timeSinceLastActivity < 300000; // 5 minutes
        };
    }

    /**
     * Interface utilisateur XP
     */
    createXPInterface() {
        // Création barre XP dynamique
        const xpBar = document.createElement('div');
        xpBar.id = 'xp-progress-bar';
        xpBar.className = 'xp-interface';
        xpBar.innerHTML = `
            <div class="xp-info">
                <span id="current-level">Niveau ${this.getCurrentLevel()}</span>
                <span id="xp-display">${this.xpData.totalXP} XP</span>
            </div>
            <div class="xp-bar-container">
                <div class="xp-bar-fill" style="width: ${this.getProgressPercentage()}%"></div>
                <div class="xp-bar-text">${this.getXPForNextLevel() || 'MAX'} XP restants</div>
            </div>
            <div id="xp-multipliers" class="xp-multipliers"></div>
        `;

        // Insertion dans interface
        const targetContainer = document.querySelector('.mindmap-section, main, body');
        if (targetContainer) {
            targetContainer.insertBefore(xpBar, targetContainer.firstChild);
        }
    }

    updateDisplays() {
        // Mise à jour niveau
        const levelDisplay = document.getElementById('current-level');
        if (levelDisplay) {
            levelDisplay.textContent = `Niveau ${this.getCurrentLevel()}`;
        }

        // Mise à jour XP total
        const xpDisplay = document.getElementById('xp-display');
        if (xpDisplay) {
            xpDisplay.textContent = `${this.xpData.totalXP} XP`;
        }

        // Mise à jour barre progression
        const xpBarFill = document.querySelector('.xp-bar-fill');
        if (xpBarFill) {
            xpBarFill.style.width = `${this.getProgressPercentage()}%`;
        }

        // Mise à jour texte XP restants
        const xpBarText = document.querySelector('.xp-bar-text');
        if (xpBarText) {
            const remaining = this.getXPForNextLevel();
            xpBarText.textContent = remaining ? `${remaining} XP restants` : 'Niveau maximum!';
        }
    }

    showXPGainAnimation(xpCalculation) {
        const animationContainer = document.createElement('div');
        animationContainer.className = 'xp-gain-animation';
        animationContainer.innerHTML = `
            <div class="xp-main">+${xpCalculation.finalXP} XP!</div>
            ${xpCalculation.appliedMultipliers.map(mult => 
                `<div class="xp-multiplier">${mult}</div>`
            ).join('')}
        `;

        document.body.appendChild(animationContainer);

        // Animation et suppression
        setTimeout(() => {
            animationContainer.classList.add('fade-out');
            setTimeout(() => animationContainer.remove(), 1000);
        }, 2000);
    }

    triggerLevelUpAnimation(oldLevel, newLevel) {
        const levelUpOverlay = document.createElement('div');
        levelUpOverlay.className = 'level-up-overlay';
        levelUpOverlay.innerHTML = `
            <div class="level-up-content">
                <div class="level-up-star">⭐</div>
                <h2>NIVEAU SUPÉRIEUR!</h2>
                <div class="level-progression">
                    <span class="old-level">Niveau ${oldLevel}</span>
                    <span class="arrow">→</span>
                    <span class="new-level">Niveau ${newLevel}</span>
                </div>
                <p>Bravo! Tu deviens de plus en plus fort!</p>
                <button onclick="this.parentElement.parentElement.remove()" class="continue-btn">
                    Continuer l'aventure! 🚀
                </button>
            </div>
        `;

        document.body.appendChild(levelUpOverlay);

        // Son level up (si Web Audio disponible)
        this.playLevelUpSound();
    }

    playLevelUpSound() {
        if (window.AudioContext || window.webkitAudioContext) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Son synthétique level up style jeu vidéo
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // Do
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // Mi
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // Sol
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        }
    }

    checkLevelUp() {
        const currentLevel = this.getCurrentLevel();
        const lastKnownLevel = this.xpData.lastKnownLevel || 1;
        
        if (currentLevel > lastKnownLevel) {
            this.xpData.lastKnownLevel = currentLevel;
            // Level up déjà géré dans addXP
        }
    }

    checkAchievements() {
        const achievements = [
            {
                id: 'first_100_xp',
                condition: () => this.xpData.totalXP >= 100,
                title: 'Premier Centurion',
                description: '100 XP gagnés!'
            },
            {
                id: 'level_5',
                condition: () => this.getCurrentLevel() >= 5,
                title: 'Explorateur Confirmé',
                description: 'Niveau 5 atteint!'
            },
            {
                id: 'perfectionist',
                condition: () => this.xpData.multiplierHistory.filter(m => m.includes('Parfait')).length >= 5,
                title: 'Perfectionniste',
                description: '5 scores parfaits!'
            }
        ];

        achievements.forEach(achievement => {
            if (achievement.condition() && !this.xpData.achievements.includes(achievement.id)) {
                this.xpData.achievements.push(achievement.id);
                this.showAchievementUnlock(achievement);
            }
        });
    }

    showAchievementUnlock(achievement) {
        // Notification achievement débloqué
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">🏆</div>
            <div class="achievement-text">
                <h4>${achievement.title}</h4>
                <p>${achievement.description}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }

    // API publique pour intégration
    getStats() {
        return {
            level: this.getCurrentLevel(),
            totalXP: this.xpData.totalXP,
            xpForNext: this.getXPForNextLevel(),
            progressPercent: this.getProgressPercentage(),
            sectionsXP: this.xpData.sectionsXP,
            achievements: this.xpData.achievements
        };
    }

    // Debug et maintenance
    exportData() {
        return {
            xpData: this.xpData,
            levelThresholds: this.levelThresholds,
            timestamp: new Date().toISOString()
        };
    }

    resetProgress() {
        if (confirm('Êtes-vous sûr de vouloir remettre à zéro la progression XP?')) {
            localStorage.removeItem('lemondedescurieux_xp');
            location.reload();
        }
    }
}

// CSS intégré pour interface XP
const xpStyles = `
<style>
.xp-interface {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px;
    border-radius: 12px;
    margin: 10px 0;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    font-family: 'Press Start 2P', monospace;
    font-size: 12px;
}

.xp-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.xp-bar-container {
    position: relative;
    background: rgba(255,255,255,0.3);
    height: 20px;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 10px;
}

.xp-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #00f260, #0575e6);
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 10px;
}

.xp-bar-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 10px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

.xp-multipliers {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
    font-size: 8px;
}

.xp-gain-animation {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    text-align: center;
    pointer-events: none;
    animation: xpBounce 2s ease-out;
}

.xp-main {
    font-size: 24px;
    color: #00f260;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
    margin-bottom: 10px;
}

.xp-multiplier {
    font-size: 14px;
    color: #ffd700;
    margin: 2px 0;
}

.level-up-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    animation: fadeIn 0.5s ease-out;
}

.level-up-content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 40px;
    border-radius: 20px;
    text-align: center;
    color: white;
    max-width: 400px;
    animation: levelUpBounce 0.8s ease-out;
}

.level-up-star {
    font-size: 60px;
    animation: spin 2s linear infinite;
}

.level-progression {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    margin: 20px 0;
    font-size: 18px;
}

.continue-btn {
    background: #00f260;
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 25px;
    font-family: inherit;
    font-size: 14px;
    cursor: pointer;
    transition: transform 0.2s;
}

.continue-btn:hover {
    transform: scale(1.05);
}

.achievement-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #ffd700, #ff8c00);
    padding: 15px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 1500;
    animation: slideIn 0.5s ease-out;
    max-width: 300px;
}

@keyframes xpBounce {
    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
}

@keyframes levelUpBounce {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@media (max-width: 768px) {
    .xp-interface {
        padding: 10px;
        font-size: 10px;
    }
    
    .level-up-content {
        padding: 20px;
        margin: 20px;
    }
    
    .achievement-notification {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
    }
}
</style>
`;

// Injection CSS et initialisation automatique
document.head.insertAdjacentHTML('beforeend', xpStyles);

// Initialisation globale
window.addEventListener('DOMContentLoaded', () => {
    window.xpManager = new XPManager();
    
    // API debug pour développement
    window.XPDebug = {
        addXP: (amount, context) => window.xpManager.addXP(amount, context),
        getStats: () => window.xpManager.getStats(),
        levelUp: () => window.xpManager.addXP(1000),
        reset: () => window.xpManager.resetProgress(),
        export: () => console.log(JSON.stringify(window.xpManager.exportData(), null, 2))
    };
    
    console.log('✅ Système XP initialisé avec succès!');
    console.log('🎮 Debug: window.XPDebug disponible');
});
