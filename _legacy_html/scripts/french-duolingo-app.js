/**
 * FRENCH DUOLINGO APP - VERSION CORRIGÉE
 * Application principale pour l'apprentissage du français style Duolingo
 */

class FrenchDuolingoApp {
    constructor() {
        console.log('🚀 Création FrenchDuolingoApp...');
        
        // Configuration par défaut
        this.config = {
            hearts: {
                maxHearts: 5,
                regenTime: 30 * 60 * 1000, // 30 minutes
                enabled: true
            },
            streaks: {
                enabled: true,
                showMotivation: true
            },
            xp: {
                showAnimations: true,
                levelUpNotifications: true
            },
            storage: {
                autoSave: true,
                syncWithGlobal: true
            }
        };

        // Clés de stockage localStorage
        this.storageKeys = {
            progress: 'lemondedescurieux_french_progress',
            global: 'userProgress',
            badges: 'userBadges'
        };

        // État de l'application
        this.currentLesson = null;
        this.currentExercise = 0;
        this.sessionStartTime = null;
        
        // Données de progression
        this.progressData = this.loadProgressData();
        
        console.log('✅ FrenchDuolingoApp créée');
    }

    /**
     * Initialise l'application
     */
    initialize() {
        console.log('🔧 Initialisation FrenchDuolingoApp...');
        
        try {
            // Vérifier dépendances
            if (!window.FRENCH_LESSONS_DATABASE) {
                throw new Error('Base de données leçons manquante');
            }

            // Initialiser l'interface
            this.initializeUI();
            
            // Attacher événements
            this.attachEventListeners();
            
            // Mettre à jour affichage
            this.updateAllDisplays();
            
            // Démarrer système de sauvegarde automatique
            this.startAutoSave();
            
            console.log('✅ FrenchDuolingoApp initialisée avec succès');
            
        } catch (error) {
            console.error('❌ Erreur initialisation:', error);
            this.showError('Erreur lors du chargement. Rechargez la page.');
        }
    }

    /**
     * Charge les données de progression depuis localStorage
     */
    loadProgressData() {
        const defaultData = {
            currentStreak: 0,
            longestStreak: 0,
            lastActivityDate: null,
            currentHearts: this.config.hearts.maxHearts,
            lastHeartLoss: null,
            totalXP: 0,
            completedLessons: {},
            averageAccuracy: 0,
            studyTime: 0,
            level: 'cm1',
            totalSessions: 0,
            heartsUsed: 0
        };

        const saved = localStorage.getItem(this.storageKeys.progress);
        if (saved) {
            try {
                return { ...defaultData, ...JSON.parse(saved) };
            } catch (error) {
                console.warn('Données progression corrompues, réinitialisation');
                return defaultData;
            }
        }
        
        return defaultData;
    }

    /**
     * Sauvegarde les données de progression
     */
    saveProgressData() {
        try {
            localStorage.setItem(this.storageKeys.progress, JSON.stringify(this.progressData));
            
            if (this.config.storage.syncWithGlobal) {
                this.syncWithGlobalProgress();
            }
            
            console.log('💾 Progression sauvegardée');
        } catch (error) {
            console.error('❌ Erreur sauvegarde:', error);
        }
    }

    /**
     * Synchronise avec la progression globale du site
     */
    syncWithGlobalProgress() {
        const globalProgress = JSON.parse(localStorage.getItem(this.storageKeys.global)) || {};
        
        if (!globalProgress.francais) {
            globalProgress.francais = { activites: {}, niveauActuel: 'cm1', tempsTotal: 0 };
        }

        // Convertir données vers format global
        Object.entries(this.progressData.completedLessons).forEach(([lessonId, data]) => {
            globalProgress.francais.activites[lessonId] = {
                completed: data.completed,
                score: data.bestScore || 0,
                timeSpent: data.timeSpent || 0,
                lastAttempt: data.completedAt || new Date().toISOString()
            };
        });

        globalProgress.francais.statistiques = {
            totalXP: this.progressData.totalXP,
            streak: this.progressData.currentStreak,
            precision: this.progressData.averageAccuracy,
            tempsEtude: this.progressData.studyTime
        };

        localStorage.setItem(this.storageKeys.global, JSON.stringify(globalProgress));
    }

