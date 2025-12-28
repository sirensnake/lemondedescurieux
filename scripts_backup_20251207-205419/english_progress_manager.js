// === FINALISATION INTÉGRATION ENGLISH INTERACTIVE ===
// Scripts à ajouter dans english_section.html pour fonctionnalité complète

// 1. SYSTÈME DE PROGRESSION UNIFIÉ
class EnglishProgressManager {
    constructor() {
        this.storageKey = 'english_progress';
        this.progressData = this.loadProgress();
        this.initializeUI();
    }

    loadProgress() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : {
            level: 1,
            xp: 0,
            streak: 0,
            lastActivity: null,
            unlockedSections: ['vocabulary'],
            completedLessons: []
        };
    }

    saveProgress() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.progressData));
    }

    initializeUI() {
        // Mise à jour des indicateurs visuels
        this.updateStreakDisplay();
        this.updateXPDisplay();
        this.updateSectionLocks();
    }

    updateStreakDisplay() {
        const streakElement = document.querySelector('.streak-counter');
        if (streakElement) {
            streakElement.innerHTML = `🔥 ${this.progressData.streak} day${this.progressData.streak !== 1 ? 's' : ''}`;
        }
    }

    updateXPDisplay() {
        const xpElement = document.querySelector('.xp-indicator');
        if (xpElement) {
            const xpToNextLevel = this.progressData.level * 100;
            const currentXP = this.progressData.xp;
            xpElement.innerHTML = `Level ${this.progressData.level} - ${currentXP}/${xpToNextLevel} XP`;
        }
    }

    updateSectionLocks() {
        // Gestion des sections débloquées
        const sections = document.querySelectorAll('.english-section');
        sections.forEach(section => {
            const sectionId = section.dataset.section;
            if (!this.progressData.unlockedSections.includes(sectionId)) {
                section.classList.add('locked');
                section.querySelector('.section-link').style.pointerEvents = 'none';
            }
        });
    }

    completeLesson(lessonId) {
        if (!this.progressData.completedLessons.includes(lessonId)) {
            this.progressData.completedLessons.push(lessonId);
            this.addXP(20); // 20 XP par leçon complétée
            this.updateStreak();
            this.checkUnlocks();
            this.saveProgress();
            this.initializeUI();
        }
    }

    addXP(amount) {
        this.progressData.xp += amount;
        const xpToNextLevel = this.progressData.level * 100;
        
        if (this.progressData.xp >= xpToNextLevel) {
            this.progressData.level++;
            this.progressData.xp -= xpToNextLevel;
            this.showLevelUpAnimation();
        }
    }

    updateStreak() {
        const today = new Date().toDateString();
        const lastActivity = this.progressData.lastActivity;
        
        if (lastActivity === today) {
            return; // Déjà fait aujourd'hui
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastActivity === yesterday.toDateString()) {
            this.progressData.streak++;
        } else if (lastActivity !== null) {
            this.progressData.streak = 1;
        } else {
            this.progressData.streak = 1;
        }
        
        this.progressData.lastActivity = today;
    }

    checkUnlocks() {
        // Logique de débloquage des sections
        const completedCount = this.progressData.completedLessons.length;
        
        if (completedCount >= 3 && !this.progressData.unlockedSections.includes('grammar')) {
            this.progressData.unlockedSections.push('grammar');
            this.showUnlockNotification('Grammar & Verbs');
        }
        
        if (completedCount >= 6 && !this.progressData.unlockedSections.includes('conversation')) {
            this.progressData.unlockedSections.push('conversation');
            this.showUnlockNotification('Conversation Skills');
        }
        
        if (completedCount >= 10 && !this.progressData.unlockedSections.includes('listening')) {
            this.progressData.unlockedSections.push('listening');
            this.showUnlockNotification('Songs & Listening');
        }
    }

    showLevelUpAnimation() {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="level-up-content">
                <div class="level-up-icon">🎉</div>
                <div class="level-up-text">
                    <h3>Level Up!</h3>
                    <p>You've reached Level ${this.progressData.level}!</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showUnlockNotification(sectionName) {
        const notification = document.createElement('div');
        notification.className = 'unlock-notification';
        notification.innerHTML = `
            <div class="unlock-content">
                <div class="unlock-icon">🔓</div>
                <div class="unlock-text">
                    <h3>New Section Unlocked!</h3>
                    <p>${sectionName} is now available</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// 2. GESTION DES CLICS SUR LES SECTIONS
class EnglishSectionNavigator {
    constructor(progressManager) {
        this.progressManager = progressManager;
        this.initializeNavigation();
    }

    initializeNavigation() {
        // Vocabulary Builder
        const vocabButton = document.querySelector('[href="#vocabulary"]');
        if (vocabButton) {
            vocabButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSection('vocabulary');
            });
        }

        // Grammar & Verbs
        const grammarButton = document.querySelector('[href="#grammar"]');
        if (grammarButton) {
            grammarButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSection('grammar');
            });
        }

        // Conversation Skills
        const conversationButton = document.querySelector('[href="#conversation"]');
        if (conversationButton) {
            conversationButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSection('conversation');
            });
        }

        // Songs & Listening
        const listeningButton = document.querySelector('[href="#listening"]');
        if (listeningButton) {
            listeningButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSection('listening');
            });
        }
    }

    navigateToSection(sectionId) {
        // Vérifier si la section est débloquée
        if (!this.progressManager.progressData.unlockedSections.includes(sectionId)) {
            this.showLockedMessage(sectionId);
            return;
        }

        // Redirection vers les activités spécifiques
        switch(sectionId) {
            case 'vocabulary':
                this.loadVocabularyActivities();
                break;
            case 'grammar':
                this.loadGrammarActivities();
                break;
            case 'conversation':
                this.loadConversationActivities();
                break;
            case 'listening':
                this.loadListeningActivities();
                break;
        }
    }

    showLockedMessage(sectionId) {
        const requiredLessons = this.getRequiredLessons(sectionId);
        const completedCount = this.progressManager.progressData.completedLessons.length;
        
        const modal = document.createElement('div');
        modal.className = 'locked-modal';
        modal.innerHTML = `
            <div class="locked-modal-content">
                <div class="locked-icon">🔒</div>
                <h3>Section Locked</h3>
                <p>Complete ${requiredLessons - completedCount} more lesson${requiredLessons - completedCount !== 1 ? 's' : ''} to unlock this section!</p>
                <button class="close-modal-btn">OK</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.close-modal-btn').addEventListener('click', () => {
            modal.remove();
        });
    }

    getRequiredLessons(sectionId) {
        const requirements = {
            'vocabulary': 0,
            'grammar': 3,
            'conversation': 6,
            'listening': 10
        };
        return requirements[sectionId] || 0;
    }

    loadVocabularyActivities() {
        // Création d'une section d'activités de vocabulaire
        this.createActivityInterface('Vocabulary Builder', [
            { id: 'basic_words', title: 'Basic Words', difficulty: 'Beginner' },
            { id: 'family_words', title: 'Family & Friends', difficulty: 'Beginner' },
            { id: 'school_words', title: 'School Vocabulary', difficulty: 'Intermediate' },
            { id: 'daily_life', title: 'Daily Life', difficulty: 'Intermediate' }
        ]);
    }

    loadGrammarActivities() {
        this.createActivityInterface('Grammar & Verbs', [
            { id: 'present_simple', title: 'Present Simple', difficulty: 'Beginner' },
            { id: 'past_simple', title: 'Past Simple', difficulty: 'Intermediate' },
            { id: 'future_tense', title: 'Future Tense', difficulty: 'Intermediate' },
            { id: 'irregular_verbs', title: 'Irregular Verbs', difficulty: 'Advanced' }
        ]);
    }

    loadConversationActivities() {
        this.createActivityInterface('Conversation Skills', [
            { id: 'greetings', title: 'Greetings & Introductions', difficulty: 'Beginner' },
            { id: 'asking_directions', title: 'Asking for Directions', difficulty: 'Intermediate' },
            { id: 'restaurant_talk', title: 'At the Restaurant', difficulty: 'Intermediate' },
            { id: 'phone_calls', title: 'Phone Conversations', difficulty: 'Advanced' }
        ]);
    }

    loadListeningActivities() {
        this.createActivityInterface('Songs & Listening', [
            { id: 'simple_songs', title: 'Simple Songs', difficulty: 'Beginner' },
            { id: 'story_listening', title: 'Story Time', difficulty: 'Beginner' },
            { id: 'news_listening', title: 'Simple News', difficulty: 'Intermediate' },
            { id: 'movie_clips', title: 'Movie Clips', difficulty: 'Advanced' }
        ]);
    }

    createActivityInterface(sectionTitle, activities) {
        // Masquer la page principale et afficher les activités
        const mainContent = document.querySelector('.english-main-content');
        mainContent.style.display = 'none';
        
        const activityContainer = document.createElement('div');
        activityContainer.className = 'activity-container';
        activityContainer.innerHTML = `
            <div class="activity-header">
                <button class="back-btn">← Back to English</button>
                <h2>${sectionTitle}</h2>
            </div>
            <div class="activities-grid">
                ${activities.map(activity => `
                    <div class="activity-card" data-activity="${activity.id}">
                        <div class="activity-icon">📝</div>
                        <h3>${activity.title}</h3>
                        <span class="difficulty-badge ${activity.difficulty.toLowerCase()}">${activity.difficulty}</span>
                        <button class="start-activity-btn">Start</button>
                    </div>
                `).join('')}
            </div>
        `;
        
        document.querySelector('.container').appendChild(activityContainer);
        
        // Gestion du bouton retour
        activityContainer.querySelector('.back-btn').addEventListener('click', () => {
            activityContainer.remove();
            mainContent.style.display = 'block';
        });
        
        // Gestion des boutons de démarrage d'activité
        activityContainer.querySelectorAll('.start-activity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const activityId = e.target.closest('.activity-card').dataset.activity;
                this.startActivity(activityId);
            });
        });
    }

    startActivity(activityId) {
        // Redirection vers english_duolingo_style.html avec l'activité spécifique
        window.location.href = `english_duolingo_style.html?activity=${activityId}`;
    }
}

