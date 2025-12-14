/**
 * FrenchApp - Application principale de la section Français
 * Coordonne tous les systèmes (Hearts, Streaks, Lessons, XP)
 */

class FrenchApp {
    constructor() {
        console.log('🎯 Initializing FrenchApp...');
        
        // Initialisation des systèmes de base
        this.storage = new FrenchStorage();
        this.heartsSystem = new FrenchHearts(this.storage);
        this.streakSystem = new FrenchStreaks(this.storage);
        
        // ⭐ INSTANCIATION DU SYSTÈME DE LEÇONS ⭐
        this.lessonsSystem = new FrenchLessons(this.storage, this.heartsSystem, this.streakSystem);
        
        // Configuration
        this.currentScreen = 'welcome-screen';
        this.currentDifficulty = 'medium';
        this.debugMode = false;
        
        // Initialisation de l'interface
        this.initializeUI();
        this.attachEventListeners();
        this.updateAllDisplays();
        
        console.log('✅ FrenchApp initialized successfully');
    }
    
    /**
     * Initialisation de l'interface utilisateur
     */
    initializeUI() {
        // Mise à jour du header
        this.updateStreakDisplay();
        this.updateHeartsDisplay();
        this.updateXPDisplay();
        
        // Charger les statistiques de l'écran d'accueil
        this.updateWelcomeStats();
        
        // Afficher l'écran d'accueil par défaut
        this.showScreen('welcome-screen');
    }
    
