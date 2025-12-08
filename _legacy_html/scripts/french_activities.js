/**
 * Système d'Activités Françaises Gamifiées
 * Intégration complète avec XP Manager, Heart System et Streak Manager
 * Compatible architecture existante Le Monde des Curieux
 */

class FrenchActivitiesSystem {
    constructor() {
        this.currentActivity = null;
        this.activityData = {};
        this.questionsDatabase = this.initializeQuestionsDatabase();
        
        // Références aux systèmes existants
        this.xpManager = window.xpManager;
        this.heartSystem = window.heartSystem;
        this.streakManager = window.streakManager;
        
        console.log('🇫🇷 Système Activités Français initialisé');
    }

    initializeQuestionsDatabase() {
        return {
            grammaire: [
                {
                    question: "Quelle est la nature du mot 'rapidement' ?",
                    options: ["Nom", "Adverbe", "Adjectif", "Verbe"],
                    correct: 1,
                    explanation: "'Rapidement' est un adverbe de manière qui modifie le verbe.",
                    difficulty: "medium"
                },
                {
                    question: "Dans 'Les enfants jouent', quel est le sujet ?",
                    options: ["Les", "enfants", "Les enfants", "jouent"],
                    correct: 2,
                    explanation: "'Les enfants' est le groupe nominal sujet de la phrase.",
                    difficulty: "easy"
                },
                {
                    question: "Comment accorde-t-on l'adjectif dans 'des fleurs rouge...' ?",
                    options: ["rouge", "rouges", "rouge(s)", "ça dépend"],
                    correct: 1,
                    explanation: "L'adjectif s'accorde avec le nom : 'des fleurs rouges'.",
                    difficulty: "medium"
                },
                {
                    question: "Qu'est-ce qu'un COD ?",
                    options: ["Complément d'Objet Direct", "Complément d'Origine Directe", "Complément Obligatoire Direct", "Code Orthographique Direct"],
                    correct: 0,
                    explanation: "COD = Complément d'Objet Direct, il répond à 'qui ?' ou 'quoi ?'",
                    difficulty: "hard"
                },
                {
                    question: "Dans 'Je mange une pomme', que représente 'une pomme' ?",
                    options: ["COI", "COD", "CC", "Sujet"],
                    correct: 1,
                    explanation: "'Une pomme' répond à 'quoi ?' donc c'est un COD.",
                    difficulty: "medium"
                }
            ],
            
            conjugaison: [
                {
                    question: "Conjugue 'être' à la 1ère personne du présent :",
                    options: ["je suis", "j'ai", "je fais", "je vais"],
                    correct: 0,
                    explanation: "Être au présent : je suis, tu es, il/elle est...",
                    difficulty: "easy"
                },
                {
                    question: "Conjugue 'finir' à la 3ème personne du pluriel au présent :",
                    options: ["ils finissent", "ils finisssent", "ils finisent", "ils finient"],
                    correct: 0,
                    explanation: "Verbe du 2ème groupe : ils finissent (avec -iss-)",
                    difficulty: "medium"
                },
                {
                    question: "Quel est le participe passé de 'prendre' ?",
                    options: ["prendu", "pris", "prenu", "prit"],
                    correct: 1,
                    explanation: "Le participe passé de 'prendre' est 'pris'.",
                    difficulty: "medium"
                },
                {
                    question: "Conjugue 'aller' au futur, 2ème personne du singulier :",
                    options: ["tu alleras", "tu iras", "tu vas aller", "tu irais"],
                    correct: 1,
                    explanation: "'Aller' au futur : j'irai, tu iras, il/elle ira...",
                    difficulty: "hard"
                },
                {
                    question: "Dans 'Nous avons mangé', quel est le temps ?",
                    options: ["Présent", "Imparfait", "Passé composé", "Futur"],
                    correct: 2,
                    explanation: "Auxiliaire 'avoir' + participe passé = passé composé",
                    difficulty: "medium"
                }
            ],
            
            vocabulaire: [
                {
                    question: "Quel est le synonyme de 'content' ?",
                    options: ["Triste", "Heureux", "Fatigué", "Énervé"],
                    correct: 1,
                    explanation: "'Content' et 'heureux' expriment la joie.",
                    difficulty: "easy"
                },
                {
                    question: "Que signifie 'perspicace' ?",
                    options: ["Qui voit bien", "Qui entend bien", "Qui comprend vite", "Qui court vite"],
                    correct: 2,
                    explanation: "'Perspicace' = qui a une intelligence vive, qui comprend rapidement.",
                    difficulty: "hard"
                },
                {
                    question: "Quel est l'antonyme de 'généreux' ?",
                    options: ["Avare", "Riche", "Pauvre", "Gentil"],
                    correct: 0,
                    explanation: "'Avare' est le contraire de 'généreux'.",
                    difficulty: "medium"
                },
                {
                    question: "Un 'ornithologue' étudie :",
                    options: ["Les insectes", "Les oiseaux", "Les poissons", "Les plantes"],
                    correct: 1,
                    explanation: "L'ornithologue est un spécialiste des oiseaux.",
                    difficulty: "hard"
                },
                {
                    question: "Que veut dire 'diligent' ?",
                    options: ["Paresseux", "Appliqué", "Distrait", "Nerveux"],
                    correct: 1,
                    explanation: "'Diligent' = qui fait preuve d'application, de zèle.",
                    difficulty: "medium"
                }
            ],
            
            dictee: [
                {
                    text: "Les enfants jouent dans le jardin.",
                    audio: "data:audio/wav;base64,", // Placeholder pour audio
                    words: ["Les", "enfants", "jouent", "dans", "le", "jardin"],
                    difficulty: "easy",
                    points: ["Accord du verbe", "Articles définis"]
                },
                {
                    text: "Mes amies sont parties en vacances.",
                    audio: "data:audio/wav;base64,",
                    words: ["Mes", "amies", "sont", "parties", "en", "vacances"],
                    difficulty: "medium",
                    points: ["Accord participe passé", "Féminin pluriel"]
                },
                {
                    text: "Il faut que nous réfléchissions davantage.",
                    audio: "data:audio/wav;base64,",
                    words: ["Il", "faut", "que", "nous", "réfléchissions", "davantage"],
                    difficulty: "hard",
                    points: ["Subjonctif présent", "Orthographe complexe"]
                }
            ]
        };
    }