// 3. INITIALISATION GLOBALE
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le gestionnaire de progression
    window.englishProgress = new EnglishProgressManager();
    
    // Initialiser la navigation
    window.englishNavigator = new EnglishSectionNavigator(window.englishProgress);
    
    // Ajouter un message de bienvenue personnalisé
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage && window.englishProgress.progressData.streak > 0) {
        welcomeMessage.innerHTML += `<br><small>🔥 Great job! You're on a ${window.englishProgress.progressData.streak}-day streak!</small>`;
    }
    
    console.log('English Interactive fully loaded!');
});

// 4. STYLES CSS ADDITIONNELS À AJOUTER
const additionalStyles = `
/* Notifications */
.level-up-notification, .unlock-notification {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: white;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: slideIn 0.3s ease;
}

.locked-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.locked-modal-content {
    background: white;
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

.locked-icon {
    font-size: 3em;
    margin-bottom: 15px;
}

.close-modal-btn {
    background: #2196F3;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 15px;
}

/* Sections verrouillées */
.english-section.locked {
    opacity: 0.5;
    position: relative;
}

.english-section.locked::after {
    content: "🔒";
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 1.5em;
}

/* Activités */
.activity-container {
    padding: 20px;
}

.activity-header {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
}

.back-btn {
    background: #f0f0f0;
    border: none;
    padding: 10px 15px;
    border-radius: 8px;
    cursor: pointer;
    margin-right: 20px;
}

.activities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

.activity-card {
    background: white;
    border-radius: 15px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.activity-card:hover {
    transform: translateY(-5px);
}

.activity-icon {
    font-size: 2.5em;
    margin-bottom: 15px;
}

.difficulty-badge {
    display: inline-block;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 0.8em;
    margin: 10px 0;
}

.difficulty-badge.beginner { background: #E8F5E8; color: #4CAF50; }
.difficulty-badge.intermediate { background: #FFF3E0; color: #FF9800; }
.difficulty-badge.advanced { background: #FFEBEE; color: #F44336; }

.start-activity-btn {
    background: linear-gradient(135deg, #2196F3, #1976D2);
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 25px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 15px;
    transition: all 0.3s ease;
}

.start-activity-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
}

@keyframes slideIn {
    from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
    to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
}
`;

