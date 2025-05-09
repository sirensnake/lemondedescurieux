class QuizEngine {
    constructor(quizData, containerId) {
        this.quizData = quizData;
        this.container = document.getElementById(containerId);
        this.currentQuestion = 0;
        this.score = 0;
        this.questionText = document.getElementById('question-text');
        this.optionsContainer = document.getElementById('options-container');
        this.resultFeedback = document.getElementById('result-feedback');
        this.submitButton = document.getElementById('submit-answer');
        this.nextButton = document.getElementById('next-question');
        this.restartButton = document.getElementById('restart-quiz');
        this.progressBar = document.getElementById('progress-bar');
        this.currentScoreDisplay = document.getElementById('current-score');
        this.totalQuestionsDisplay = document.getElementById('total-questions');
        
        this.selectedOption = null;
        
        this.init();
    }
    
    init() {
        this.totalQuestionsDisplay.textContent = this.quizData.length;
        this.currentScoreDisplay.textContent = this.score;
        
        this.submitButton.addEventListener('click', () => this.checkAnswer());
        this.nextButton.addEventListener('click', () => this.loadNextQuestion());
        this.restartButton.addEventListener('click', () => this.restartQuiz());
        
        this.loadQuestion();
    }
    
    loadQuestion() {
        const question = this.quizData[this.currentQuestion];
        this.questionText.textContent = `Question ${this.currentQuestion + 1}: ${question.question}`;
        
        // Vider les options précédentes
        this.optionsContainer.innerHTML = '';
        
        // Créer les nouvelles options
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'quiz-option';
            optionElement.innerHTML = `
                <input type="radio" id="option${index}" name="quiz-option" value="${index}">
                <label for="option${index}">${option}</label>
            `;
            this.optionsContainer.appendChild(optionElement);
            
            // Ajouter un gestionnaire d'événements
            optionElement.addEventListener('click', () => {
                this.selectedOption = index;
                
                // Décocher les autres options
                document.querySelectorAll('.quiz-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Cocher cette option
                optionElement.classList.add('selected');
            });
        });
        
        // Mettre à jour la barre de progression
        this.progressBar.style.width = `${(this.currentQuestion / this.quizData.length) * 100}%`;
        
        // Réinitialiser l'affichage
        this.resultFeedback.classList.add('hidden');
        this.nextButton.classList.add('hidden');
        this.submitButton.classList.remove('hidden');
        this.selectedOption = null;
    }
    
    checkAnswer() {
        if (this.selectedOption === null) {
            this.resultFeedback.textContent = "Choisis une réponse avant de valider.";
            this.resultFeedback.className = 'feedback warning';
            this.resultFeedback.classList.remove('hidden');
            return;
        }
        
        const correctAnswerIndex = this.quizData[this.currentQuestion].correctAnswer;
        
        if (this.selectedOption === correctAnswerIndex) {
            this.score++;
            this.currentScoreDisplay.textContent = this.score;
            this.resultFeedback.textContent = "✅ Bonne réponse! " + 
                (this.quizData[this.currentQuestion].explanation || "");
            this.resultFeedback.className = 'feedback correct';
            
            // Enregistrer la progression
            if (this.quizData[this.currentQuestion].section && this.quizData[this.currentQuestion].activity) {
                markProgress(
                    this.quizData[this.currentQuestion].section, 
                    this.quizData[this.currentQuestion].activity
                );
            }
        } else {
            this.resultFeedback.textContent = "❌ Mauvaise réponse. La bonne réponse était: " + 
                this.quizData[this.currentQuestion].options[correctAnswerIndex] + 
                (this.quizData[this.currentQuestion].explanation ? ". " + this.quizData[this.currentQuestion].explanation : "");
            this.resultFeedback.className = 'feedback incorrect';
        }
        
        this.resultFeedback.classList.remove('hidden');
        this.submitButton.classList.add('hidden');
        
        if (this.currentQuestion < this.quizData.length - 1) {
            this.nextButton.classList.remove('hidden');
        } else {
            this.restartButton.classList.remove('hidden');
            this.resultFeedback.textContent += `\nQuiz terminé! Ton score final est de ${this.score}/${this.quizData.length}.`;
        }
    }
    
    loadNextQuestion() {
        this.currentQuestion++;
        this.loadQuestion();
    }
    
    restartQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.currentScoreDisplay.textContent = this.score;
        this.restartButton.classList.add('hidden');
        this.loadQuestion();
    }
}

// Exemple d'utilisation pour une matière (à adapter)
const mathsQuizData = [
    {
        question: "Combien font 5 × 9?",
        options: ["41", "45", "54", "50"],
        correctAnswer: 1,
        explanation: "5 × 9 = 45",
        section: "Mathématiques",
        activity: "quiz_multiplication"
    },
    // Autres questions...
];

// Initialiser le quiz
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('quiz-content')) {
        const quiz = new QuizEngine(mathsQuizData, 'quiz-content');
    }
});