/**
 * ENGLISH_GAMIFICATION.JS
 * Système Duolingo-style pour section Anglais
 * Spécialisé apprentissage langue étrangère avec audio
 * Compatible avec localStorage existant "Le Monde des Curieux"
 */

class EnglishGameSystem {
    constructor() {
        this.storageKey = 'lemondedescurieux_english';
        this.globalProgressKey = 'userProgress'; // Compatibilité existante
        
        // Configuration spécifique anglais
        this.config = {
            hearts: {
                maxHearts: 5,
                regenTimeMinutes: 30,
                lossOnError: 1
            },
            streaks: {
                requiredDaily: 1,
                notificationHour: 19 // 19h pour anglais (différent du français)
            },
            xp: {
                perQuestion: 15, // Plus d'XP pour langue étrangère
                streakBonus: 1.5,
                perfectBonus: 2.0,
                listeningBonus: 1.3,
                speakingBonus: 1.8,
                minimumPerLesson: 75
            },
            levels: {
                xpPerLevel: 150, // Plus difficile que français
                maxLevel: 25
            },
            audio: {
                enabled: true,
                autoPlay: false,
                speed: 1.0, // Vitesse normale par défaut
                slowSpeed: 0.7
            },
            difficulty: {
                beginner: { stars: 1, vocabulary: 50 },
                intermediate: { stars: 2, vocabulary: 150 },
                advanced: { stars: 3, vocabulary: 300 },
                expert: { stars: 4, vocabulary: 500 },
                native: { stars: 5, vocabulary: 1000 }
            }
        };
        
        this.data = this.loadData();
        this.initializeAudio();
        this.initializeUI();
        this.startDailyCheck();
        
        console.log('🌍 Section English Duolingo initialisée avec succès');
    }
    