// Injection des styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// === FINALISATION ENGLISH INTERACTIVE - FONCTIONNALITÉS MANQUANTES ===

// 1. VÉRIFICATION ET CORRECTION DU CHARGEMENT DES SCRIPTS
console.log('=== DIAGNOSTIC ENGLISH INTERACTIVE ===');

// Test 1: Vérifier si les classes sont chargées
if (typeof EnglishProgressManager === 'undefined') {
    console.error('❌ EnglishProgressManager non chargé - Vérifier scripts/english_progress_manager.js');
} else {
    console.log('✅ EnglishProgressManager chargé');
}

// Test 2: Vérifier l'initialisation des instances globales
if (typeof window.englishProgress === 'undefined') {
    console.log('🔧 Initialisation manuelle du système...');
    
    // Initialisation manuelle si script pas encore chargé
    window.englishProgress = new EnglishProgressManager();
    window.englishNavigator = new EnglishSectionNavigator(window.englishProgress);
    
    console.log('✅ Système initialisé manuellement');
} else {
    console.log('✅ Système déjà initialisé');
}

// 2. CRÉATION DES ACTIVITÉS VOCABULARY RÉELLES
class VocabularyActivities {
    constructor() {
        this.lessons = {
            'basic_words': {
                title: 'Basic Words',
                difficulty: 'Beginner',
                words: [
                    { english: 'hello', french: 'bonjour', pronunciation: '/həˈloʊ/' },
                    { english: 'goodbye', french: 'au revoir', pronunciation: '/ɡʊdˈbaɪ/' },
                    { english: 'please', french: 's\'il vous plaît', pronunciation: '/pliːz/' },
                    { english: 'thank you', french: 'merci', pronunciation: '/θæŋk juː/' },
                    { english: 'yes', french: 'oui', pronunciation: '/jɛs/' },
                    { english: 'no', french: 'non', pronunciation: '/noʊ/' },
                    { english: 'water', french: 'eau', pronunciation: '/ˈwɔːtər/' },
                    { english: 'food', french: 'nourriture', pronunciation: '/fuːd/' }
                ]
            },
            'family_words': {
                title: 'Family & Friends',
                difficulty: 'Beginner',
                words: [
                    { english: 'mother', french: 'mère', pronunciation: '/ˈmʌðər/' },
                    { english: 'father', french: 'père', pronunciation: '/ˈfɑːðər/' },
                    { english: 'sister', french: 'sœur', pronunciation: '/ˈsɪstər/' },
                    { english: 'brother', french: 'frère', pronunciation: '/ˈbrʌðər/' },
                    { english: 'friend', french: 'ami(e)', pronunciation: '/frɛnd/' },
                    { english: 'family', french: 'famille', pronunciation: '/ˈfæməli/' }
                ]
            }
        };
    }