    /**
     * Initialise l'interface utilisateur
     */
    initializeUI() {
        // Masquer interface de leçon au démarrage
        const lessonInterface = document.getElementById('lesson-interface');
        if (lessonInterface) {
            lessonInterface.classList.add('hidden');
        }

        // Afficher grille des leçons
        const lessonsGrid = document.getElementById('lessons-grid');
        if (lessonsGrid) {
            lessonsGrid.classList.remove('hidden');
        }

        // Initialiser sélecteur de niveau
        this.updateLevelSelector();
        
        // Mettre à jour état des leçons (verrouillées/débloquées)
        this.updateLessonsAvailability();
    }

    /**
     * Attache tous les gestionnaires d'événements
     */
    attachEventListeners() {
        // Sélecteur de niveau
        const levelSelector = document.querySelector('.level-selector');
        if (levelSelector) {
            levelSelector.addEventListener('click', (e) => {
                if (e.target.classList.contains('level-btn')) {
                    this.handleLevelChange(e.target.dataset.level);
                }
            });
        }

        // Grille des leçons
        const lessonsGrid = document.getElementById('lessons-grid');
        if (lessonsGrid) {
            lessonsGrid.addEventListener('click', (e) => {
                const lessonBubble = e.target.closest('.lesson-bubble');
                if (lessonBubble && !lessonBubble.classList.contains('locked')) {
                    this.startLesson(lessonBubble.dataset.lesson);
                }
            });
        }

        // Boutons de l'interface de leçon
        this.attachLessonEventListeners();
        
        // Boutons des modales
        this.attachModalEventListeners();
    }

