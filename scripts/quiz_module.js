/**
 * Gestionnaire de quiz pour Le Monde des Curieux
 * Module optimisé pour l'accessibilité, la performance et la compatibilité
 */
class QuizManager {
    /**
     * Initialise un nouveau quiz
     * @param {string} containerId - ID du conteneur HTML
     * @param {Array} quizData - Tableau de questions et réponses
     * @param {Object} options - Options de configuration
     */
    constructor(containerId, quizData, options = {}) {
        // Validation des paramètres
        if (!containerId || !document.getElementById(containerId)) {
            console.error(`Conteneur '${containerId}' introuvable`);
            return;
        }
        
        if (!Array.isArray(quizData) || quizData.length === 0) {
            console.error('Données de quiz invalides');
            return;
        }
        
        // Propriétés
        this.container = document.getElementById(containerId);
        this.quizId = `quiz-${containerId}-${Math.floor(Math.random() * 10000)}`;
        this.quizData = this.validateQuizData(quizData);
        this.currentQuestion = 0;
        this.score = 0;
        this.selectedOption = null;
        this.isTransitioning = false;
        
        // Options avec valeurs par défaut
        this.options = {
            shuffleQuestions: options.shuffleQuestions || false,
            shuffleOptions: options.shuffleOptions || false,
            showProgress: options.showProgress !== false,
            showScore: options.showScore !== false,
            autoFocus: options.autoFocus !== false,
            transitionTime: options.transitionTime || 200,
            textValidate: options.textValidate || 'Valider',
            textNext: options.textNext || 'Question suivante',
            textRestart: options.textRestart || 'Recommencer',
            textNoAnswer: options.textNoAnswer || 'Choisis une réponse avant de valider.',
            saveProgress: options.saveProgress !== false,
            animationsEnabled: options.animationsEnabled !== false
        };
        
        // Vérifier si le système de progression est disponible
        this.progressSystemAvailable = 
            typeof window.ProgressionSystem !== 'undefined' || 
            typeof markProgress === 'function';
        
        if (this.options.saveProgress && !this.progressSystemAvailable) {
            console.warn('Système de progression non disponible. Les progrès ne seront pas enregistrés.');
        }
        
        // Mélanger les questions si demandé
        if (this.options.shuffleQuestions) {
            this.quizData = this.shuffleArray([...this.quizData]);
        }
        
        // Créer la structure du quiz
        this.createQuizStructure();
        
        // Initialiser le quiz
        this.initQuiz();
    }
    
    /**
     * Valide et nettoie les données du quiz
     * @param {Array} data - Données brutes du quiz
     * @return {Array} - Données validées
     */
    validateQuizData(data) {
        return data.map((q, index) => {
            // S'assurer que les propriétés requises existent
            if (!q.question) q.question = `Question ${index + 1}`;
            if (!Array.isArray(q.options) || q.options.length < 2) {
                q.options = ['Option A', 'Option B'];
            }
            if (typeof q.correctAnswer !== 'number' || 
                q.correctAnswer < 0 || 
                q.correctAnswer >= q.options.length) {
                q.correctAnswer = 0;
            }
            
            return q;
        });
    }
    
    /**
     * Crée la structure HTML du quiz
     */
    createQuizStructure() {
        // Créer le conteneur principal avec une classe unique
        this.container.innerHTML = `
            <div class="quiz-container" id="${this.quizId}">
                <div class="quiz-content">
                    <div id="${this.quizId}-question-container" class="question-container">
                        <h3 id="${this.quizId}-question-text" class="question-text" tabindex="0">Question 1</h3>
                        <div id="${this.quizId}-options-container" class="options-container">
                            <!-- Les options seront générées par JavaScript -->
                        </div>
                    </div>
                    <div id="${this.quizId}-result-feedback" class="feedback hidden" aria-live="polite" tabindex="0"></div>
                    <div id="${this.quizId}-quiz-controls" class="quiz-controls">
                        <button id="${this.quizId}-submit-answer" class="quiz-button" aria-label="${this.options.textValidate}">${this.options.textValidate}</button>
                        <button id="${this.quizId}-next-question" class="quiz-button hidden" aria-label="${this.options.textNext}">${this.options.textNext}</button>
                        <button id="${this.quizId}-restart-quiz" class="quiz-button hidden" aria-label="${this.options.textRestart}">${this.options.textRestart}</button>
                    </div>
                    ${this.options.showProgress ? `
                        <div id="${this.quizId}-progress-container" class="progress-container">
                            <div id="${this.quizId}-progress-bar-container" class="progress-bar-container" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                                <div id="${this.quizId}-progress-bar" class="progress-bar"></div>
                            </div>
                            <div id="${this.quizId}-progress-text" class="progress-text">Question 1/${this.quizData.length}</div>
                        </div>
                    ` : ''}
                    ${this.options.showScore ? `
                        <div id="${this.quizId}-score-display" class="score-display">
                            Score: <span id="${this.quizId}-current-score">0</span>/<span id="${this.quizId}-total-questions">${this.quizData.length}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // Stocker les références aux éléments DOM
        this.questionText = document.getElementById(`${this.quizId}-question-text`);
        this.optionsContainer = document.getElementById(`${this.quizId}-options-container`);
        this.resultFeedback = document.getElementById(`${this.quizId}-result-feedback`);
        this.submitButton = document.getElementById(`${this.quizId}-submit-answer`);
        this.nextButton = document.getElementById(`${this.quizId}-next-question`);
        this.restartButton = document.getElementById(`${this.quizId}-restart-quiz`);
        
        if (this.options.showProgress) {
            this.progressBar = document.getElementById(`${this.quizId}-progress-bar`);
            this.progressText = document.getElementById(`${this.quizId}-progress-text`);
            this.progressBarContainer = document.getElementById(`${this.quizId}-progress-bar-container`);
        }
        
        if (this.options.showScore) {
            this.currentScoreDisplay = document.getElementById(`${this.quizId}-current-score`);
            this.totalQuestionsDisplay = document.getElementById(`${this.quizId}-total-questions`);
        }
    }
    