    createLessonInterface(lessonId) {
        const lesson = this.lessons[lessonId];
        if (!lesson) return null;

        return `
            <div class="lesson-container">
                <div class="lesson-header">
                    <button class="back-btn" onclick="backToVocabulary()">← Back to Vocabulary</button>
                    <h2>${lesson.title}</h2>
                    <div class="lesson-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%"></div>
                        </div>
                        <span class="progress-text">0/${lesson.words.length}</span>
                    </div>
                </div>

                <div class="lesson-content">
                    <div class="word-card" id="current-word-card">
                        <div class="word-english" id="word-english"></div>
                        <div class="word-pronunciation" id="word-pronunciation"></div>
                        <button class="listen-btn" id="listen-btn">🔊 Listen</button>
                        
                        <div class="answer-section">
                            <input type="text" id="answer-input" placeholder="Écris la traduction en français...">
                            <button class="check-btn" id="check-answer">Vérifier</button>
                        </div>
                        
                        <div class="feedback" id="feedback-area"></div>
                        <button class="next-btn" id="next-word" style="display: none;">Mot suivant</button>
                    </div>
                </div>

                <div class="lesson-stats">
                    <div class="stat">
                        <span class="stat-label">Correct</span>
                        <span class="stat-value" id="correct-count">0</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Errors</span>
                        <span class="stat-value" id="error-count">0</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Hearts</span>
                        <span class="stat-value" id="hearts-remaining">5</span>
                    </div>
                </div>
            </div>
        `;
    }

    startLesson(lessonId, container) {
        const lesson = this.lessons[lessonId];
        container.innerHTML = this.createLessonInterface(lessonId);
        
        this.currentLesson = lesson;
        this.currentWordIndex = 0;
        this.correctAnswers = 0;
        this.errors = 0;
        this.hearts = 5;
        
        this.initializeLessonEvents();
        this.showCurrentWord();
    }

