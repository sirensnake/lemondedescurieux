/**
 * Module de quiz avancé pour Le Monde des Curieux
 */
class AdvancedQuizManager {
    constructor(containerId, quizData) {
        this.container = document.getElementById(containerId);
        this.quizData = quizData;
        this.currentQuestion = 0;
        this.score = 0;
        this.answered = false;
        
        // Initialiser le quiz
        this.init();
    }
    
    init() {
        // Créer la structure du quiz
        this.container.innerHTML = `
            <div class="quiz-container">
                <div id="question-container"></div>
                <div id="feedback" class="feedback hidden"></div>
                <div id="quiz-controls">
                    <button id="check-button" class="quiz-button">Vérifier</button>
                    <button id="next-button" class="quiz-button hidden">Question suivante</button>
                </div>
                <div id="progress-bar-container">
                    <div id="progress-bar"></div>
                </div>
                <div id="score-display">Score: 0/${this.quizData.length}</div>
            </div>
        `;
        
        // Récupérer les éléments du DOM
        this.questionContainer = document.getElementById('question-container');
        this.feedbackContainer = document.getElementById('feedback');
        this.checkButton = document.getElementById('check-button');
        this.nextButton = document.getElementById('next-button');
        this.progressBar = document.getElementById('progress-bar');
        this.scoreDisplay = document.getElementById('score-display');
        
        // Ajouter les événements
        this.checkButton.addEventListener('click', () => this.checkAnswer());
        this.nextButton.addEventListener('click', () => this.nextQuestion());
        
        // Afficher la première question
        this.showQuestion();
    }
    
    showQuestion() {
        // Récupérer la question actuelle
        const question = this.quizData[this.currentQuestion];
        
        // Réinitialiser l'état
        this.answered = false;
        this.feedbackContainer.classList.add('hidden');
        this.checkButton.classList.remove('hidden');
        this.nextButton.classList.add('hidden');
        
        // Déterminer le type de question et afficher le contenu approprié
        let questionHtml = '';
        
        switch (question.type) {
            case 'multiple-choice':
                questionHtml = this.createMultipleChoiceQuestion(question);
                break;
            case 'true-false':
                questionHtml = this.createTrueFalseQuestion(question);
                break;
            case 'fill-blank':
                questionHtml = this.createFillBlankQuestion(question);
                break;
            case 'matching':
                questionHtml = this.createMatchingQuestion(question);
                break;
            case 'drag-drop':
                questionHtml = this.createDragDropQuestion(question);
                break;
            default:
                // Par défaut, utiliser choix multiple
                questionHtml = this.createMultipleChoiceQuestion(question);
        }
        
        // Mettre à jour le conteneur de la question
        this.questionContainer.innerHTML = questionHtml;
        
        // Ajouter les événements spécifiques au type de question
        this.addQuestionTypeEvents(question.type);
        
        // Mettre à jour la barre de progression
        this.updateProgressBar();
    }
    
