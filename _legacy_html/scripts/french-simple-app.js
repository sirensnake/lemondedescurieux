/**
 * FRENCH SIMPLE APP - VERSION AUTONOME
 * Application simplifiée fonctionnelle sans dépendances complexes
 * Compatible avec francais_duolingo_section.html existant
 */

class FrenchSimpleApp {
    constructor() {
        console.log('🚀 French Simple App - Démarrage...');
        
        // État de l'application
        this.gameState = {
            currentLesson: null,
            currentExercise: 0,
            selectedAnswer: null,
            sessionStartTime: null,
            
            // Progression utilisateur
            hearts: 5,
            maxHearts: 5,
            streak: 0,
            totalXP: 0,
            level: 'cm1',
            
            // Données session
            score: 0,
            mistakes: 0
        };
        
        // Base de données des leçons (autonome)
        this.lessons = this.initializeLessonsDatabase();
        
        // Charger progression sauvegardée
        this.loadProgress();
    }
    
    /**
     * Initialise la base de données des leçons (autonome)
     */
    initializeLessonsDatabase() {
        return {
            'verbes-present': {
                id: 'verbes-present',
                title: 'Verbes au présent',
                icon: '🏃',
                difficulty: 1,
                xpReward: 50,
                exercises: [
                    {
                        question: 'Choisis la bonne conjugaison du verbe "chanter" :',
                        prompt: 'Je _____ une chanson.',
                        options: ['chante', 'chantes', 'chantons', 'chantez'],
                        correct: 0,
                        explanation: 'Avec "je", on conjugue : je chante (sans "s" à la fin)'
                    },
                    {
                        question: 'Complète avec la bonne forme :',
                        prompt: 'Tu _____ dans la cour.',
                        options: ['joue', 'joues', 'jouons', 'jouez'],
                        correct: 1,
                        explanation: 'Avec "tu", on ajoute toujours un "s" : tu joues'
                    },
                    {
                        question: 'Choisis la bonne conjugaison :',
                        prompt: 'Nous _____ à la télé.',
                        options: ['regardons', 'regardez', 'regarde', 'regardent'],
                        correct: 0,
                        explanation: 'Avec "nous", on termine par -ons : nous regardons'
                    },
                    {
                        question: 'Trouve le verbe du 1er groupe :',
                        prompt: 'Quel verbe est du 1er groupe ?',
                        options: ['finir', 'marcher', 'avoir', 'être'],
                        correct: 1,
                        explanation: '"Marcher" est du 1er groupe (infinitif en -er)'
                    },
                    {
                        question: 'Dernière question !',
                        prompt: 'Ils _____ très bien.',
                        options: ['chante', 'chantes', 'chantons', 'chantent'],
                        correct: 3,
                        explanation: 'Avec "ils", on termine par -ent : ils chantent'
                    }
                ]
            },
            
            'homonymes': {
                id: 'homonymes',
                title: 'Les homonymes',
                icon: '👥',
                difficulty: 2,
                xpReward: 45,
                exercises: [
                    {
                        question: 'Choisis la bonne orthographe :',
                        prompt: 'Les enfants _____ dans la cour.',
                        options: ['son', 'sont'],
                        correct: 1,
                        explanation: '"Sont" = verbe être (ils sont). "Son" = possession (son ballon)'
                    },
                    {
                        question: 'Complète avec "a" ou "à" :',
                        prompt: 'Marie _____ une belle robe.',
                        options: ['a', 'à'],
                        correct: 0,
                        explanation: 'Marie possède = elle "a"'
                    },
                    {
                        question: 'Complète avec "a" ou "à" :',
                        prompt: 'Je vais _____ l\'école.',
                        options: ['a', 'à'],
                        correct: 1,
                        explanation: 'Direction = "à" (vers l\'école)'
                    }
                ]
            }
        };
    }
    
