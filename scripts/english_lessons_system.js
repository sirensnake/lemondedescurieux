// english_lessons_system.js - Système de leçons English style Duolingo
class EnglishLessonsSystem {
    constructor() {
        this.lessons = {
            colors: {
                id: 'colors',
                title: '🎨 Colors',
                xp: 15,
                unlocked: true,
                words: [
                    { english: 'red', french: 'rouge', pronunciation: '/rɛd/' },
                    { english: 'blue', french: 'bleu', pronunciation: '/bluː/' },
                    { english: 'green', french: 'vert', pronunciation: '/ɡriːn/' },
                    { english: 'yellow', french: 'jaune', pronunciation: '/ˈjɛloʊ/' },
                    { english: 'black', french: 'noir', pronunciation: '/blæk/' },
                    { english: 'white', french: 'blanc', pronunciation: '/waɪt/' },
                    { english: 'pink', french: 'rose', pronunciation: '/pɪŋk/' },
                    { english: 'orange', french: 'orange', pronunciation: '/ˈɔːrɪndʒ/' }
                ]
            },
            numbers: {
                id: 'numbers',
                title: '🔢 Numbers',
                xp: 15,
                unlocked: true,
                words: [
                    { english: 'one', french: 'un', pronunciation: '/wʌn/' },
                    { english: 'two', french: 'deux', pronunciation: '/tuː/' },
                    { english: 'three', french: 'trois', pronunciation: '/θriː/' },
                    { english: 'four', french: 'quatre', pronunciation: '/fɔːr/' },
                    { english: 'five', french: 'cinq', pronunciation: '/faɪv/' },
                    { english: 'six', french: 'six', pronunciation: '/sɪks/' },
                    { english: 'seven', french: 'sept', pronunciation: '/ˈsɛvən/' },
                    { english: 'eight', french: 'huit', pronunciation: '/eɪt/' },
                    { english: 'nine', french: 'neuf', pronunciation: '/naɪn/' },
                    { english: 'ten', french: 'dix', pronunciation: '/tɛn/' }
                ]
            },
            family_members: {
                id: 'family_members',
                title: '👨‍👩‍👧 Family Members',
                xp: 20,
                unlocked: true,
                words: [
                    { english: 'mother', french: 'mère', pronunciation: '/ˈmʌðər/' },
                    { english: 'father', french: 'père', pronunciation: '/ˈfɑːðər/' },
                    { english: 'sister', french: 'sœur', pronunciation: '/ˈsɪstər/' },
                    { english: 'brother', french: 'frère', pronunciation: '/ˈbrʌðər/' },
                    { english: 'grandmother', french: 'grand-mère', pronunciation: '/ˈɡrændˌmʌðər/' },
                    { english: 'grandfather', french: 'grand-père', pronunciation: '/ˈɡrændˌfɑːðər/' },
                    { english: 'daughter', french: 'fille', pronunciation: '/ˈdɔːtər/' },
                    { english: 'son', french: 'fils', pronunciation: '/sʌn/' }
                ]
            }
        };
        
        this.currentLesson = null;
        this.currentExercise = 0;
        this.exercises = [];
        this.score = 0;
        this.container = null;
    }
    
    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Container non trouvé:', containerId);
            return;
        }
    }
    
    startLesson(lessonId) {
        this.currentLesson = this.lessons[lessonId];
        if (!this.currentLesson) {
            console.error('Leçon non trouvée:', lessonId);
            return;
        }
        
        this.generateExercises();
        this.currentExercise = 0;
        this.score = 0;
        this.showExercise();
    }
    
    generateExercises() {
        const words = this.currentLesson.words;
        this.exercises = [];
        
        // Types d'exercices variés
        words.forEach(word => {
            // Exercice 1: Traduction français → anglais
            this.exercises.push({
                type: 'translate_to_english',
                word: word,
                question: `Comment dit-on "${word.french}" en anglais ?`,
                correct: word.english,
                options: this.generateOptions(word.english, 'english')
            });
            
            // Exercice 2: Traduction anglais → français
            this.exercises.push({
                type: 'translate_to_french',
                word: word,
                question: `What does "${word.english}" mean in French?`,
                correct: word.french,
                options: this.generateOptions(word.french, 'french')
            });
        });
        
        // Mélanger les exercices
        this.exercises = this.shuffleArray(this.exercises);
        
        // Limiter à 12 exercices pour ne pas trop long
        this.exercises = this.exercises.slice(0, 12);
    }
    
    generateOptions(correct, language) {
        const allWords = Object.values(this.lessons)
            .flatMap(lesson => lesson.words)
            .map(word => word[language])
            .filter(word => word !== correct);
            
        const wrongOptions = this.shuffleArray(allWords).slice(0, 3);
        const options = [correct, ...wrongOptions];
        return this.shuffleArray(options);
    }
    
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    showExercise() {
        const exercise = this.exercises[this.currentExercise];
        const progress = ((this.currentExercise + 1) / this.exercises.length) * 100;
        
        this.container.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 700px; margin: 0 auto;">
                <!-- Header avec progress -->
                <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 2rem;">
                    <h2 style="color: #1976d2; margin: 0; font-family: 'Press Start 2P', monospace; font-size: 14px;">
                        ${this.currentLesson.title}
                    </h2>
                    <span style="color: #666; font-family: 'Press Start 2P', monospace; font-size: 10px;">
                        ${this.currentExercise + 1}/${this.exercises.length}
                    </span>
                </div>
                
                <!-- Progress bar -->
                <div style="background: #e0e0e0; border-radius: 10px; margin-bottom: 2rem; height: 8px;">
                    <div style="background: linear-gradient(135deg, #2196f3, #64b5f6); height: 100%; border-radius: 10px; width: ${progress}%; transition: width 0.3s;"></div>
                </div>
                
                <!-- Exercise content -->
                <div style="text-align: center; margin-bottom: 2rem;">
                    ${this.renderExerciseContent(exercise)}
                </div>
                
                <!-- Hearts display -->
                <div style="text-align: center; margin-top: 2rem; color: #1976d2; font-family: 'Press Start 2P', monospace; font-size: 10px;">
                    Score: ${this.score}/${this.currentExercise} | 💖 Hearts: ${window.heartSystem ? window.heartSystem.heartsData.currentHearts : 5}
                </div>
            </div>
        `;
        
        // Audio auto-play si disponible
        if (exercise.word && this.currentExercise === 0) {
            this.speakWord(exercise.word.english);
        }
    }
    
    renderExerciseContent(exercise) {
        switch(exercise.type) {
            case 'translate_to_english':
                return `
                    <div style="margin-bottom: 2rem;">
                        <div style="font-size: 2rem; margin-bottom: 1rem;">🇫🇷 → 🇬🇧</div>
                        <h3 style="color: #1976d2; margin-bottom: 2rem; font-size: 20px;">
                            ${exercise.question}
                        </h3>
                        
                        <!-- Audio button -->
                        <button onclick="englishLessons.speakWord('${exercise.word.english}')" style="
                            background: #4caf50;
                            color: white;
                            border: none;
                            padding: 0.5rem 1rem;
                            border-radius: 6px;
                            cursor: pointer;
                            margin-bottom: 2rem;
                            font-size: 12px;
                        ">
                            🔊 Listen
                        </button>
                        
                        <div style="display: grid; gap: 1rem;">
                            ${exercise.options.map((option, index) => `
                                <button onclick="englishLessons.selectAnswer('${option}')" style="
                                    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                                    border: 2px solid #dee2e6;
                                    padding: 1rem;
                                    border-radius: 8px;
                                    cursor: pointer;
                                    text-align: left;
                                    font-size: 16px;
                                    transition: all 0.3s;
                                " onmouseover="this.style.transform='translateY(-2px)'; this.style.borderColor='#2196f3';" 
                                   onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='#dee2e6';">
                                    ${option}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `;
                
            case 'translate_to_french':
                return `
                    <div style="margin-bottom: 2rem;">
                        <div style="font-size: 2rem; margin-bottom: 1rem;">🇬🇧 → 🇫🇷</div>
                        <h3 style="color: #1976d2; margin-bottom: 1rem; font-size: 20px;">
                            ${exercise.question}
                        </h3>
                        
                        <!-- Pronunciation -->
                        <div style="background: #e3f2fd; padding: 1rem; border-radius: 8px; margin-bottom: 2rem;">
                            <p style="margin: 0; color: #1976d2; font-style: italic;">
                                Pronunciation: ${exercise.word.pronunciation}
                            </p>
                            <button onclick="englishLessons.speakWord('${exercise.word.english}')" style="
                                background: #2196f3;
                                color: white;
                                border: none;
                                padding: 0.5rem 1rem;
                                border-radius: 6px;
                                cursor: pointer;
                                margin-top: 0.5rem;
                                font-size: 12px;
                            ">
                                🔊 Listen to pronunciation
                            </button>
                        </div>
                        
                        <div style="display: grid; gap: 1rem;">
                            ${exercise.options.map((option, index) => `
                                <button onclick="englishLessons.selectAnswer('${option}')" style="
                                    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                                    border: 2px solid #dee2e6;
                                    padding: 1rem;
                                    border-radius: 8px;
                                    cursor: pointer;
                                    text-align: left;
                                    font-size: 16px;
                                    transition: all 0.3s;
                                " onmouseover="this.style.transform='translateY(-2px)'; this.style.borderColor='#2196f3';" 
                                   onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='#dee2e6';">
                                    ${option}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `;
        }
    }
    
    selectAnswer(answer) {
        const exercise = this.exercises[this.currentExercise];
        const isCorrect = answer === exercise.correct;
        
        if (isCorrect) {
            this.score++;
        } else {
            // Perdre un cœur
            if (window.heartSystem) {
                window.heartSystem.loseHeart();
            }
        }
        
        this.showFeedback(answer, isCorrect, exercise);
    }
    
    showFeedback(userAnswer, isCorrect, exercise) {
        this.container.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 700px; margin: 0 auto; text-align: center;">
                <!-- Feedback icon -->
                <div style="font-size: 4rem; margin-bottom: 1rem;">
                    ${isCorrect ? '🎉' : '😔'}
                </div>
                
                <h3 style="color: ${isCorrect ? '#4caf50' : '#e76f51'}; margin-bottom: 2rem; font-family: 'Press Start 2P', monospace; font-size: 16px;">
                    ${isCorrect ? 'Great job!' : 'Not quite...'}
                </h3>
                
                <!-- Word card -->
                <div style="background: #e3f2fd; padding: 2rem; border-radius: 12px; margin-bottom: 2rem;">
                    <div style="display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div style="text-align: center;">
                            <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🇬🇧</div>
                            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1976d2;">
                                ${exercise.word.english}
                            </p>
                        </div>
                        <div style="font-size: 2rem;">⟷</div>
                        <div style="text-align: center;">
                            <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🇫🇷</div>
                            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1976d2;">
                                ${exercise.word.french}
                            </p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 1rem;">
                        <p style="margin: 0; color: #666; font-style: italic;">
                            ${exercise.word.pronunciation}
                        </p>
                        <button onclick="englishLessons.speakWord('${exercise.word.english}')" style="
                            background: #2196f3;
                            color: white;
                            border: none;
                            padding: 0.5rem 1rem;
                            border-radius: 6px;
                            cursor: pointer;
                            margin-top: 0.5rem;
                        ">
                            🔊 Listen again
                        </button>
                    </div>
                </div>
                
                ${!isCorrect ? `
                    <div style="background: #ffebee; padding: 1rem; border-radius: 8px; margin-bottom: 2rem;">
                        <p style="margin: 0; color: #c62828;">
                            <strong>Your answer:</strong> ${userAnswer}<br>
                            <strong>Correct answer:</strong> ${exercise.correct}
                        </p>
                    </div>
                ` : ''}
                
                <!-- XP reward -->
                <div style="background: linear-gradient(135deg, #4caf50, #81c784); padding: 1rem; border-radius: 8px; margin-bottom: 2rem; color: white;">
                    <p style="margin: 0; font-family: 'Press Start 2P', monospace; font-size: 12px;">
                        ${isCorrect ? '+10 XP earned!' : '+5 XP for trying!'}
                    </p>
                </div>
                
                <!-- Continue button -->
                <button onclick="englishLessons.nextExercise()" style="
                    background: linear-gradient(135deg, #2196f3, #1976d2);
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-family: 'Press Start 2P', monospace;
                    font-size: 12px;
                ">
                    ${this.currentExercise < this.exercises.length - 1 ? '➤ Continue' : '🏆 Finish lesson'}
                </button>
            </div>
        `;
        
        // Add XP
        if (window.xpManager) {
            window.xpManager.addXP(isCorrect ? 10 : 5, `english_${this.currentLesson.id}`);
        }
        
        // Speak correct answer
        this.speakWord(exercise.word.english);
    }
    
    nextExercise() {
        this.currentExercise++;
        
        if (this.currentExercise < this.exercises.length) {
            this.showExercise();
        } else {
            this.showLessonResults();
        }
    }
    
    showLessonResults() {
        const percentage = Math.round((this.score / this.exercises.length) * 100);
        const level = this.getLevel(percentage);
        const totalXP = this.currentLesson.xp + (this.score * 10) + ((this.exercises.length - this.score) * 5);
        
        this.container.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 700px; margin: 0 auto; text-align: center;">
                <h2 style="color: #1976d2; margin-bottom: 2rem; font-family: 'Press Start 2P', monospace; font-size: 18px;">
                    🏆 Lesson Complete!
                </h2>
                
                <!-- Lesson info -->
                <div style="background: linear-gradient(135deg, #2196f3, #64b5f6); padding: 2rem; border-radius: 12px; margin-bottom: 2rem; color: white;">
                    <h3 style="margin: 0.5rem 0; font-family: 'Press Start 2P', monospace;">
                        ${this.currentLesson.title}
                    </h3>
                    <div style="font-size: 3rem; margin: 1rem 0;">${level.emoji}</div>
                    <p style="margin: 0; font-size: 18px;">${this.score}/${this.exercises.length} correct</p>
                    <p style="margin: 0.5rem 0;">${percentage}% accuracy</p>
                </div>
                
                <!-- Rewards -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                    <div style="background: #e8f5e8; padding: 1rem; border-radius: 8px;">
                        <div style="font-size: 2rem;">✨</div>
                        <p style="margin: 0; color: #2e7d32; font-weight: bold;">+${totalXP} XP</p>
                    </div>
                    <div style="background: #fff3e0; padding: 1rem; border-radius: 8px;">
                        <div style="font-size: 2rem;">🔥</div>
                        <p style="margin: 0; color: #ef6c00; font-weight: bold;">Streak kept!</p>
                    </div>
                    <div style="background: #f3e5f5; padding: 1rem; border-radius: 8px;">
                        <div style="font-size: 2rem;">🏅</div>
                        <p style="margin: 0; color: #7b1fa2; font-weight: bold;">${level.badge}</p>
                    </div>
                </div>
                
                <!-- Actions -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    <button onclick="englishLessons.restartLesson()" style="
                        background: linear-gradient(135deg, #ff9800, #ffb74d);
                        color: white;
                        border: none;
                        padding: 1rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-family: 'Press Start 2P', monospace;
                        font-size: 10px;
                    ">
                        🔄 Practice again
                    </button>
                    <button onclick="location.reload()" style="
                        background: linear-gradient(135deg, #2196f3, #1976d2);
                        color: white;
                        border: none;
                        padding: 1rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-family: 'Press Start 2P', monospace;
                        font-size: 10px;
                    ">
                        🏠 Back to lessons
                    </button>
                </div>
            </div>
        `;
        
        // Update streak if good performance
        if (percentage >= 70 && window.streakManager) {
            window.streakManager.recordActivity();
        }
    }
    
    getLevel(percentage) {
        if (percentage >= 90) return { emoji: "🏆", badge: "English Master" };
        if (percentage >= 80) return { emoji: "⭐", badge: "Great Student" };
        if (percentage >= 70) return { emoji: "👍", badge: "Good Job" };
        if (percentage >= 60) return { emoji: "😊", badge: "Keep Going" };
        return { emoji: "💪", badge: "Never Give Up" };
    }
    
    speakWord(word) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'en-US';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
    }
    
    restartLesson() {
        this.startLesson(this.currentLesson.id);
    }
}

// Instance globale
const englishLessons = new EnglishLessonsSystem();