    initializeLessonEvents() {
        const checkBtn = document.getElementById('check-answer');
        const answerInput = document.getElementById('answer-input');
        const nextBtn = document.getElementById('next-word');
        const listenBtn = document.getElementById('listen-btn');

        checkBtn.addEventListener('click', () => this.checkAnswer());
        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkAnswer();
        });
        nextBtn.addEventListener('click', () => this.nextWord());
        listenBtn.addEventListener('click', () => this.playPronunciation());
    }

    showCurrentWord() {
        const currentWord = this.currentLesson.words[this.currentWordIndex];
        
        document.getElementById('word-english').textContent = currentWord.english;
        document.getElementById('word-pronunciation').textContent = currentWord.pronunciation;
        document.getElementById('answer-input').value = '';
        document.getElementById('answer-input').focus();
        document.getElementById('feedback-area').innerHTML = '';
        document.getElementById('next-word').style.display = 'none';
        
        // Update progress
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        const progress = (this.currentWordIndex / this.currentLesson.words.length) * 100;
        
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${this.currentWordIndex}/${this.currentLesson.words.length}`;
    }

    checkAnswer() {
        const userAnswer = document.getElementById('answer-input').value.toLowerCase().trim();
        const correctAnswer = this.currentLesson.words[this.currentWordIndex].french.toLowerCase();
        const feedbackArea = document.getElementById('feedback-area');
        
        // Normalize answers for comparison
        const normalizedUser = this.normalizeAnswer(userAnswer);
        const normalizedCorrect = this.normalizeAnswer(correctAnswer);
        
        if (normalizedUser === normalizedCorrect) {
            // Correct answer
            this.correctAnswers++;
            feedbackArea.innerHTML = `
                <div class="feedback-correct">
                    <div class="feedback-icon">✅</div>
                    <div class="feedback-text">
                        <strong>Excellent !</strong><br>
                        <em>"${this.currentLesson.words[this.currentWordIndex].english}"</em> = 
                        <em>"${this.currentLesson.words[this.currentWordIndex].french}"</em>
                    </div>
                </div>
            `;
            
            // Add XP
            if (window.englishProgress) {
                window.englishProgress.addXP(10);
                window.englishProgress.updateXPDisplay();
            }
            
            document.getElementById('correct-count').textContent = this.correctAnswers;
            document.getElementById('next-word').style.display = 'block';
            
        } else {
            // Wrong answer
            this.errors++;
            this.hearts--;
            
            feedbackArea.innerHTML = `
                <div class="feedback-wrong">
                    <div class="feedback-icon">❌</div>
                    <div class="feedback-text">
                        <strong>Pas tout à fait...</strong><br>
                        La bonne réponse est : <strong>"${this.currentLesson.words[this.currentWordIndex].french}"</strong>
                    </div>
                </div>
            `;
            
            document.getElementById('error-count').textContent = this.errors;
            document.getElementById('hearts-remaining').textContent = this.hearts;
            
            // Update hearts display in header
            this.updateHeartsDisplay();
            
            if (this.hearts <= 0) {
                this.endLesson(false);
                return;
            }
            
            // Allow to continue after wrong answer
            setTimeout(() => {
                document.getElementById('next-word').style.display = 'block';
            }, 2000);
        }
    }

    normalizeAnswer(answer) {
        return answer
            .toLowerCase()
            .replace(/[àáâäã]/g, 'a')
            .replace(/[èéêë]/g, 'e')
            .replace(/[ìíîï]/g, 'i')
            .replace(/[òóôöõ]/g, 'o')
            .replace(/[ùúûü]/g, 'u')
            .replace(/[ç]/g, 'c')
            .replace(/[^a-z\s]/g, '')
            .trim();
    }

    nextWord() {
        this.currentWordIndex++;
        
        if (this.currentWordIndex >= this.currentLesson.words.length) {
            this.endLesson(true);
        } else {
            this.showCurrentWord();
        }
    }

    endLesson(completed) {
        const container = document.querySelector('.container');
        const score = Math.round((this.correctAnswers / this.currentLesson.words.length) * 100);
        
        container.innerHTML = `
            <div class="lesson-complete">
                <div class="complete-header">
                    <div class="complete-icon">${completed ? '🎉' : '💔'}</div>
                    <h2>${completed ? 'Lesson Completed!' : 'Out of Hearts'}</h2>
                </div>
                
                <div class="complete-stats">
                    <div class="stat-big">
                        <span class="stat-number">${score}%</span>
                        <span class="stat-label">Score</span>
                    </div>
                    <div class="stat-row">
                        <div class="stat">✅ ${this.correctAnswers} correct</div>
                        <div class="stat">❌ ${this.errors} errors</div>
                        <div class="stat">💗 ${this.hearts} hearts left</div>
                    </div>
                </div>
                
                <div class="complete-actions">
                    <button class="restart-btn" onclick="restartVocabulary()">🔄 Try Again</button>
                    <button class="continue-btn" onclick="backToEnglish()">Continue Learning</button>
                </div>
            </div>
        `;
        
        // Save progress if completed successfully
        if (completed && window.englishProgress) {
            window.englishProgress.completeLesson(`vocabulary_${Date.now()}`);
        }
    }

    updateHeartsDisplay() {
        const heartsDisplay = document.querySelector('.hearts-display');
        if (heartsDisplay) {
            const hearts = heartsDisplay.querySelectorAll('.heart');
            hearts.forEach((heart, index) => {
                if (index >= this.hearts) {
                    heart.classList.add('empty');
                } else {
                    heart.classList.remove('empty');
                }
            });
        }
    }

    playPronunciation() {
        const currentWord = this.currentLesson.words[this.currentWordIndex];
        
        // Use Web Speech API if available
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(currentWord.english);
            utterance.lang = 'en-US';
            utterance.rate = 0.8;
            window.speechSynthesis.speak(utterance);
        } else {
            // Fallback: show pronunciation guide
            const pronunciationDiv = document.getElementById('word-pronunciation');
            pronunciationDiv.style.fontSize = '1.2em';
            pronunciationDiv.style.color = '#2196F3';
            
            setTimeout(() => {
                pronunciationDiv.style.fontSize = '';
                pronunciationDiv.style.color = '';
            }, 1000);
        }
    }
}

// 3. FONCTIONS GLOBALES DE NAVIGATION
window.vocabularyActivities = new VocabularyActivities();

function startVocabularyLesson(lessonId) {
    const container = document.querySelector('.container');
    window.vocabularyActivities.startLesson(lessonId, container);
}

function backToVocabulary() {
    // Recreate vocabulary interface
    if (window.englishNavigator) {
        window.englishNavigator.loadVocabularyActivities();
    }
}

function backToEnglish() {
    // Return to main English page
    window.location.reload();
}

function restartVocabulary() {
    backToVocabulary();
}

// 4. CORRECTION DES LIENS VOCABULARY
function fixVocabularyNavigation() {
    const vocabButton = document.querySelector('[href="#vocabulary"]');
    if (vocabButton) {
        vocabButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Show vocabulary activities interface
            const container = document.querySelector('.container');
            container.innerHTML = `
                <div class="activity-container">
                    <div class="activity-header">
                        <button class="back-btn" onclick="backToEnglish()">← Back to English</button>
                        <h2>Vocabulary Builder</h2>
                    </div>
                    <div class="activities-grid">
                        <div class="activity-card" onclick="startVocabularyLesson('basic_words')">
                            <div class="activity-icon">📝</div>
                            <h3>Basic Words</h3>
                            <span class="difficulty-badge beginner">Beginner</span>
                            <p>Learn essential everyday words</p>
                            <button class="start-activity-btn">Start Lesson</button>
                        </div>
                        
                        <div class="activity-card" onclick="startVocabularyLesson('family_words')">
                            <div class="activity-icon">👨‍👩‍👧‍👦</div>
                            <h3>Family & Friends</h3>
                            <span class="difficulty-badge beginner">Beginner</span>
                            <p>Words about family and relationships</p>
                            <button class="start-activity-btn">Start Lesson</button>
                        </div>
                        
                        <div class="activity-card locked">
                            <div class="activity-icon">🏫</div>
                            <h3>School Vocabulary</h3>
                            <span class="difficulty-badge intermediate">Intermediate</span>
                            <p>Complete 2 lessons to unlock</p>
                            <button class="start-activity-btn" disabled>🔒 Locked</button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
}

