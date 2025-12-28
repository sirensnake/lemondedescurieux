/**
 * HEART SYSTEM - Le Monde des Curieux
 * Système de cœurs/vies compatible Duolingo avec régénération
 * 
 * Fonctionnalités :
 * - Gestion des cœurs par session d'apprentissage
 * - Régénération temporelle automatique
 * - Intégration streak system
 * - Feedback visuel adaptatif
 * - Mode entraînement illimité
 * - Sauvegarde localStorage
 */

class HeartSystem {
    constructor() {
        this.storageKey = 'lemondedescurieux_hearts';
        this.streakSystemRef = null; // Référence au système de streaks
        
        // Configuration du système
        this.config = {
            maxHearts: 5,
            regenTimeMinutes: 30,
            practiceMode: false, // Mode entraînement sans limite
            gracePeriodMinutes: 5, // Période de grâce après erreur
            bonusHeartsStreak: [7, 14, 30], // Streaks donnant bonus cœurs
            heartCostByDifficulty: {
                easy: 1,
                medium: 1, 
                hard: 1,
                expert: 2
            }
        };
        
        // États du système
        this.data = this.loadHeartData();
        this.listeners = [];
        this.regenTimer = null;
        
        // Initialisation
        this.initializeSystem();
    }

    /**
     * Chargement des données depuis localStorage
     */
    loadHeartData() {
        const saved = localStorage.getItem(this.storageKey);
        
        const defaultData = {
            currentHearts: this.config.maxHearts,
            lastHeartLoss: null,
            lastRegenTime: null,
            totalHeartsLost: 0,
            heartsLostToday: 0,
            lastResetDate: this.getCurrentDate(),
            bonusHearts: 0,
            practiceMode: false,
            statistics: {
                totalErrors: 0,
                perfectSessions: 0,
                averageAccuracy: 100,
                errorsBySubject: {}
            }
        };

        if (saved) {
            const parsed = JSON.parse(saved);
            // Migration et validation des données
            const migrated = { ...defaultData, ...parsed };
            
            // Reset quotidien si nécessaire
            if (migrated.lastResetDate !== this.getCurrentDate()) {
                migrated.heartsLostToday = 0;
                migrated.lastResetDate = this.getCurrentDate();
            }
            
            return migrated;
        }

        return defaultData;
    }

