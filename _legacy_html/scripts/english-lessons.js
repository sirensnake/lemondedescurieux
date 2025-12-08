// Système de leçons Duolingo-style enrichi
class EnglishLessonSystem {
    constructor() {
        this.streakSystem = new EnglishStreakSystem();
        this.heartsSystem = new EnglishHeartsSystem();
        this.currentLesson = 0;
        this.currentQuestion = 0;
        this.score = 0;
        this.xp = 0;
        this.totalXP = this.loadTotalXP();
        
        this.lessons = this.loadLessons();
        this.initializeUI();
    }
    
    loadTotalXP() {
        const progress = JSON.parse(localStorage.getItem('userProgress')) || {};
        return progress.english?.totalXP || 0;
    }
    
    loadLessons() {
        // Leçons progressives adaptées niveau CM1/CM2
        return [
            {
                id: 1,
                title: "Les animaux",
                difficulty: 1,
                xpReward: 10,
                questions: [
                    {
                        type: "translation",
                        question: "Traduis : The cat",
                        options: ["Le chat", "Le chien", "L'oiseau", "Le poisson"],
                        correct: 0,
                        audio: "audio/cat.mp3"
                    },
                    {
                        type: "translation",
                        question: "Traduis : Le chien",
                        options: ["The cat", "The dog", "The bird", "The fish"],
                        correct: 1
                    },
                    {
                        type: "fill",
                        question: "Complète : The ___ is flying",
                        options: ["cat", "dog", "bird", "fish"],
                        correct: 2,
                        hint: "Quel animal vole ?"
                    },
                    {
                        type: "listening",
                        question: "Écoute et choisis l'animal",
                        audio: "audio/bird.mp3",
                        options: ["cat", "dog", "bird", "fish"],
                        correct: 2
                    },
                    {
                        type: "matching",
                        question: "Associe les paires",
                        pairs: [
                            {en: "cat", fr: "chat"},
                            {en: "dog", fr: "chien"},
                            {en: "bird", fr: "oiseau"},
                            {en: "fish", fr: "poisson"}
                        ]
                    }
                ]
            },
            {
                id: 2,
                title: "Les couleurs",
                difficulty: 1,
                xpReward: 15,
                questions: [
                    {
                        type: "translation",
                        question: "Traduis : Red",
                        options: ["Rouge", "Bleu", "Vert", "Jaune"],
                        correct: 0
                    },
                    {
                        type: "image",
                        question: "Quelle est cette couleur ?",
                        image: "images/blue.png",
                        options: ["Red", "Blue", "Green", "Yellow"],
                        correct: 1
                    },
                    {
                        type: "fill",
                        question: "The sky is ___",
                        options: ["red", "blue", "green", "yellow"],
                        correct: 1,
                        hint: "De quelle couleur est le ciel ?"
                    },
                    {
                        type: "translation",
                        question: "Traduis : Le soleil est jaune",
                        options: [
                            "The sun is yellow",
                            "The sun is red", 
                            "The moon is yellow",
                            "The star is yellow"
                        ],
                        correct: 0
                    },
                    {
                        type: "matching",
                        question: "Associe les couleurs",
                        pairs: [
                            {en: "red", fr: "rouge"},
                            {en: "blue", fr: "bleu"},
                            {en: "green", fr: "vert"},
                            {en: "yellow", fr: "jaune"},
                            {en: "black", fr: "noir"},
                            {en: "white", fr: "blanc"}
                        ]
                    }
                ]
            },
            {
                id: 3,
                title: "La famille",
                difficulty: 1,
                xpReward: 15,
                questions: [
                    {
                        type: "translation",
                        question: "Traduis : Mother",
                        options: ["Mère", "Père", "Sœur", "Frère"],
                        correct: 0
                    },
                    {
                        type: "translation",
                        question: "Traduis : Le frère",
                        options: ["The sister", "The brother", "The mother", "The father"],
                        correct: 1
                    },
                    {
                        type: "fill",
                        question: "My ___ is tall",
                        options: ["father", "table", "color", "number"],
                        correct: 0,
                        hint: "Qui dans ta famille est grand ?"
                    },
                    {
                        type: "sentence",
                        question: "Mets les mots dans l'ordre",
                        words: ["sister", "My", "is", "young"],
                        correct: ["My", "sister", "is", "young"]
                    },
                    {
                        type: "matching",
                        question: "Associe les membres de la famille",
                        pairs: [
                            {en: "mother", fr: "mère"},
                            {en: "father", fr: "père"},
                            {en: "sister", fr: "sœur"},
                            {en: "brother", fr: "frère"},
                            {en: "grandmother", fr: "grand-mère"},
                            {en: "grandfather", fr: "grand-père"}
                        ]
                    }
                ]
            },
            {
                id: 4,
                title: "Les nombres",
                difficulty: 2,
                xpReward: 20,
                questions: [
                    {
                        type: "translation",
                        question: "Traduis : Five",
                        options: ["Trois", "Quatre", "Cinq", "Six"],
                        correct: 2
                    },
                    {
                        type: "math",
                        question: "Two + Three = ?",
                        options: ["Four", "Five", "Six", "Seven"],
                        correct: 1
                    },
                    {
                        type: "fill",
                        question: "I have ___ apples",
                        options: ["ten", "cat", "blue", "big"],
                        correct: 0,
                        hint: "Combien de pommes ?"
                    },
                    {
                        type: "listening",
                        question: "Écoute et choisis le nombre",
                        audio: "audio/seven.mp3",
                        options: ["5", "6", "7", "8"],
                        correct: 2
                    },
                    {
                        type: "matching",
                        question: "Associe les nombres",
                        pairs: [
                            {en: "one", fr: "1"},
                            {en: "two", fr: "2"},
                            {en: "three", fr: "3"},
                            {en: "four", fr: "4"},
                            {en: "five", fr: "5"},
                            {en: "six", fr: "6"},
                            {en: "seven", fr: "7"},
                            {en: "eight", fr: "8"},
                            {en: "nine", fr: "9"},
                            {en: "ten", fr: "10"}
                        ]
                    }
                ]
            },
            {
                id: 5,
                title: "La nourriture",
                difficulty: 2,
                xpReward: 20,
                questions: [
                    {
                        type: "translation",
                        question: "Traduis : Apple",
                        options: ["Pomme", "Banane", "Orange", "Fraise"],
                        correct: 0
                    },
                    {
                        type: "fill",
                        question: "I like to eat ___",
                        options: ["pizza", "chair", "blue", "sleep"],
                        correct: 0,
                        hint: "Qu'est-ce qu'on mange ?"
                    },
                    {
                        type: "image",
                        question: "Qu'est-ce que c'est ?",
                        image: "images/banana.png",
                        options: ["Apple", "Banana", "Orange", "Strawberry"],
                        correct: 1
                    },
                    {
                        type: "sentence",
                        question: "Mets les mots dans l'ordre",
                        words: ["eat", "I", "bread", "like", "to"],
                        correct: ["I", "like", "to", "eat", "bread"]
                    },
                    {
                        type: "matching",
                        question: "Associe la nourriture",
                        pairs: [
                            {en: "apple", fr: "pomme"},
                            {en: "banana", fr: "banane"},
                            {en: "bread", fr: "pain"},
                            {en: "milk", fr: "lait"},
                            {en: "water", fr: "eau"},
                            {en: "cheese", fr: "fromage"}
                        ]
                    }
                ]
            }
        ];
    }
    