// 5. STYLES CSS POUR LES LEÇONS
const lessonStyles = `
.lesson-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.lesson-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid #f0f0f0;
}

.back-btn {
    background: #f0f0f0;
    border: none;
    padding: 10px 15px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
}

.progress-bar {
    width: 200px;
    height: 8px;
    background: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #58CC02, #46A302);
    transition: width 0.3s ease;
}

.word-card {
    background: white;
    border-radius: 20px;
    padding: 40px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    margin-bottom: 30px;
}

.word-english {
    font-size: 2.5em;
    font-weight: bold;
    color: #2196F3;
    margin-bottom: 10px;
}

.word-pronunciation {
    font-size: 1.2em;
    color: #666;
    font-style: italic;
    margin-bottom: 20px;
}

.listen-btn {
    background: #2196F3;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 25px;
    cursor: pointer;
    margin-bottom: 30px;
    font-size: 1em;
}

.answer-section {
    margin: 30px 0;
}

#answer-input {
    width: 100%;
    max-width: 400px;
    padding: 15px;
    font-size: 1.2em;
    border: 2px solid #ddd;
    border-radius: 10px;
    margin-bottom: 15px;
    text-align: center;
}

.check-btn {
    background: #58CC02;
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 1.1em;
    font-weight: bold;
}

.feedback-correct {
    background: #E8F5E8;
    border: 2px solid #4CAF50;
    border-radius: 15px;
    padding: 20px;
    margin: 20px 0;
    display: flex;
    align-items: center;
    gap: 15px;
}

.feedback-wrong {
    background: #FFEBEE;
    border: 2px solid #F44336;
    border-radius: 15px;
    padding: 20px;
    margin: 20px 0;
    display: flex;
    align-items: center;
    gap: 15px;
}

.feedback-icon {
    font-size: 2em;
}

.next-btn {
    background: #FF9800;
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 1.1em;
    font-weight: bold;
    margin-top: 20px;
}

.lesson-stats {
    display: flex;
    justify-content: center;
    gap: 30px;
    background: #f8f9fa;
    padding: 20px;
    border-radius: 15px;
}

.stat {
    text-align: center;
}

.stat-label {
    display: block;
    font-size: 0.9em;
    color: #666;
    margin-bottom: 5px;
}

.stat-value {
    font-size: 1.5em;
    font-weight: bold;
    color: #2196F3;
}

.lesson-complete {
    text-align: center;
    padding: 40px 20px;
}

.complete-icon {
    font-size: 4em;
    margin-bottom: 20px;
}

.complete-stats {
    background: #f8f9fa;
    border-radius: 20px;
    padding: 30px;
    margin: 30px 0;
}

.stat-big {
    margin-bottom: 20px;
}

.stat-number {
    display: block;
    font-size: 3em;
    font-weight: bold;
    color: #58CC02;
}

.stat-row {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
}

.complete-actions {
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-wrap: wrap;
}

.restart-btn, .continue-btn {
    padding: 15px 30px;
    border: none;
    border-radius: 25px;
    font-size: 1.1em;
    font-weight: bold;
    cursor: pointer;
}

.restart-btn {
    background: #FF9800;
    color: white;
}

.continue-btn {
    background: #58CC02;
    color: white;
}

@media (max-width: 768px) {
    .lesson-header {
        flex-direction: column;
        gap: 15px;
    }
    
    .word-card {
        padding: 20px;
    }
    
    .word-english {
        font-size: 2em;
    }
    
    .lesson-stats {
        flex-direction: column;
        gap: 15px;
    }
}
`;

// Inject lesson styles
const lessonStyleSheet = document.createElement('style');
lessonStyleSheet.textContent = lessonStyles;
document.head.appendChild(lessonStyleSheet);

