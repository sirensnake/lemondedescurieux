// scripts/quiz_grammaire_cm1.js - Quiz Grammaire CM1 niveau avancé
class GrammaireQuizCM1 {
    constructor() {
        this.questions = [
            {
                id: 1,
                question: "Quelle est la nature du mot 'rapidement' ?",
                options: ["Adjectif", "Adverbe", "Nom", "Verbe"],
                correct: 1,
                explanation: "Rapidement est un adverbe car il modifie un verbe (il court rapidement)"
            },
            {
                id: 2,
                question: "Dans 'Le chat mange sa pâtée', quel est le sujet ?",
                options: ["mange", "Le chat", "sa pâtée", "chat"],
                correct: 1,
                explanation: "Le sujet est 'Le chat' car c'est lui qui fait l'action de manger"
            },
            {
                id: 3,
                question: "Quel type de phrase est : 'Viens ici !' ?",
                options: ["Déclarative", "Interrogative", "Exclamative", "Impérative"],
                correct: 3,
                explanation: "C'est une phrase impérative car elle exprime un ordre"
            },
            {
                id: 4,
                question: "Dans 'Il mange UNE pomme', quelle est la nature de 'UNE' ?",
                options: ["Pronom", "Déterminant", "Adjectif", "Adverbe"],
                correct: 1,
                explanation: "UNE est un déterminant (article indéfini) qui accompagne le nom 'pomme'"
            },
            {
                id: 5,
                question: "Combien y a-t-il de phrases dans : 'Il pleut. Je prends mon parapluie.' ?",
                options: ["1", "2", "3", "0"],
                correct: 1,
                explanation: "Il y a 2 phrases séparées par un point"
            },
            {
                id: 6,
                question: "Dans 'Les enfants JOUENT dans le jardin', quelle est la fonction de 'dans le jardin' ?",
                options: ["Sujet", "Verbe", "Complément", "Attribut"],
                correct: 2,
                explanation: "C'est un complément circonstanciel de lieu (où ?)"
            },
            {
                id: 7,
                question: "Quel est le genre du mot 'école' ?",
                options: ["Masculin", "Féminin", "Neutre", "Les deux"],
                correct: 1,
                explanation: "École est féminin : une école, la grande école"
            },
            {
                id: 8,
                question: "Dans 'Mon petit chien', quel mot est l'adjectif qualificatif ?",
                options: ["Mon", "petit", "chien", "Aucun"],
                correct: 1,
                explanation: "Petit est l'adjectif qualificatif qui qualifie le nom 'chien'"
            },
            {
                id: 9,
                question: "Transforme en phrase négative : 'Il mange' →",
                options: ["Il ne mange pas", "Il mange ne pas", "Ne il mange pas", "Il pas mange"],
                correct: 0,
                explanation: "La négation se forme avec 'ne...pas' encadrant le verbe"
            },
            {
                id: 10,
                question: "Dans 'Nous chantons BIEN', quelle est la nature de 'BIEN' ?",
                options: ["Nom", "Adjectif", "Adverbe", "Verbe"],
                correct: 2,
                explanation: "BIEN est un adverbe de manière qui modifie le verbe 'chantons'"
            }
        ];
        
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.timeLimit = 30; // secondes par question
        this.currentTimer = null;
        this.quizContainer = null;
    }
    
    init(containerId) {
        this.quizContainer = document.getElementById(containerId);
        if (!this.quizContainer) {
            console.error('❌ Container non trouvé:', containerId);
            return;
        }
        
        console.log('📝 Démarrage Quiz Grammaire CM1');
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.showIntroduction();
    }
    