    initializeUI() {
        // Initialiser l'interface
        this.heartsSystem.initializeUI();
        this.streakSystem.initializeUI();
        this.updateXPBar();
    }
    
    startLesson(lessonIndex) {
        this.currentLesson = lessonIndex;
        this.currentQuestion = 0;
        this.score = 0;
        
        const lesson = this.lessons[lessonIndex];
        document.getElementById('question-area').innerHTML = `
            <h2>${lesson.title}</h2>
            <div class="progress-bar">
                <div class="progress" style="width: 0%"></div>
            </div>
        `;
        
        // Animer l'entrée
        setTimeout(() => this.showQuestion(), 500);
    }
    
    showQuestion() {
        const lesson = this.lessons[this.currentLesson];
        const question = lesson.questions[this.currentQuestion];
        
        // Mise à jour de la barre de progression
        const progress = (this.currentQuestion / lesson.questions.length) * 100;
        document.querySelector('.progress').style.width = `${progress}%`;
        
        // Nettoyer les zones
        document.getElementById('answer-options').innerHTML = '';
        document.getElementById('feedback-area').innerHTML = '';
        
        // Affichage selon le type de question
        switch(question.type) {
            case 'translation':
                this.showTranslationQuestion(question);
                break;
            case 'fill':
                this.showFillQuestion(question);
                break;
            case 'listening':
                this.showListeningQuestion(question);
                break;
            case 'matching':
                this.showMatchingQuestion(question);
                break;
            case 'image':
                this.showImageQuestion(question);
                break;
            case 'sentence':
                this.showSentenceQuestion(question);
                break;
            case 'math':
                this.showMathQuestion(question);
                break;
        }
    }
    
