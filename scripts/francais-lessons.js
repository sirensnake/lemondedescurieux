// Système de leçons Duolingo-style
class EnglishLessonSystem {
    constructor() {
        this.streakSystem = new EnglishStreakSystem();
        this.heartsSystem = new EnglishHeartsSystem();
        this.currentLesson = 0;
        this.currentQuestion = 0;
        this.score = 0;
        this.xp = 0;
        
        this.lessons = this.loadLessons();
        this.initializeUI();
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
                        correct: 1,
                        audio: "audio/dog.mp3"
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
                    }
                    // Ajouter plus de questions...
                ]
            }
        ];
    }
    
    initializeUI() {
        // Initialiser l'interface
        this.updateHeartsDisplay();
        this.updateStreakDisplay();
        this.updateXPBar();
        
        // Commencer la première leçon
        this.startLesson(0);
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
        
        this.showQuestion();
    }
    
    showQuestion() {
        const lesson = this.lessons[this.currentLesson];
        const question = lesson.questions[this.currentQuestion];
        
        // Mise à jour de la barre de progression
        const progress = (this.currentQuestion / lesson.questions.length) * 100;
        document.querySelector('.progress').style.width = `${progress}%`;
        
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
        }
    }
    
    showTranslationQuestion(question) {
        const questionArea = document.getElementById('question-area');
        const answerArea = document.getElementById('answer-options');
        const feedbackArea = document.getElementById('feedback-area');
        
        questionArea.innerHTML = `
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
            <button class="check-button" disabled onclick="englishLesson.checkAnswer()">
                VÉRIFIER
            </button>
        `;
        
        // Gestion des clics
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
            this.heartsSystem.loseHeart();
            
            // Montrer la bonne réponse
            document.querySelectorAll('.answer-option')[question.correct].classList.add('correct');
            
            // Feedback négatif
            this.showFeedback('Oups ! La bonne réponse était en vert.', 'error');
            
            // Son d'erreur
            this.playSound('error');
            
            // Vérifier si game over
            if (this.heartsSystem.heartsData.currentHearts === 0) {
                this.gameOver();
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
                <button class="next-lesson-btn" onclick="englishLesson.startLesson(${this.currentLesson + 1})">
                    Leçon suivante
                </button>
                <button class="retry-btn" onclick="englishLesson.startLesson(${this.currentLesson})">
                    Recommencer
                </button>
            </div>
        `;
        
        // Sauvegarder la progression
        this.saveProgress();
    }
    
    showFeedback(message, type) {
        const feedbackArea = document.getElementById('feedback-area');
        feedbackArea.innerHTML = `
            <div class="feedback-message ${type}">
                ${message}
            </div>
        `;
    }
    
    playSound(type) {
        // Implémenter la lecture des sons
        const audio = new Audio(`sounds/${type}.mp3`);
        audio.play().catch(e => console.log('Audio play failed:', e));
    }
    
    saveProgress() {
        const progress = JSON.parse(localStorage.getItem('userProgress')) || {};
        progress.english = progress.english || {};
        progress.english.lessonsCompleted = this.currentLesson + 1;
        progress.english.totalXP = (progress.english.totalXP || 0) + this.xp;
        progress.english.lastActivity = new Date().toISOString();
        
        localStorage.setItem('userProgress', JSON.stringify(progress));
    }
    
    updateHeartsDisplay() {
        this.heartsSystem.updateHeartsDisplay();
    }
    
    updateStreakDisplay() {
        this.streakSystem.updateStreakDisplay();
    }
    
    updateXPBar() {
        // Implémenter la mise à jour de la barre XP
    }
    
    gameOver() {
        document.getElementById('question-area').innerHTML = `
            <div class="game-over">
                <h2>Plus de cœurs ! 💔</h2>
                <p>Attends 30 minutes ou pratique d'autres matières.</p>
                <button onclick="window.location.href='index.html'">Retour à l'accueil</button>
            </div>
        `;
    }
}

// Initialiser au chargement de la page
let englishLesson;
document.addEventListener('DOMContentLoaded', () => {
    englishLesson = new EnglishLessonSystem();
});

// Fonction helper pour jouer l'audio
function playAudio(src) {
    const audio = new Audio(src);
    audio.play();
}