    /**
     * Attache les événements de l'interface de leçon
     */
    attachLessonEventListeners() {
        // Bouton de vérification
        const checkBtn = document.getElementById('check-answer');
        if (checkBtn) {
            checkBtn.addEventListener('click', () => this.checkCurrentAnswer());
        }

        // Bouton de continuation
        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => this.nextExercise());
        }

        // Bouton de fermeture
        const closeBtn = document.getElementById('close-lesson');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeLessonInterface());
        }
    }

    /**
     * Attache les événements des modales
     */
    attachModalEventListeners() {
        // Modal fin de leçon
        const continueBtn = document.getElementById('continue-learning');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => this.closeModal('lesson-complete-modal'));
        }

        const backBtn = document.getElementById('back-to-map');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.closeModal('lesson-complete-modal');
                this.returnToLessonsGrid();
            });
        }

        // Modal perte de cœurs
        const practiceBtn = document.getElementById('practice-mode');
        if (practiceBtn) {
            practiceBtn.addEventListener('click', () => this.startPracticeMode());
        }

        const backHeartsBtn = document.getElementById('back-to-map-hearts');
        if (backHeartsBtn) {
            backHeartsBtn.addEventListener('click', () => {
                this.closeModal('hearts-lost-modal');
                this.returnToLessonsGrid();
            });
        }
    }

    /**
     * Démarre une leçon
     */
    startLesson(lessonId) {
        console.log('🎯 Démarrage leçon:', lessonId);

        // Vérifier si l'utilisateur a assez de cœurs
        if (this.config.hearts.enabled && this.progressData.currentHearts <= 0) {
            this.showModal('hearts-lost-modal');
            return;
        }

        // Charger données de la leçon
        const lessonData = window.getFrenchLesson(lessonId);
        if (!lessonData) {
            this.showError('Leçon non trouvée: ' + lessonId);
            return;
        }

        // Initialiser session
        this.currentLesson = {
            id: lessonId,
            data: lessonData,
            exercises: lessonData.exercises || [],
            currentExercise: 0,
            score: 0,
            mistakes: 0,
            startTime: Date.now()
        };

        // Afficher interface de leçon
        this.showLessonInterface();
        
        // Démarrer premier exercice
        this.showCurrentExercise();

        // Enregistrer début de session
        this.progressData.totalSessions++;
        this.sessionStartTime = Date.now();
    }

    /**
     * Affiche l'interface de leçon
     */
    showLessonInterface() {
        // Masquer grille des leçons
        const lessonsGrid = document.getElementById('lessons-grid');
        if (lessonsGrid) lessonsGrid.classList.add('hidden');

        // Afficher interface de leçon
        const lessonInterface = document.getElementById('lesson-interface');
        if (lessonInterface) {
            lessonInterface.classList.remove('hidden');
            
            // Mettre à jour titre et progression
            this.updateLessonHeader();
        }
    }

    /**
     * Met à jour l'en-tête de la leçon
     */
    updateLessonHeader() {
        if (!this.currentLesson) return;

        // Barre de progression
        const progressFill = document.getElementById('lesson-progress-fill');
        const currentQuestionSpan = document.getElementById('current-question');
        const totalQuestionsSpan = document.getElementById('total-questions');

        if (progressFill && currentQuestionSpan && totalQuestionsSpan) {
            const progress = ((this.currentLesson.currentExercise + 1) / this.currentLesson.exercises.length) * 100;
            progressFill.style.width = progress + '%';
            
            currentQuestionSpan.textContent = this.currentLesson.currentExercise + 1;
            totalQuestionsSpan.textContent = this.currentLesson.exercises.length;
        }
    }

    /**
     * Affiche l'exercice actuel
     */
    showCurrentExercise() {
        if (!this.currentLesson || !this.currentLesson.exercises) return;

        const exercise = this.currentLesson.exercises[this.currentLesson.currentExercise];
        if (!exercise) {
            this.completeLesson();
            return;
        }

        // Mettre à jour header
        this.updateLessonHeader();

        // Masquer feedback
        this.hideFeedback();

        // Afficher exercice selon le type
        this.renderExercise(exercise);

        // Réactiver bouton de vérification
        const checkBtn = document.getElementById('check-answer');
        if (checkBtn) {
            checkBtn.disabled = true;
            checkBtn.textContent = 'Vérifier';
        }
    }

    /**
     * Affiche un exercice selon son type
     */
    renderExercise(exercise) {
        const exerciseArea = document.getElementById('exercise-area');
        if (!exerciseArea) return;

        switch (exercise.type) {
            case 'multiple_choice':
                this.renderMultipleChoice(exercise, exerciseArea);
                break;
            case 'fill_blank':
                this.renderFillBlank(exercise, exerciseArea);
                break;
            case 'drag_and_drop':
                this.renderDragAndDrop(exercise, exerciseArea);
                break;
            default:
                this.renderMultipleChoice(exercise, exerciseArea);
        }
    }

    /**
     * Affiche un exercice à choix multiples
     */
    renderMultipleChoice(exercise, container) {
        container.innerHTML = `
            <div class="exercise-question">
                <div class="instruction">${exercise.instruction}</div>
                <div class="question">${exercise.question}</div>
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
        container.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Désélectionner autres options
                container.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                
                // Sélectionner option cliquée
                e.target.classList.add('selected');
                
                // Activer bouton vérification
                const checkBtn = document.getElementById('check-answer');
                if (checkBtn) checkBtn.disabled = false;
            });
        });
    }

    /**
     * Affiche un exercice de texte à trous
     */
    renderFillBlank(exercise, container) {
        container.innerHTML = `
            <div class="exercise-question">
                <div class="instruction">${exercise.instruction}</div>
            </div>
            <div class="fill-blank-container">
                ${exercise.sentences.map((sentence, index) => `
                    <div class="sentence-container">
                        <div class="sentence-text">
                            ${sentence.text.replace('_____', `<input type="text" class="blank-input" data-index="${index}" placeholder="...">`)}
                        </div>
                        ${sentence.hint ? `<div class="hint">💡 ${sentence.hint}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        `;

        // Attacher événements aux inputs
        container.querySelectorAll('.blank-input').forEach(input => {
            input.addEventListener('input', () => {
                // Vérifier si tous les champs sont remplis
                const allInputs = container.querySelectorAll('.blank-input');
                const allFilled = Array.from(allInputs).every(inp => inp.value.trim().length > 0);
                
                const checkBtn = document.getElementById('check-answer');
                if (checkBtn) checkBtn.disabled = !allFilled;
            });
        });
    }

    /**
     * Affiche un exercice de glisser-déposer
     */
    renderDragAndDrop(exercise, container) {
        container.innerHTML = `
            <div class="exercise-question">
                <div class="instruction">${exercise.instruction}</div>
                <div class="question">${exercise.question}</div>
            </div>
            <div class="drag-drop-container">
                <div class="drag-items">
                    ${exercise.items.map(item => `
                        <div class="drag-item" draggable="true" data-id="${item.id}">
                            ${item.text}
                        </div>
                    `).join('')}
                </div>
                <div class="drop-targets">
                    ${exercise.targets.map(target => `
                        <div class="drop-target" data-correct="${target.correct}">
                            <div class="target-text">${target.text}</div>
                            <div class="drop-zone"></div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Implémenter glisser-déposer
        this.implementDragAndDrop(container);
    }

    /**
     * Implémente la fonctionnalité glisser-déposer
     */
    implementDragAndDrop(container) {
        let draggedElement = null;

        // Événements de glissement
        container.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('drag-item')) {
                draggedElement = e.target;
                e.target.style.opacity = '0.5';
            }
        });

        container.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('drag-item')) {
                e.target.style.opacity = '1';
            }
        });

        // Événements de dépôt
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        container.addEventListener('drop', (e) => {
            e.preventDefault();
            const dropZone = e.target.closest('.drop-zone');
            
            if (dropZone && draggedElement) {
                dropZone.appendChild(draggedElement);
                draggedElement = null;
                
                // Vérifier si tous les éléments sont placés
                const allPlaced = container.querySelectorAll('.drop-zone .drag-item').length === 
                                 container.querySelectorAll('.drag-item').length;
                
                const checkBtn = document.getElementById('check-answer');
                if (checkBtn) checkBtn.disabled = !allPlaced;
            }
        });
    }

    /**
     * Vérifie la réponse de l'exercice actuel
     */
    checkCurrentAnswer() {
        if (!this.currentLesson) return;

        const exercise = this.currentLesson.exercises[this.currentLesson.currentExercise];
        let isCorrect = false;
        let userAnswer = null;

        switch (exercise.type) {
            case 'multiple_choice':
                isCorrect = this.checkMultipleChoice(exercise);
                break;
            case 'fill_blank':
                isCorrect = this.checkFillBlank(exercise);
                break;
            case 'drag_and_drop':
                isCorrect = this.checkDragAndDrop(exercise);
                break;
        }

        // Traiter le résultat
        this.processAnswer(isCorrect, exercise);
    }

    /**
     * Vérifie une réponse à choix multiples
     */
    checkMultipleChoice(exercise) {
        const selected = document.querySelector('.option-btn.selected');
        if (!selected) return false;

        const selectedIndex = parseInt(selected.dataset.index);
        return selectedIndex === exercise.correct;
    }

    /**
     * Vérifie une réponse de texte à trous
     */
    checkFillBlank(exercise) {
        const inputs = document.querySelectorAll('.blank-input');
        let allCorrect = true;

        inputs.forEach((input, index) => {
            const userAnswer = input.value.trim().toLowerCase();
            const correctAnswer = exercise.sentences[index].correct.toLowerCase();
            
            if (userAnswer !== correctAnswer) {
                allCorrect = false;
            }
        });

        return allCorrect;
    }

    /**
     * Vérifie une réponse de glisser-déposer
     */
    checkDragAndDrop(exercise) {
        const dropZones = document.querySelectorAll('.drop-target');
        let allCorrect = true;

        dropZones.forEach(zone => {
            const draggedItem = zone.querySelector('.drag-item');
            if (!draggedItem) {
                allCorrect = false;
                return;
            }

            const itemId = draggedItem.dataset.id;
            const expectedId = zone.dataset.correct;
            
            if (itemId !== expectedId) {
                allCorrect = false;
            }
        });

        return allCorrect;
    }

    /**
     * Traite le résultat d'une réponse
     */
    processAnswer(isCorrect, exercise) {
        // Mettre à jour score de la leçon
        if (isCorrect) {
            this.currentLesson.score++;
        } else {
            this.currentLesson.mistakes++;
            
            // Perdre un cœur si système activé
            if (this.config.hearts.enabled) {
                this.loseHeart();
            }
        }

        // Afficher feedback
        this.showFeedback(isCorrect, exercise);

        // Désactiver bouton de vérification
        const checkBtn = document.getElementById('check-answer');
        if (checkBtn) {
            checkBtn.disabled = true;
        }
    }

    /**
     * Affiche le feedback d'une réponse
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
            feedbackIcon.textContent = '✅';
            feedbackText.textContent = 'Bonne réponse !';
        } else {
            feedbackArea.classList.add('wrong');
            feedbackIcon.textContent = '❌';
            feedbackText.textContent = 'Pas tout à fait...';
        }

        // Ajouter explication si disponible
        if (exercise.explanation && feedbackExplanation) {
            feedbackExplanation.textContent = exercise.explanation;
        }

        // Afficher feedback
        feedbackArea.classList.remove('hidden');

        // Mettre à jour visuellement les bonnes/mauvaises réponses
        this.highlightAnswers(isCorrect, exercise);
    }

    /**
     * Met en évidence les bonnes/mauvaises réponses
     */
    highlightAnswers(isCorrect, exercise) {
        switch (exercise.type) {
            case 'multiple_choice':
                this.highlightMultipleChoice(isCorrect, exercise);
                break;
            case 'fill_blank':
                this.highlightFillBlank(isCorrect, exercise);
                break;
            case 'drag_and_drop':
                this.highlightDragAndDrop(isCorrect, exercise);
                break;
        }
    }

    /**
     * Met en évidence les réponses à choix multiples
     */
    highlightMultipleChoice(isCorrect, exercise) {
        const options = document.querySelectorAll('.option-btn');
        
        options.forEach((option, index) => {
            if (index === exercise.correct) {
                option.classList.add('correct');
            } else if (option.classList.contains('selected') && !isCorrect) {
                option.classList.add('wrong');
            }
        });
    }

    /**
     * Met en évidence les réponses de texte à trous
     */
    highlightFillBlank(isCorrect, exercise) {
        const inputs = document.querySelectorAll('.blank-input');
        
        inputs.forEach((input, index) => {
            const userAnswer = input.value.trim().toLowerCase();
            const correctAnswer = exercise.sentences[index].correct.toLowerCase();
            
            if (userAnswer === correctAnswer) {
                input.classList.add('correct');
            } else {
                input.classList.add('wrong');
            }
        });
    }

    /**
     * Met en évidence les réponses de glisser-déposer
     */
    highlightDragAndDrop(isCorrect, exercise) {
        const dropZones = document.querySelectorAll('.drop-target');
        
        dropZones.forEach(zone => {
            const draggedItem = zone.querySelector('.drag-item');
            if (!draggedItem) return;

            const itemId = draggedItem.dataset.id;
            const expectedId = zone.dataset.correct;
            
            if (itemId === expectedId) {
                zone.classList.add('correct');
            } else {
                zone.classList.add('wrong');
            }
        });
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
        if (!this.currentLesson) return;

        this.currentLesson.currentExercise++;
        
        if (this.currentLesson.currentExercise >= this.currentLesson.exercises.length) {
            this.completeLesson();
        } else {
            this.showCurrentExercise();
        }
    }

    /**
     * Termine la leçon actuelle
     */
    completeLesson() {
        if (!this.currentLesson) return;

        const sessionTime = Date.now() - this.currentLesson.startTime;
        const accuracy = Math.round((this.currentLesson.score / this.currentLesson.exercises.length) * 100);
        const xpGained = this.calculateXPGain(accuracy);

        // Mettre à jour progression
        this.updateProgressAfterLesson(sessionTime, accuracy, xpGained);

        // Afficher modal de fin
        this.showLessonCompleteModal(xpGained, accuracy, sessionTime);

        // Nettoyer session
        this.currentLesson = null;
    }

    /**
     * Calcule l'XP gagné pour une leçon
     */
    calculateXPGain(accuracy) {
        if (!this.currentLesson) return 0;

        const lesson = this.currentLesson.data;
        let baseXP = lesson.xpReward || 50;

        // Bonus de précision
        if (accuracy >= 100) baseXP += 20;
        else if (accuracy >= 90) baseXP += 10;

        // Bonus de streak
        if (this.progressData.currentStreak > 0) {
            baseXP = Math.round(baseXP * 1.5);
        }

        return baseXP;
    }

    /**
     * Met à jour la progression après une leçon
     */
    updateProgressAfterLesson(sessionTime, accuracy, xpGained) {
        if (!this.currentLesson) return;

        const lessonId = this.currentLesson.id;

        // Mettre à jour données de progression
        this.progressData.totalXP += xpGained;
        this.progressData.studyTime += sessionTime;

        // Enregistrer leçon complétée
        this.progressData.completedLessons[lessonId] = {
            completed: true,
            completedAt: new Date().toISOString(),
            accuracy: accuracy,
            timeSpent: sessionTime,
            xpGained: xpGained,
            attempts: (this.progressData.completedLessons[lessonId]?.attempts || 0) + 1,
            bestScore: Math.max(accuracy, this.progressData.completedLessons[lessonId]?.bestScore || 0)
        };

        // Mettre à jour streak
        this.updateStreak();

        // Mettre à jour précision moyenne
        this.updateAverageAccuracy();

        // Sauvegarder
        this.saveProgressData();

        // Vérifier nouveaux badges
        this.checkNewBadges();

        // Déverrouiller nouvelles leçons
        this.updateLessonsAvailability();
    }

    /**
     * Met à jour le streak quotidien
     */
    updateStreak() {
        const today = new Date().toDateString();
        const lastActivity = this.progressData.lastActivityDate;

        if (lastActivity === today) {
            // Déjà une activité aujourd'hui, pas de changement
            return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastActivity === yesterday.toDateString()) {
            // Continuité du streak
            this.progressData.currentStreak++;
        } else {
            // Nouveau streak ou rupture
            this.progressData.currentStreak = 1;
        }

        // Mettre à jour record
        this.progressData.longestStreak = Math.max(
            this.progressData.longestStreak,
            this.progressData.currentStreak
        );

        this.progressData.lastActivityDate = today;

        // Émettre événement streak
        document.dispatchEvent(new CustomEvent('streakUpdated', {
            detail: {
                currentStreak: this.progressData.currentStreak,
                longestStreak: this.progressData.longestStreak
            }
        }));
    }

    /**
     * Met à jour la précision moyenne
     */
    updateAverageAccuracy() {
        const lessons = Object.values(this.progressData.completedLessons);
        if (lessons.length === 0) return;

        const totalAccuracy = lessons.reduce((sum, lesson) => sum + (lesson.accuracy || 0), 0);
        this.progressData.averageAccuracy = Math.round(totalAccuracy / lessons.length);
    }

    /**
     * Vérifie et attribue de nouveaux badges
     */
    checkNewBadges() {
        const badges = JSON.parse(localStorage.getItem(this.storageKeys.badges)) || {};
        const newBadges = [];

        // Badge première leçon
        if (Object.keys(this.progressData.completedLessons).length === 1 && !badges.french_first_lesson) {
            const badge = {
                id: 'french_first_lesson',
                name: 'Premier Pas',
                description: 'Tu as terminé ta première leçon de français !',
                icon: '🌟',
                earnedAt: new Date().toISOString(),
                category: 'progression_francais'
            };
            badges[badge.id] = badge;
            newBadges.push(badge);
        }

        // Badge streak
        if (this.progressData.currentStreak >= 3 && !badges.french_streak_3) {
            const badge = {
                id: 'french_streak_3',
                name: 'Persévérant',
                description: '3 jours d\'étude consécutifs !',
                icon: '🔥',
                earnedAt: new Date().toISOString(),
                category: 'streak_francais'
            };
            badges[badge.id] = badge;
            newBadges.push(badge);
        }

        // Sauvegarder badges
        if (newBadges.length > 0) {
            localStorage.setItem(this.storageKeys.badges, JSON.stringify(badges));
            
            // Émettre événements
            newBadges.forEach(badge => {
                document.dispatchEvent(new CustomEvent('badgeEarned', { detail: badge }));
            });
        }
    }

    /**
     * Fait perdre un cœur
     */
    loseHeart() {
        if (this.progressData.currentHearts > 0) {
            this.progressData.currentHearts--;
            this.progressData.lastHeartLoss = Date.now();
            this.progressData.heartsUsed++;

            // Mettre à jour affichage
            this.updateHeartsDisplay();

            // Émettre événement
            document.dispatchEvent(new CustomEvent('heartsChanged', {
                detail: { currentHearts: this.progressData.currentHearts }
            }));

            // Vérifier si plus de cœurs
            if (this.progressData.currentHearts <= 0) {
                setTimeout(() => {
                    this.showModal('hearts-lost-modal');
                }, 1000); // Délai pour voir l'animation
            }
        }
    }

    /**
     * Régénère les cœurs
     */
    regenerateHearts() {
        if (!this.progressData.lastHeartLoss) return;

        const heartRegenTime = this.config.hearts.regenTime;
        const timeSinceLoss = Date.now() - this.progressData.lastHeartLoss;
        const heartsToRegenerate = Math.floor(timeSinceLoss / heartRegenTime);

        if (heartsToRegenerate > 0) {
            this.progressData.currentHearts = Math.min(
                this.config.hearts.maxHearts,
                this.progressData.currentHearts + heartsToRegenerate
            );

            if (this.progressData.currentHearts >= this.config.hearts.maxHearts) {
                this.progressData.lastHeartLoss = null;
            } else {
                this.progressData.lastHeartLoss += heartsToRegenerate * heartRegenTime;
            }

            this.updateHeartsDisplay();
        }
    }

    /**
     * Met à jour l'affichage de tous les éléments
     */
    updateAllDisplays() {
        this.updateStreakDisplay();
        this.updateHeartsDisplay();
        this.updateXPDisplay();
        this.updateStatsDisplay();
    }

    /**
     * Met à jour l'affichage du streak
     */
    updateStreakDisplay() {
        const streakCount = document.querySelector('.streak-count');
        if (streakCount) {
            streakCount.textContent = this.progressData.currentStreak;
        }
    }

    /**
     * Met à jour l'affichage des cœurs
     */
    updateHeartsDisplay() {
        const heartsContainer = document.getElementById('hearts-display');
        if (!heartsContainer) return;

        heartsContainer.innerHTML = '';
        
        for (let i = 0; i < this.config.hearts.maxHearts; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.textContent = '❤️';
            
            if (i < this.progressData.currentHearts) {
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
        const xpCount = document.getElementById('xp-count');
        if (xpCount) {
            xpCount.textContent = this.progressData.totalXP;
        }

        const xpFill = document.getElementById('xp-fill');
        if (xpFill) {
            const percentage = (this.progressData.totalXP % 1000) / 10;
            xpFill.style.width = percentage + '%';
        }
    }

    /**
     * Met à jour l'affichage des statistiques
     */
    updateStatsDisplay() {
        const elements = {
            'total-xp': this.progressData.totalXP,
            'lessons-completed': Object.keys(this.progressData.completedLessons).length,
            'accuracy-rate': this.progressData.averageAccuracy + '%',
            'study-days': this.calculateStudyDays()
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }

    /**
     * Calcule le nombre de jours d'étude
     */
    calculateStudyDays() {
        const uniqueDates = new Set();
        Object.values(this.progressData.completedLessons).forEach(lesson => {
            if (lesson.completedAt) {
                uniqueDates.add(new Date(lesson.completedAt).toDateString());
            }
        });
        return uniqueDates.size;
    }

    /**
     * Met à jour la disponibilité des leçons
     */
    updateLessonsAvailability() {
        document.querySelectorAll('.lesson-bubble').forEach(bubble => {
            const lessonId = bubble.dataset.lesson;
            if (lessonId && window.isLessonUnlocked) {
                const isUnlocked = window.isLessonUnlocked(lessonId, this.progressData.completedLessons);
                const isCompleted = this.progressData.completedLessons[lessonId]?.completed;

                bubble.classList.toggle('locked', !isUnlocked);
                bubble.classList.toggle('completed', isCompleted);
            }
        });
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
     * Affiche la modal de fin de leçon
     */
    showLessonCompleteModal(xpGained, accuracy, sessionTime) {
        // Mettre à jour contenu modal
        const xpGainedElement = document.getElementById('xp-gained');
        const lessonAccuracyElement = document.getElementById('lesson-accuracy');
        const lessonTimeElement = document.getElementById('lesson-time');

        if (xpGainedElement) xpGainedElement.textContent = xpGained;
        if (lessonAccuracyElement) lessonAccuracyElement.textContent = accuracy + '%';
        if (lessonTimeElement) {
            const minutes = Math.floor(sessionTime / 60000);
            const seconds = Math.floor((sessionTime % 60000) / 1000);
            lessonTimeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        // Afficher bonus streak si applicable
        const streakBonus = document.getElementById('streak-bonus');
        if (streakBonus) {
            if (this.progressData.currentStreak > 0) {
                streakBonus.classList.remove('hidden');
            } else {
                streakBonus.classList.add('hidden');
            }
        }

        this.showModal('lesson-complete-modal');
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

        // Mettre à jour affichages
        this.updateAllDisplays();
    }

    /**
     * Gère le changement de niveau
     */
    handleLevelChange(level) {
        this.progressData.level = level;
        this.saveProgressData();

        // Mettre à jour affichage sélecteur
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.level === level);
        });
    }

    /**
     * Met à jour le sélecteur de niveau
     */
    updateLevelSelector() {
        const activeBtn = document.querySelector(`.level-btn[data-level="${this.progressData.level}"]`);
        if (activeBtn) {
            document.querySelectorAll('.level-btn').forEach(btn => btn.classList.remove('active'));
            activeBtn.classList.add('active');
        }
    }

    /**
     * Démarre le mode entraînement
     */
    startPracticeMode() {
        // Mode entraînement sans perte de cœurs
        const originalHeartsEnabled = this.config.hearts.enabled;
        this.config.hearts.enabled = false;

        this.closeModal('hearts-lost-modal');

        // Redémarrer dernière leçon
        if (this.currentLesson) {
            this.startLesson(this.currentLesson.id);
        }

        // Restaurer configuration après la leçon
        // (implémentation plus complexe nécessaire pour restaurer proprement)
    }

    /**
     * Démarre la sauvegarde automatique
     */
    startAutoSave() {
        if (this.config.storage.autoSave) {
            setInterval(() => {
                this.saveProgressData();
            }, 30000); // Toutes les 30 secondes
        }
    }

    /**
     * Affiche une erreur à l'utilisateur
     */
    showError(message) {
        console.error('Erreur app:', message);
        
        // Créer notification d'erreur simple
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; 
            background: #e74c3c; color: white; 
            padding: 1rem; border-radius: 8px; 
            z-index: 10000; max-width: 300px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    /**
     * Configure l'application
     */
    configure(newConfig) {
        this.config = { ...this.config, ...newConfig };
        console.log('📝 Configuration mise à jour:', this.config);
    }

    /**
     * Obtient les données de progression pour export
     */
    getProgressData() {
        return { ...this.progressData };
    }

    /**
     * Exporte les données pour analytics
     */
    exportProgressForAnalytics() {
        return {
            section: 'francais',
            timestamp: new Date().toISOString(),
            metrics: this.progressData,
            config: this.config,
            performance: {
                sessionsTotal: this.progressData.totalSessions,
                tempsTotal: this.progressData.studyTime,
                efficacite: this.progressData.averageAccuracy
            }
        };
    }

    /**
     * Remet à zéro toute la progression
     */
    resetAllProgress() {
        localStorage.removeItem(this.storageKeys.progress);
        this.progressData = this.loadProgressData();
        this.updateAllDisplays();
        this.updateLessonsAvailability();
        console.log('🔄 Progression réinitialisée');
    }
}

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FrenchDuolingoApp;
} else {
    window.FrenchDuolingoApp = FrenchDuolingoApp;
    console.log('✅ FrenchDuolingoApp chargée dans window');
}