    showTranslationQuestion(question) {
        const questionArea = document.getElementById('question-area');
        const answerArea = document.getElementById('answer-options');
        const feedbackArea = document.getElementById('feedback-area');
        
        questionArea.innerHTML += `
            <div class="question-prompt">Traduction</div>
            <div class="question-text">${question.question}</div>
            ${question.audio ? `<button onclick="playAudio('${question.audio}')" class="audio-btn">🔊</button>` : ''}
        `;
        
        answerArea.innerHTML = question.options.map((option, index) => `
            <div class="answer-option" data-index="${index}">
                <span class="option-number">${index + 1}</span>
                <span class="option-text">${option}</span>
            </div>
        `).join('');
        
        feedbackArea.innerHTML = `
            <button class="btn btn-primary check-button" disabled onclick="englishLesson.checkAnswer()">
                VÉRIFIER
            </button>
        `;
        
        this.attachOptionListeners();
    }
    
    showFillQuestion(question) {
        const questionArea = document.getElementById('question-area');
        const answerArea = document.getElementById('answer-options');
        const feedbackArea = document.getElementById('feedback-area');
        
        questionArea.innerHTML += `
            <div class="question-prompt">Complète la phrase</div>
            <div class="question-text">${question.question}</div>
            ${question.hint ? `<div class="hint">💡 ${question.hint}</div>` : ''}
        `;
        
        answerArea.innerHTML = question.options.map((option, index) => `
            <div class="answer-option word-option" data-index="${index}">
                ${option}
            </div>
        `).join('');
        
        feedbackArea.innerHTML = `
            <button class="btn btn-primary check-button" disabled onclick="englishLesson.checkAnswer()">
                VÉRIFIER
            </button>
        `;
        
        this.attachOptionListeners();
    }
    
    showMatchingQuestion(question) {
        const questionArea = document.getElementById('question-area');
        const answerArea = document.getElementById('answer-options');
        const feedbackArea = document.getElementById('feedback-area');
        
        questionArea.innerHTML += `
            <div class="question-prompt">Associe les paires</div>
            <div class="question-text">${question.question}</div>
        `;
        
        // Mélanger les paires
        const shuffledPairs = [...question.pairs].sort(() => Math.random() - 0.5);
        const shuffledFrench = shuffledPairs.map(p => p.fr).sort(() => Math.random() - 0.5);
        
        answerArea.innerHTML = `
            <div class="matching-container">
                <div class="matching-column left">
                    ${shuffledPairs.map((pair, i) => `
                        <div class="matching-item" data-en="${pair.en}" data-index="${i}">
                            ${pair.en}
                        </div>
                    `).join('')}
                </div>
                <div class="matching-column right">
                    ${shuffledFrench.map((fr, i) => `
                        <div class="matching-item droppable" data-fr="${fr}" data-index="${i}">
                            ${fr}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        feedbackArea.innerHTML = `
            <button class="btn btn-primary check-button" onclick="englishLesson.checkMatchingAnswer()">
                VÉRIFIER
            </button>
        `;
        
        this.setupMatchingDragDrop();
    }
    