    showIntroduction() {
        this.quizContainer.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto; text-align: center;">
                <h2 style="color: #2a9d8f; margin-bottom: 2rem; font-family: 'Press Start 2P', monospace; font-size: 18px;">
                    📝 Quiz Grammaire CM1
                </h2>
                
                <div style="background: #e8f5e8; padding: 2rem; border-radius: 8px; margin-bottom: 2rem;">
                    <h3 style="color: #2e7d32; margin-bottom: 1rem;">Règles du Quiz :</h3>
                    <ul style="color: #388e3c; text-align: left; line-height: 1.6;">
                        <li><strong>10 questions</strong> de grammaire niveau CM1</li>
                        <li><strong>30 secondes</strong> maximum par question</li>
                        <li><strong>4 choix</strong> possibles à chaque fois</li>
                        <li><strong>+10 XP</strong> par bonne réponse</li>
                        <li><strong>Explication</strong> à chaque réponse</li>
                    </ul>
                </div>
                
                <div style="background: #fff3e0; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                    <p style="color: #e65100; margin: 0;">
                        💡 <strong>Astuce :</strong> Lis bien chaque question et prends ton temps !
                    </p>
                </div>
                
                <button onclick="grammaireQuiz.startQuiz()" style="
                    background: linear-gradient(135deg, #2a9d8f, #e9c46a);
                    color: white;
                    border: none;
                    padding: 1.5rem 3rem;
                    border-radius: 12px;
                    cursor: pointer;
                    font-family: 'Press Start 2P', monospace;
                    font-size: 14px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                ">
                    🚀 Commencer le Quiz
                </button>
            </div>
        `;
    }
    
    startQuiz() {
        this.showQuestion();
    }
    
    showQuestion() {
        const question = this.questions[this.currentQuestion];
        
        this.quizContainer.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 700px; margin: 0 auto;">
                <!-- Progress bar -->
                <div style="background: #e0e0e0; border-radius: 10px; margin-bottom: 2rem; height: 8px;">
                    <div style="background: linear-gradient(135deg, #2a9d8f, #e9c46a); height: 100%; border-radius: 10px; width: ${((this.currentQuestion + 1) / this.questions.length) * 100}%; transition: width 0.3s;"></div>
                </div>
                
                <!-- Question info -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <span style="color: #666; font-family: 'Press Start 2P', monospace; font-size: 10px;">
                        Question ${this.currentQuestion + 1}/${this.questions.length}
                    </span>
                    <span id="timer" style="background: #e76f51; color: white; padding: 0.5rem 1rem; border-radius: 6px; font-family: 'Press Start 2P', monospace; font-size: 10px;">
                        ⏱️ ${this.timeLimit}s
                    </span>
                </div>
                
                <!-- Question -->
                <div style="background: #f1faee; padding: 2rem; border-radius: 8px; margin-bottom: 2rem;">
                    <h3 style="color: #2a9d8f; margin: 0; font-size: 18px; line-height: 1.4;">
                        ${question.question}
                    </h3>
                </div>
                
                <!-- Options -->
                <div style="display: grid; gap: 1rem; margin-bottom: 2rem;">
                    ${question.options.map((option, index) => `
                        <button onclick="grammaireQuiz.selectAnswer(${index})" style="
                            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                            border: 2px solid #dee2e6;
                            padding: 1.5rem;
                            border-radius: 8px;
                            cursor: pointer;
                            text-align: left;
                            font-size: 16px;
                            transition: all 0.3s;
                        " onmouseover="this.style.transform='translateY(-2px)'; this.style.borderColor='#2a9d8f';" 
                           onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='#dee2e6';">
                            <strong>${String.fromCharCode(65 + index)}.</strong> ${option}
                        </button>
                    `).join('')}
                </div>
                
                <!-- Score actuel -->
                <div style="text-align: center; color: #2a9d8f; font-family: 'Press Start 2P', monospace; font-size: 10px;">
                    Score: ${this.score}/${this.currentQuestion} | 💖 Coeurs: ${window.heartSystem ? window.heartSystem.heartsData.currentHearts : 5}
                </div>
            </div>
        `;
        
        this.startTimer();
    }
    
    startTimer() {
        let timeLeft = this.timeLimit;
        const timerElement = document.getElementById('timer');
        
        this.currentTimer = setInterval(() => {
            timeLeft--;
            if (timerElement) {
                timerElement.textContent = `⏱️ ${timeLeft}s`;
                
                // Changer couleur quand temps critique
                if (timeLeft <= 10) {
                    timerElement.style.background = '#d32f2f';
                    timerElement.style.animation = 'pulse 1s infinite';
                } else if (timeLeft <= 20) {
                    timerElement.style.background = '#ff9800';
                }
            }
            
            if (timeLeft <= 0) {
                clearInterval(this.currentTimer);
                this.timeOut();
            }
        }, 1000);
    }
    
    timeOut() {
        // Temps écoulé = mauvaise réponse
        this.userAnswers.push({
            questionId: this.questions[this.currentQuestion].id,
            userAnswer: -1, // -1 = timeout
            correct: false,
            timeOut: true
        });
        
        // Perdre un cœur
        if (window.heartSystem) {
            window.heartSystem.loseHeart();
        }
        
        this.showExplanation(-1, false, true);
    }
    
    selectAnswer(selectedIndex) {
        clearInterval(this.currentTimer);
        
        const question = this.questions[this.currentQuestion];
        const isCorrect = selectedIndex === question.correct;
        
        this.userAnswers.push({
            questionId: question.id,
            userAnswer: selectedIndex,
            correct: isCorrect,
            timeOut: false
        });
        
        if (isCorrect) {
            this.score++;
        } else {
            // Perdre un cœur
            if (window.heartSystem) {
                window.heartSystem.loseHeart();
            }
        }
        
        this.showExplanation(selectedIndex, isCorrect, false);
    }
    
    showExplanation(selectedIndex, isCorrect, timeOut) {
        const question = this.questions[this.currentQuestion];
        
        this.quizContainer.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 700px; margin: 0 auto; text-align: center;">
                <!-- Feedback visuel -->
                <div style="font-size: 4rem; margin-bottom: 1rem;">
                    ${timeOut ? '⏰' : (isCorrect ? '🎉' : '😔')}
                </div>
                
                <h3 style="color: ${timeOut ? '#ff9800' : (isCorrect ? '#4caf50' : '#e76f51')}; margin-bottom: 1rem; font-family: 'Press Start 2P', monospace; font-size: 16px;">
                    ${timeOut ? 'Temps écoulé !' : (isCorrect ? 'Excellente réponse !' : 'Pas encore...')}
                </h3>
                
                <!-- Réponses -->
                <div style="display: grid; gap: 1rem; margin-bottom: 2rem;">
                    ${!timeOut ? `
                        <div style="background: #f1faee; padding: 1rem; border-radius: 8px;">
                            <p style="margin: 0; color: #264653;">
                                <strong>Ta réponse :</strong> ${question.options[selectedIndex]}
                            </p>
                        </div>
                    ` : ''}
                    ${!isCorrect || timeOut ? `
                        <div style="background: #e8f5e8; padding: 1rem; border-radius: 8px;">
                            <p style="margin: 0; color: #2e7d32;">
                                <strong>La bonne réponse :</strong> ${question.options[question.correct]}
                            </p>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Explication -->
                <div style="background: #fff3e0; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                    <p style="color: #e65100; font-size: 16px; margin: 0; line-height: 1.5;">
                        <strong>📚 Explication :</strong> ${question.explanation}
                    </p>
                </div>
                
                <!-- Gain XP -->
                <div style="background: linear-gradient(135deg, ${isCorrect ? '#4caf50' : '#ff9800'}, ${isCorrect ? '#81c784' : '#ffb74d'}); padding: 1rem; border-radius: 8px; margin-bottom: 2rem;">
                    <p style="color: white; margin: 0; font-family: 'Press Start 2P', monospace; font-size: 12px;">
                        ${timeOut ? '+2 XP (présence)' : (isCorrect ? '+10 XP gagné !' : '+4 XP (effort récompensé)')}
                    </p>
                </div>
                
                <!-- Bouton continuer -->
                <button onclick="grammaireQuiz.nextQuestion()" style="
                    background: linear-gradient(135deg, #2a9d8f, #264653);
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
            const xpGain = timeOut ? 2 : (isCorrect ? 10 : 4);
            window.xpManager.addXP(xpGain, 'grammaire_cm1');
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
        const totalTimeOuts = this.userAnswers.filter(a => a.timeOut).length;
        
        this.quizContainer.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 700px; margin: 0 auto; text-align: center;">
                <h2 style="color: #2a9d8f; margin-bottom: 2rem; font-family: 'Press Start 2P', monospace; font-size: 18px;">
                    📝 Quiz Grammaire Terminé !
                </h2>
                
                <!-- Score principal -->
                <div style="background: linear-gradient(135deg, #2a9d8f, #e9c46a); padding: 2rem; border-radius: 12px; margin-bottom: 2rem; color: white;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">${level.emoji}</div>
                    <h3 style="margin: 0.5rem 0; font-family: 'Press Start 2P', monospace;">${this.score}/${this.questions.length}</h3>
                    <p style="margin: 0; font-size: 18px;">${percentage}% de réussite</p>
                    <p style="margin: 0.5rem 0; font-family: 'Press Start 2P', monospace; font-size: 12px;">Niveau: ${level.name}</p>
                    ${totalTimeOuts > 0 ? `<p style="margin: 0; font-size: 12px;">⏰ ${totalTimeOuts} timeout(s)</p>` : ''}
                </div>
                
                <!-- Détails performance -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                    <div style="background: #e8f5e8; padding: 1rem; border-radius: 8px;">
                        <div style="color: #2e7d32; font-size: 1.5rem;">✅</div>
                        <p style="margin: 0; font-size: 12px; color: #2e7d32;">${this.score} bonnes</p>
                    </div>
                    <div style="background: #ffebee; padding: 1rem; border-radius: 8px;">
                        <div style="color: #c62828; font-size: 1.5rem;">❌</div>
                        <p style="margin: 0; font-size: 12px; color: #c62828;">${this.questions.length - this.score} erreurs</p>
                    </div>
                    <div style="background: #fff3e0; padding: 1rem; border-radius: 8px;">
                        <div style="color: #e65100; font-size: 1.5rem;">🎯</div>
                        <p style="margin: 0; font-size: 12px; color: #e65100;">Précision ${percentage}%</p>
                    </div>
                </div>
                
                <!-- Actions -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    <button onclick="grammaireQuiz.restart()" style="
                        background: linear-gradient(135deg, #2a9d8f, #e9c46a);
                        color: white;
                        border: none;
                        padding: 1rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-family: 'Press Start 2P', monospace;
                        font-size: 10px;
                    ">
                        🔄 Refaire le quiz
                    </button>
                    <button onclick="location.reload()" style="
                        background: linear-gradient(135deg, #457b9d, #1d3557);
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
        if (percentage >= 70 && window.streakManager) {
            window.streakManager.recordActivity();
        }
    }
    
    getLevel(percentage) {
        if (percentage >= 90) return { name: "Expert", emoji: "🏆", badge: "Maître Grammaire" };
        if (percentage >= 80) return { name: "Très bien", emoji: "⭐", badge: "As des règles" };
        if (percentage >= 70) return { name: "Bien", emoji: "👍", badge: "Bon élève" };
        if (percentage >= 60) return { name: "Assez bien", emoji: "😊", badge: "En progrès" };
        return { name: "À retravailler", emoji: "💪", badge: "Persévérant" };
    }
    
    restart() {
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.showIntroduction();
    }
}

// Instance globale CRUCIALE
const grammaireQuiz = new GrammaireQuizCM1();