    /**
     * INITIALISATION ACTIVITÉ QUIZ
     */
    initializeActivityQuiz(activityType, config) {
        this.currentActivity = {
            type: activityType,
            config: config,
            currentQuestion: 0,
            score: 0,
            errors: 0,
            startTime: Date.now(),
            responses: []
        };

        // Vérifier cœurs disponibles
        if (this.heartSystem && this.heartSystem.heartsData.currentHearts < 1) {
            this.showMessage('😔 Plus de cœurs ! Attends qu\'ils se régénèrent.', 'error');
            return false;
        }

        // Préparer questions
        const questions = this.selectQuestions(activityType, config.difficulty || 'medium');
        this.currentActivity.questions = questions;

        // Afficher interface quiz
        this.renderQuizInterface();
        this.displayQuestion();

        return true;
    }

    selectQuestions(activityType, difficulty, count = 5) {
        const allQuestions = this.questionsDatabase[activityType] || [];
        
        // Filtrer par difficulté si spécifiée
        let filteredQuestions = allQuestions;
        if (difficulty !== 'mixed') {
            filteredQuestions = allQuestions.filter(q => q.difficulty === difficulty);
        }

        // Sélection aléatoire
        const shuffled = filteredQuestions.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }

    renderQuizInterface() {
        const container = document.getElementById('quiz-container');
        if (!container) return;

        container.innerHTML = `
            <div class="quiz-active-interface">
                <div class="quiz-header">
                    <div class="quiz-info">
                        <h3>${this.getActivityTitle()}</h3>
                        <div class="quiz-progress-bar">
                            <div class="progress-fill" id="quiz-progress"></div>
                        </div>
                    </div>
                    <div class="quiz-stats">
                        <div class="hearts-display" id="hearts-quiz">
                            ${this.renderHeartsDisplay()}
                        </div>
                        <div class="score-display">
                            Score: <span id="current-score">0</span>/${this.currentActivity.questions.length}
                        </div>
                    </div>
                </div>
                
                <div class="question-container">
                    <div class="question-number" id="question-number">
                        Question 1/${this.currentActivity.questions.length}
                    </div>
                    <div class="question-text" id="question-text">
                        <!-- Question apparaîtra ici -->
                    </div>
                    <div class="answer-options" id="answer-options">
                        <!-- Options apparaîtront ici -->
                    </div>
                </div>
                
                <div class="feedback-container" id="feedback-container" style="display:none;">
                    <!-- Feedback apparaîtra ici -->
                </div>
                
                <div class="quiz-actions">
                    <button id="quit-quiz-btn" class="quit-btn" onclick="frenchActivities.quitQuiz()">
                        Quitter
                    </button>
                </div>
            </div>
        `;
    }