    /**
     * Initialise l'application
     */
    initialize() {
        console.log('🔧 Initialisation French Simple App...');
        
        try {
            // Attacher les événements
            this.attachEventListeners();
            
            // Mettre à jour l'affichage initial
            this.updateAllDisplays();
            
            // Configurer l'état initial des leçons
            this.updateLessonsAvailability();
            
            console.log('✅ French Simple App initialisée avec succès');
            
        } catch (error) {
            console.error('❌ Erreur initialisation:', error);
            this.showNotification('Erreur de chargement. Rechargez la page.', 'error');
        }
    }
    
    /**
     * Attache tous les gestionnaires d'événements
     */
    attachEventListeners() {
        // Sélecteur de niveau
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('level-btn')) {
                this.handleLevelChange(e.target.dataset.level);
            }
        });
        
        // Bulles de leçons
        document.addEventListener('click', (e) => {
            const lessonBubble = e.target.closest('.lesson-bubble');
            if (lessonBubble && !lessonBubble.classList.contains('locked')) {
                const lessonId = lessonBubble.dataset.lesson;
                if (lessonId) {
                    this.startLesson(lessonId);
                }
            }
        });
        
        // Boutons de l'interface de leçon
        const checkBtn = document.getElementById('check-answer');
        if (checkBtn) {
            checkBtn.addEventListener('click', () => this.checkAnswer());
        }
        
        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => this.nextExercise());
        }
        
        const closeBtn = document.getElementById('close-lesson');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeLessonInterface());
        }
        
        // Modales
        const continueLearningBtn = document.getElementById('continue-learning');
        if (continueLearningBtn) {
            continueLearningBtn.addEventListener('click', () => this.closeModal('lesson-complete-modal'));
        }
        
        const backToMapBtn = document.getElementById('back-to-map');
        if (backToMapBtn) {
            backToMapBtn.addEventListener('click', () => {
                this.closeModal('lesson-complete-modal');
                this.returnToLessonsGrid();
            });
        }
    }
    
    /**
     * Démarre une leçon
     */
    startLesson(lessonId) {
        console.log('🎯 Démarrage leçon:', lessonId);
        
        // Vérifier les cœurs
        if (this.gameState.hearts <= 0) {
            this.showNotification('❤️ Plus de cœurs ! Ils se régénèrent automatiquement.', 'warning');
            return;
        }
        
        // Charger la leçon
        const lesson = this.lessons[lessonId];
        if (!lesson) {
            this.showNotification('Leçon non trouvée', 'error');
            return;
        }
        
        // Initialiser la session
        this.gameState.currentLesson = lesson;
        this.gameState.currentExercise = 0;
        this.gameState.score = 0;
        this.gameState.mistakes = 0;
        this.gameState.selectedAnswer = null;
        this.gameState.sessionStartTime = Date.now();
        
        // Afficher l'interface de leçon
        this.showLessonInterface();
        this.showCurrentExercise();
    }
    
    /**
     * Affiche l'interface de leçon
     */
    showLessonInterface() {
        const lessonsGrid = document.getElementById('lessons-grid');
        const lessonInterface = document.getElementById('lesson-interface');
        
        if (lessonsGrid) lessonsGrid.classList.add('hidden');
        if (lessonInterface) lessonInterface.classList.remove('hidden');
    }
    
    /**
     * Affiche l'exercice actuel
     */
    showCurrentExercise() {
        if (!this.gameState.currentLesson) return;
        
        const exercise = this.gameState.currentLesson.exercises[this.gameState.currentExercise];
        if (!exercise) {
            this.completeLesson();
            return;
        }
        
        // Mettre à jour la progression de la leçon
        this.updateLessonProgress();
        
        // Afficher l'exercice
        const exerciseArea = document.getElementById('exercise-area');
        if (exerciseArea) {
            exerciseArea.innerHTML = `
                <div class="exercise-question">
                    <div class="instruction">${exercise.question}</div>
                    <div class="question">${exercise.prompt}</div>
                </div>
                <div class="exercise-options" id="exercise-options">
                    ${exercise.options.map((option, index) => `
                        <button class="option-btn" data-index="${index}">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            `;
            
            // Attacher événements aux options
            exerciseArea.querySelectorAll('.option-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.selectAnswer(parseInt(e.target.dataset.index));
                });
            });
        }
        
        // Réinitialiser l'état
        this.gameState.selectedAnswer = null;
        this.hideFeedback();
        
        const checkBtn = document.getElementById('check-answer');
        if (checkBtn) {
            checkBtn.disabled = true;
        }
    }
    
    /**
     * Met à jour la progression de la leçon
     */
    updateLessonProgress() {
        if (!this.gameState.currentLesson) return;
        
        const total = this.gameState.currentLesson.exercises.length;
        const current = this.gameState.currentExercise + 1;
        const progress = (current / total) * 100;
        
        const progressFill = document.getElementById('lesson-progress-fill');
        const currentSpan = document.getElementById('current-question');
        const totalSpan = document.getElementById('total-questions');
        
        if (progressFill) progressFill.style.width = progress + '%';
        if (currentSpan) currentSpan.textContent = current;
        if (totalSpan) totalSpan.textContent = total;
    }
    
    /**
     * Sélectionne une réponse
     */
    selectAnswer(index) {
        // Désélectionner toutes les options
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Sélectionner l'option choisie
        const selectedBtn = document.querySelector(`[data-index="${index}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
        }
        
        this.gameState.selectedAnswer = index;
        
        // Activer le bouton de vérification
        const checkBtn = document.getElementById('check-answer');
        if (checkBtn) {
            checkBtn.disabled = false;
        }
    }
    
    /**
     * Vérifie la réponse
     */
    checkAnswer() {
        if (this.gameState.selectedAnswer === null) return;
        
        const exercise = this.gameState.currentLesson.exercises[this.gameState.currentExercise];
        const isCorrect = this.gameState.selectedAnswer === exercise.correct;
        
        // Mettre à jour le score
        if (isCorrect) {
            this.gameState.score++;
        } else {
            this.gameState.mistakes++;
            this.loseHeart();
        }
        
        // Afficher le feedback
        this.showFeedback(isCorrect, exercise);
        
        // Mettre à jour visuellement les réponses
        this.highlightAnswers(isCorrect, exercise);
        
        // Désactiver le bouton
        const checkBtn = document.getElementById('check-answer');
        if (checkBtn) {
            checkBtn.disabled = true;
        }
    }
    
    /**
     * Met en évidence les réponses
     */
    highlightAnswers(isCorrect, exercise) {
        const options = document.querySelectorAll('.option-btn');
        
        options.forEach((btn, index) => {
            if (index === exercise.correct) {
                btn.classList.add('correct');
            } else if (index === this.gameState.selectedAnswer && !isCorrect) {
                btn.classList.add('wrong');
            }
        });
    }
    
    /**
     * Affiche le feedback
     */
    showFeedback(isCorrect, exercise) {
        const feedbackArea = document.getElementById('feedback-area');
        const feedbackIcon = document.getElementById('feedback-icon');
        const feedbackText = document.getElementById('feedback-text');
        const feedbackExplanation = document.getElementById('feedback-explanation');
        
        if (!feedbackArea) return;
        
        // Configurer le feedback
        if (isCorrect) {
            feedbackArea.classList.remove('wrong');
            if (feedbackIcon) feedbackIcon.textContent = '✅';
            if (feedbackText) feedbackText.textContent = 'Bonne réponse !';
        } else {
            feedbackArea.classList.add('wrong');
            if (feedbackIcon) feedbackIcon.textContent = '❌';
            if (feedbackText) feedbackText.textContent = 'Pas tout à fait...';
        }
        
        // Ajouter l'explication
        if (feedbackExplanation && exercise.explanation) {
            feedbackExplanation.textContent = exercise.explanation;
        }
        
        // Afficher le feedback
        feedbackArea.classList.remove('hidden');
    }
    
    /**
     * Cache le feedback
     */
    hideFeedback() {
        const feedbackArea = document.getElementById('feedback-area');
        if (feedbackArea) {
            feedbackArea.classList.add('hidden');
        }
    }
    
    /**
     * Passe à l'exercice suivant
     */
    nextExercise() {
        this.gameState.currentExercise++;
        
        if (this.gameState.currentExercise >= this.gameState.currentLesson.exercises.length) {
            this.completeLesson();
        } else {
            this.showCurrentExercise();
        }
    }
    
    /**
     * Termine la leçon
     */
    completeLesson() {
        if (!this.gameState.currentLesson) return;
        
        const sessionTime = Date.now() - this.gameState.sessionStartTime;
        const total = this.gameState.currentLesson.exercises.length;
        const accuracy = Math.round((this.gameState.score / total) * 100);
        const xpGained = this.calculateXPGain(accuracy);
        
        // Mettre à jour la progression
        this.gameState.totalXP += xpGained;
        this.updateStreak();
        
        // Sauvegarder la progression
        this.saveProgress();
        
        // Afficher la modal de fin
        this.showLessonCompleteModal(xpGained, accuracy, sessionTime);
        
        // Nettoyer
        this.gameState.currentLesson = null;
    }
    
    /**
     * Calcule l'XP gagné
     */
    calculateXPGain(accuracy) {
        const baseXP = this.gameState.currentLesson?.xpReward || 50;
        let xp = baseXP;
        
        // Bonus de précision
        if (accuracy >= 100) xp += 20;
        else if (accuracy >= 90) xp += 10;
        
        // Bonus de streak
        if (this.gameState.streak > 0) {
            xp = Math.round(xp * 1.5);
        }
        
        return xp;
    }
    
    /**
     * Met à jour le streak
     */
    updateStreak() {
        const today = new Date().toDateString();
        const lastActivity = localStorage.getItem('french_last_activity');
        
        if (lastActivity === today) {
            // Déjà une activité aujourd'hui
            return;
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastActivity === yesterday.toDateString()) {
            // Continuation du streak
            this.gameState.streak++;
        } else {
            // Nouveau streak
            this.gameState.streak = 1;
        }
        
        localStorage.setItem('french_last_activity', today);
    }
    
    /**
     * Fait perdre un cœur
     */
    loseHeart() {
        if (this.gameState.hearts > 0) {
            this.gameState.hearts--;
            this.updateHeartsDisplay();
            
            if (this.gameState.hearts <= 0) {
                setTimeout(() => {
                    this.showNotification('💔 Plus de cœurs ! Ils se régénèrent automatiquement.', 'warning');
                    this.closeLessonInterface();
                }, 2000);
            }
        }
    }
    
    /**
     * Ferme l'interface de leçon
     */
    closeLessonInterface() {
        const lessonInterface = document.getElementById('lesson-interface');
        if (lessonInterface) lessonInterface.classList.add('hidden');
        
        this.returnToLessonsGrid();
    }
    
    /**
     * Retourne à la grille des leçons
     */
    returnToLessonsGrid() {
        const lessonsGrid = document.getElementById('lessons-grid');
        if (lessonsGrid) lessonsGrid.classList.remove('hidden');
        
        this.updateAllDisplays();
    }
    
    /**
     * Affiche la modal de fin de leçon
     */
    showLessonCompleteModal(xpGained, accuracy, sessionTime) {
        const xpElement = document.getElementById('xp-gained');
        const accuracyElement = document.getElementById('lesson-accuracy');
        const timeElement = document.getElementById('lesson-time');
        
        if (xpElement) xpElement.textContent = xpGained;
        if (accuracyElement) accuracyElement.textContent = accuracy + '%';
        if (timeElement) {
            const minutes = Math.floor(sessionTime / 60000);
            const seconds = Math.floor((sessionTime % 60000) / 1000);
            timeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        this.showModal('lesson-complete-modal');
    }
    
    /**
     * Affiche une modal
     */
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }
    
    /**
     * Ferme une modal
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }
    
    /**
     * Gère le changement de niveau
     */
    handleLevelChange(level) {
        this.gameState.level = level;
        this.saveProgress();
        
        // Mettre à jour l'affichage
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.level === level);
        });
        
        console.log('Niveau changé:', level);
    }
    
    /**
     * Met à jour tous les affichages
     */
    updateAllDisplays() {
        this.updateStreakDisplay();
        this.updateHeartsDisplay();
        this.updateXPDisplay();
        this.updateLessonsAvailability();
    }
    
    /**
     * Met à jour l'affichage du streak
     */
    updateStreakDisplay() {
        const streakElement = document.querySelector('.streak-count');
        if (streakElement) {
            streakElement.textContent = this.gameState.streak;
        }
    }
    
    /**
     * Met à jour l'affichage des cœurs
     */
    updateHeartsDisplay() {
        const heartsContainer = document.getElementById('hearts-display');
        if (!heartsContainer) return;
        
        heartsContainer.innerHTML = '';
        
        for (let i = 0; i < this.gameState.maxHearts; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.textContent = '❤️';
            
            if (i < this.gameState.hearts) {
                heart.classList.add('filled');
            } else {
                heart.classList.add('empty');
            }
            
            heartsContainer.appendChild(heart);
        }
    }
    
    /**
     * Met à jour l'affichage de l'XP
     */
    updateXPDisplay() {
        const xpElement = document.getElementById('xp-count');
        if (xpElement) {
            xpElement.textContent = this.gameState.totalXP;
        }
        
        const xpFill = document.getElementById('xp-fill');
        if (xpFill) {
            const percentage = (this.gameState.totalXP % 1000) / 10;
            xpFill.style.width = percentage + '%';
        }
    }
    
    /**
     * Met à jour la disponibilité des leçons
     */
    updateLessonsAvailability() {
        // Pour l'instant, seule la première leçon est débloquée
        document.querySelectorAll('.lesson-bubble').forEach(bubble => {
            const lessonId = bubble.dataset.lesson;
            if (lessonId === 'verbes-present') {
                bubble.classList.remove('locked');
            } else {
                bubble.classList.add('locked');
            }
        });
    }
    
    /**
     * Affiche une notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#e74c3c' : type === 'warning' ? '#f39c12' : '#2a9d8f'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            z-index: 10000;
            max-width: 300px;
            font-size: 0.9rem;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    }
    
    /**
     * Sauvegarde la progression
     */
    saveProgress() {
        try {
            const progressData = {
                hearts: this.gameState.hearts,
                streak: this.gameState.streak,
                totalXP: this.gameState.totalXP,
                level: this.gameState.level,
                lastSaved: new Date().toISOString()
            };
            
            localStorage.setItem('french_simple_progress', JSON.stringify(progressData));
            console.log('💾 Progression sauvegardée');
            
        } catch (error) {
            console.error('❌ Erreur sauvegarde:', error);
        }
    }
    
    /**
     * Charge la progression
     */
    loadProgress() {
        try {
            const saved = localStorage.getItem('french_simple_progress');
            if (saved) {
                const progressData = JSON.parse(saved);
                
                this.gameState.hearts = progressData.hearts || 5;
                this.gameState.streak = progressData.streak || 0;
                this.gameState.totalXP = progressData.totalXP || 0;
                this.gameState.level = progressData.level || 'cm1';
                
                console.log('📂 Progression chargée');
            }
        } catch (error) {
            console.error('❌ Erreur chargement:', error);
        }
    }
    
    /**
     * Remet à zéro la progression
     */
    resetProgress() {
        localStorage.removeItem('french_simple_progress');
        localStorage.removeItem('french_last_activity');
        
        this.gameState.hearts = 5;
        this.gameState.streak = 0;
        this.gameState.totalXP = 0;
        this.gameState.level = 'cm1';
        
        this.updateAllDisplays();
        console.log('🔄 Progression réinitialisée');
    }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Démarrage French Simple App...');
    
    // Créer et initialiser l'application
    window.frenchApp = new FrenchSimpleApp();
    window.frenchApp.initialize();
    
    // Fonctions debug globales
    window.FrenchDebug = {
        getApp: () => window.frenchApp,
        resetProgress: () => window.frenchApp.resetProgress(),
        addXP: (amount) => {
            window.frenchApp.gameState.totalXP += amount;
            window.frenchApp.updateXPDisplay();
        },
        setStreak: (days) => {
            window.frenchApp.gameState.streak = days;
            window.frenchApp.updateStreakDisplay();
        }
    };
    
    console.log('✅ French Simple App initialisée');
    console.log('🔧 Debug: window.FrenchDebug disponible');
});