    createMultipleChoiceQuestion(question) {
        let html = `
            <h3 class="question-text">${question.question}</h3>
            <div class="options-container">
        `;
        
        // Ajouter les options
        question.options.forEach((option, index) => {
            html += `
                <div class="quiz-option" data-index="${index}">
                    <label class="option-label">
                        <span class="option-number">${index + 1}</span>
                        <span class="option-text">${option}</span>
                    </label>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }
    
    createTrueFalseQuestion(question) {
        return `
            <h3 class="question-text">${question.question}</h3>
            <div class="options-container">
                <div class="quiz-option" data-index="0">
                    <label class="option-label">
                        <span class="option-number">V</span>
                        <span class="option-text">Vrai</span>
                    </label>
                </div>
                <div class="quiz-option" data-index="1">
                    <label class="option-label">
                        <span class="option-number">F</span>
                        <span class="option-text">Faux</span>
                    </label>
                </div>
            </div>
        `;
    }
    
    createFillBlankQuestion(question) {
        let html = `
            <h3 class="question-text">${question.question}</h3>
            <div class="fill-blank-container">
        `;
        
        // Remplacer les blancs par des champs de saisie
        const text = question.text;
        const parts = text.split('____');
        
        for (let i = 0; i < parts.length; i++) {
            html += parts[i];
            
            if (i < parts.length - 1) {
                html += `<input type="text" class="fill-blank-input" data-index="${i}">`;
            }
        }
        
        html += '</div>';
        return html;
    }
    
    createMatchingQuestion(question) {
        let html = `
            <h3 class="question-text">${question.question}</h3>
            <div class="matching-container">
                <div class="matching-left">
        `;
        
        // Colonne de gauche
        question.leftItems.forEach((item, index) => {
            html += `
                <div class="matching-item" data-index="${index}">
                    ${item}
                    <select class="matching-select" data-index="${index}">
                        <option value="">-- Choisir --</option>
            `;
            
            // Ajouter les options
            question.rightItems.forEach((rightItem, rightIndex) => {
                html += `<option value="${rightIndex}">${rightItem}</option>`;
            });
            
            html += `
                    </select>
                </div>
            `;
        });
        
        html += '</div></div>';
        return html;
    }
    
    createDragDropQuestion(question) {
        let html = `
            <h3 class="question-text">${question.question}</h3>
            <div class="drag-drop-container">
                <div class="drag-items">
        `;
        
        // Éléments à glisser
        question.items.forEach((item, index) => {
            html += `
                <div class="drag-item" draggable="true" data-index="${index}">${item}</div>
            `;
        });
        
        html += '</div><div class="drop-zones">';
        
        // Zones de dépôt
        question.zones.forEach((zone, index) => {
            html += `
                <div class="drop-zone" data-index="${index}">
                    <div class="zone-label">${zone}</div>
                    <div class="zone-content"></div>
                </div>
            `;
        });
        
        html += '</div></div>';
        return html;
    }
    
    addQuestionTypeEvents(type) {
        const question = this.quizData[this.currentQuestion];
        
        switch (type) {
            case 'multiple-choice':
            case 'true-false':
                // Ajouter l'événement de sélection
                const options = this.questionContainer.querySelectorAll('.quiz-option');
                options.forEach(option => {
                    option.addEventListener('click', () => {
                        // Désélectionner toutes les options
                        options.forEach(opt => opt.classList.remove('selected'));
                        // Sélectionner l'option cliquée
                        option.classList.add('selected');
                    });
                });
                break;
                
            case 'drag-drop':
                // Ajouter les événements de glisser-déposer
                const dragItems = this.questionContainer.querySelectorAll('.drag-item');
                const dropZones = this.questionContainer.querySelectorAll('.drop-zone');
                
                dragItems.forEach(item => {
                    item.addEventListener('dragstart', e => {
                        e.dataTransfer.setData('text/plain', item.dataset.index);
                        setTimeout(() => item.classList.add('dragging'), 0);
                    });
                    
                    item.addEventListener('dragend', () => {
                        item.classList.remove('dragging');
                    });
                });
                
                dropZones.forEach(zone => {
                    zone.addEventListener('dragover', e => {
                        e.preventDefault();
                        zone.classList.add('dragover');
                    });
                    
                    zone.addEventListener('dragleave', () => {
                        zone.classList.remove('dragover');
                    });
                    
                    zone.addEventListener('drop', e => {
                        e.preventDefault();
                        zone.classList.remove('dragover');
                        
                        const itemIndex = e.dataTransfer.getData('text/plain');
                        const item = document.querySelector(`.drag-item[data-index="${itemIndex}"]`);
                        
                        if (item) {
                            const zoneContent = zone.querySelector('.zone-content');
                            zoneContent.appendChild(item);
                            item.classList.remove('dragging');
                        }
                    });
                });
                break;
        }
    }
    
    checkAnswer() {
        if (this.answered) return;
        
        const question = this.quizData[this.currentQuestion];
        let isCorrect = false;
        
        switch (question.type) {
            case 'multiple-choice':
            case 'true-false':
                // Vérifier la réponse sélectionnée
                const selectedOption = this.questionContainer.querySelector('.quiz-option.selected');
                
                if (selectedOption) {
                    const selectedIndex = parseInt(selectedOption.dataset.index);
                    isCorrect = selectedIndex === question.correctAnswer;
                    
                    // Marquer la réponse correcte/incorrecte
                    selectedOption.classList.add(isCorrect ? 'correct' : 'incorrect');
                    
                    // Marquer la réponse correcte si l'utilisateur s'est trompé
                    if (!isCorrect) {
                        const correctOption = this.questionContainer.querySelector(`.quiz-option[data-index="${question.correctAnswer}"]`);
                        correctOption.classList.add('correct');
                    }
                } else {
                    // Aucune réponse sélectionnée
                    this.showFeedback('Veuillez sélectionner une réponse', 'warning');
                    return;
                }
                break;
                
            case 'fill-blank':
                // Vérifier les réponses dans les champs de saisie
                const inputs = this.questionContainer.querySelectorAll('.fill-blank-input');
                let allCorrect = true;
                
                inputs.forEach((input, index) => {
                    const userAnswer = input.value.trim().toLowerCase();
                    const correctAnswer = question.answers[index].toLowerCase();
                    
                    if (userAnswer === correctAnswer) {
                        input.classList.add('correct');
                    } else {
                        input.classList.add('incorrect');
                        allCorrect = false;
                    }
                });
                
                isCorrect = allCorrect;
                break;
                
            case 'matching':
                // Vérifier les correspondances
                const selects = this.questionContainer.querySelectorAll('.matching-select');
                let allMatched = true;
                
                selects.forEach((select, index) => {
                    const selectedValue = parseInt(select.value);
                    const correctValue = question.matches[index];
                    
                    if (selectedValue === correctValue) {
                        select.classList.add('correct');
                    } else {
                        select.classList.add('incorrect');
                        allMatched = false;
                    }
                });
                
                isCorrect = allMatched;
                break;
                
            case 'drag-drop':
                // Vérifier les éléments déposés
                const dropZones = this.questionContainer.querySelectorAll('.drop-zone');
                let allDropped = true;
                
                dropZones.forEach((zone, zoneIndex) => {
                    const item = zone.querySelector('.drag-item');
                    
                    if (item) {
                        const itemIndex = parseInt(item.dataset.index);
                        const correctItemIndex = question.correctPositions[zoneIndex];
                        
                        if (itemIndex === correctItemIndex) {
                            zone.classList.add('correct');
                        } else {
                            zone.classList.add('incorrect');
                            allDropped = false;
                        }
                    } else {
                        allDropped = false;
                    }
                });
                
                isCorrect = allDropped;
                break;
        }
        
        // Mettre à jour le score et afficher le feedback
        if (isCorrect) {
            this.score++;
            this.showFeedback(`Bravo ! ${question.explanation || ''}`, 'correct');
        } else {
            this.showFeedback(`Pas tout à fait. ${question.explanation || ''}`, 'incorrect');
        }
        
        // Mettre à jour l'affichage du score
        this.scoreDisplay.textContent = `Score: ${this.score}/${this.quizData.length}`;
        
        // Désactiver les options
        this.disableOptions();
        
        // Marquer la question comme répondue
        this.answered = true;
        
        // Masquer le bouton de vérification et afficher le bouton suivant
        this.checkButton.classList.add('hidden');
        this.nextButton.classList.remove('hidden');
        
        // Enregistrer la progression si nécessaire
        if (question.section && question.activity) {
            if (typeof markProgress === 'function') {
                markProgress(question.section, question.activity);
            }
        }
    }
    
    disableOptions() {
        // Désactiver les interactions selon le type de question
        const question = this.quizData[this.currentQuestion];
        
        switch (question.type) {
            case 'multiple-choice':
            case 'true-false':
                const options = this.questionContainer.querySelectorAll('.quiz-option');
                options.forEach(option => {
                    option.classList.add('disabled');
                });
                break;
                
            case 'fill-blank':
                const inputs = this.questionContainer.querySelectorAll('.fill-blank-input');
                inputs.forEach(input => {
                    input.disabled = true;
                });
                break;
                
            case 'matching':
                const selects = this.questionContainer.querySelectorAll('.matching-select');
                selects.forEach(select => {
                    select.disabled = true;
                });
                break;
                
            case 'drag-drop':
                const dragItems = this.questionContainer.querySelectorAll('.drag-item');
                dragItems.forEach(item => {
                    item.setAttribute('draggable', 'false');
                    item.classList.add('disabled');
                });
                break;
        }
    }
    
    nextQuestion() {
        this.currentQuestion++;
        
        if (this.currentQuestion < this.quizData.length) {
            // Afficher la question suivante
            this.showQuestion();
        } else {
            // Quiz terminé
            this.showResults();
        }
    }
    
    showResults() {
        // Calculer le pourcentage
        const percentage = Math.round((this.score / this.quizData.length) * 100);
        
        // Déterminer le message
        let message = '';
        
        if (percentage >= 90) {
            message = 'Excellent ! Tu es un vrai champion !';
        } else if (percentage >= 70) {
            message = 'Très bien ! Continue comme ça !';
        } else if (percentage >= 50) {
            message = 'Pas mal ! Tu peux encore t\'améliorer.';
        } else {
            message = 'Continue à apprendre et réessaie plus tard.';
        }
        
        // Afficher les résultats
        this.container.innerHTML = `
            <div class="quiz-results">
                <h2>Quiz terminé !</h2>
                <div class="score-circle">
                    <div class="score-number">${percentage}%</div>
                </div>
                <p class="score-text">Tu as obtenu ${this.score} sur ${this.quizData.length} points</p>
                <p class="score-message">${message}</p>
                <button id="retry-button" class="quiz-button">Réessayer</button>
                <button id="back-button" class="quiz-button">Retour</button>
            </div>
        `;
        
        // Ajouter les événements
        document.getElementById('retry-button').addEventListener('click', () => {
            this.currentQuestion = 0;
            this.score = 0;
            this.init();
        });
        
        document.getElementById('back-button').addEventListener('click', () => {
            // Revenir à la page précédente ou à la page d'accueil
            if (document.referrer) {
                window.location.href = document.referrer;
            } else {
                window.location.href = 'index.html';
            }
        });
    }
    
    showFeedback(message, type) {
        this.feedbackContainer.innerHTML = message;
        this.feedbackContainer.className = `feedback ${type}`;
        this.feedbackContainer.classList.remove('hidden');
    }
    
    updateProgressBar() {
        const progress = ((this.currentQuestion + 1) / this.quizData.length) * 100;
        this.progressBar.style.width = `${progress}%`;
    }
}