    displayQuestion() {
        const question = this.currentActivity.questions[this.currentActivity.currentQuestion];
        if (!question) {
            this.finishQuiz();
            return;
        }

        // Mise à jour numéro question
        document.getElementById('question-number').textContent = 
            `Question ${this.currentActivity.currentQuestion + 1}/${this.currentActivity.questions.length}`;

        // Affichage question
        document.getElementById('question-text').textContent = question.question;

        // Affichage options
        const optionsContainer = document.getElementById('answer-options');
        optionsContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'answer-option';
            button.textContent = option;
            button.onclick = () => this.selectAnswer(index);
            optionsContainer.appendChild(button);
        });

        // Mise à jour progress bar
        const progressPercent = (this.currentActivity.currentQuestion / this.currentActivity.questions.length) * 100;
        document.getElementById('quiz-progress').style.width = `${progressPercent}%`;

        // Cacher feedback
        document.getElementById('feedback-container').style.display = 'none';
    }

    selectAnswer(selectedIndex) {
        const question = this.currentActivity.questions[this.currentActivity.currentQuestion];
        const isCorrect = selectedIndex === question.correct;
        
        // Enregistrer réponse
        this.currentActivity.responses.push({
            question: question.question,
            selected: selectedIndex,
            correct: question.correct,
            isCorrect: isCorrect,
            time: Date.now() - this.currentActivity.startTime
        });

        // Traitement réponse
        if (isCorrect) {
            this.currentActivity.score++;
            this.showQuestionFeedback(true, question.explanation);
        } else {
            this.currentActivity.errors++;
            this.processIncorrectAnswer();
            this.showQuestionFeedback(false, question.explanation);
        }

        // Mise à jour score affiché
        document.getElementById('current-score').textContent = this.currentActivity.score;

        // Prochaine question après délai
        setTimeout(() => {
            this.currentActivity.currentQuestion++;
            this.displayQuestion();
        }, 2500);
    }

    processIncorrectAnswer() {
        // Perte de cœur via HeartSystem
        if (this.heartSystem) {
            const heartsLeft = this.heartSystem.loseHeart();
            this.updateHeartsDisplay();
            
            if (heartsLeft === 0) {
                // Plus de cœurs = fin forcée
                setTimeout(() => {
                    this.forceQuitQuiz();
                }, 1000);
            }
        }
    }

    showQuestionFeedback(isCorrect, explanation) {
        const feedbackContainer = document.getElementById('feedback-container');
        feedbackContainer.style.display = 'block';
        
        feedbackContainer.innerHTML = `
            <div class="feedback ${isCorrect ? 'correct' : 'incorrect'}">
                <div class="feedback-icon">
                    ${isCorrect ? '✅' : '❌'}
                </div>
                <div class="feedback-content">
                    <div class="feedback-result">
                        ${isCorrect ? 'Bonne réponse !' : 'Pas tout à fait...'}
                    </div>
                    <div class="feedback-explanation">
                        ${explanation}
                    </div>
                </div>
            </div>
        `;

        // Animation feedback
        feedbackContainer.classList.add('fade-in');
    }

    finishQuiz() {
        const endTime = Date.now();
        const totalTime = endTime - this.currentActivity.startTime;
        const scorePercent = (this.currentActivity.score / this.currentActivity.questions.length) * 100;
        const isPerfect = this.currentActivity.errors === 0;

        // Calcul XP avec bonuses
        const baseXP = this.currentActivity.config.xpReward || 20;
        let xpContext = {
            perfect: isPerfect,
            difficulty: this.currentActivity.config.difficulty,
            scorePercent: scorePercent,
            responseTime: totalTime / this.currentActivity.questions.length
        };

        // Attribuer XP via XP Manager
        let xpResult = null;
        if (this.xpManager) {
            xpResult = this.xpManager.addXP(baseXP, `quiz_${this.currentActivity.type}`, xpContext);
        }

        // Afficher résultats
        this.showQuizResults({
            score: this.currentActivity.score,
            total: this.currentActivity.questions.length,
            scorePercent: Math.round(scorePercent),
            errors: this.currentActivity.errors,
            isPerfect: isPerfect,
            totalTime: totalTime,
            xpResult: xpResult
        });

        // Mise à jour streak si quiz réussi
        if (scorePercent >= 60 && this.streakManager) {
            this.streakManager.recordActivity();
        }
    }

    showQuizResults(results) {
        const container = document.getElementById('quiz-container');
        container.innerHTML = `
            <div class="quiz-results">
                <div class="results-header">
                    <h2>🎉 Quiz Terminé !</h2>
                    <div class="results-score ${results.isPerfect ? 'perfect' : ''}">
                        ${results.score}/${results.total}
                        <span class="score-percent">(${results.scorePercent}%)</span>
                    </div>
                </div>
                
                <div class="results-details">
                    ${results.isPerfect ? 
                        '<div class="perfect-badge">⭐ PARFAIT ! ⭐</div>' : 
                        `<div class="errors-count">❌ ${results.errors} erreur(s)</div>`
                    }
                    
                    <div class="time-taken">
                        ⏱️ Temps: ${Math.round(results.totalTime / 1000)}s
                    </div>
                    
                    ${results.xpResult ? `
                        <div class="xp-gained">
                            <div class="xp-amount">+${results.xpResult.xpGained} XP</div>
                            ${results.xpResult.bonusDetails.length > 0 ? 
                                `<div class="xp-bonuses">${results.xpResult.bonusDetails.join(' • ')}</div>` : ''
                            }
                            ${results.xpResult.levelUp ? 
                                `<div class="level-up-notice">🎊 NIVEAU ${results.xpResult.levelUp.newLevel} !</div>` : ''
                            }
                        </div>
                    ` : ''}
                </div>
                
                <div class="results-actions">
                    <button class="retry-btn" onclick="frenchActivities.retryQuiz()">
                        🔄 Recommencer
                    </button>
                    <button class="continue-btn" onclick="frenchActivities.returnToActivities()">
                        ➡️ Autres Activités
                    </button>
                </div>
                
                <div class="results-encouragement">
                    ${this.getEncouragementMessage(results.scorePercent)}
                </div>
            </div>
        `;
    }

    /**
     * ACTIVITÉ DICTÉE INTERACTIVE
     */
    initializeDicteeActivity(config) {
        this.currentActivity = {
            type: 'dictee',
            config: config,
            currentSentence: 0,
            correctWords: 0,
            totalWords: 0,
            startTime: Date.now()
        };

        // Sélectionner dictées selon difficulté
        const dictees = this.questionsDatabase.dictee.filter(d => 
            d.difficulty === (config.difficulty || 'medium')
        );

        if (dictees.length === 0) {
            this.showMessage('Aucune dictée disponible pour ce niveau.', 'error');
            return false;
        }

        this.currentActivity.dictees = dictees.slice(0, 3); // Max 3 dictées
        this.renderDicteeInterface();
        this.startDictee();

        return true;
    }

    renderDicteeInterface() {
        const container = document.getElementById('quiz-container');
        container.innerHTML = `
            <div class="dictee-interface">
                <div class="dictee-header">
                    <h3>🎧 Dictée Interactive</h3>
                    <div class="hearts-display">${this.renderHeartsDisplay()}</div>
                </div>
                
                <div class="dictee-content">
                    <div class="dictee-instructions">
                        Écoute attentivement et écris ce que tu entends.
                    </div>
                    
                    <div class="audio-controls" id="audio-controls">
                        <button id="play-audio" class="audio-btn">
                            🔊 Écouter
                        </button>
                        <button id="replay-audio" class="audio-btn">
                            🔁 Réécouter
                        </button>
                    </div>
                    
                    <div class="dictee-input-area">
                        <textarea id="dictee-input" placeholder="Écris ici ce que tu entends..." 
                                rows="4" cols="50"></textarea>
                    </div>
                    
                    <div class="dictee-actions">
                        <button id="check-dictee" class="check-btn" onclick="frenchActivities.checkDictee()">
                            ✓ Vérifier
                        </button>
                        <button id="skip-dictee" class="skip-btn" onclick="frenchActivities.skipDictee()">
                            ⏭️ Passer
                        </button>
                    </div>
                </div>
                
                <div class="dictee-feedback" id="dictee-feedback" style="display:none;">
                    <!-- Feedback dictée -->
                </div>
            </div>
        `;
    }

    startDictee() {
        const dictee = this.currentActivity.dictees[this.currentActivity.currentSentence];
        if (!dictee) {
            this.finishDictee();
            return;
        }

        // Configuration audio (simulation - à remplacer par vrais fichiers audio)
        document.getElementById('play-audio').onclick = () => this.playDicteeAudio(dictee);
        document.getElementById('replay-audio').onclick = () => this.playDicteeAudio(dictee);

        // Réinitialiser interface
        document.getElementById('dictee-input').value = '';
        document.getElementById('dictee-feedback').style.display = 'none';
    }

    playDicteeAudio(dictee) {
        // Simulation lecture audio (à remplacer par Web Speech API ou fichiers audio)
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(dictee.text);
            utterance.lang = 'fr-FR';
            utterance.rate = 0.8; // Lentement pour dictée
            speechSynthesis.speak(utterance);
        } else {
            // Fallback: afficher temporairement le texte
            this.showMessage(`Audio: "${dictee.text}"`, 'info');
        }
    }

    checkDictee() {
        const userInput = document.getElementById('dictee-input').value.trim();
        const dictee = this.currentActivity.dictees[this.currentActivity.currentSentence];
        
        if (!userInput) {
            this.showMessage('Écris d\'abord ta réponse !', 'warning');
            return;
        }

        // Analyse des mots
        const userWords = userInput.toLowerCase().split(/\s+/);
        const correctWords = dictee.words.map(w => w.toLowerCase());
        
        let correctCount = 0;
        let analysis = [];

        userWords.forEach((userWord, index) => {
            if (index < correctWords.length) {
                if (userWord === correctWords[index]) {
                    correctCount++;
                    analysis.push({ word: userWord, status: 'correct' });
                } else {
                    analysis.push({ 
                        word: userWord, 
                        status: 'incorrect', 
                        expected: correctWords[index] 
                    });
                }
            } else {
                analysis.push({ word: userWord, status: 'extra' });
            }
        });

        // Mots manqués
        if (userWords.length < correctWords.length) {
            for (let i = userWords.length; i < correctWords.length; i++) {
                analysis.push({ 
                    word: '___', 
                    status: 'missing', 
                    expected: correctWords[i] 
                });
            }
        }

        // Calcul score
        const accuracy = (correctCount / correctWords.length) * 100;
        this.currentActivity.correctWords += correctCount;
        this.currentActivity.totalWords += correctWords.length;

        // Afficher feedback
        this.showDicteeFeedback(analysis, accuracy, dictee);

        // Traitement résultat
        if (accuracy < 60) {
            this.processIncorrectAnswer(); // Perte cœur si < 60%
        }

        // Prochaine dictée
        setTimeout(() => {
            this.currentActivity.currentSentence++;
            this.startDictee();
        }, 4000);
    }

    showDicteeFeedback(analysis, accuracy, dictee) {
        const feedbackContainer = document.getElementById('dictee-feedback');
        feedbackContainer.style.display = 'block';
        
        const isGood = accuracy >= 80;
        const isMedium = accuracy >= 60;
        
        feedbackContainer.innerHTML = `
            <div class="dictee-result ${isGood ? 'excellent' : isMedium ? 'good' : 'needs-work'}">
                <div class="accuracy-score">
                    ${Math.round(accuracy)}% de précision
                </div>
                
                <div class="text-analysis">
                    <div class="original-text">
                        <strong>Texte original :</strong><br>
                        ${dictee.text}
                    </div>
                    
                    <div class="word-analysis">
                        ${analysis.map(item => `
                            <span class="word-item ${item.status}">
                                ${item.status === 'missing' ? item.expected : item.word}
                                ${item.status === 'incorrect' ? `<small>(${item.expected})</small>` : ''}
                            </span>
                        `).join(' ')}
                    </div>
                </div>
                
                <div class="dictee-points">
                    <strong>Points d'attention :</strong>
                    ${dictee.points.map(point => `<li>${point}</li>`).join('')}
                </div>
            </div>
        `;
    }

    /**
     * UTILITAIRES ET HELPERS
     */
    getActivityTitle() {
        const titles = {
            'grammaire': '📝 Quiz Grammaire',
            'conjugaison': '🔄 Conjugaison',
            'vocabulaire': '📚 Vocabulaire',
            'dictee': '🎧 Dictée Interactive'
        };
        return titles[this.currentActivity.type] || 'Activité Français';
    }

    renderHeartsDisplay() {
        if (!this.heartSystem) return '';
        
        const hearts = this.heartSystem.heartsData.currentHearts;
        const maxHearts = this.heartSystem.heartsData.maxHearts || 5;
        
        let heartsHTML = '';
        for (let i = 0; i < maxHearts; i++) {
            heartsHTML += i < hearts ? '❤️' : '🤍';
        }
        return heartsHTML;
    }

    updateHeartsDisplay() {
        const heartsElements = document.querySelectorAll('.hearts-display');
        heartsElements.forEach(element => {
            element.innerHTML = this.renderHeartsDisplay();
        });
    }

    getEncouragementMessage(scorePercent) {
        if (scorePercent >= 90) {
            return "🌟 Excellent ! Tu maîtrises parfaitement !";
        } else if (scorePercent >= 70) {
            return "👍 Très bien ! Continue comme ça !";
        } else if (scorePercent >= 50) {
            return "💪 Pas mal ! Encore un petit effort !";
        } else {
            return "📚 N'abandonne pas ! Révise et recommence !";
        }
    }

    showMessage(message, type = 'info') {
        // Système de notification simple
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    /**
     * API PUBLIQUE POUR INTÉGRATION
     */
    retryQuiz() {
        if (this.currentActivity) {
            this.initializeActivityQuiz(this.currentActivity.type, this.currentActivity.config);
        }
    }

    quitQuiz() {
        if (confirm('Vraiment quitter ? Tu perdras ton progrès.')) {
            this.returnToActivities();
        }
    }

    forceQuitQuiz() {
        this.showMessage('😔 Plus de cœurs ! Quiz interrompu.', 'error');
        setTimeout(() => {
            this.returnToActivities();
        }, 2000);
    }

    returnToActivities() {
        this.currentActivity = null;
        
        // Restaurer interface activités
        const container = document.getElementById('quiz-container');
        container.innerHTML = `
            <button id="start-quiz-btn" class="main-quiz-btn" onclick="bindFrenchActivities()">
                🚀 Retour aux Activités
            </button>
        `;
        
        // Recharger la page si nécessaire
        if (typeof bindFrenchActivities === 'function') {
            bindFrenchActivities();
        }
    }

    skipDictee() {
        this.currentActivity.currentSentence++;
        this.startDictee();
    }

    finishDictee() {
        const accuracy = (this.currentActivity.correctWords / this.currentActivity.totalWords) * 100;
        const baseXP = this.currentActivity.config.xpReward || 30;
        
        // Attribution XP dictée
        let xpResult = null;
        if (this.xpManager) {
            xpResult = this.xpManager.addXP(baseXP, 'dictee_complete', {
                accuracy: accuracy,
                difficulty: this.currentActivity.config.difficulty
            });
        }

        // Affichage résultats dictée
        const container = document.getElementById('quiz-container');
        container.innerHTML = `
            <div class="dictee-results">
                <h2>🎧 Dictée Terminée !</h2>
                <div class="dictee-score">
                    ${this.currentActivity.correctWords}/${this.currentActivity.totalWords} mots corrects
                    <br>
                    ${Math.round(accuracy)}% de précision
                </div>
                ${xpResult ? `
                    <div class="xp-gained">
                        +${xpResult.xpGained} XP
                        ${xpResult.bonusDetails.join(' • ')}
                    </div>
                ` : ''}
                <button onclick="frenchActivities.returnToActivities()">
                    Retour aux activités
                </button>
            </div>
        `;
    }
}

// API de liaison pour les templates HTML
function bindFrenchActivities() {
    // Initialiser le système s'il n'existe pas
    if (!window.frenchActivities) {
        window.frenchActivities = new FrenchActivitiesSystem();
    }
    
    console.log('🔗 French Activities liées aux événements');
}

// Fonctions globales pour intégration HTML
function initializeActivityQuiz(type, config) {
    if (window.frenchActivities) {
        return window.frenchActivities.initializeActivityQuiz(type, config);
    } else {
        console.error('French Activities System non initialisé');
        return false;
    }
}

function initializeDicteeActivity(config) {
    if (window.frenchActivities) {
        return window.frenchActivities.initializeDicteeActivity(config);
    }
    return false;
}

function initializeVocabularyActivity(config) {
    // Version simplifiée vocabulaire
    return initializeActivityQuiz('vocabulaire', config);
}

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('francais-section')) {
        bindFrenchActivities();
    }
});