// 6. INITIALISATION FINALE
document.addEventListener('DOMContentLoaded', () => {
    // Fix navigation after page load
    setTimeout(() => {
        fixVocabularyNavigation();
        console.log('✅ English Interactive fully functional!');
    }, 1000);
});

console.log('🚀 English Interactive Enhancement Script Loaded');

// === AMÉLIORATION VISUELLE IMMÉDIATE - ENGLISH INTERACTIVE ===

// 1. DÉBLOQUER TOUTES LES SECTIONS (plus de frustration)
function unlockAllSections() {
    // Retirer tous les verrous visuels
    const lockedSections = document.querySelectorAll('.adventure-card.locked');
    lockedSections.forEach(section => {
        section.classList.remove('locked');
        
        // Rendre les boutons cliquables
        const button = section.querySelector('.adventure-btn');
        if (button) {
            button.style.pointerEvents = 'auto';
            button.style.background = 'linear-gradient(135deg, #58CC02, #46A302)';
            button.style.boxShadow = '0 4px 15px rgba(88, 204, 2, 0.3)';
        }
    });
    
    // Supprimer les icônes de cadenas
    const lockIcons = document.querySelectorAll('.adventure-card::after');
    lockIcons.forEach(icon => icon.remove());
    
    console.log('🔓 Toutes les sections débloquées !');
}

// 2. ANIMATIONS ET EFFETS VISUELS DYNAMIQUES
function addVisualEffects() {
    // Animation de pulsation pour les cœurs
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach((heart, index) => {
        heart.style.animation = `heartbeat 2s ease-in-out ${index * 0.2}s infinite`;
    });
    
    // Animation de brillance pour le streak
    const streakElement = document.querySelector('.streak-counter');
    if (streakElement) {
        streakElement.style.background = 'linear-gradient(135deg, #FF6B35, #F7941D, #FF6B35)';
        streakElement.style.backgroundSize = '200% 200%';
        streakElement.style.animation = 'gradient-shift 3s ease infinite';
        streakElement.style.boxShadow = '0 0 20px rgba(255, 107, 53, 0.5)';
    }
    
    // Animation de remplissage XP
    const xpElement = document.querySelector('.xp-indicator');
    if (xpElement) {
        xpElement.style.background = 'linear-gradient(135deg, #2196F3, #21CBF3, #2196F3)';
        xpElement.style.backgroundSize = '200% 200%';
        xpElement.style.animation = 'gradient-shift 4s ease infinite';
    }
    
    console.log('✨ Effets visuels ajoutés !');
}

// 3. COULEURS PLUS VIVES ET ATTRAYANTES
function enhanceColors() {
    // Améliorer les cartes d'aventure
    const adventureCards = document.querySelectorAll('.adventure-card');
    adventureCards.forEach((card, index) => {
        const colors = [
            'linear-gradient(135deg, #FF6B6B, #FF8E8E)', // Rouge corail
            'linear-gradient(135deg, #4ECDC4, #7FDBDA)', // Turquoise
            'linear-gradient(135deg, #45B7D1, #6BC5E8)', // Bleu ciel
            'linear-gradient(135deg, #96CEB4, #B4D6C6)'  // Vert menthe
        ];
        
        card.style.background = colors[index % colors.length];
        card.style.color = 'white';
        card.style.transform = 'scale(1.02)';
        card.style.transition = 'all 0.3s ease';
        
        // Texte en blanc pour contraste
        const title = card.querySelector('h3');
        const description = card.querySelector('p');
        if (title) title.style.color = 'white';
        if (description) description.style.color = 'rgba(255,255,255,0.9)';
    });
    
    console.log('🌈 Couleurs améliorées !');
}

