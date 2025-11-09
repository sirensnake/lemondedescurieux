// quiz_conjugaison_cm1.js - Quiz Conjugaison niveau CM1 avec difficulté adaptive
class ConjugaisonQuizCM1 {
    constructor() {
        this.questions = [
            {
                id: 1,
                type: "present",
                question: "Conjugue le verbe CHANTER à la 3ème personne du singulier au présent :",
                verb: "chanter",
                person: "il/elle",
                tense: "présent",
                correct: "chante",
                alternatives: ["chantes", "chantons", "chantent"],
                explanation: "Au présent, 'il/elle chante' - terminaison -e pour les verbes du 1er groupe."
            },
            {
                id: 2,
                type: "present",
                question: "Conjugue le verbe FINIR à la 1ère personne du pluriel au présent :",
                verb: "finir",
                person: "nous",
                tense: "présent",
                correct: "finissons",
                alternatives: ["finisons", "finissez", "finissent"],
                explanation: "Au présent, 'nous finissons' - les verbes du 2ème groupe prennent -iss- au pluriel."
            },
            {
                id: 3,
                type: "present",
                question: "Conjugue le verbe ÊTRE à la 2ème personne du singulier au présent :",
                verb: "être",
                person: "tu",
                tense: "présent",
                correct: "es",
                alternatives: ["est", "sommes", "êtes"],
                explanation: "ÊTRE est un verbe irrégulier : tu es, il est, nous sommes..."
            },
            {
                id: 4,
                type: "futur",
                question: "Conjugue le verbe MANGER au futur simple à la 1ère personne du singulier :",
                verb: "manger",
                person: "je",
                tense: "futur",
                correct: "mangerai",
                alternatives: ["mange", "mangeais", "mangera"],
                explanation: "Au futur : infinitif + terminaisons. 'Je mangerai' (attention au 'e' conservé)."
            },
            {
                id: 5,
                type: "passe_compose",
                question: "Conjugue le verbe PARTIR au passé composé à la 3ème personne du singulier :",
                verb: "partir",
                person: "il/elle",
                tense: "passé composé",
                correct: "est parti(e)",
                alternatives: ["a parti", "est partis", "a partir"],
                explanation: "PARTIR se conjugue avec ÊTRE : il est parti, elle est partie."
            },
            {
                id: 6,
                type: "present",
                question: "Conjugue le verbe AVOIR à la 3ème personne du pluriel au présent :",
                verb: "avoir",
                person: "ils/elles",
                tense: "présent",
                correct: "ont",
                alternatives: ["as", "avons", "avez"],
                explanation: "AVOIR est irrégulier : j'ai, tu as, il a, nous avons, vous avez, ils ont."
            },
            {
                id: 7,
                type: "imparfait",
                question: "Conjugue le verbe JOUER à l'imparfait à la 2ème personne du singulier :",
                verb: "jouer",
                person: "tu",
                tense: "imparfait",
                correct: "jouais",
                alternatives: ["joues", "jouera", "jouerai"],
                explanation: "À l'imparfait : radical + terminaisons -ais, -ais, -ait... Tu jouais."
            },
            {
                id: 8,
                type: "present",
                question: "Conjugue le verbe VENIR à la 1ère personne du singulier au présent :",
                verb: "venir",
                person: "je",
                tense: "présent",
                correct: "viens",
                alternatives: ["vien", "venons", "vient"],
                explanation: "VENIR est du 3ème groupe : je viens, tu viens, il vient..."
            },
            {
                id: 9,
                type: "futur",
                question: "Conjugue le verbe POUVOIR au futur à la 2ème personne du pluriel :",
                verb: "pouvoir",
                person: "vous",
                tense: "futur",
                correct: "pourrez",
                alternatives: ["pouvez", "pouviez", "pourriez"],
                explanation: "POUVOIR au futur : je pourrai, tu pourras, vous pourrez..."
            },
            {
                id: 10,
                type: "passe_compose",
                question: "Conjugue le verbe PRENDRE au passé composé à la 1ère personne du pluriel :",
                verb: "prendre",
                person: "nous",
                tense: "passé composé",
                correct: "avons pris",
                alternatives: ["avons prendre", "sommes pris", "avons prend"],
                explanation: "PRENDRE avec AVOIR : nous avons pris (participe passé irrégulier : pris)."
            }
        ];
        
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.difficulty = 'normal'; // easy, normal, hard
        this.quizContainer = null;
    }
    