    /**
     * Initialise le quiz avec les écouteurs d'événements
     */
    initQuiz() {
        // Initialiser le score et le nombre total de questions
        if (this.options.showScore) {
            this.totalQuestionsDisplay.textContent = this.quizData.length;
            this.currentScoreDisplay.textContent = this.score;
        }
        
        // Ajouter les écouteurs d'événements aux boutons
        this.submitButton.addEventListener('click', () => this.checkAnswer());
        this.nextButton.addEventListener('click', () => this.loadNextQuestion());
        this.restartButton.addEventListener('click', () => this.restartQuiz());
        
        // Ajouter les raccourcis clavier
        document.addEventListener('keydown', e => this.handleKeyboardNavigation(e));
        
        // Charger la première question
        this.loadQuestion();
    }
    
    /**
     * Gère la navigation au clavier
     * @param {KeyboardEvent} event - L'événement clavier
     */
    handleKeyboardNavigation(event) {
        // Ne pas interférer avec la saisie dans les champs de texte
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Si le quiz n'est pas dans le focus actif de la page, ignorer
        if (!this.container.contains(document.activeElement)) {
            return;
        }
        
        switch (event.key) {
            case 'Enter':
                // Sur Entrée, simuler un clic sur le bouton visible
                if (!this.submitButton.classList.contains('hidden')) {
                    event.preventDefault();
                    this.submitButton.click();
                } else if (!this.nextButton.classList.contains('hidden')) {
                    event.preventDefault();
                    this.nextButton.click();
                } else if (!this.restartButton.classList.contains('hidden')) {
                    event.preventDefault();
                    this.restartButton.click();
                }
                break;
                
            case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
                // Sélectionner une option par son numéro
                const optionNumber = parseInt(event.key) - 1;
                const options = this.optionsContainer.querySelectorAll('.quiz-option');
                
                if (optionNumber >= 0 && optionNumber < options.length) {
                    event.preventDefault();
                    options[optionNumber].click();
                }
                break;
        }
    }
    
    /**
     * Charge la question actuelle
     */
    loadQuestion() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
        // Animation de transition si activée
        if (this.options.animationsEnabled) {
            this.questionText.style.opacity = "0";
            this.optionsContainer.style.opacity = "0";
        }
        
