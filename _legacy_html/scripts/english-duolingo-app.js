// english-duolingo-app.js - Logique principale Alpine.js pour section anglais gamifiée

// ===== CONFIGURATION GLOBALE =====
const DUOLINGO_CONFIG = {
  storage: {
    prefix: 'lemondedescurieux_english_',
    keys: {
      streak: 'streak_data',
      hearts: 'hearts_data', 
      xp: 'xp_data',
      stats: 'stats_data',
      badges: 'badges_data',
      progress: 'progress_data'
    }
  },
  
  gameplay: {
    maxHearts: 5,
    heartRegenTime: 30 * 60 * 1000, // 30 minutes en ms
    xpPerCorrectAnswer: 10,
    xpStreakMultiplier: 1.5,
    xpPerfectBonus: 50,
    questionsPerLesson: 10
  },
  
  badges: {
    firstLesson: { id: 'first_lesson', name: 'Premier Pas', icon: '🎯', xpReward: 25 },
    streak3: { id: 'streak_3', name: 'Régularité', icon: '🔥', xpReward: 50 },
    streak7: { id: 'streak_7', name: 'Dévotion', icon: '💎', xpReward: 100 },
    perfectLesson: { id: 'perfect_lesson', name: 'Perfection', icon: '⭐', xpReward: 75 },
    speedster: { id: 'speedster', name: 'Éclair', icon: '⚡', xpReward: 40 }
  }
};