    /**
     * GESTION DES DONNÉES ANGLAIS
     */
    loadData() {
        const stored = localStorage.getItem(this.storageKey);
        const defaultData = {
            // Système cœurs/vies identique au français
            hearts: {
                current: this.config.hearts.maxHearts,
                lastLoss: null,
                regenStartTime: null
            },
            
            // Streaks spécifiques anglais
            streaks: {
                current: 0,
                longest: 0,
                lastActivityDate: null,
                totalDays: 0,
                weeklyGoal: 7 // Objectif hebdomadaire
            },
            
            // XP et niveaux anglais
            xp: {
                total: 0,
                currentLevel: 1,
                currentLevelXP: 0,
                nextLevelXP: this.config.levels.xpPerLevel
            },
            
            // Activités anglais avec niveaux
            activities: {
                vocabulary: { 
                    completed: 0, 
                    total: 20, 
                    unlocked: true, 
                    difficulty: 'beginner',
                    wordsLearned: 0
                },
                grammar: { 
                    completed: 0, 
                    total: 15, 
                    unlocked: false, 
                    difficulty: 'beginner',
                    rulesLearned: 0
                },
                listening: { 
                    completed: 0, 
                    total: 18, 
                    unlocked: false, 
                    difficulty: 'beginner',
                    audioCompleted: 0
                },
                speaking: { 
                    completed: 0, 
                    total: 12, 
                    unlocked: false, 
                    difficulty: 'intermediate',
                    pronunciationScore: 0
                },
                reading: { 
                    completed: 0, 
                    total: 10, 
                    unlocked: false, 
                    difficulty: 'intermediate',
                    textsRead: 0
                },
                writing: { 
                    completed: 0, 
                    total: 8, 
                    unlocked: false, 
                    difficulty: 'advanced',
                    essaysWritten: 0
                }
            },
            
            // Statistiques avancées anglais
            stats: {
                totalQuestions: 0,
                correctAnswers: 0,
                totalTime: 0,
                sessionsCompleted: 0,
                perfectLessons: 0,
                vocabularyMastered: 0,
                listeningTime: 0,
                speakingTime: 0,
                achievementsUnlocked: []
            },
            
            // Préférences audio/culturelles
            preferences: {
                accent: 'british', // british / american
                audioSpeed: 1.0,
                autoPlayAudio: false,
                showPhonetics: true,
                culturalContext: true
            },
            
            // Vocabulaire appris
            vocabulary: {
                learned: [],
                toReview: [],
                mastered: []
            },
            
            lastSession: null,
            createdAt: new Date().toISOString()
        };
        
        return stored ? { ...defaultData, ...JSON.parse(stored) } : defaultData;
    }
    
    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        this.updateGlobalProgress();
    }
    
    updateGlobalProgress() {
        const globalProgress = JSON.parse(localStorage.getItem(this.globalProgressKey)) || {};
        
        if (!globalProgress.anglais) {
            globalProgress.anglais = {};
        }
        
        // Sync spécifique anglais
        globalProgress.anglais.level = this.data.xp.currentLevel;
        globalProgress.anglais.xp = this.data.xp.total;
        globalProgress.anglais.streak = this.data.streaks.current;
        globalProgress.anglais.vocabularySize = this.data.vocabulary.learned.length;
        globalProgress.anglais.activitiesCompleted = Object.values(this.data.activities)
            .reduce((sum, activity) => sum + activity.completed, 0);
        
        localStorage.setItem(this.globalProgressKey, JSON.stringify(globalProgress));
    }
    
    /**
     * SYSTÈME AUDIO AVANCÉ
     */
    initializeAudio() {
        this.audioContext = null;
        this.speechSynthesis = window.speechSynthesis;
        this.speechRecognition = null;
        
        // Configuration Speech Synthesis
        if (this.speechSynthesis) {
            this.setupVoices();
        }
        
        // Configuration Speech Recognition si disponible
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.speechRecognition = new SpeechRecognition();
            this.speechRecognition.continuous = false;
            this.speechRecognition.interimResults = false;
            this.speechRecognition.lang = 'en-US';
        }
    }
    
    setupVoices() {
        const updateVoices = () => {
            this.voices = this.speechSynthesis.getVoices();
            this.britishVoice = this.voices.find(voice => 
                voice.lang.includes('en-GB') || voice.name.includes('British')
            );
            this.americanVoice = this.voices.find(voice => 
                voice.lang.includes('en-US') || voice.name.includes('US')
            );
        };
        
        updateVoices();
        this.speechSynthesis.onvoiceschanged = updateVoices;
    }
    
    playAudio(text, options = {}) {
        if (!this.speechSynthesis || !text) return;
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configuration voix selon préférence
        const preferredVoice = this.data.preferences.accent === 'british' 
            ? this.britishVoice 
            : this.americanVoice;
            
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        
        utterance.rate = options.slow ? this.config.audio.slowSpeed : this.data.preferences.audioSpeed;
        utterance.pitch = options.pitch || 1;
        utterance.volume = options.volume || 1;
        
        // Callbacks
        utterance.onstart = () => {
            if (options.onStart) options.onStart();
            this.showAudioAnimation(true);
        };
        
        utterance.onend = () => {
            if (options.onEnd) options.onEnd();
            this.showAudioAnimation(false);
        };
        
        utterance.onerror = (event) => {
            console.error('Audio error:', event);
            this.showAudioAnimation(false);
        };
        
        this.speechSynthesis.speak(utterance);
    }
    
    startSpeechRecognition(expectedText, callback) {
        if (!this.speechRecognition) {
            callback({ error: 'Speech recognition not supported' });
            return;
        }
        
        this.speechRecognition.onresult = (event) => {
            const result = event.results[0][0].transcript.toLowerCase();
            const expected = expectedText.toLowerCase();
            const similarity = this.calculateSimilarity(result, expected);
            
            callback({
                recognized: result,
                expected: expected,
                similarity: similarity,
                success: similarity > 0.7 // 70% de similarité minimum
            });
        };
        
        this.speechRecognition.onerror = (event) => {
            callback({ error: event.error });
        };
        
        this.speechRecognition.start();
    }
    
    calculateSimilarity(str1, str2) {
        // Algorithme simple de distance de Levenshtein normalisée
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        const maxLength = Math.max(str1.length, str2.length);
        return (maxLength - matrix[str2.length][str1.length]) / maxLength;
    }
    
    /**
     * HÉRITE DU SYSTÈME FRANÇAIS (cœurs, streaks, XP)
     */
    getCurrentHearts() {
        this.processHeartRegeneration();
        return this.data.hearts.current;
    }
    
    loseHeart() {
        if (this.data.hearts.current > 0) {
            this.data.hearts.current -= this.config.hearts.lossOnError;
            this.data.hearts.lastLoss = Date.now();
            
            if (this.data.hearts.current === this.config.hearts.maxHearts - 1) {
                this.data.hearts.regenStartTime = Date.now();
            }
            
            this.updateHeartsDisplay();
            this.saveData();
            this.animateHeartLoss();
            
            return this.data.hearts.current > 0;
        }
        return false;
    }
    
    processHeartRegeneration() {
        if (this.data.hearts.regenStartTime && this.data.hearts.current < this.config.hearts.maxHearts) {
            const elapsed = Date.now() - this.data.hearts.regenStartTime;
            const regenTime = this.config.hearts.regenTimeMinutes * 60 * 1000;
            const heartsToRegen = Math.floor(elapsed / regenTime);
            
            if (heartsToRegen > 0) {
                this.data.hearts.current = Math.min(
                    this.config.hearts.maxHearts,
                    this.data.hearts.current + heartsToRegen
                );
                
                if (this.data.hearts.current === this.config.hearts.maxHearts) {
                    this.data.hearts.regenStartTime = null;
                } else {
                    this.data.hearts.regenStartTime += heartsToRegen * regenTime;
                }
                
                this.updateHeartsDisplay();
                this.saveData();
            }
        }
    }
    
    recordActivity() {
        const today = new Date().toDateString();
        const lastActivity = this.data.streaks.lastActivityDate;
        
        if (lastActivity === today) {
            return false;
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastActivity === yesterday.toDateString()) {
            this.data.streaks.current++;
        } else if (lastActivity === null || this.isStreakBroken(lastActivity)) {
            this.data.streaks.current = 1;
        }
        
        this.data.streaks.longest = Math.max(this.data.streaks.longest, this.data.streaks.current);
        this.data.streaks.lastActivityDate = today;
        this.data.streaks.totalDays++;
        
        this.updateStreakDisplay();
        this.saveData();
        
        // Célébrations spéciales anglais
        if (this.data.streaks.current === 7) {
            this.showNotification(
                "First Week Complete! 🇬🇧",
                "Amazing! You've studied English for 7 days straight!",
                "🏆"
            );
        } else if (this.data.streaks.current % 30 === 0) {
            this.showNotification(
                "Monthly Master! 🌟",
                `${this.data.streaks.current} days of English learning! Incredible dedication!`,
                "👑"
            );
        }
        
        return true;
    }
    
    isStreakBroken(lastActivity) {
        const lastDate = new Date(lastActivity);
        const today = new Date();
        const diffTime = Math.abs(today - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 1;
    }
    
    addXP(baseXP, isCorrect = true, lessonType = 'standard', bonus = {}) {
        if (!isCorrect) return 0;
        
        let xp = baseXP;
        
        // Bonus streak
        if (this.data.streaks.current > 0) {
            xp *= this.config.xp.streakBonus;
        }
        
        // Bonus type de leçon
        if (lessonType === 'listening') {
            xp *= this.config.xp.listeningBonus;
        } else if (lessonType === 'speaking') {
            xp *= this.config.xp.speakingBonus;
        }
        
        // Bonus parfait
        if (bonus.perfect) {
            xp *= this.config.xp.perfectBonus;
        }
        
        // Bonus première fois
        if (bonus.firstTime) {
            xp *= 1.2;
        }
        
        xp = Math.round(xp);
        
        this.data.xp.total += xp;
        this.data.xp.currentLevelXP += xp;
        
        // Vérification niveau suivant
        while (this.data.xp.currentLevelXP >= this.data.xp.nextLevelXP && this.data.xp.currentLevel < this.config.levels.maxLevel) {
            this.levelUp();
        }
        
        this.updateXPDisplay();
        this.saveData();
        
        return xp;
    }
    
    levelUp() {
        this.data.xp.currentLevelXP -= this.data.xp.nextLevelXP;
        this.data.xp.currentLevel++;
        this.data.xp.nextLevelXP = Math.round(this.config.levels.xpPerLevel * Math.pow(1.1, this.data.xp.currentLevel - 1));
        
        this.unlockNextActivity();
        this.showLevelUpCelebration();
    }
    
    unlockNextActivity() {
        const activities = ['vocabulary', 'grammar', 'listening', 'speaking', 'reading', 'writing'];
        const unlockedCount = activities.filter(activity => this.data.activities[activity].unlocked).length;
        
        if (unlockedCount < activities.length) {
            const nextActivity = activities[unlockedCount];
            this.data.activities[nextActivity].unlocked = true;
            this.showActivityUnlocked(nextActivity);
        }
    }
    
    /**
     * INTERFACE UTILISATEUR ANGLAIS
     */
    initializeUI() {
        this.updateHeartsDisplay();
        this.updateStreakDisplay();
        this.updateXPDisplay();
        this.updateActivitiesDisplay();
        this.startHeartTimer();
    }
    
    updateHeartsDisplay() {
        const heartsContainer = document.getElementById('hearts-display');
        if (!heartsContainer) return;
        
        const currentHearts = this.getCurrentHearts();
        let heartsHTML = '';
        
        for (let i = 0; i < this.config.hearts.maxHearts; i++) {
            const isFilled = i < currentHearts;
            const heartClass = isFilled ? 'filled' : 'empty';
            heartsHTML += `<div class="heart ${heartClass}">❤️</div>`;
        }
        
        const nextHeartTime = this.getNextHeartTime();
        if (nextHeartTime && currentHearts < this.config.hearts.maxHearts) {
            const minutes = Math.floor(nextHeartTime / (1000 * 60));
            const seconds = Math.floor((nextHeartTime % (1000 * 60)) / 1000);
            heartsHTML += `
                <div class="hearts-regeneration">
                    <span>⏱️</span>
                    <span class="hearts-timer">${minutes}:${seconds.toString().padStart(2, '0')}</span>
                </div>
            `;
        }
        
        heartsContainer.innerHTML = heartsHTML;
    }
    
    updateStreakDisplay() {
        const streakContainer = document.getElementById('streak-counter');
        if (!streakContainer) return;
        
        const streak = this.data.streaks.current;
        const isActive = streak > 0;
        
        // Icône dynamique selon streak
        let streakIcon = '💨';
        if (streak >= 30) streakIcon = '👑';
        else if (streak >= 14) streakIcon = '⭐';
        else if (streak >= 7) streakIcon = '🏆';
        else if (streak > 0) streakIcon = '🔥';
        
        streakContainer.innerHTML = `
            <div class="streak-flame ${isActive ? 'active' : ''}">${streakIcon}</div>
            <div class="streak-count">${streak}</div>
            <div class="streak-label">day${streak !== 1 ? 's' : ''} streak</div>
        `;
        
        if (isActive) {
            streakContainer.classList.add('active');
        }
    }
    
    updateXPDisplay() {
        const xpContainer = document.getElementById('xp-bar');
        if (!xpContainer) return;
        
        const progress = (this.data.xp.currentLevelXP / this.data.xp.nextLevelXP) * 100;
        
        xpContainer.innerHTML = `
            <div class="xp-progress" style="width: ${progress}%"></div>
        `;
        
        const xpText = document.getElementById('xp-text');
        if (xpText) {
            xpText.textContent = `Level ${this.data.xp.currentLevel} • ${this.data.xp.currentLevelXP}/${this.data.xp.nextLevelXP} XP`;
        }
    }
    
    updateActivitiesDisplay() {
        Object.entries(this.data.activities).forEach(([activityName, activityData]) => {
            const card = document.querySelector(`.activity-${activityName}`);
            if (!card) return;
            
            // État débloqué/verrouillé
            if (activityData.unlocked) {
                card.classList.remove('locked');
                card.classList.add('english-entrance');
            } else {
                card.classList.add('locked');
            }
            
            // Progression
            const progressBar = card.querySelector('.progress-fill');
            const progressText = card.querySelector('.progress-text');
            
            if (progressBar && progressText) {
                const progress = (activityData.completed / activityData.total) * 100;
                progressBar.style.width = `${progress}%`;
                progressText.textContent = `${activityData.completed}/${activityData.total}`;
            }
            
            // Difficulté
            this.updateDifficultyStars(card, activityData.difficulty);
            
            // Statistiques spécifiques
            this.updateActivityStats(card, activityName, activityData);
            
            // État complété
            if (activityData.completed >= activityData.total) {
                card.classList.add('completed');
                if (activityData.completed === activityData.total && activityData.difficulty === 'expert') {
                    card.classList.add('perfect');
                }
            }
        });
    }
    
    updateDifficultyStars(card, difficulty) {
        const difficultyContainer = card.querySelector('.activity-difficulty');
        if (!difficultyContainer) return;
        
        const difficultyConfig = this.config.difficulty[difficulty];
        const stars = difficultyConfig ? difficultyConfig.stars : 1;
        
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            const starClass = i <= stars ? 'difficulty-star' : 'difficulty-star empty';
            starsHTML += `<span class="${starClass}">⭐</span>`;
        }
        
        difficultyContainer.innerHTML = starsHTML;
    }
    
    updateActivityStats(card, activityName, activityData) {
        const statsContainer = card.querySelector('.activity-stats');
        if (!statsContainer) return;
        
        // Statistiques spécifiques par type d'activité
        let statsHTML = '';
        
        switch (activityName) {
            case 'vocabulary':
                statsHTML = `
                    <div class="stat-item">
                        <div class="stat-value">${activityData.wordsLearned || 0}</div>
                        <div class="stat-label">Words</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${activityData.completed}</div>
                        <div class="stat-label">Lessons</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${Math.round((activityData.completed / activityData.total) * 100)}%</div>
                        <div class="stat-label">Complete</div>
                    </div>
                `;
                break;
                
            case 'listening':
                statsHTML = `
                    <div class="stat-item">
                        <div class="stat-value">${activityData.audioCompleted || 0}</div>
                        <div class="stat-label">Audio</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${Math.round((this.data.stats.listeningTime || 0) / 60)}m</div>
                        <div class="stat-label">Time</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${activityData.completed}</div>
                        <div class="stat-label">Done</div>
                    </div>
                `;
                break;
                
            case 'speaking':
                statsHTML = `
                    <div class="stat-item">
                        <div class="stat-value">${activityData.pronunciationScore || 0}%</div>
                        <div class="stat-label">Accuracy</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${Math.round((this.data.stats.speakingTime || 0) / 60)}m</div>
                        <div class="stat-label">Practice</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${activityData.completed}</div>
                        <div class="stat-label">Sessions</div>
                    </div>
                `;
                break;
                
            default:
                statsHTML = `
                    <div class="stat-item">
                        <div class="stat-value">${activityData.completed}</div>
                        <div class="stat-label">Completed</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${activityData.total}</div>
                        <div class="stat-label">Total</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${Math.round((activityData.completed / activityData.total) * 100)}%</div>
                        <div class="stat-label">Progress</div>
                    </div>
                `;
        }
        
        statsContainer.innerHTML = statsHTML;
    }
    
    /**
     * GESTION DES LEÇONS ANGLAIS
     */
    startLesson(activityType, lessonId) {
        if (!this.data.activities[activityType]?.unlocked) {
            this.showNotification(
                "Activity Locked", 
                "Complete previous activities to unlock this one!", 
                "🔒"
            );
            return false;
        }
        
        if (this.getCurrentHearts() <= 0) {
            this.showNotification(
                "No Hearts Left", 
                "Wait for your hearts to regenerate or come back later!", 
                "💔"
            );
            return false;
        }
        
        this.currentLesson = {
            activityType,
            lessonId,
            startTime: Date.now(),
            questions: 0,
            correct: 0,
            perfect: true,
            lessonData: this.generateLessonData(activityType)
        };
        
        return true;
    }
    
    generateLessonData(activityType) {
        // Données d'exemple pour les différents types d'activités
        const lessonData = {
            vocabulary: {
                words: [
                    { english: 'hello', french: 'bonjour', phonetic: '/həˈloʊ/' },
                    { english: 'goodbye', french: 'au revoir', phonetic: '/ɡʊdˈbaɪ/' },
                    { english: 'please', french: 's\'il vous plaît', phonetic: '/pliːz/' },
                    { english: 'thank you', french: 'merci', phonetic: '/θæŋk juː/' },
                    { english: 'water', french: 'eau', phonetic: '/ˈwɔːtər/' }
                ]
            },
            listening: {
                sentences: [
                    { text: 'Hello, how are you?', difficulty: 'easy' },
                    { text: 'What time is it?', difficulty: 'easy' },
                    { text: 'I would like some water, please.', difficulty: 'medium' }
                ]
            },
            speaking: {
                prompts: [
                    { text: 'Say: Hello', expected: 'hello' },
                    { text: 'Say: Thank you', expected: 'thank you' },
                    { text: 'Say: Good morning', expected: 'good morning' }
                ]
            }
        };
        
        return lessonData[activityType] || {};
    }
    
    answerQuestion(isCorrect, answerData = {}) {
        if (!this.currentLesson) return;
        
        this.currentLesson.questions++;
        this.data.stats.totalQuestions++;
        
        if (isCorrect) {
            this.currentLesson.correct++;
            this.data.stats.correctAnswers++;
            
            // XP selon type d'activité
            const xpGained = this.addXP(
                this.config.xp.perQuestion, 
                true, 
                this.currentLesson.activityType,
                { firstTime: answerData.firstTime }
            );
            
            this.showXPGain(xpGained);
            
            // Vocabulaire appris
            if (this.currentLesson.activityType === 'vocabulary' && answerData.word) {
                this.addToVocabulary(answerData.word);
            }
            
        } else {
            this.currentLesson.perfect = false;
            
            const hasHearts = this.loseHeart();
            if (!hasHearts) {
                this.endLesson(true);
                return false;
            }
        }
        
        return true;
    }
    
    addToVocabulary(word) {
        if (!this.data.vocabulary.learned.find(w => w.english === word.english)) {
            this.data.vocabulary.learned.push({
                ...word,
                learnedAt: new Date().toISOString(),
                reviewCount: 0,
                masteryLevel: 1
            });
            
            this.data.stats.vocabularyMastered++;
        }
    }
    
    completeLesson() {
        if (!this.currentLesson) return;
        
        const { activityType, questions, correct } = this.currentLesson;
        const score = Math.round((correct / questions) * 100);
        
        // XP de fin de leçon
        let bonusXP = this.config.xp.minimumPerLesson;
        bonusXP = this.addXP(bonusXP, true, activityType, { 
            perfect: this.currentLesson.perfect 
        });
        
        // Mise à jour progression
        this.data.activities[activityType].completed++;
        this.data.stats.sessionsCompleted++;
        this.data.stats.totalTime += Date.now() - this.currentLesson.startTime;
        
        if (this.currentLesson.perfect) {
            this.data.stats.perfectLessons++;
        }
        
        // Temps spécifique aux activités audio
        if (activityType === 'listening') {
            this.data.stats.listeningTime += Date.now() - this.currentLesson.startTime;
        } else if (activityType === 'speaking') {
            this.data.stats.speakingTime += Date.now() - this.currentLesson.startTime;
        }
        
        this.recordActivity();
        this.saveData();
        this.updateActivitiesDisplay();
        
        this.showLessonResults(score, bonusXP, this.currentLesson.perfect);
        this.currentLesson = null;
    }
    
    /**
     * ANIMATIONS ET NOTIFICATIONS ANGLAIS
     */
    showAudioAnimation(isPlaying) {
        const audioElements = document.querySelectorAll('.audio-wave .wave-bar');
        audioElements.forEach(bar => {
            if (isPlaying) {
                bar.style.animationPlayState = 'running';
            } else {
                bar.style.animationPlayState = 'paused';
            }
        });
    }
    
    animateHeartLoss() {
        const hearts = document.querySelectorAll('.heart.filled');
        if (hearts.length > 0) {
            const lastHeart = hearts[hearts.length - 1];
            lastHeart.classList.add('lost');
            
            setTimeout(() => {
                lastHeart.classList.remove('filled', 'lost');
                lastHeart.classList.add('empty');
            }, 500);
        }
    }
    
    showActivityUnlocked(activityName) {
        const activityNames = {
            vocabulary: "Vocabulary",
            grammar: "Grammar",
            listening: "Listening",
            speaking: "Speaking",
            reading: "Reading",
            writing: "Writing"
        };
        
        this.showNotification(
            "New Activity Unlocked!",
            `${activityNames[activityName]} is now available!`,
            "🎯"
        );
        
        // Animation déverrouillage
        const card = document.querySelector(`.activity-${activityName}`);
        if (card) {
            card.classList.add('activity-unlock');
        }
    }
    
    showLevelUpCelebration() {
        const messages = [
            "Level Up! Well done! 🌟",
            "Amazing progress! Keep it up! ⭐",
            "You're getting better! Great job! 🏆",
            "Fantastic! English mastery unlocked! 👑"
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        this.showNotification(
            `Level ${this.data.xp.currentLevel} Reached!`,
            randomMessage,
            "🎉"
        );
    }
    
    showXPGain(xp) {
        const xpIndicator = document.createElement('div');
        xpIndicator.className = 'xp-gain-indicator';
        xpIndicator.textContent = `+${xp} XP`;
        xpIndicator.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--english-primary);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: bold;
            z-index: 1000;
            animation: xpGainFloat 2s ease-out forwards;
            box-shadow: 0 4px 12px rgba(26, 188, 156, 0.3);
        `;
        
        document.body.appendChild(xpIndicator);
        setTimeout(() => xpIndicator.remove(), 2000);
    }
    
    showLessonResults(score, xpGained, perfect) {
        let message = `Score: ${score}% • +${xpGained} XP`;
        if (perfect) message += " • Perfect! 🌟";
        
        const encouragements = {
            100: "Perfect! Outstanding! 🌟",
            90: "Excellent work! 🎉", 
            80: "Great job! 👍",
            70: "Good progress! 👌",
            60: "Keep practicing! 💪"
        };
        
        const encouragementKey = Object.keys(encouragements)
            .reverse()
            .find(key => score >= parseInt(key));
            
        const encouragement = encouragements[encouragementKey] || "Keep trying! 🤗";
        
        this.showNotification(
            "Lesson Complete!",
            `${message}\n${encouragement}`,
            score >= 80 ? "🎉" : "👍"
        );
    }
    
    showNotification(title, message, icon = "🎉") {
        const notification = document.createElement('div');
        notification.className = 'notification-overlay';
        notification.innerHTML = `
            <div class="notification">
                <div class="notification-icon">${icon}</div>
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
                <button class="english-btn english-btn-primary" onclick="this.closest('.notification-overlay').remove()">
                    Awesome! 👍
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    /**
     * UTILITAIRES AVANCÉS
     */
    getNextHeartTime() {
        if (!this.data.hearts.regenStartTime || this.data.hearts.current >= this.config.hearts.maxHearts) {
            return null;
        }
        
        const elapsed = Date.now() - this.data.hearts.regenStartTime;
        const regenTime = this.config.hearts.regenTimeMinutes * 60 * 1000;
        const timeToNext = regenTime - (elapsed % regenTime);
        
        return timeToNext;
    }
    
    startDailyCheck() {
        setInterval(() => {
            this.checkDailyStreak();
        }, 60000);
    }
    
    checkDailyStreak() {
        const now = new Date();
        const hour = now.getHours();
        
        if (hour === this.config.streaks.notificationHour) {
            const today = now.toDateString();
            if (this.data.streaks.lastActivityDate !== today) {
                this.showNotification(
                    "Don't forget your English!",
                    "Practice at least one activity to keep your streak! 🔥",
                    "⏰"
                );
            }
        }
    }
    
    startHeartTimer() {
        setInterval(() => {
            this.updateHeartsDisplay();
        }, 1000);
    }
    
    /**
     * API PUBLIQUE POUR DEBUG ET TESTS
     */
    getStats() {
        return {
            hearts: this.getCurrentHearts(),
            streak: this.data.streaks.current,
            level: this.data.xp.currentLevel,
            totalXP: this.data.xp.total,
            vocabularySize: this.data.vocabulary.learned.length,
            activitiesUnlocked: Object.values(this.data.activities).filter(a => a.unlocked).length,
            accuracy: this.data.stats.totalQuestions > 0 ? 
                Math.round((this.data.stats.correctAnswers / this.data.stats.totalQuestions) * 100) : 0,
            totalTime: Math.round(this.data.stats.totalTime / (1000 * 60)), // en minutes
            perfectLessons: this.data.stats.perfectLessons
        };
    }
    
    resetProgress() {
        if (confirm('⚠️ Delete all English progress?')) {
            localStorage.removeItem(this.storageKey);
            location.reload();
        }
    }
    
    exportData() {
        const exportData = {
            ...this.data,
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `english_progress_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialisation globale
let englishGame;

document.addEventListener('DOMContentLoaded', () => {
    englishGame = new EnglishGameSystem();
    
    // Exposition pour debug
    window.EnglishDebug = {
        getStats: () => englishGame.getStats(),
        resetProgress: () => englishGame.resetProgress(),
        exportData: () => englishGame.exportData(),
        addXP: (amount, type = 'standard') => englishGame.addXP(amount, true, type, {}),
        loseHeart: () => englishGame.loseHeart(),
        playAudio: (text, slow = false) => englishGame.playAudio(text, { slow }),
        testSpeech: (text) => englishGame.startSpeechRecognition(text, console.log),
        getAppInstance: () => englishGame
    };
});

// Styles CSS pour animations spécifiques anglais
const englishStyle = document.createElement('style');
englishStyle.textContent = `
    @keyframes xpGainFloat {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        50% {
            transform: translate(-50%, -60%) scale(1.2);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -70%) scale(1);
        }
    }
    
    .activity-unlock {
        animation: activity-unlock 1s ease-out;
    }
    
    @keyframes activity-unlock {
        0% {
            transform: scale(0.8) rotateY(-90deg);
            opacity: 0;
        }
        50% {
            transform: scale(1.1) rotateY(0deg);
        }
        100% {
            transform: scale(1) rotateY(0deg);
            opacity: 1;
        }
    }
`;
document.head.appendChild(englishStyle);