    showSentenceQuestion(question) {
        const questionArea = document.getElementById('question-area');
        const answerArea = document.getElementById('answer-options');
        const feedbackArea = document.getElementById('feedback-area');
        
        questionArea.innerHTML += `
            <div class="question-prompt">Mets les mots dans l'ordre</div>
            <div class="question-text">${question.question}</div>
        `;
        
        // Mélanger les mots
        const shuffledWords = [...question.words].sort(() => Math.random() - 0.5);
        
        answerArea.innerHTML = `
            <div class="sentence-builder">
                <div class="word-bank">
                    ${shuffledWords.map((word, i) => `
                        <div class="word-tile" data-word="${word}" data-index="${i}">
                            ${word}
                        </div>
                    `).join('')}
                </div>
                <div class="sentence-area" id="sentence-drop-area">
                    <!-- Les mots seront déposés ici -->
                </div>
            </div>
        `;
        
        feedbackArea.innerHTML = `
            <button class="btn btn-primary check-button" onclick="englishLesson.checkSentenceAnswer()">
                VÉRIFIER
            </button>
        `;
        
        this.setupSentenceDragDrop();
    }
    
    attachOptionListeners() {
        document.querySelectorAll('.answer-option').forEach(option => {
            option.addEventListener('click', (e) => {
                // Désélectionner les autres
                document.querySelectorAll('.answer-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Sélectionner celle-ci
                option.classList.add('selected');
                
                // Activer le bouton
                document.querySelector('.check-button').disabled = false;
            });
        });
    }
    
    checkAnswer() {
        const selected = document.querySelector('.answer-option.selected');
        if (!selected) return;
        
        const selectedIndex = parseInt(selected.dataset.index);
        const question = this.lessons[this.currentLesson].questions[this.currentQuestion];
        
        if (selectedIndex === question.correct) {
            // Bonne réponse
            selected.classList.add('correct');
            this.score++;
            this.xp += 5;
            
            // Feedback positif
            this.showFeedback('Excellent ! 🎉', 'success');
            
            // Son de succès
            this.playSound('success');
            
            // Continuer après 1.5s
            setTimeout(() => this.nextQuestion(), 1500);
            
        } else {
            // Mauvaise réponse
            selected.classList.add('incorrect');
            const canContinue = this.heartsSystem.loseHeart();
            
            // Montrer la bonne réponse
            document.querySelectorAll('.answer-option')[question.correct].classList.add('correct');
            
            // Feedback négatif
            this.showFeedback('Oups ! La bonne réponse était en vert.', 'error');
            
            // Son d'erreur
            this.playSound('error');
            
            // Vérifier si game over
            if (!canContinue) {
                setTimeout(() => this.gameOver(), 1500);
            } else {
                // Continuer après 2s
                setTimeout(() => this.nextQuestion(), 2000);
            }
        }
        
        // Désactiver les interactions
        document.querySelectorAll('.answer-option').forEach(opt => {
            opt.style.pointerEvents = 'none';
        });
        document.querySelector('.check-button').disabled = true;
    }
    
    nextQuestion() {
        this.currentQuestion++;
        const lesson = this.lessons[this.currentLesson];
        
        if (this.currentQuestion >= lesson.questions.length) {
            // Fin de la leçon
            this.endLesson();
        } else {
            // Question suivante
            this.showQuestion();
        }
    }
    
    endLesson() {
        const lesson = this.lessons[this.currentLesson];
        const percentage = Math.round((this.score / lesson.questions.length) * 100);
        
        // Enregistrer l'activité pour le streak
        this.streakSystem.recordActivity();
        
        // Calculer les XP bonus
        let bonusXP = 0;
        if (percentage === 100) bonusXP += 10; // Perfection
        if (this.heartsSystem.heartsData.currentHearts === 5) bonusXP += 5; // Aucune erreur
        
        const totalXP = lesson.xpReward + bonusXP + this.xp;
        this.totalXP += totalXP;
        
        // Afficher les résultats
        document.getElementById('question-area').innerHTML = `
            <div class="lesson-complete">
                <h2>Leçon terminée ! 🎉</h2>
                <div class="score-display">
                    <div class="score-item">
                        <span class="score-label">Score</span>
                        <span class="score-value">${this.score}/${lesson.questions.length}</span>
                    </div>
                    <div class="score-item">
                        <span class="score-label">XP gagnés</span>
                        <span class="score-value">+${totalXP}</span>
                    </div>
                    <div class="score-item">
                        <span class="score-label">Streak</span>
                        <span class="score-value">${this.streakSystem.streakData.currentStreak} 🔥</span>
                    </div>
                </div>
                ${percentage === 100 ? '<div class="perfect-score">Score parfait ! 🌟</div>' : ''}
            </div>
        `;
        
        document.getElementById('answer-options').innerHTML = '';
        document.getElementById('feedback-area').innerHTML = `
            <button class="btn btn-primary" onclick="window.location.reload()">
                Retour aux leçons
            </button>
        `;
        
        // Sauvegarder la progression
        this.saveProgress();
        this.updateXPBar();
    }
    
    showFeedback(message, type) {
        const feedbackArea = document.getElementById('feedback-area');
        const existingBtn = feedbackArea.querySelector('.check-button');
        
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = `feedback-message ${type}`;
        feedbackDiv.textContent = message;
        
        if (existingBtn) {
            feedbackArea.insertBefore(feedbackDiv, existingBtn);
        } else {
            feedbackArea.appendChild(feedbackDiv);
        }
    }
    
    playSound(type) {
        // Implémenter la lecture des sons
        // Pour l'instant, on simule
        console.log(`Playing ${type} sound`);
    }
    
    saveProgress() {
        const progress = JSON.parse(localStorage.getItem('userProgress')) || {};
        progress.english = progress.english || {};
        progress.english.lessonsCompleted = Math.max(progress.english.lessonsCompleted || 0, this.currentLesson + 1);
        progress.english.totalXP = this.totalXP;
        progress.english.lastActivity = new Date().toISOString();
        
        localStorage.setItem('userProgress', JSON.stringify(progress));
    }
    
    updateXPBar() {
        const xpText = document.querySelector('.xp-text');
        if (xpText) {
            xpText.textContent = `${this.totalXP} XP`;
        }
        
        // Calculer le niveau (100 XP par niveau)
        const level = Math.floor(this.totalXP / 100) + 1;
        const levelProgress = this.totalXP % 100;
        
        const xpFill = document.querySelector('.xp-fill');
        if (xpFill) {
            xpFill.style.width = `${levelProgress}%`;
        }
        
        const levelIndicator = document.querySelector('.level-indicator');
        if (levelIndicator) {
            levelIndicator.textContent = `Niveau ${level}`;
        }
    }
    
    gameOver() {
        document.getElementById('question-area').innerHTML = `
            <div class="game-over">
                <h2>Plus de cœurs ! 💔</h2>
                <p>Attends 30 minutes ou pratique d'autres matières.</p>
                <div class="timer-display">
                    <p>Prochain cœur dans :</p>
                    <div id="regen-timer-display"></div>
                </div>
            </div>
        `;
        
        document.getElementById('answer-options').innerHTML = '';
        document.getElementById('feedback-area').innerHTML = `
            <button class="btn btn-secondary" onclick="window.location.href='index.html'">
                Retour à l'accueil
            </button>
        `;
    }
    
    // Fonctions pour les types de questions spéciaux
    setupMatchingDragDrop() {
        // Implémentation simplifiée du matching
        console.log('Matching drag-drop setup');
    }
    
    setupSentenceDragDrop() {
        // Implémentation simplifiée du sentence builder
        console.log('Sentence drag-drop setup');
    }
    
    checkMatchingAnswer() {
        // Pour l'instant, on valide automatiquement
        this.score++;
        this.xp += 5;
        this.showFeedback('Bien joué ! 🎉', 'success');
        setTimeout(() => this.nextQuestion(), 1500);
    }
    
    checkSentenceAnswer() {
        // Pour l'instant, on valide automatiquement
        this.score++;
        this.xp += 5;
        this.showFeedback('Super ! 🎉', 'success');
        setTimeout(() => this.nextQuestion(), 1500);
    }
}

// Initialiser au chargement de la page
let englishLesson;
document.addEventListener('DOMContentLoaded', () => {
    if (typeof EnglishStreakSystem === 'undefined' || typeof EnglishHeartsSystem === 'undefined') {
        console.error('Les dépendances ne sont pas chargées');
        return;
    }
    
    englishLesson = new EnglishLessonSystem();
});

// Fonction helper pour jouer l'audio
function playAudio(src) {
    console.log(`Playing audio: ${src}`);
    // Implémenter la lecture audio réelle
}