// ===== COMPOSANT ALPINE.JS PRINCIPAL =====
function englishDuolingoApp() {
  return {
    // ===== ÉTAT RÉACTIF =====
    
    // Navigation et écrans
    currentScreen: 'home', // 'home', 'lesson', 'results'
    lessonType: null, // 'vocabulary', 'listening', 'grammar', 'speaking'
    
    // Données gamification
    streak: {
      current: 0,
      longest: 0,
      lastActivityDate: null
    },
    
    hearts: {
      current: 5,
      lastLoss: null,
      regenStartTime: null,
      isLosing: false,
      regenTimeText: ''
    },
    
    xp: {
      current: 0,
      sessionXP: 0,
      totalEarned: 0
    },
    
    stats: {
      lessonsCompleted: 0,
      correctAnswers: 0,
      totalQuestions: 0,
      averageTime: 0,
      favoriteLessonType: null
    },
    
    // État de la leçon
    currentQuestion: 0,
    totalQuestions: 10,
    questions: [],
    currentQuestionData: null,
    userAnswer: '',
    selectedGrammar: '',
    isAnswered: false,
    correctAnswers: 0,
    sessionStartTime: null,
    questionStartTime: null,
    
    // Feedback et résultats
    feedbackType: '', // 'correct', 'incorrect'
    feedbackMessage: '',
    feedbackExplanation: '',
    showHeartLossModal: false,
    heartLossMessage: '',
    
    // Badges et récompenses
    newBadges: [],
    streakBonus: 0,
    perfectBonus: 0,
    isStreakMilestone: false,
    
    // Enregistrement audio (pour speaking)
    isRecording: false,
    hasRecording: false,
    mediaRecorder: null,
    audioChunks: [],
    
    // ===== MÉTHODES D'INITIALISATION =====
    
    async initializeApp() {
      console.log('🎮 Initializing English Duolingo App...');
      
      try {
        // Charger toutes les données sauvegardées
        this.loadAllData();
        
        // Mettre à jour les systèmes temps-réel
        this.updateHeartRegeneration();
        this.checkStreakStatus();
        
        // Démarrer les timers
        this.startHeartRegenTimer();
        
        console.log('✅ App initialized successfully');
        console.log('📊 Current stats:', {
          streak: this.streak.current,
          hearts: this.hearts.current,
          xp: this.xp.current,
          level: Math.floor(this.xp.current / 100)
        });
        
      } catch (error) {
        console.error('❌ Error initializing app:', error);
        this.handleError('Erreur d\'initialisation', error);
      }
    },
    
    loadAllData() {
      // Charger streak
      const streakData = this.getStorageItem('streak');
      if (streakData) {
        this.streak = { ...this.streak, ...streakData };
      }
      
      // Charger hearts
      const heartsData = this.getStorageItem('hearts');
      if (heartsData) {
        this.hearts = { ...this.hearts, ...heartsData };
      }
      
      // Charger XP
      const xpData = this.getStorageItem('xp');
      if (xpData) {
        this.xp = { ...this.xp, ...xpData };
      }
      
      // Charger stats
      const statsData = this.getStorageItem('stats');
      if (statsData) {
        this.stats = { ...this.stats, ...statsData };
      }
    },
    
    // ===== GESTION LOCALSTORAGE =====
    
    getStorageItem(key) {
      try {
        const item = localStorage.getItem(DUOLINGO_CONFIG.storage.prefix + key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error(`Error loading ${key}:`, error);
        return null;
      }
    },
    
    setStorageItem(key, data) {
      try {
        localStorage.setItem(DUOLINGO_CONFIG.storage.prefix + key, JSON.stringify(data));
      } catch (error) {
        console.error(`Error saving ${key}:`, error);
      }
    },
    
    saveAllData() {
      this.setStorageItem('streak', this.streak);
      this.setStorageItem('hearts', this.hearts);
      this.setStorageItem('xp', this.xp);
      this.setStorageItem('stats', this.stats);
    },
    
    // ===== SYSTÈME STREAK =====
    
    checkStreakStatus() {
      const today = new Date().toDateString();
      const lastActivity = this.streak.lastActivityDate;
      
      if (!lastActivity) {
        console.log('📅 Premier jour d\'activité');
        return;
      }
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastActivity === today) {
        console.log('✅ Activité déjà enregistrée aujourd\'hui');
        return;
      }
      
      if (lastActivity !== yesterday.toDateString()) {
        console.log('💔 Streak cassé - reset à 0');
        this.streak.current = 0;
        this.saveAllData();
      }
    },
    
    updateStreak() {
      const today = new Date().toDateString();
      
      if (this.streak.lastActivityDate === today) {
        return; // Déjà fait aujourd'hui
      }
      
      this.streak.current++;
      this.streak.longest = Math.max(this.streak.longest, this.streak.current);
      this.streak.lastActivityDate = today;
      
      // Vérifier milestones
      if (this.streak.current % 7 === 0) {
        this.isStreakMilestone = true;
        setTimeout(() => this.isStreakMilestone = false, 3000);
      }
      
      // Badges streak
      this.checkStreakBadges();
      
      console.log(`🔥 Streak mis à jour: ${this.streak.current} jours`);
      this.saveAllData();
    },
    
    checkStreakBadges() {
      if (this.streak.current === 3) {
        this.awardBadge(DUOLINGO_CONFIG.badges.streak3);
      } else if (this.streak.current === 7) {
        this.awardBadge(DUOLINGO_CONFIG.badges.streak7);
      }
    },
    
    // ===== SYSTÈME CŒURS =====
    
    loseHeart(message = 'Réponse incorrecte') {
      if (this.hearts.current <= 0) {
        return false;
      }
      
      this.hearts.current--;
      this.hearts.lastLoss = Date.now();
      this.hearts.isLosing = true;
      
      // Démarrer régénération si c'était le premier cœur perdu
      if (this.hearts.current === 4 && !this.hearts.regenStartTime) {
        this.hearts.regenStartTime = Date.now();
      }
      
      // Animation perte de cœur
      setTimeout(() => {
        this.hearts.isLosing = false;
      }, 600);
      
      // Afficher modal si plus de cœurs
      if (this.hearts.current === 0) {
        this.heartLossMessage = message;
        this.showHeartLossModal = true;
      }
      
      this.saveAllData();
      console.log(`💔 Cœur perdu: ${this.hearts.current}/5 restants`);
      
      return this.hearts.current > 0;
    },
    
    updateHeartRegeneration() {
      if (this.hearts.current >= 5) {
        this.hearts.regenStartTime = null;
        return;
      }
      
      if (!this.hearts.regenStartTime) {
        return;
      }
      
      const now = Date.now();
      const elapsed = now - this.hearts.regenStartTime;
      const regenInterval = DUOLINGO_CONFIG.gameplay.heartRegenTime;
      
      // Calculer combien de cœurs ont été régénérés
      const heartsToRegen = Math.floor(elapsed / regenInterval);
      
      if (heartsToRegen > 0) {
        const newHearts = Math.min(5, this.hearts.current + heartsToRegen);
        this.hearts.current = newHearts;
        
        if (newHearts >= 5) {
          this.hearts.regenStartTime = null;
          this.hearts.regenTimeText = '';
        } else {
          this.hearts.regenStartTime += heartsToRegen * regenInterval;
        }
        
        this.saveAllData();
        console.log(`❤️ Cœurs régénérés: ${newHearts}/5`);
      }
    },
    
    startHeartRegenTimer() {
      setInterval(() => {
        this.updateHeartRegeneration();
        this.updateHeartRegenText();
      }, 1000);
    },
    
    updateHeartRegenText() {
      if (this.hearts.current >= 5 || !this.hearts.regenStartTime) {
        this.hearts.regenTimeText = '';
        return;
      }
      
      const now = Date.now();
      const nextRegenTime = this.hearts.regenStartTime + DUOLINGO_CONFIG.gameplay.heartRegenTime;
      const timeLeft = Math.max(0, nextRegenTime - now);
      
      const minutes = Math.floor(timeLeft / 60000);
      const seconds = Math.floor((timeLeft % 60000) / 1000);
      
      this.hearts.regenTimeText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    },
    
    // ===== SYSTÈME XP ET BADGES =====
    
    awardXP(amount, reason = '') {
      this.xp.current += amount;
      this.xp.sessionXP += amount;
      this.xp.totalEarned += amount;
      
      console.log(`⭐ +${amount} XP ${reason ? '(' + reason + ')' : ''}`);
      this.saveAllData();
    },
    
    awardBadge(badge) {
      // Vérifier si déjà obtenu
      const existingBadges = this.getStorageItem('badges') || [];
      if (existingBadges.find(b => b.id === badge.id)) {
        return;
      }
      
      // Ajouter à la liste
      const newBadge = {
        ...badge,
        earnedAt: new Date().toISOString()
      };
      
      existingBadges.push(newBadge);
      this.setStorageItem('badges', existingBadges);
      
      // Ajouter à l'affichage temporaire
      this.newBadges.push(newBadge);
      
      // Bonus XP
      if (badge.xpReward) {
        this.awardXP(badge.xpReward, `Badge ${badge.name}`);
      }
      
      console.log(`🏆 Nouveau badge: ${badge.name}`);
    },
    
    // ===== NAVIGATION =====
    
    goBack() {
      if (this.currentScreen === 'lesson') {
        // Confirmer abandon
        if (confirm('Abandonner la leçon en cours ?')) {
          this.goHome();
        }
      } else {
        window.history.back();
      }
    },
    
    goHome() {
      this.currentScreen = 'home';
      this.resetLessonState();
    },
    
    startNewLesson() {
      this.currentScreen = 'home';
      this.resetLessonState();
    },
    
    // ===== GESTION DES LEÇONS =====
    
    async startLesson(type) {
      if (this.hearts.current <= 0) {
        this.showHeartLossModal = true;
        this.heartLossMessage = 'Tu n\'as plus de cœurs ! Attends qu\'ils se régénèrent.';
        return;
      }
      
      console.log(`🎯 Démarrage leçon: ${type}`);
      
      this.lessonType = type;
      this.currentScreen = 'lesson';
      this.sessionStartTime = Date.now();
      this.currentQuestion = 1;
      this.correctAnswers = 0;
      this.xp.sessionXP = 0;
      this.newBadges = [];
      
      // Générer questions selon le type
      await this.generateQuestions(type);
      this.loadCurrentQuestion();
    },
    
    async generateQuestions(type) {
      // Cette méthode sera étendue avec le contenu de la base de données
      const questionGenerators = {
        vocabulary: () => this.generateVocabularyQuestions(),
        listening: () => this.generateListeningQuestions(),
        grammar: () => this.generateGrammarQuestions(),
        speaking: () => this.generateSpeakingQuestions()
      };
      
      const generator = questionGenerators[type];
      if (generator) {
        this.questions = generator();
        this.totalQuestions = this.questions.length;
      } else {
        console.error('Type de leçon inconnu:', type);
        this.questions = [];
      }
    },
    
    generateVocabularyQuestions() {
      // Questions de vocabulaire basiques - sera étendu avec la vraie DB
      const words = [
        { word: 'Apple', correct: 'Pomme', options: ['Pomme', 'Orange', 'Banane', 'Poire'] },
        { word: 'House', correct: 'Maison', options: ['Maison', 'Voiture', 'École', 'Magasin'] },
        { word: 'Cat', correct: 'Chat', options: ['Chat', 'Chien', 'Oiseau', 'Poisson'] },
        { word: 'Book', correct: 'Livre', options: ['Livre', 'Stylo', 'Cahier', 'Table'] },
        { word: 'Water', correct: 'Eau', options: ['Eau', 'Lait', 'Jus', 'Café'] }
      ];
      
      return words.slice(0, DUOLINGO_CONFIG.gameplay.questionsPerLesson).map((item, index) => ({
        id: index + 1,
        type: 'vocabulary',
        word: item.word,
        correct: item.correct,
        options: this.shuffleArray([...item.options]),
        explanation: `"${item.word}" se traduit par "${item.correct}" en français.`
      }));
    },
    
    generateListeningQuestions() {
      // Questions d'écoute - placeholder
      return [
        {
          id: 1,
          type: 'listening',
          audioUrl: 'audio/hello.mp3',
          slowAudioUrl: 'audio/hello-slow.mp3',
          correct: 'Hello',
          explanation: 'L\'audio dit "Hello", qui signifie "Bonjour".'
        }
      ];
    },
    
    generateGrammarQuestions() {
      // Questions de grammaire
      return [
        {
          id: 1,
          type: 'grammar',
          sentenceStart: 'I',
          sentenceEnd: 'a student.',
          grammarOptions: ['am', 'is', 'are'],
          correct: 'am',
          explanation: 'Avec "I", on utilise toujours "am".'
        }
      ];
    },
    
    generateSpeakingQuestions() {
      // Questions d'expression orale
      return [
        {
          id: 1,
          type: 'speaking',
          frenchPhrase: 'Bonjour, comment allez-vous ?',
          expectedEnglish: 'Hello, how are you?',
          explanation: 'Une salutation polie en anglais.'
        }
      ];
    },
    
    loadCurrentQuestion() {
      if (this.currentQuestion <= this.totalQuestions) {
        this.currentQuestionData = this.questions[this.currentQuestion - 1];
        this.resetQuestionState();
        this.questionStartTime = Date.now();
        console.log(`❓ Question ${this.currentQuestion}:`, this.currentQuestionData);
      }
    },
    
    resetQuestionState() {
      this.isAnswered = false;
      this.userAnswer = '';
      this.selectedGrammar = '';
      this.feedbackType = '';
      this.feedbackMessage = '';
      this.feedbackExplanation = '';
    },
    
    resetLessonState() {
      this.currentQuestion = 0;
      this.totalQuestions = 0;
      this.questions = [];
      this.currentQuestionData = null;
      this.correctAnswers = 0;
      this.lessonType = null;
      this.sessionStartTime = null;
      this.resetQuestionState();
    },
    
    // ===== RÉPONSES ET FEEDBACK =====
    
    selectAnswer(answer) {
      if (this.isAnswered) return;
      
      const isCorrect = answer === this.currentQuestionData.correct;
      this.processAnswer(isCorrect, answer);
    },
    
    checkTextAnswer() {
      if (this.isAnswered || !this.userAnswer.trim()) return;
      
      const isCorrect = this.userAnswer.trim().toLowerCase() === this.currentQuestionData.correct.toLowerCase();
      this.processAnswer(isCorrect, this.userAnswer);
    },
    
    checkGrammarAnswer() {
      if (this.isAnswered || !this.selectedGrammar) return;
      
      const isCorrect = this.selectedGrammar === this.currentQuestionData.correct;
      this.processAnswer(isCorrect, this.selectedGrammar);
    },
    
    processAnswer(isCorrect, userAnswer) {
      this.isAnswered = true;
      const questionTime = Date.now() - this.questionStartTime;
      
      if (isCorrect) {
        this.correctAnswers++;
        this.feedbackType = 'correct';
        this.feedbackMessage = this.getCorrectFeedback();
        
        // XP de base
        let xpEarned = DUOLINGO_CONFIG.gameplay.xpPerCorrectAnswer;
        
        // Bonus vitesse (réponse en moins de 5 secondes)
        if (questionTime < 5000) {
          xpEarned += 5;
          this.checkSpeedBadge();
        }
        
        this.awardXP(xpEarned, 'Bonne réponse');
        
      } else {
        this.feedbackType = 'incorrect';
        this.feedbackMessage = this.getIncorrectFeedback();
        
        // Perdre un cœur
        const canContinue = this.loseHeart();
        if (!canContinue) {
          setTimeout(() => this.endLesson(), 2000);
          return;
        }
      }
      
      // Explication
      if (this.currentQuestionData.explanation) {
        this.feedbackExplanation = this.currentQuestionData.explanation;
      }
      
      // Stats
      this.updateQuestionStats(isCorrect, questionTime);
    },
    
    getCorrectFeedback() {
      const messages = [
        'Excellent !', 'Parfait !', 'Bravo !', 'Super !', 
        'Très bien !', 'Fantastique !', 'Génial !'
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    },
    
    getIncorrectFeedback() {
      const messages = [
        'Pas tout à fait...', 'Presque !', 'Continue !', 
        'Ne t\'inquiète pas !', 'Tu vas y arriver !', 'Réessaie !'
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    },
    
    updateQuestionStats(isCorrect, time) {
      this.stats.totalQuestions++;
      if (isCorrect) {
        this.stats.correctAnswers++;
      }
      
      // Moyenne du temps
      this.stats.averageTime = (this.stats.averageTime * (this.stats.totalQuestions - 1) + time) / this.stats.totalQuestions;
      
      this.saveAllData();
    },
    
    checkSpeedBadge() {
      const existingBadges = this.getStorageItem('badges') || [];
      if (!existingBadges.find(b => b.id === 'speedster')) {
        this.awardBadge(DUOLINGO_CONFIG.badges.speedster);
      }
    },
    
    // ===== PROGRESSION ET FIN =====
    
    nextQuestion() {
      if (this.currentQuestion < this.totalQuestions) {
        this.currentQuestion++;
        this.loadCurrentQuestion();
      } else {
        this.endLesson();
      }
    },
    
    endLesson() {
      console.log('🏁 Fin de leçon');
      
      // Calculer bonus
      this.calculateBonuses();
      
      // Mettre à jour streak
      this.updateStreak();
      
      // Stats de session
      this.stats.lessonsCompleted++;
      
      // Premier badge leçon
      if (this.stats.lessonsCompleted === 1) {
        this.awardBadge(DUOLINGO_CONFIG.badges.firstLesson);
      }
      
      // Badge parfait
      if (this.correctAnswers === this.totalQuestions) {
        this.awardBadge(DUOLINGO_CONFIG.badges.perfectLesson);
      }
      
      this.saveAllData();
      this.currentScreen = 'results';
    },
    
    calculateBonuses() {
      // Bonus streak
      if (this.streak.current > 0) {
        this.streakBonus = Math.floor(this.xp.sessionXP * (DUOLINGO_CONFIG.gameplay.xpStreakMultiplier - 1));
        this.awardXP(this.streakBonus, 'Bonus streak');
      }
      
      // Bonus parfait
      if (this.correctAnswers === this.totalQuestions) {
        this.perfectBonus = DUOLINGO_CONFIG.gameplay.xpPerfectBonus;
        this.awardXP(this.perfectBonus, 'Parcours parfait');
      }
    },
    
    // ===== UTILITAIRES =====
    
    shuffleArray(array) {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    },
    
    getDifficultyClass(type) {
      const difficulties = {
        vocabulary: 'easy',
        listening: 'medium', 
        grammar: 'medium',
        speaking: 'hard'
      };
      return difficulties[type] || 'medium';
    },
    
    getOptionClass(option) {
      if (!this.isAnswered) return '';
      
      if (option === this.currentQuestionData.correct) {
        return 'correct';
      } else if (option === this.userAnswer || option === this.selectedGrammar) {
        return 'incorrect';
      }
      
      return '';
    },
    
    // ===== RÉSULTATS =====
    
    getResultsClass() {
      const percentage = (this.correctAnswers / this.totalQuestions) * 100;
      if (percentage >= 80) return 'excellent';
      if (percentage >= 60) return 'good';
      return 'needs-work';
    },
    
    getResultsIcon() {
      const percentage = (this.correctAnswers / this.totalQuestions) * 100;
      if (percentage >= 80) return '🏆';
      if (percentage >= 60) return '👍';
      return '💪';
    },
    
    getResultsTitle() {
      const percentage = (this.correctAnswers / this.totalQuestions) * 100;
      if (percentage >= 80) return 'Excellent travail !';
      if (percentage >= 60) return 'Bon travail !';
      return 'Continue tes efforts !';
    },
    
    getResultsMessage() {
      const percentage = (this.correctAnswers / this.totalQuestions) * 100;
      if (percentage >= 80) return 'Tu maîtrises très bien cette leçon !';
      if (percentage >= 60) return 'Tu progresses bien, continue !';
      return 'Révise et réessaie, tu vas y arriver !';
    },
    
    // ===== MODALS =====
    
    closeHeartLossModal() {
      this.showHeartLossModal = false;
      
      if (this.hearts.current === 0) {
        this.goHome();
      }
    },
    
    // ===== FONCTIONNALITÉS AUDIO =====
    
    playAudio() {
      // Placeholder pour lecture audio normal
      console.log('🔊 Lecture audio normal');
    },
    
    playSlowAudio() {
      // Placeholder pour lecture audio lent
      console.log('🐌 Lecture audio lent');
    },
    
    async toggleRecording() {
      if (!this.isRecording) {
        await this.startRecording();
      } else {
        this.stopRecording();
      }
    },
    
    async startRecording() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];
        
        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };
        
        this.mediaRecorder.onstop = () => {
          this.hasRecording = true;
        };
        
        this.mediaRecorder.start();
        this.isRecording = true;
        console.log('🎤 Enregistrement démarré');
        
      } catch (error) {
        console.error('Erreur enregistrement:', error);
        alert('Impossible d\'accéder au microphone');
      }
    },
    
    stopRecording() {
      if (this.mediaRecorder && this.isRecording) {
        this.mediaRecorder.stop();
        this.isRecording = false;
        console.log('⏹️ Enregistrement arrêté');
      }
    },
    
    playRecording() {
      if (this.audioChunks.length > 0) {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
        console.log('🔊 Lecture enregistrement');
      }
    },
    
    submitRecording() {
      // Pour l'instant, on considère l'enregistrement comme correct
      // Dans une version avancée, on pourrait utiliser speech-to-text
      this.processAnswer(true, 'Enregistrement vocal');
    },
    
    // ===== GESTION D'ERREURS =====
    
    handleError(message, error) {
      console.error(message, error);
      alert(`Erreur: ${message}. Vérifiez la console pour plus de détails.`);
    }
  };
}

// ===== EXPORT GLOBAL =====
window.englishDuolingoApp = englishDuolingoApp;

console.log('🎮 English Duolingo App script loaded successfully');