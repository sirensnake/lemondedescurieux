/**
 * English Activities System - Duolingo-inspired
 * Système d'apprentissage anglais gamifié pour Le Monde des Curieux
 * Intégration XP, Hearts, Streaks + fonctionnalités audio
 */

class EnglishActivitiesSystem {
    constructor() {
        this.currentLesson = null;
        this.currentActivity = null;
        this.lessonsDatabase = this.initializeLessonsDatabase();
        this.audioCache = new Map();
        
        // Références systèmes existants
        this.xpManager = window.xpManager;
        this.heartSystem = window.heartSystem;
        this.streakManager = window.streakManager;
        
        // Configuration audio
        this.speechSynthesis = window.speechSynthesis;
        this.speechRecognition = this.initializeSpeechRecognition();
        
        console.log('🇬🇧 English Activities System initialized');
    }

    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;
            return recognition;
        }
        return null;
    }

    initializeLessonsDatabase() {
        return {
            colors: {
                title: "🎨 Colors",
                difficulty: "easy",
                xpReward: 15,
                lessons: [
                    {
                        type: "vocabulary_intro",
                        words: [
                            { english: "red", french: "rouge", image: "🔴" },
                            { english: "blue", french: "bleu", image: "🔵" },
                            { english: "green", french: "vert", image: "🟢" },
                            { english: "yellow", french: "jaune", image: "🟡" },
                            { english: "orange", french: "orange", image: "🟠" },
                            { english: "purple", french: "violet", image: "🟣" },
                            { english: "black", french: "noir", image: "⚫" },
                            { english: "white", french: "blanc", image: "⚪" }
                        ]
                    },
                    {
                        type: "translation_quiz",
                        questions: [
                            {
                                question: "Comment dit-on 'rouge' en anglais ?",
                                options: ["red", "blue", "green", "yellow"],
                                correct: 0,
                                audio: "red"
                            },
                            {
                                question: "What color is this? 🔵",
                                options: ["rouge", "bleu", "vert", "jaune"],
                                correct: 1,
                                audio: "blue"
                            },
                            {
                                question: "Complete: The grass is ___",
                                options: ["red", "blue", "green", "yellow"],
                                correct: 2,
                                audio: "green"
                            }
                        ]
                    },
                    {
                        type: "listening_practice",
                        exercises: [
                            { word: "red", alternatives: ["red", "read", "bread"] },
                            { word: "blue", alternatives: ["blue", "blow", "blew"] },
                            { word: "green", alternatives: ["green", "grain", "grin"] }
                        ]
                    }
                ]
            },

            numbers: {
                title: "🔢 Numbers",
                difficulty: "easy", 
                xpReward: 15,
                lessons: [
                    {
                        type: "vocabulary_intro",
                        words: [
                            { english: "one", french: "un", number: 1 },
                            { english: "two", french: "deux", number: 2 },
                            { english: "three", french: "trois", number: 3 },
                            { english: "four", french: "quatre", number: 4 },
                            { english: "five", français: "cinq", number: 5 },
                            { english: "six", french: "six", number: 6 },
                            { english: "seven", french: "sept", number: 7 },
                            { english: "eight", french: "huit", number: 8 },
                            { english: "nine", french: "neuf", number: 9 },
                            { english: "ten", french: "dix", number: 10 }
                        ]
                    },
                    {
                        type: "number_matching",
                        questions: [
                            { question: "Match the number: 3", options: ["three", "tree", "free", "throw"], correct: 0 },
                            { question: "How many? 🍎🍎🍎🍎🍎", options: ["four", "five", "six", "seven"], correct: 1 },
                            { question: "What comes after 'eight'?", options: ["seven", "nine", "ten", "six"], correct: 1 }
                        ]
                    }
                ]
            },

            family_members: {
                title: "👨‍👩‍👧‍👦 Family Members",
                difficulty: "medium",
                xpReward: 20,
                lessons: [
                    {
                        type: "vocabulary_intro",
                        words: [
                            { english: "mother", french: "mère", image: "👩" },
                            { english: "father", french: "père", image: "👨" },
                            { english: "sister", french: "sœur", image: "👧" },
                            { english: "brother", french: "frère", image: "👦" },
                            { english: "grandmother", french: "grand-mère", image: "👵" },
                            { english: "grandfather", french: "grand-père", image: "👴" },
                            { english: "baby", french: "bébé", image: "👶" },
                            { english: "family", french: "famille", image: "👨‍👩‍👧‍👦" }
                        ]
                    },
                    {
                        type: "sentence_building",
                        exercises: [
                            {
                                prompt: "Build: 'This is my mother'",
                                words: ["This", "is", "my", "mother", "father", "sister"],
                                correct: ["This", "is", "my", "mother"]
                            },
                            {
                                prompt: "Build: 'I love my family'",
                                words: ["I", "love", "my", "family", "house", "cat"],
                                correct: ["I", "love", "my", "family"]
                            }
                        ]
                    }
                ]
            },

            animals: {
                title: "🐾 Animals",
                difficulty: "medium",
                xpReward: 18,
                lessons: [
                    {
                        type: "vocabulary_intro",
                        words: [
                            { english: "cat", french: "chat", image: "🐱" },
                            { english: "dog", french: "chien", image: "🐶" },
                            { english: "bird", french: "oiseau", image: "🐦" },
                            { english: "fish", french: "poisson", image: "🐠" },
                            { english: "elephant", french: "éléphant", image: "🐘" },
                            { english: "lion", french: "lion", image: "🦁" },
                            { english: "rabbit", french: "lapin", image: "🐰" },
                            { english: "bear", french: "ours", image: "🐻" }
                        ]
                    }
                ]
            }
        };
    }

    /**
     * INITIALISATION LEÇON ANGLAISE
     */
    initializeEnglishLesson(lessonType, config) {
        // Vérification cœurs
        if (this.heartSystem && this.heartSystem.heartsData.currentHearts < 1) {
            this.showNotification('😔 No hearts left! Wait for regeneration.', 'error');
            return false;
        }

        const lessonData = this.lessonsDatabase[lessonType];
        if (!lessonData) {
            this.showNotification(`Lesson '${lessonType}' not found.`, 'error');
            return false;
        }

        this.currentLesson = {
            type: lessonType,
            data: lessonData,
            config: config,
            currentStep: 0,
            score: 0,
            errors: 0,
            startTime: Date.now(),
            responses: []
        };

        // Initialiser interface leçon
        this.renderLessonInterface();
        this.startLessonStep();

        return true;
    }

    renderLessonInterface() {
        // Récupérer container principal
        const container = document.getElementById('quiz-container') || 
                          document.getElementById('english-activity-container') ||
                          this.createActivityContainer();

        container.innerHTML = `
            <div class="english-lesson-interface">
                <div class="lesson-header">
                    <div class="lesson-info">
                        <h3>${this.currentLesson.data.title}</h3>
                        <div class="lesson-progress-bar">
                            <div class="progress-fill" id="lesson-progress"></div>
                        </div>
                    </div>
                    <div class="lesson-stats">
                        <div class="hearts-display" id="hearts-lesson">
                            ${this.renderHeartsDisplay()}
                        </div>
                        <div class="xp-preview">
                            <span class="xp-icon">⭐</span>
                            <span id="xp-preview">${this.currentLesson.data.xpReward} XP</span>
                        </div>
                    </div>
                </div>
                
                <div class="lesson-content" id="lesson-content">
                    <!-- Contenu leçon apparaîtra ici -->
                </div>
                
                <div class="lesson-actions">
                    <button id="quit-lesson-btn" class="quit-btn" onclick="englishActivities.quitLesson()">
                        Quit
                    </button>
                    <button id="hint-btn" class="hint-btn" onclick="englishActivities.showHint()" style="display:none;">
                        💡 Hint
                    </button>
                </div>
            </div>
        `;
    }

    createActivityContainer() {
        const container = document.createElement('div');
        container.id = 'english-activity-container';
        container.className = 'activity-container';
        
        // Insérer dans la page
        const mainContent = document.querySelector('.english-content') || 
                           document.querySelector('main') || 
                           document.body;
        mainContent.appendChild(container);
        
        return container;
    }

    startLessonStep() {
        const lesson = this.currentLesson.data.lessons[this.currentLesson.currentStep];
        if (!lesson) {
            this.finishLesson();
            return;
        }

        // Mise à jour progress bar
        const progressPercent = (this.currentLesson.currentStep / this.currentLesson.data.lessons.length) * 100;
        document.getElementById('lesson-progress').style.width = `${progressPercent}%`;

        // Afficher étape selon le type
        switch (lesson.type) {
            case 'vocabulary_intro':
                this.renderVocabularyIntro(lesson);
                break;
            case 'translation_quiz':
                this.renderTranslationQuiz(lesson);
                break;
            case 'listening_practice':
                this.renderListeningPractice(lesson);
                break;
            case 'number_matching':
                this.renderNumberMatching(lesson);
                break;
            case 'sentence_building':
                this.renderSentenceBuilding(lesson);
                break;
            default:
                console.error('Unknown lesson type:', lesson.type);
        }
    }

    /**
     * TYPES DE LEÇONS
     */
    renderVocabularyIntro(lesson) {
        const content = document.getElementById('lesson-content');
        const words = lesson.words;
        let currentWordIndex = 0;

        function showWord(index) {
            if (index >= words.length) {
                // Fin des mots, passer à l'étape suivante
                setTimeout(() => {
                    window.englishActivities.nextLessonStep();
                }, 1000);
                return;
            }

            const word = words[index];
            content.innerHTML = `
                <div class="vocabulary-intro">
                    <div class="word-display">
                        <div class="word-visual">
                            ${word.image || word.number || '📝'}
                        </div>
                        <div class="word-english">
                            <span class="english-word">${word.english}</span>
                            <button class="audio-btn" onclick="englishActivities.playAudio('${word.english}')">
                                🔊
                            </button>
                        </div>
                        <div class="word-french">
                            ${word.french}
                        </div>
                    </div>
                    
                    <div class="vocab-actions">
                        <button class="continue-btn" onclick="nextWord()">
                            Continue
                        </button>
                    </div>
                    
                    <div class="word-counter">
                        ${index + 1} / ${words.length}
                    </div>
                </div>
            `;

            // Fonction locale pour mot suivant
            window.nextWord = () => {
                currentWordIndex++;
                showWord(currentWordIndex);
            };

            // Auto-play audio
            setTimeout(() => {
                window.englishActivities.playAudio(word.english);
            }, 500);
        }

        showWord(0);
    }

    renderTranslationQuiz(lesson) {
        const content = document.getElementById('lesson-content');
        const questions = lesson.questions;
        let currentQuestionIndex = 0;

        this.currentQuizData = {
            questions: questions,
            currentIndex: 0,
            score: 0
        };

        this.showQuizQuestion();
    }

    showQuizQuestion() {
        const questions = this.currentQuizData.questions;
        const question = questions[this.currentQuizData.currentIndex];
        
        if (!question) {
            this.nextLessonStep();
            return;
        }

        const content = document.getElementById('lesson-content');
        content.innerHTML = `
            <div class="translation-quiz">
                <div class="question-header">
                    <span class="question-counter">
                        ${this.currentQuizData.currentIndex + 1} / ${questions.length}
                    </span>
                    ${question.audio ? `
                        <button class="audio-question-btn" onclick="englishActivities.playAudio('${question.audio}')">
                            🔊
                        </button>
                    ` : ''}
                </div>
                
                <div class="question-text">
                    ${question.question}
                </div>
                
                <div class="answer-options" id="quiz-options">
                    ${question.options.map((option, index) => `
                        <button class="quiz-option" onclick="englishActivities.selectQuizAnswer(${index})">
                            ${option}
                        </button>
                    `).join('')}
                </div>
                
                <div class="quiz-feedback" id="quiz-feedback" style="display:none;">
                    <!-- Feedback apparaîtra ici -->
                </div>
            </div>
        `;

        // Auto-play audio si disponible
        if (question.audio) {
            setTimeout(() => {
                this.playAudio(question.audio);
            }, 800);
        }
    }

    selectQuizAnswer(selectedIndex) {
        const question = this.currentQuizData.questions[this.currentQuizData.currentIndex];
        const isCorrect = selectedIndex === question.correct;

        // Enregistrer réponse
        this.currentLesson.responses.push({
            question: question.question,
            selected: selectedIndex,
            correct: question.correct,
            isCorrect: isCorrect
        });

        // Traitement réponse
        if (isCorrect) {
            this.currentQuizData.score++;
            this.currentLesson.score++;
            this.showQuizFeedback(true, "Great! Well done! 🎉");
        } else {
            this.currentLesson.errors++;
            this.processIncorrectAnswer();
            this.showQuizFeedback(false, `Correct answer: ${question.options[question.correct]}`);
        }

        // Question suivante après délai
        setTimeout(() => {
            this.currentQuizData.currentIndex++;
            this.showQuizQuestion();
        }, 2000);
    }

    renderListeningPractice(lesson) {
        const content = document.getElementById('lesson-content');
        const exercises = lesson.exercises;
        let currentExerciseIndex = 0;

        function showExercise(index) {
            if (index >= exercises.length) {
                window.englishActivities.nextLessonStep();
                return;
            }

            const exercise = exercises[index];
            content.innerHTML = `
                <div class="listening-practice">
                    <div class="listening-instructions">
                        🎧 Listen carefully and choose what you hear
                    </div>
                    
                    <div class="audio-player">
                        <button class="big-audio-btn" onclick="englishActivities.playAudio('${exercise.word}')">
                            🔊 Play Audio
                        </button>
                    </div>
                    
                    <div class="listening-options">
                        ${exercise.alternatives.map((alt, i) => `
                            <button class="listening-option" onclick="selectListeningAnswer(${i}, '${exercise.word}', '${alt}')">
                                ${alt}
                            </button>
                        `).join('')}
                    </div>
                    
                    <div class="exercise-counter">
                        ${index + 1} / ${exercises.length}
                    </div>
                </div>
            `;

            window.selectListeningAnswer = (selectedIndex, correctWord, selectedWord) => {
                const isCorrect = selectedWord === correctWord;
                
                if (isCorrect) {
                    window.englishActivities.showQuizFeedback(true, "Perfect! You heard correctly! 👂");
                    window.englishActivities.currentLesson.score++;
                } else {
                    window.englishActivities.showQuizFeedback(false, `The correct word was: ${correctWord}`);
                    window.englishActivities.currentLesson.errors++;
                    window.englishActivities.processIncorrectAnswer();
                }

                setTimeout(() => {
                    currentExerciseIndex++;
                    showExercise(currentExerciseIndex);
                }, 2000);
            };

            // Auto-play audio au début
            setTimeout(() => {
                window.englishActivities.playAudio(exercise.word);
            }, 500);
        }

        showExercise(0);
    }

    renderNumberMatching(lesson) {
        // Similaire à translation_quiz mais adapté aux nombres
        this.renderTranslationQuiz(lesson);
    }

    renderSentenceBuilding(lesson) {
        const content = document.getElementById('lesson-content');
        const exercises = lesson.exercises;
        let currentExerciseIndex = 0;

        function showExercise(index) {
            if (index >= exercises.length) {
                window.englishActivities.nextLessonStep();
                return;
            }

            const exercise = exercises[index];
            let selectedWords = [];

            content.innerHTML = `
                <div class="sentence-building">
                    <div class="building-prompt">
                        ${exercise.prompt}
                    </div>
                    
                    <div class="sentence-area" id="sentence-area">
                        <div class="built-sentence" id="built-sentence">
                            <!-- Mots sélectionnés apparaîtront ici -->
                        </div>
                    </div>
                    
                    <div class="word-bank">
                        ${exercise.words.map((word, i) => `
                            <button class="word-chip" data-word="${word}" onclick="addWordToSentence('${word}', ${i})">
                                ${word}
                            </button>
                        `).join('')}
                    </div>
                    
                    <div class="building-actions">
                        <button class="clear-btn" onclick="clearSentence()">
                            🗑️ Clear
                        </button>
                        <button class="check-sentence-btn" onclick="checkSentence()">
                            ✓ Check
                        </button>
                    </div>
                </div>
            `;

            window.addWordToSentence = (word, index) => {
                selectedWords.push(word);
                updateBuiltSentence();
                
                // Désactiver le bouton utilisé
                const buttons = document.querySelectorAll('.word-chip');
                buttons[index].disabled = true;
                buttons[index].style.opacity = '0.5';
            };

            window.clearSentence = () => {
                selectedWords = [];
                updateBuiltSentence();
                
                // Réactiver tous les boutons
                const buttons = document.querySelectorAll('.word-chip');
                buttons.forEach(btn => {
                    btn.disabled = false;
                    btn.style.opacity = '1';
                });
            };

            window.updateBuiltSentence = () => {
                document.getElementById('built-sentence').textContent = selectedWords.join(' ');
            };

            window.checkSentence = () => {
                const userSentence = selectedWords.join(' ');
                const correctSentence = exercise.correct.join(' ');
                const isCorrect = userSentence === correctSentence;

                if (isCorrect) {
                    window.englishActivities.showQuizFeedback(true, "Perfect sentence! 🎯");
                    window.englishActivities.currentLesson.score++;
                } else {
                    window.englishActivities.showQuizFeedback(false, `Correct: ${correctSentence}`);
                    window.englishActivities.currentLesson.errors++;
                    window.englishActivities.processIncorrectAnswer();
                }

                setTimeout(() => {
                    currentExerciseIndex++;
                    showExercise(currentExerciseIndex);
                }, 3000);
            };
        }

        showExercise(0);
    }

    /**
     * AUDIO ET SPEECH
     */
    playAudio(text) {
        if (this.speechSynthesis) {
            // Arrêter lecture en cours
            this.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            
            // Essayer d'utiliser une voix native anglaise
            const voices = this.speechSynthesis.getVoices();
            const englishVoice = voices.find(voice => 
                voice.lang.startsWith('en') && voice.name.includes('Google')
            ) || voices.find(voice => voice.lang.startsWith('en'));
            
            if (englishVoice) {
                utterance.voice = englishVoice;
            }
            
            this.speechSynthesis.speak(utterance);
        } else {
            console.warn('Speech synthesis not supported');
        }
    }

    /**
     * AUDIO PRACTICE ACTIVITÉ
     */
    initializeAudioActivity(type, config) {
        if (this.heartSystem && this.heartSystem.heartsData.currentHearts < 1) {
            this.showNotification('😔 No hearts left!', 'error');
            return false;
        }

        this.currentActivity = {
            type: `audio_${type}`,
            config: config,
            startTime: Date.now(),
            score: 0,
            exercises: this.getAudioExercises(type)
        };

        this.renderAudioInterface(type);
        return true;
    }

    getAudioExercises(type) {
        const exercises = {
            pronunciation: [
                { word: "cat", phonetic: "/kæt/", difficulty: "easy" },
                { word: "bird", phonetic: "/bɜːrd/", difficulty: "medium" },
                { word: "elephant", phonetic: "/ˈelɪfənt/", difficulty: "hard" }
            ],
            listening: [
                { 
                    story: "The cat is sleeping on the chair.",
                    questions: [
                        { q: "Where is the cat?", options: ["bed", "chair", "table"], correct: 1 }
                    ]
                }
            ]
        };

        return exercises[type] || [];
    }

    renderAudioInterface(type) {
        const container = this.createActivityContainer();
        
        if (type === 'pronunciation') {
            this.renderPronunciationPractice(container);
        } else if (type === 'listening') {
            this.renderListeningComprehension(container);
        }
    }

    renderPronunciationPractice(container) {
        // Interface practice prononciation avec Web Speech API
        container.innerHTML = `
            <div class="pronunciation-practice">
                <h3>🗣️ Pronunciation Practice</h3>
                
                <div class="word-to-practice" id="practice-word">
                    <!-- Mot à prononcer -->
                </div>
                
                <div class="pronunciation-controls">
                    <button class="listen-btn" onclick="englishActivities.playCurrentWord()">
                        🔊 Listen
                    </button>
                    <button class="record-btn" onclick="englishActivities.startRecording()">
                        🎤 Record
                    </button>
                </div>
                
                <div class="pronunciation-feedback" id="pronunciation-feedback">
                    <!-- Feedback prononciation -->
                </div>
            </div>
        `;

        this.startPronunciationExercise();
    }

    /**
     * GESTION PROGRESSION ET FEEDBACK
     */
    processIncorrectAnswer() {
        if (this.heartSystem) {
            const heartsLeft = this.heartSystem.loseHeart();
            this.updateHeartsDisplay();
            
            if (heartsLeft === 0) {
                setTimeout(() => {
                    this.forceQuitLesson();
                }, 1000);
            }
        }
    }

    showQuizFeedback(isCorrect, message) {
        const feedbackElement = document.getElementById('quiz-feedback') || 
                               document.getElementById('lesson-feedback') ||
                               this.createFeedbackElement();
        
        feedbackElement.style.display = 'block';
        feedbackElement.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        feedbackElement.innerHTML = `
            <div class="feedback-content">
                <span class="feedback-icon">${isCorrect ? '✅' : '❌'}</span>
                <span class="feedback-message">${message}</span>
            </div>
        `;

        // Animation feedback
        feedbackElement.classList.add('fade-in');
    }

    createFeedbackElement() {
        const feedback = document.createElement('div');
        feedback.id = 'lesson-feedback';
        feedback.className = 'quiz-feedback';
        
        const content = document.getElementById('lesson-content');
        content.appendChild(feedback);
        
        return feedback;
    }

    nextLessonStep() {
        this.currentLesson.currentStep++;
        this.startLessonStep();
    }

    finishLesson() {
        const endTime = Date.now();
        const totalTime = endTime - this.currentLesson.startTime;
        const scorePercent = (this.currentLesson.score / (this.currentLesson.score + this.currentLesson.errors)) * 100;
        const isPerfect = this.currentLesson.errors === 0;

        // Attribution XP
        let xpResult = null;
        if (this.xpManager) {
            xpResult = this.xpManager.addXP(
                this.currentLesson.data.xpReward,
                `english_${this.currentLesson.type}`,
                {
                    perfect: isPerfect,
                    difficulty: this.currentLesson.data.difficulty,
                    scorePercent: scorePercent
                }
            );
        }

        // Affichage résultats
        this.showLessonResults({
            title: this.currentLesson.data.title,
            score: this.currentLesson.score,
            errors: this.currentLesson.errors,
            isPerfect: isPerfect,
            totalTime: totalTime,
            xpResult: xpResult
        });

        // Mise à jour streak
        if (scorePercent >= 60 && this.streakManager) {
            this.streakManager.recordActivity();
        }
    }

    showLessonResults(results) {
        const container = document.getElementById('lesson-content') || 
                          document.getElementById('english-activity-container');
        
        container.innerHTML = `
            <div class="lesson-results">
                <div class="results-header">
                    <h2>🎉 Lesson Complete!</h2>
                    <div class="lesson-title">${results.title}</div>
                    ${results.isPerfect ? 
                        '<div class="perfect-badge">⭐ PERFECT! ⭐</div>' : 
                        `<div class="lesson-score">${results.score} correct, ${results.errors} errors</div>`
                    }
                </div>
                
                ${results.xpResult ? `
                    <div class="xp-gained">
                        <div class="xp-amount">+${results.xpResult.xpGained} XP</div>
                        ${results.xpResult.bonusDetails.length > 0 ? 
                            `<div class="xp-bonuses">${results.xpResult.bonusDetails.join(' • ')}</div>` : ''
                        }
                        ${results.xpResult.levelUp ? 
                            `<div class="level-up-notice">🎊 LEVEL ${results.xpResult.levelUp.newLevel}!</div>` : ''
                        }
                    </div>
                ` : ''}
                
                <div class="results-actions">
                    <button class="retry-btn" onclick="englishActivities.retryLesson()">
                        🔄 Try Again
                    </button>
                    <button class="continue-btn" onclick="englishActivities.returnToLessons()">
                        ➡️ More Lessons
                    </button>
                </div>
                
                <div class="encouragement">
                    ${this.getEncouragementMessage(results.isPerfect, results.errors)}
                </div>
            </div>
        `;
    }

    /**
     * UTILITAIRES
     */
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

    getEncouragementMessage(isPerfect, errors) {
        if (isPerfect) {
            return "🌟 Amazing! Your English is getting better every day!";
        } else if (errors <= 2) {
            return "👍 Great job! Keep practicing!";
        } else {
            return "💪 Don't give up! Practice makes perfect!";
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    /**
     * API PUBLIQUE
     */
    retryLesson() {
        if (this.currentLesson) {
            this.initializeEnglishLesson(this.currentLesson.type, this.currentLesson.config);
        }
    }

    quitLesson() {
        if (confirm('Really quit? You\'ll lose your progress.')) {
            this.returnToLessons();
        }
    }

    forceQuitLesson() {
        this.showNotification('😔 No hearts left! Lesson ended.', 'error');
        setTimeout(() => {
            this.returnToLessons();
        }, 2000);
    }

    returnToLessons() {
        this.currentLesson = null;
        this.currentActivity = null;
        
        // Retour interface principale
        const container = document.getElementById('english-activity-container');
        if (container) {
            container.remove();
        }
        
        // Recharger si fonction disponible
        if (typeof bindEnglishActivities === 'function') {
            bindEnglishActivities();
        }
    }

    showHint() {
        // Système d'indices contextuels
        this.showNotification('💡 Listen carefully to the pronunciation!', 'info');
    }
}

// API de liaison globale
function bindEnglishActivities() {
    if (!window.englishActivities) {
        window.englishActivities = new EnglishActivitiesSystem();
    }
    
    console.log('🔗 English Activities bound to events');
}

// Fonctions globales pour intégration HTML
function initializeEnglishLesson(type, config) {
    if (window.englishActivities) {
        return window.englishActivities.initializeEnglishLesson(type, config);
    }
    return false;
}

function initializeAudioActivity(type, config) {
    if (window.englishActivities) {
        return window.englishActivities.initializeAudioActivity(type, config);
    }
    return false;
}

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('english-section')) {
        bindEnglishActivities();
    }
});