        // Délai court pour créer un effet de transition
        setTimeout(() => {
            const question = this.quizData[this.currentQuestion];
            this.questionText.textContent = `Question ${this.currentQuestion + 1}: ${question.question}`;
            this.questionText.setAttribute('aria-label', `Question ${this.currentQuestion + 1} sur ${this.quizData.length}: ${question.question}`);
            
            // Vider les options précédentes
            this.optionsContainer.innerHTML = '';
            
            // Copier les options pour ne pas modifier l'original
            let options = [...question.options];
            
            // Mélanger les options si demandé
            if (this.options.shuffleOptions) {
                const correctOption = options[question.correctAnswer];
                options = this.shuffleArray(options);
                // Mettre à jour l'index de la bonne réponse
                question.currentCorrectAnswer = options.indexOf(correctOption);
            } else {
                question.currentCorrectAnswer = question.correctAnswer;
            }
            
            // Créer les nouvelles options
            options.forEach((option, index) => {
                const optionId = `${this.quizId}-option-${index}`;
                
                const optionElement = document.createElement('div');
                optionElement.className = 'quiz-option';
                optionElement.setAttribute('role', 'radio');
                optionElement.setAttribute('aria-checked', 'false');
                optionElement.setAttribute('tabindex', '0');
                optionElement.setAttribute('aria-label', `Option ${index + 1}: ${option}`);
                
                optionElement.innerHTML = `
                    <input type="radio" id="${optionId}" name="${this.quizId}-option" value="${index}" class="sr-only">
                    <label for="${optionId}" class="option-label">
                        <span class="option-number">${index + 1}</span>
                        <span class="option-text">${option}</span>
                    </label>
                `;
                
                this.optionsContainer.appendChild(optionElement);
                
                // Ajouter un gestionnaire d'événements
                optionElement.addEventListener('click', () => {
                    this.selectOption(index, optionElement);
                });
                
                // Support des événements clavier pour l'accessibilité
                optionElement.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.selectOption(index, optionElement);
                    }
                });
            });
            
            // Mettre à jour la barre de progression
            if (this.options.showProgress) {
                const progressPercentage = ((this.currentQuestion) / this.quizData.length) * 100;
                this.progressBar.style.width = `${progressPercentage}%`;
                this.progressText.textContent = `Question ${this.currentQuestion + 1}/${this.quizData.length}`;
                this.progressBarContainer.setAttribute('aria-valuenow', progressPercentage);
            }
            
            // Réinitialiser l'affichage
            this.resultFeedback.classList.add('hidden');
            this.nextButton.classList.add('hidden');
            this.restartButton.classList.add('hidden');
            this.submitButton.classList.remove('hidden');
            this.selectedOption = null;
            
            // Animation de retour si activée
            if (this.options.animationsEnabled) {
                this.questionText.style.opacity = "1";
                this.optionsContainer.style.opacity = "1";
            }
            
            // Auto-focus sur la première option pour l'accessibilité
            if (this.options.autoFocus) {
                setTimeout(() => {
                    const firstOption = this.optionsContainer.querySelector('.quiz-option');
                    if (firstOption) firstOption.focus();
                }, 50);
            }
            
            this.isTransitioning = false;
        }, this.options.animationsEnabled ? this.options.transitionTime : 0);
    }
    
    /**
     * Sélectionne une option de réponse
     * @param {number} index - Index de l'option
     * @param {HTMLElement} element - Élément de l'option
     */
    selectOption(index, element) {
        // Désélectionner l'option précédente si elle existe
        const previousSelection = this.optionsContainer.querySelector('.selected');
        if (previousSelection) {
            previousSelection.classList.remove('selected');
            previousSelection.setAttribute('aria-checked', 'false');
        }
        
        // Sélectionner la nouvelle option
        element.classList.add('selected');
        element.setAttribute('aria-checked', 'true');
        this.selectedOption = index;
    }
    
    /**
     * Vérifie la réponse sélectionnée
     */
    checkAnswer() {
        // Vérifier si une option est sélectionnée
        if (this.selectedOption === null) {
            alert(this.options.textNoAnswer);
            return;
        }
        
        // Désactiver le bouton de validation pendant le traitement
        this.submitButton.disabled = true;
        
        // Obtenir la question actuelle
        const currentQ = this.quizData[this.currentQuestion];
        const isCorrect = this.selectedOption === currentQ.currentCorrectAnswer;
        
        // Récupérer toutes les options
        const options = this.optionsContainer.querySelectorAll('.quiz-option');
        
        // Marquer la réponse correcte et incorrecte
        options.forEach((option, index) => {
            if (index === currentQ.currentCorrectAnswer) {
                option.classList.add('correct');
            } else if (index === this.selectedOption && !isCorrect) {
                option.classList.add('incorrect');
            }
            
            // Désactiver toutes les options
            option.classList.add('disabled');
            option.setAttribute('aria-disabled', 'true');
        });
        
        // Mettre à jour le score si la réponse est correcte
        if (isCorrect) {
            this.score++;
            if (this.options.showScore) {
                this.currentScoreDisplay.textContent = this.score;
            }
        }
        
        // Afficher le feedback
        this.resultFeedback.classList.remove('hidden');
        this.resultFeedback.textContent = isCorrect 
            ? `Bravo ! ${currentQ.explanation || ''}` 
            : `Dommage ! La bonne réponse était "${currentQ.options[currentQ.currentCorrectAnswer]}". ${currentQ.explanation || ''}`;
        
        // Changer les boutons
        this.submitButton.classList.add('hidden');
        
        if (this.currentQuestion < this.quizData.length - 1) {
            this.nextButton.classList.remove('hidden');
        } else {
            this.restartButton.classList.remove('hidden');
            
            // Enregistrer le progrès si le système est disponible
            if (this.options.saveProgress && this.progressSystemAvailable) {
                try {
                    const currentQ = this.quizData[this.currentQuestion];
                    if (currentQ.section && currentQ.activity) {
                        markProgress(currentQ.section, currentQ.activity);
                    }
                } catch (e) {
                    console.error('Erreur lors de l\'enregistrement du progrès:', e);
                }
            }
        }
    }
    
    /**
     * Charge la question suivante
     */
    loadNextQuestion() {
        this.currentQuestion++;
        this.submitButton.disabled = false;
        this.loadQuestion();
    }
    
    /**
     * Redémarre le quiz
     */
    restartQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.submitButton.disabled = false;
        if (this.options.showScore) {
            this.currentScoreDisplay.textContent = this.score;
        }
        this.loadQuestion();
    }
    
    /**
     * Mélange un tableau
     * @param {Array} array - Le tableau à mélanger
     * @return {Array} - Le tableau mélangé
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}