    init(containerId) {
        this.quizContainer = document.getElementById(containerId);
        if (!this.quizContainer) {
            console.error('Container non trouvé:', containerId);
            return;
        }
        this.showDifficultyChoice();
    }
    
    showDifficultyChoice() {
        this.quizContainer.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto; text-align: center;">
                <h2 style="color: #e76f51; margin-bottom: 2rem; font-family: 'Press Start 2P', monospace; font-size: 18px;">
                    🔄 Quiz Conjugaison CM1
                </h2>
                
                <p style="color: #264653; margin-bottom: 2rem; font-size: 16px;">
                    Choisis ton niveau de difficulté :
                </p>
                
                <div style="display: grid; gap: 1rem; margin-bottom: 2rem;">
                    <button onclick="conjugaisonQuiz.setDifficulty('easy')" style="
                        background: linear-gradient(135deg, #4caf50, #81c784);
                        color: white;
                        border: none;
                        padding: 1.5rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-family: 'Press Start 2P', monospace;
                        font-size: 12px;
                    ">
                        😊 FACILE - Présent uniquement
                    </button>
                    
                    <button onclick="conjugaisonQuiz.setDifficulty('normal')" style="
                        background: linear-gradient(135deg, #ff9800, #ffb74d);
                        color: white;
                        border: none;
                        padding: 1.5rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-family: 'Press Start 2P', monospace;
                        font-size: 12px;
                    ">
                        🤔 NORMAL - Présent, futur, imparfait
                    </button>
                    
                    <button onclick="conjugaisonQuiz.setDifficulty('hard')" style="
                        background: linear-gradient(135deg, #e76f51, #f4a261);
                        color: white;
                        border: none;
                        padding: 1.5rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-family: 'Press Start 2P', monospace;
                        font-size: 12px;
                    ">
                        🔥 DIFFICILE - Tous les temps
                    </button>
                </div>
            </div>
        `;
    }
    
    setDifficulty(level) {
        this.difficulty = level;
        this.filterQuestionsByDifficulty();
        this.showQuestion();
    }
    
    filterQuestionsByDifficulty() {
        if (this.difficulty === 'easy') {
            this.questions = this.questions.filter(q => q.type === 'present');
        } else if (this.difficulty === 'normal') {
            this.questions = this.questions.filter(q => ['present', 'futur', 'imparfait'].includes(q.type));
        }
        // 'hard' garde toutes les questions
        
        // Mélanger les questions
        this.questions = this.shuffleArray(this.questions);
    }
    
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    showQuestion() {
        const question = this.questions[this.currentQuestion];
        const allOptions = [question.correct, ...question.alternatives];
        const shuffledOptions = this.shuffleArray(allOptions);
        
        this.quizContainer.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 700px; margin: 0 auto;">
                <!-- Progress bar -->
                <div style="background: #e0e0e0; border-radius: 10px; margin-bottom: 2rem; height: 8px;">
                    <div style="background: linear-gradient(135deg, #e76f51, #f4a261); height: 100%; border-radius: 10px; width: ${((this.currentQuestion + 1) / this.questions.length) * 100}%; transition: width 0.3s;"></div>
                </div>
                
                <!-- Question info -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <span style="color: #666; font-family: 'Press Start 2P', monospace; font-size: 10px;">
                        Question ${this.currentQuestion + 1}/${this.questions.length}
                    </span>
                    <span style="background: ${this.getDifficultyColor()}; color: white; padding: 0.5rem 1rem; border-radius: 6px; font-family: 'Press Start 2P', monospace; font-size: 8px;">
                        ${this.getDifficultyLabel()}
                    </span>
                </div>
                
                <!-- Question -->
                <div style="background: #fff3e0; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                    <h3 style="color: #e76f51; margin-bottom: 1rem; font-size: 18px;">
                        ${question.question}
                    </h3>
                    <p style="color: #666; font-style: italic; margin: 0;">
                        ${question.person} ${question.verb} (${question.tense})
                    </p>
                </div>
                
                <!-- Input pour la réponse -->
                <div style="margin-bottom: 2rem; text-align: center;">
                    <p style="margin-bottom: 1rem; color: #264653; font-weight: bold;">
                        ${question.person} 
                        <input type="text" id="answer-input" style="
                            border: 2px solid #e76f51;
                            border-radius: 6px;
                            padding: 0.5rem 1rem;
                            font-size: 16px;
                            text-align: center;
                            margin: 0 0.5rem;
                            min-width: 150px;
                        " placeholder="ta réponse" onkeypress="if(event.key==='Enter') conjugaisonQuiz.checkAnswer()">
                    </p>
                    
                    <button onclick="conjugaisonQuiz.checkAnswer()" style="
                        background: linear-gradient(135deg, #e76f51, #f4a261);
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-family: 'Press Start 2P', monospace;
                        font-size: 12px;
                        margin-top: 1rem;
                    ">
                        ✓ Vérifier ma réponse
                    </button>
                </div>
                
                <!-- Indices -->
                <div style="background: #f1faee; padding: 1rem; border-radius: 8px; text-align: center;">
                    <button onclick="conjugaisonQuiz.showHint()" style="
                        background: none;
                        border: 1px dashed #2a9d8f;
                        color: #2a9d8f;
                        padding: 0.5rem 1rem;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 12px;
                    ">
                        💡 Besoin d'un indice ? (-1 XP)
                    </button>
                </div>
                
                <!-- Score actuel -->
                <div style="text-align: center; color: #e76f51; font-family: 'Press Start 2P', monospace; font-size: 10px; margin-top: 2rem;">
                    Score: ${this.score}/${this.currentQuestion} | 💖 Coeurs: ${window.heartSystem ? window.heartSystem.heartsData.currentHearts : 5}
                </div>
            </div>
        `;
        
        // Focus sur l'input
        setTimeout(() => {
            document.getElementById('answer-input').focus();
        }, 100);
    }
    
    checkAnswer() {
        const userInput = document.getElementById('answer-input').value.trim().toLowerCase();
        const question = this.questions[this.currentQuestion];
        const correctAnswer = question.correct.toLowerCase();
        
        // Variations acceptées
        const isCorrect = this.isAnswerCorrect(userInput, correctAnswer);
        
        this.userAnswers.push({
            questionId: question.id,
            userAnswer: userInput,
            correct: isCorrect
        });
        
        if (isCorrect) {
            this.score++;
        } else {
            // Perdre un cœur
            if (window.heartSystem) {
                window.heartSystem.loseHeart();
                window.heartSystem.updateHeartsDisplay();
            }
        }
        
        this.showExplanation(userInput, isCorrect);
    }
    
    isAnswerCorrect(userAnswer, correctAnswer) {
        // Accepter différentes variations (avec/sans accents, etc.)
        const normalize = (str) => str.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
            .trim();
            
        return normalize(userAnswer) === normalize(correctAnswer);
    }
    
    showHint() {
        const question = this.questions[this.currentQuestion];
        let hint = "";
        
        switch(question.type) {
            case 'present':
                hint = "💡 Au présent : regarde bien la terminaison selon la personne !";
                break;
            case 'futur':
                hint = "💡 Au futur : infinitif + -ai, -as, -a, -ons, -ez, -ont";
                break;
            case 'imparfait':
                hint = "💡 À l'imparfait : radical + -ais, -ais, -ait, -ions, -iez, -aient";
                break;
            case 'passe_compose':
                hint = "💡 Passé composé : auxiliaire ÊTRE ou AVOIR + participe passé";
                break;
        }
        
        alert(hint);
        
        // Pénalité XP pour l'indice
        if (window.xpManager) {
            window.xpManager.addXP(-1, 'conjugaison_hint');
        }
    }
    
    showExplanation(userAnswer, isCorrect) {
        const question = this.questions[this.currentQuestion];
        
        this.quizContainer.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 700px; margin: 0 auto; text-align: center;">
                <!-- Feedback visuel -->
                <div style="font-size: 4rem; margin-bottom: 1rem;">
                    ${isCorrect ? '🎉' : '😔'}
                </div>
                
                <h3 style="color: ${isCorrect ? '#4caf50' : '#e76f51'}; margin-bottom: 1rem; font-family: 'Press Start 2P', monospace; font-size: 16px;">
                    ${isCorrect ? 'Excellente réponse !' : 'Pas encore...'}
                </h3>
                
                <!-- Réponses -->
                <div style="display: grid; gap: 1rem; margin-bottom: 2rem;">
                    <div style="background: #f1faee; padding: 1rem; border-radius: 8px;">
                        <p style="margin: 0; color: #264653;">
                            <strong>Ta réponse :</strong> ${userAnswer}
                        </p>
                    </div>
                    ${!isCorrect ? `
                        <div style="background: #e8f5e8; padding: 1rem; border-radius: 8px;">
                            <p style="margin: 0; color: #2e7d32;">
                                <strong>La bonne réponse :</strong> ${question.correct}
                            </p>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Explication -->
                <div style="background: #fff3e0; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                    <p style="color: #e76f51; font-size: 16px; margin: 0; line-height: 1.5;">
                        <strong>📚 Explication :</strong> ${question.explanation}
                    </p>
                </div>
                
                <!-- Gain XP -->
                <div style="background: linear-gradient(135deg, #e76f51, #f4a261); padding: 1rem; border-radius: 8px; margin-bottom: 2rem;">
                    <p style="color: white; margin: 0; font-family: 'Press Start 2P', monospace; font-size: 12px;">
                        ${isCorrect ? '+8 XP gagné !' : '+3 XP (effort récompensé)'}
                    </p>
                </div>
                
                <!-- Bouton continuer -->
                <button onclick="conjugaisonQuiz.nextQuestion()" style="
                    background: linear-gradient(135deg, #e76f51, #264653);
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-family: 'Press Start 2P', monospace;
                    font-size: 12px;
                ">
                    ${this.currentQuestion < this.questions.length - 1 ? '➤ Question suivante' : '🏆 Voir les résultats'}
                </button>
            </div>
        `;
        
        // Ajouter XP
        if (window.xpManager) {
            window.xpManager.addXP(isCorrect ? 8 : 3, 'conjugaison_cm1');
        }
    }
    
    nextQuestion() {
        this.currentQuestion++;
        
        if (this.currentQuestion < this.questions.length) {
            this.showQuestion();
        } else {
            this.showResults();
        }
    }
    
    showResults() {
        const percentage = Math.round((this.score / this.questions.length) * 100);
        const level = this.getLevel(percentage);
        const totalXP = this.score * 8 + (this.questions.length - this.score) * 3;
        
        this.quizContainer.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 700px; margin: 0 auto; text-align: center;">
                <h2 style="color: #e76f51; margin-bottom: 2rem; font-family: 'Press Start 2P', monospace; font-size: 18px;">
                    🔄 Quiz Conjugaison Terminé !
                </h2>
                
                <!-- Score principal -->
                <div style="background: linear-gradient(135deg, #e76f51, #f4a261); padding: 2rem; border-radius: 12px; margin-bottom: 2rem; color: white;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">${level.emoji}</div>
                    <h3 style="margin: 0.5rem 0; font-family: 'Press Start 2P', monospace;">${this.score}/${this.questions.length}</h3>
                    <p style="margin: 0; font-size: 18px;">${percentage}% de réussite</p>
                    <p style="margin: 0.5rem 0; font-family: 'Press Start 2P', monospace; font-size: 12px;">Niveau: ${level.name}</p>
                    <p style="margin: 0; font-size: 14px;">Difficulté: ${this.getDifficultyLabel()}</p>
                </div>
                
                <!-- Actions -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    <button onclick="conjugaisonQuiz.restart()" style="
                        background: linear-gradient(135deg, #e76f51, #f4a261);
                        color: white;
                        border: none;
                        padding: 1rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-family: 'Press Start 2P', monospace;
                        font-size: 10px;
                    ">
                        🔄 Changer difficulté
                    </button>
                    <button onclick="location.reload()" style="
                        background: linear-gradient(135deg, #2a9d8f, #264653);
                        color: white;
                        border: none;
                        padding: 1rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-family: 'Press Start 2P', monospace;
                        font-size: 10px;
                    ">
                        🏠 Retour activités
                    </button>
                </div>
            </div>
        `;
        
        // Mise à jour streak si bon score
        if (percentage >= 60 && window.streakManager) {
            window.streakManager.recordActivity();
        }
    }
    
    getDifficultyColor() {
        const colors = {
            easy: '#4caf50',
            normal: '#ff9800', 
            hard: '#e76f51'
        };
        return colors[this.difficulty];
    }
    
    getDifficultyLabel() {
        const labels = {
            easy: 'FACILE',
            normal: 'NORMAL',
            hard: 'DIFFICILE'
        };
        return labels[this.difficulty];
    }
    
    getLevel(percentage) {
        if (percentage >= 90) return { name: "Expert", emoji: "🏆", badge: "Maître Conjugaison" };
        if (percentage >= 80) return { name: "Très bien", emoji: "⭐", badge: "As des verbes" };
        if (percentage >= 70) return { name: "Bien", emoji: "👍", badge: "Bon élève" };
        if (percentage >= 60) return { name: "Assez bien", emoji: "😊", badge: "En progrès" };
        return { name: "À retravailler", emoji: "💪", badge: "Persévérant" };
    }
    
    restart() {
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.showDifficultyChoice();
    }
}

// Instance globale
const conjugaisonQuiz = new ConjugaisonQuizCM1();