    /**
     * Sauvegarde des données
     */
    saveHeartData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            console.log('💖 Heart data saved successfully');
        } catch (error) {
            console.error('❌ Error saving heart data:', error);
        }
    }

    /**
     * Initialisation du système
     */
    initializeSystem() {
        console.log('💖 Heart System initialized');
        
        // Lien avec le système de streaks
        this.linkWithStreakSystem();
        
        // Processus de régénération
        this.processHeartRegeneration();
        
        // Mise à jour affichage
        this.updateHeartDisplay();
        
        // Timer de régénération
        this.startRegenerationTimer();
        
        // Listeners d'activité
        this.setupActivityListeners();
    }

    /**
     * Lien avec le système de streaks
     */
    linkWithStreakSystem() {
        if (window.StreakSystem) {
            this.streakSystemRef = window.StreakSystem;
            console.log('🔗 Heart System linked with Streak System');
            
            // Vérifier bonus de cœurs selon streak
            this.checkStreakBonus();
        } else {
            // Attendre que le streak system soit chargé
            setTimeout(() => this.linkWithStreakSystem(), 1000);
        }
    }

    /**
     * Obtention date actuelle
     */
    getCurrentDate() {
        return new Date().toISOString().split('T')[0];
    }

    /**
     * Calcul des cœurs bonus selon streak
     */
    checkStreakBonus() {
        if (!this.streakSystemRef) return;
        
        const streakData = this.streakSystemRef.getStreakData();
        const currentStreak = streakData.current;
        
        let bonusHearts = 0;
        
        // Bonus selon milestones de streak
        if (currentStreak >= 30) bonusHearts = 2;
        else if (currentStreak >= 14) bonusHearts = 1;
        else if (currentStreak >= 7) bonusHearts = 1;
        
        if (bonusHearts > this.data.bonusHearts) {
            this.data.bonusHearts = bonusHearts;
            this.showHeartBonusNotification(bonusHearts, currentStreak);
            this.saveHeartData();
        }
    }

    /**
     * Processus de régénération automatique
     */
    processHeartRegeneration() {
        const now = Date.now();
        const lastLoss = this.data.lastHeartLoss;
        
        if (!lastLoss || this.data.currentHearts >= this.getMaxHearts()) {
            return; // Pas de régénération nécessaire
        }
        
        const timeSinceLoss = now - new Date(lastLoss).getTime();
        const regenIntervalMs = this.config.regenTimeMinutes * 60 * 1000;
        
        const heartsToRegen = Math.floor(timeSinceLoss / regenIntervalMs);
        
        if (heartsToRegen > 0) {
            const newHearts = Math.min(
                this.data.currentHearts + heartsToRegen,
                this.getMaxHearts()
            );
            
            const actuallyRegenerated = newHearts - this.data.currentHearts;
            
            if (actuallyRegenerated > 0) {
                this.data.currentHearts = newHearts;
                this.data.lastRegenTime = new Date().toISOString();
                
                console.log(`💚 ${actuallyRegenerated} cœur(s) régénéré(s)`);
                this.showHeartRegenNotification(actuallyRegenerated);
                this.saveHeartData();
            }
        }
    }

    /**
     * Obtenir le maximum de cœurs (base + bonus)
     */
    getMaxHearts() {
        return this.config.maxHearts + this.data.bonusHearts;
    }

    /**
     * Démarrage du timer de régénération
     */
    startRegenerationTimer() {
        // Nettoyer timer existant
        if (this.regenTimer) {
            clearInterval(this.regenTimer);
        }
        
        // Timer toutes les minutes pour vérifier régénération
        this.regenTimer = setInterval(() => {
            this.processHeartRegeneration();
            this.updateHeartDisplay();
        }, 60000); // 1 minute
    }

    /**
     * Perte d'un cœur
     */
    loseHeart(context = {}) {
        const { 
            difficulty = 'medium', 
            subject = 'general',
            errorType = 'incorrect_answer',
            showFeedback = true 
        } = context;
        
        // Mode pratique = pas de perte
        if (this.data.practiceMode) {
            console.log('🎯 Practice mode - no hearts lost');
            return {
                success: true,
                heartsRemaining: this.data.currentHearts,
                canContinue: true,
                practiceMode: true
            };
        }
        
        const heartCost = this.config.heartCostByDifficulty[difficulty] || 1;
        
        if (this.data.currentHearts >= heartCost) {
            // Perte effective
            this.data.currentHearts -= heartCost;
            this.data.lastHeartLoss = new Date().toISOString();
            this.data.totalHeartsLost += heartCost;
            this.data.heartsLostToday += heartCost;
            
            // Statistiques
            this.updateErrorStatistics(subject, errorType);
            
            // Feedback visuel
            if (showFeedback) {
                this.showHeartLossAnimation(heartCost);
            }
            
            // Vérifier si plus de cœurs
            const canContinue = this.data.currentHearts > 0;
            
            if (!canContinue) {
                this.handleNoHeartsLeft();
            }
            
            console.log(`💔 ${heartCost} cœur(s) perdu(s). Restants: ${this.data.currentHearts}`);
            
            // Sauvegarder et mettre à jour
            this.saveHeartData();
            this.updateHeartDisplay();
            
            // Notifier les listeners
            this.notifyListeners('heart_lost', {
                heartsRemaining: this.data.currentHearts,
                heartCost: heartCost,
                canContinue: canContinue,
                context: context
            });
            
            return {
                success: true,
                heartsRemaining: this.data.currentHearts,
                canContinue: canContinue,
                heartCost: heartCost
            };
        } else {
            // Pas assez de cœurs
            console.log('💔 Not enough hearts for this action');
            return {
                success: false,
                heartsRemaining: this.data.currentHearts,
                canContinue: false,
                heartCost: heartCost
            };
        }
    }

    /**
     * Récupération d'un cœur (bonus, récompense)
     */
    gainHeart(reason = 'bonus', amount = 1) {
        const maxHearts = this.getMaxHearts();
        const newTotal = Math.min(this.data.currentHearts + amount, maxHearts);
        const actualGain = newTotal - this.data.currentHearts;
        
        if (actualGain > 0) {
            this.data.currentHearts = newTotal;
            
            console.log(`💚 ${actualGain} cœur(s) gagné(s) (${reason})`);
            
            this.showHeartGainAnimation(actualGain, reason);
            this.saveHeartData();
            this.updateHeartDisplay();
            
            this.notifyListeners('heart_gained', {
                heartsTotal: this.data.currentHearts,
                heartsGained: actualGain,
                reason: reason
            });
        }
        
        return actualGain;
    }

    /**
     * Gestion quand plus de cœurs
     */
    handleNoHeartsLeft() {
        console.log('💔 No hearts left!');
        
        // Calculer temps de régénération
        const nextRegenTime = this.getNextRegenerationTime();
        
        // Afficher écran de fin
        this.showNoHeartsScreen(nextRegenTime);
        
        // Proposer alternatives
        this.showAlternativeOptions();
    }

    /**
     * Calcul du prochain temps de régénération
     */
    getNextRegenerationTime() {
        if (!this.data.lastHeartLoss) return new Date();
        
        const lastLoss = new Date(this.data.lastHeartLoss);
        const regenTime = new Date(lastLoss.getTime() + (this.config.regenTimeMinutes * 60 * 1000));
        
        return regenTime;
    }

    /**
     * Activation/désactivation mode pratique
     */
    togglePracticeMode(enabled = null) {
        if (enabled === null) {
            this.data.practiceMode = !this.data.practiceMode;
        } else {
            this.data.practiceMode = enabled;
        }
        
        this.saveHeartData();
        this.updateHeartDisplay();
        
        console.log(`🎯 Practice mode: ${this.data.practiceMode ? 'ON' : 'OFF'}`);
        
        this.notifyListeners('practice_mode_changed', {
            practiceMode: this.data.practiceMode
        });
        
        return this.data.practiceMode;
    }

    /**
     * Mise à jour statistiques d'erreur
     */
    updateErrorStatistics(subject, errorType) {
        this.data.statistics.totalErrors += 1;
        
        if (!this.data.statistics.errorsBySubject[subject]) {
            this.data.statistics.errorsBySubject[subject] = {
                total: 0,
                types: {}
            };
        }
        
        this.data.statistics.errorsBySubject[subject].total += 1;
        
        if (!this.data.statistics.errorsBySubject[subject].types[errorType]) {
            this.data.statistics.errorsBySubject[subject].types[errorType] = 0;
        }
        
        this.data.statistics.errorsBySubject[subject].types[errorType] += 1;
    }

    /**
     * Mise à jour de l'affichage des cœurs
     */
    updateHeartDisplay() {
        const heartContainers = document.querySelectorAll('.hearts-display, .heart-counter');
        
        heartContainers.forEach(container => {
            this.updateHeartContainer(container);
        });
        
        // Mise à jour indicateurs de régénération
        this.updateRegenerationIndicators();
        
        // Mise à jour mode pratique
        this.updatePracticeModeIndicator();
    }

    /**
     * Mise à jour indicateur mode pratique
     */
    updatePracticeModeIndicator() {
        const practiceIndicators = document.querySelectorAll('.practice-mode-indicator');
        
        practiceIndicators.forEach(indicator => {
            if (this.data.practiceMode) {
                indicator.style.display = 'block';
                indicator.textContent = '🎯 Mode Entraînement';
            } else {
                indicator.style.display = 'none';
            }
        });
    }

    /**
     * Mise à jour d'un conteneur de cœurs spécifique
     */
    updateHeartContainer(container) {
        const maxHearts = this.getMaxHearts();
        const currentHearts = this.data.currentHearts;
        
        let heartsHTML = '';
        
        // Cœurs pleins
        for (let i = 0; i < currentHearts; i++) {
            heartsHTML += `<span class="heart filled" data-heart="${i}">❤️</span>`;
        }
        
        // Cœurs vides
        for (let i = currentHearts; i < maxHearts; i++) {
            heartsHTML += `<span class="heart empty" data-heart="${i}">🤍</span>`;
        }
        
        // Mode pratique indicator
        if (this.data.practiceMode) {
            heartsHTML += `<span class="practice-indicator">🎯</span>`;
        }
        
        container.innerHTML = heartsHTML;
        
        // Classes CSS conditionnelles
        container.classList.toggle('low-hearts', currentHearts <= 1);
        container.classList.toggle('no-hearts', currentHearts === 0);
        container.classList.toggle('practice-mode', this.data.practiceMode);
    }

    /**
     * Mise à jour indicateurs de régénération
     */
    updateRegenerationIndicators() {
        const regenIndicators = document.querySelectorAll('.heart-regen-timer');
        
        if (this.data.currentHearts < this.getMaxHearts() && !this.data.practiceMode) {
            const nextRegen = this.getNextRegenerationTime();
            const now = new Date();
            const timeLeft = Math.max(0, nextRegen - now);
            
            if (timeLeft > 0) {
                const minutes = Math.floor(timeLeft / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                
                regenIndicators.forEach(indicator => {
                    indicator.textContent = `⏱️ ${minutes}:${seconds.toString().padStart(2, '0')}`;
                    indicator.style.display = 'block';
                });
            } else {
                regenIndicators.forEach(indicator => {
                    indicator.style.display = 'none';
                });
            }
        } else {
            regenIndicators.forEach(indicator => {
                indicator.style.display = 'none';
            });
        }
    }

    /**
     * Configuration des listeners d'activité
     */
    setupActivityListeners() {
        // Listener pour réponses incorrectes
        window.addEventListener('quiz-wrong-answer', (e) => {
            this.loseHeart({
                difficulty: e.detail.difficulty || 'medium',
                subject: e.detail.subject || 'general',
                errorType: 'wrong_answer'
            });
        });
        
        // Listener pour sessions parfaites
        window.addEventListener('quiz-perfect-session', (e) => {
            this.data.statistics.perfectSessions += 1;
            this.saveHeartData();
            
            // Chance de récupérer un cœur
            if (Math.random() < 0.3) { // 30% de chance
                this.gainHeart('perfect_session');
            }
        });
        
        // Listener pour bonus streak
        window.addEventListener('streak-milestone', (e) => {
            this.checkStreakBonus();
        });
    }

    /**
     * Animations de perte de cœur
     */
    showHeartLossAnimation(heartCost) {
        // Animation sur tous les cœurs affichés
        const heartElements = document.querySelectorAll('.heart.filled');
        
        // Animer les derniers cœurs perdus
        for (let i = 0; i < Math.min(heartCost, heartElements.length); i++) {
            const heart = heartElements[heartElements.length - 1 - i];
            if (heart) {
                heart.style.animation = 'heartBreak 0.6s ease-out';
                
                setTimeout(() => {
                    heart.classList.remove('filled');
                    heart.classList.add('empty');
                    heart.textContent = '🤍';
                    heart.style.animation = '';
                }, 300);
            }
        }
        
        // Effet shake sur le conteneur
        const containers = document.querySelectorAll('.hearts-display');
        containers.forEach(container => {
            container.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => container.style.animation = '', 500);
        });
    }

    /**
     * Animations de gain de cœur
     */
    showHeartGainAnimation(amount, reason) {
        // Animation healing sur cœurs vides
        const emptyHearts = document.querySelectorAll('.heart.empty');
        
        for (let i = 0; i < Math.min(amount, emptyHearts.length); i++) {
            const heart = emptyHearts[i];
            if (heart) {
                heart.style.animation = 'heartHeal 0.8s ease-out';
                
                setTimeout(() => {
                    heart.classList.remove('empty');
                    heart.classList.add('filled');
                    heart.textContent = '❤️';
                    heart.style.animation = '';
                }, 400);
            }
        }
        
        // Notification de gain
        this.showHeartGainNotification(amount, reason);
    }

    /**
     * Notifications système
     */
    showHeartGainNotification(amount, reason) {
        const messages = {
            bonus: `💚 +${amount} cœur${amount > 1 ? 's' : ''} bonus !`,
            perfect_session: `🌟 +${amount} cœur${amount > 1 ? 's' : ''} pour ta session parfaite !`,
            streak_bonus: `🔥 +${amount} cœur${amount > 1 ? 's' : ''} bonus streak !`,
            achievement: `🏆 +${amount} cœur${amount > 1 ? 's' : ''} d'achievement !`
        };
        
        this.showNotification({
            type: 'heart-gain',
            title: '💚 Cœur Récupéré !',
            message: messages[reason] || `+${amount} cœur${amount > 1 ? 's' : ''}`,
            style: 'success'
        });
    }

    showHeartBonusNotification(bonusHearts, streak) {
        this.showNotification({
            type: 'heart-bonus',
            title: '🎁 Bonus Streak !',
            message: `Streak de ${streak} jours = +${bonusHearts} cœur${bonusHearts > 1 ? 's' : ''} max !`,
            style: 'bonus'
        });
    }

    showHeartRegenNotification(amount) {
        this.showNotification({
            type: 'heart-regen',
            title: '⏰ Récupération !',
            message: `${amount} cœur${amount > 1 ? 's' : ''} régénéré${amount > 1 ? 's' : ''} !`,
            style: 'info',
            duration: 2000
        });
    }

    /**
     * Écran pas de cœurs
     */
    showNoHeartsScreen(nextRegenTime) {
        const overlay = document.createElement('div');
        overlay.className = 'no-hearts-overlay';
        overlay.innerHTML = `
            <div class="no-hearts-modal">
                <div class="modal-header">
                    <h3>💔 Plus de cœurs !</h3>
                </div>
                <div class="modal-content">
                    <p>Tes cœurs se régénèrent automatiquement.</p>
                    <div class="regen-timer" id="modal-timer">
                        Prochain cœur dans : <span class="timer-display">--:--</span>
                    </div>
                    
                    <div class="modal-options">
                        <button class="btn btn-primary" onclick="heartSystem.togglePracticeMode(true); this.closest('.no-hearts-overlay').remove();">
                            🎯 Mode Entraînement
                        </button>
                        <button class="btn btn-secondary" onclick="this.closest('.no-hearts-overlay').remove();">
                            ⏰ Attendre la régénération
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Styles inline
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        document.body.appendChild(overlay);
        
        // Timer countdown
        this.startModalTimer(nextRegenTime);
    }

    /**
     * Timer pour modal no hearts
     */
    startModalTimer(targetTime) {
        const timerDisplay = document.querySelector('.timer-display');
        if (!timerDisplay) return;
        
        const updateTimer = () => {
            const now = new Date();
            const timeLeft = Math.max(0, targetTime - now);
            
            if (timeLeft === 0) {
                timerDisplay.textContent = 'Prêt !';
                setTimeout(() => {
                    const overlay = document.querySelector('.no-hearts-overlay');
                    if (overlay) overlay.remove();
                }, 1000);
                return;
            }
            
            const minutes = Math.floor(timeLeft / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            setTimeout(updateTimer, 1000);
        };
        
        updateTimer();
    }

    /**
     * Notification système unifié
     */
    showNotification({type, title, message, style = 'info', duration = 3000}) {
        const notification = document.createElement('div');
        notification.className = `heart-notification ${style}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            background: white;
            border: 3px solid #e76f51;
            border-radius: 15px;
            padding: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 9999;
            max-width: 280px;
            animation: slideInRight 0.5s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, duration);
    }

    /**
     * Gestion des listeners externes
     */
    addListener(callback) {
        this.listeners.push(callback);
    }

    removeListener(callback) {
        this.listeners = this.listeners.filter(l => l !== callback);
    }

    notifyListeners(event, data) {
        this.listeners.forEach(callback => {
            try {
                callback(event, data);
            } catch (error) {
                console.error('Error in heart system listener:', error);
            }
        });
    }

    /**
     * API publique
     */
    getHeartData() {
        return {
            current: this.data.currentHearts,
            max: this.getMaxHearts(),
            bonus: this.data.bonusHearts,
            practiceMode: this.data.practiceMode,
            lostToday: this.data.heartsLostToday,
            totalLost: this.data.totalHeartsLost,
            statistics: this.data.statistics,
            nextRegen: this.getNextRegenerationTime()
        };
    }

    /**
     * Méthodes de debug et test
     */
    debug() {
        console.log('💖 HEART SYSTEM DEBUG');
        console.log('Current Hearts:', this.data.currentHearts);
        console.log('Max Hearts:', this.getMaxHearts());
        console.log('Practice Mode:', this.data.practiceMode);
        console.log('Statistics:', this.data.statistics);
        console.log('Next Regen:', this.getNextRegenerationTime());
    }

    // Méthodes de test
    forceRegeneration() {
        this.data.currentHearts = this.getMaxHearts();
        this.saveHeartData();
        this.updateHeartDisplay();
        console.log('💚 Hearts fully regenerated (forced)');
    }

    simulateHeartLoss(amount = 1) {
        this.loseHeart({ errorType: 'simulation' });
    }

    resetHearts() {
        this.data.currentHearts = this.getMaxHearts();
        this.data.lastHeartLoss = null;
        this.data.practiceMode = false;
        this.saveHeartData();
        this.updateHeartDisplay();
        console.log('💖 Hearts reset to maximum');
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.regenTimer) {
            clearInterval(this.regenTimer);
        }
        this.listeners = [];
        console.log('💔 Heart System destroyed');
    }
}

// Initialisation automatique
window.addEventListener('DOMContentLoaded', () => {
    // Instance globale
    window.HeartSystem = new HeartSystem();
    window.heartSystem = window.HeartSystem; // Alias pour compatibilité
    
    // API de debug globale
    window.debugHearts = () => window.HeartSystem.debug();
    window.loseHeart = () => window.HeartSystem.simulateHeartLoss();
    window.regenHearts = () => window.HeartSystem.forceRegeneration();
    window.resetHearts = () => window.HeartSystem.resetHearts();
    window.togglePractice = () => window.HeartSystem.togglePracticeMode();
    
    console.log('💖 Heart System ready! Use debugHearts() for info');
});

// Export pour modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeartSystem;
}