    /**
     * Attacher les gestionnaires d'événements
     */
    attachEventListeners() {
        // Bouton retour
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
        
        // Bouton "Commencer"
        const startBtn = document.getElementById('start-learning-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.showScreen('lessons-screen');
            });
        }
        
        // Boutons de difficulté
        const difficultyBtns = document.querySelectorAll('.difficulty-btn');
        difficultyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const level = e.target.getAttribute('data-level');
                this.setDifficulty(level);
            });
        });
        
        // Bouton fermer notification
        const notifClose = document.getElementById('notification-close');
        if (notifClose) {
            notifClose.addEventListener('click', () => {
                this.hideNotification();
            });
        }
        
        // Boutons écran de résultats
        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                this.showScreen('lessons-screen');
            });
        }
        
        const replayBtn = document.getElementById('replay-btn');
        if (replayBtn) {
            replayBtn.addEventListener('click', () => {
                // Rejouer la dernière leçon
                if (this.lastLessonId) {
                    this.lessonsSystem.startLesson(this.lastLessonId);
                }
            });
        }
        
        // Boutons écran sans cœurs
        const waitHeartsBtn = document.getElementById('wait-hearts-btn');
        if (waitHeartsBtn) {
            waitHeartsBtn.addEventListener('click', () => {
                this.showScreen('lessons-screen');
            });
        }
        
        const practiceModeBtn = document.getElementById('practice-mode-btn');
        if (practiceModeBtn) {
            practiceModeBtn.addEventListener('click', () => {
                // Activer mode entraînement sans cœurs
                this.enablePracticeMode();
            });
        }
    }
    
    /**
     * Afficher un écran spécifique
     */
    showScreen(screenId) {
        console.log(`📺 Switching to screen: ${screenId}`);
        
        // Masquer tous les écrans
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Afficher l'écran demandé
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
        } else {
            console.error(`❌ Screen not found: ${screenId}`);
        }
    }
    
    /**
     * Définir la difficulté
     */
    setDifficulty(level) {
        console.log(`✅ Difficulty set to: ${level}`);
        this.currentDifficulty = level;
        
        // Mettre à jour les boutons visuellement
        const difficultyBtns = document.querySelectorAll('.difficulty-btn');
        difficultyBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-level') === level) {
                btn.classList.add('active');
            }
        });
        
        // Notifier les autres systèmes si nécessaire
        if (this.lessonsSystem) {
            this.lessonsSystem.setDifficulty(level);
        }
    }
    
    /**
     * Mise à jour de l'affichage du streak
     */
    updateStreakDisplay() {
        const streakCount = document.getElementById('streak-count');
        if (streakCount && this.streakSystem) {
            // ✅ ACCÈS DIRECT AUX DONNÉES via storage
            const streakData = this.storage.get('streakData') || { currentStreak: 0, longestStreak: 0 };
            streakCount.textContent = streakData.currentStreak;
        }
    }
    
    /**
     * Mise à jour de l'affichage des cœurs
     */
    updateHeartsDisplay() {
        const heartsDisplay = document.getElementById('hearts-display');
        if (heartsDisplay && this.heartsSystem) {
            // ✅ ACCÈS DIRECT AUX DONNÉES via storage
            const heartsData = this.storage.get('heartsData') || { currentHearts: 5 };
            const maxHearts = 5;
            
            heartsDisplay.innerHTML = '';
            for (let i = 0; i < maxHearts; i++) {
                const heart = document.createElement('span');
                heart.className = 'heart';
                heart.textContent = i < heartsData.currentHearts ? '❤️' : '🖤';
                heartsDisplay.appendChild(heart);
            }
        }
    }
    
    /**
     * Mise à jour de l'affichage XP
     */
    updateXPDisplay() {
        const xpText = document.getElementById('xp-text');
        const xpFill = document.getElementById('xp-fill');
        
        if (xpText && xpFill) {
            const totalXP = this.storage.get('totalXP') || 0;
            xpText.textContent = `${totalXP} XP`;
            
            // Calculer le pourcentage pour la barre
            const xpInLevel = totalXP % 100;
            const percentage = xpInLevel;
            
            xpFill.style.width = `${percentage}%`;
        }
    }
    
    /**
     * Mise à jour de toutes les statistiques
     */
    updateAllDisplays() {
        this.updateStreakDisplay();
        this.updateHeartsDisplay();
        this.updateXPDisplay();
    }
    
    /**
     * Mise à jour des stats de l'écran d'accueil
     */
    updateWelcomeStats() {
        const totalLessons = document.getElementById('total-lessons');
        const longestStreak = document.getElementById('longest-streak');
        const totalXP = document.getElementById('total-xp');
        
        if (totalLessons) {
            const completed = this.storage.get('completedLessons') || [];
            totalLessons.textContent = completed.length;
        }
        
        if (longestStreak) {
            // ✅ ACCÈS DIRECT AUX DONNÉES
            const streakData = this.storage.get('streakData') || { longestStreak: 0 };
            longestStreak.textContent = streakData.longestStreak;
        }
        
        if (totalXP) {
            const xp = this.storage.get('totalXP') || 0;
            totalXP.textContent = xp;
        }
    }
    
    /**
     * Afficher une notification
     */
    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notification-text');
        
        if (notification && notificationText) {
            notificationText.textContent = message;
            notification.className = `notification ${type} show`;
            
            // Masquer automatiquement après 3 secondes
            setTimeout(() => {
                this.hideNotification();
            }, 3000);
        }
    }
    
    /**
     * Masquer la notification
     */
    hideNotification() {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.classList.remove('show');
        }
    }
    
    /**
     * Activer le mode entraînement
     */
    enablePracticeMode() {
        console.log('📚 Practice mode enabled');
        this.practiceMode = true;
        this.showNotification('Mode entraînement activé ! 📚', 'info');
        this.showScreen('lessons-screen');
    }
    
    /**
     * Activer le mode debug
     */
    enableDebugMode() {
        console.log('🔧 Debug mode enabled');
        this.debugMode = true;
        const debugPanel = document.getElementById('debug-panel');
        if (debugPanel) {
            debugPanel.style.display = 'block';
        }
    }
    
    /**
     * Réinitialiser la progression
     */
    resetProgress() {
        if (confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser toute votre progression ?')) {
            this.storage.clear();
            location.reload();
        }
    }
}

// Exposer globalement pour debug
window.FrenchApp = FrenchApp;