// 4. ÉLÉMENTS INTERACTIFS ET LUDIQUES
function addInteractiveElements() {
    // Particules flottantes pour effet magique
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;
    
    // Créer 15 particules
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.innerHTML = ['⭐', '✨', '🌟', '💫', '🎯'][Math.floor(Math.random() * 5)];
        particle.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 20 + 15}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 3 + 4}s ease-in-out infinite;
            opacity: 0.7;
        `;
        particlesContainer.appendChild(particle);
    }
    
    document.body.appendChild(particlesContainer);
    
    // Effet de survol dynamique pour les cartes
    const cards = document.querySelectorAll('.adventure-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.05)';
            card.style.boxShadow = '0 15px 35px rgba(0,0,0,0.2)';
            card.style.filter = 'brightness(1.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1.02)';
            card.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            card.style.filter = 'brightness(1)';
        });
    });
    
    console.log('🎮 Éléments interactifs ajoutés !');
}

// 5. MESSAGES MOTIVANTS ET PERSONNALISÉS
function addMotivationalElements() {
    // Messages rotatifs encourageants
    const messages = [
        "🚀 Tu es un champion de l'anglais !",
        "🌟 Continue comme ça, c'est fantastique !",
        "🎯 Chaque mot appris est une victoire !",
        "💪 Tu progresses de jour en jour !",
        "🏆 Bientôt tu seras bilingue !"
    ];
    
    // Ajouter un message motivant qui change
    const welcomeSection = document.querySelector('.welcome-message');
    if (welcomeSection) {
        const motivationDiv = document.createElement('div');
        motivationDiv.className = 'rotating-motivation';
        motivationDiv.style.cssText = `
            background: linear-gradient(135deg, #FF6B35, #F7941D);
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            margin: 20px 0;
            font-weight: bold;
            text-align: center;
            font-size: 1.1em;
            box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
            animation: pulse 2s ease-in-out infinite;
        `;
        
        let currentMessage = 0;
        function rotateMessage() {
            motivationDiv.textContent = messages[currentMessage];
            currentMessage = (currentMessage + 1) % messages.length;
        }
        
        rotateMessage();
        setInterval(rotateMessage, 4000);
        
        welcomeSection.appendChild(motivationDiv);
    }
    
    console.log('💝 Messages motivants ajoutés !');
}

// 6. STYLES CSS ADDITIONNELS POUR LES ANIMATIONS
function addAdvancedStyles() {
    const advancedCSS = `
        @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }
        
        @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
            0%, 100% { 
                transform: translateY(0px) rotate(0deg); 
                opacity: 0.7; 
            }
            50% { 
                transform: translateY(-20px) rotate(180deg); 
                opacity: 1; 
            }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3); }
            50% { transform: scale(1.05); box-shadow: 0 8px 25px rgba(255, 107, 53, 0.5); }
        }
        
        .adventure-card {
            position: relative;
            overflow: hidden;
        }
        
        .adventure-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
            transform: rotate(45deg);
            transition: all 0.5s;
            opacity: 0;
        }
        
        .adventure-card:hover::before {
            animation: shine 0.5s ease-in-out;
        }
        
        @keyframes shine {
            0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(100%) translateY(100%) rotate(45deg); opacity: 0; }
        }
        
        .particles-container .particle {
            pointer-events: none;
            user-select: none;
        }
        
        /* Amélioration responsive */
        @media (max-width: 768px) {
            .adventure-card {
                margin-bottom: 20px;
            }
            
            .particles-container {
                display: none; /* Masquer sur mobile pour performance */
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = advancedCSS;
    document.head.appendChild(styleSheet);
    
    console.log('🎨 Styles avancés ajoutés !');
}

// 7. FONCTION DE DÉVERROUILLAGE DES SECTIONS AVEC ANIMATIONS
function unlockSectionsWithAnimation() {
    const sections = ['grammar', 'conversation', 'listening'];
    
    sections.forEach((sectionId, index) => {
        setTimeout(() => {
            const sectionCard = document.querySelector(`[data-section="${sectionId}"]`);
            if (sectionCard && sectionCard.classList.contains('locked')) {
                // Animation de déverrouillage
                sectionCard.style.animation = 'unlock-bounce 0.8s ease-out';
                sectionCard.classList.remove('locked');
                
                // Notification de déverrouillage
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #4CAF50, #66BB6A);
                    color: white;
                    padding: 15px 20px;
                    border-radius: 10px;
                    font-weight: bold;
                    z-index: 1000;
                    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
                    animation: slideInRight 0.5s ease;
                `;
                notification.innerHTML = `🔓 ${sectionCard.querySelector('h3').textContent} unlocked!`;
                
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.style.animation = 'fadeOut 0.5s ease';
                    setTimeout(() => notification.remove(), 500);
                }, 2000);
            }
        }, index * 1000); // Délai progressif pour effet spectaculaire
    });
}

// 8. INITIALISATION COMPLÈTE
function initializeEnhancedInterface() {
    console.log('🎨 Démarrage des améliorations visuelles...');
    
    // Lancer toutes les améliorations
    unlockAllSections();
    addVisualEffects();
    enhanceColors();
    addInteractiveElements();
    addMotivationalElements();
    addAdvancedStyles();
    
    // Déverrouillage spectaculaire après 2 secondes
    setTimeout(() => {
        unlockSectionsWithAnimation();
    }, 2000);
    
    console.log('✨ Interface Enhanced - Version Colorée et Ludique activée !');
}

// Animations CSS supplémentaires
const extraCSS = `
    @keyframes unlock-bounce {
        0% { transform: scale(0.8); opacity: 0.5; }
        50% { transform: scale(1.1); opacity: 0.8; }
        100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;

const extraStyleSheet = document.createElement('style');
extraStyleSheet.textContent = extraCSS;
document.head.appendChild(extraStyleSheet);

// LANCEMENT AUTOMATIQUE
initializeEnhancedInterface();

console.log('🚀 English Interactive - Version Colorée et Engageante ACTIVÉE !');