/* ============================================================================
   CONTRÔLEUR PRINCIPAL - FRANÇAIS
   Fichier: scripts/francais-app.js
   ============================================================================ */

class FrancaisApp {
  constructor() {
    console.log('🎮 Initialisation FrancaisApp...');
    
    // Vérifier les dépendances
    this.checkDependencies();
    
    // Initialiser les systèmes
    this.initializeSystems();
    
    // Charger les données utilisateur
    this.userProgress = this.loadUserProgress();
    
    // État de la session
    this.currentLesson = null;
    this.currentExercise = 0;
    this.sessionScore = 0;
    this.sessionStartTime = Date.now();
    this.selectedAnswer = null;
    
    // Configurer l'interface
    this.setupEventListeners();
    this.renderDashboard();
    this.renderLessons();
    
    console.log('✅ FrancaisApp initialisée avec succès !');
  }
  
  checkDependencies() {
    const required = ['FRANCAIS_LESSONS_DATA', 'FrancaisStreaks', 'FrancaisHearts'];
    const missing = required.filter(dep => typeof window[dep] === 'undefined');
    
    if (missing.length > 0) {
      console.warn('⚠️ Dépendances manquantes:', missing);
    }
  }
  
  initializeSystems() {
    // Initialiser les sous-systèmes
    try {
      this.streakSystem = new FrancaisStreaks();
    } catch (e) {
      console.warn('⚠️ Streak system non disponible');
    }
    
    try {
      this.heartsSystem = new FrancaisHearts();
    } catch (e) {
      console.warn('⚠️ Hearts system non disponible');
    }
  }
  
  loadUserProgress() {
    const stored = localStorage.getItem('francais_user_progress');
    if (stored) {
      return JSON.parse(stored);
    }
    
    return {
      totalXP: 0,
      lessonsCompleted: 0,
      lessons: {},
      achievements: [],
      level: 1
    };
  }
  
  saveUserProgress() {
    localStorage.setItem('francais_user_progress', JSON.stringify(this.userProgress));
  }
  
  setupEventListeners() {
    // Bouton commencer l'apprentissage
    const startBtn = document.getElementById('start-learning-btn');
    if (startBtn) {
      startBtn.onclick = () => this.showAvailableLessons();
    }
    
    // Bouton voir progression
    const progressBtn = document.getElementById('view-progress-btn');
    if (progressBtn) {
      progressBtn.onclick = () => this.showDetailedProgress();
    }
    
    // Bouton continuer (overlay de célébration)
    const celebrationBtn = document.getElementById('celebration-continue-btn');
    if (celebrationBtn) {
      celebrationBtn.onclick = () => this.hideCelebration();
    }
  }
  
  renderDashboard() {
    // Mettre à jour streak
    if (this.streakSystem) {
      const streak = this.streakSystem.getCurrentStreak();
      const streakElement = document.getElementById('streak-count');
      if (streakElement) {
        streakElement.textContent = streak;
      }
    }
    
    // Mettre à jour cœurs
    if (this.heartsSystem) {
      this.heartsSystem.updateDisplay();
    }
    
    // Mettre à jour XP
    this.updateXPDisplay();
    
    // Mettre à jour statistiques
    this.updateStats();
  }
  
  updateXPDisplay() {
    const totalXP = this.userProgress.totalXP || 0;
    const level = Math.floor(totalXP / 100) + 1;
    const xpInLevel = totalXP % 100;
    const xpProgress = (xpInLevel / 100) * 100;
    
    const xpBar = document.getElementById('xp-progress');
    const xpText = document.getElementById('xp-text');
    
    if (xpBar) {
      xpBar.style.width = xpProgress + '%';
    }
    
    if (xpText) {
      xpText.textContent = `Niveau ${level} - ${xpInLevel}/100 XP`;
    }
  }
  
  updateStats() {
    // Leçons terminées
    const lessonsElement = document.getElementById('lessons-completed');
    if (lessonsElement) {
      lessonsElement.textContent = this.userProgress.lessonsCompleted || 0;
    }
    
    // Meilleur streak
    const streakElement = document.getElementById('best-streak');
    if (streakElement && this.streakSystem) {
      streakElement.textContent = this.streakSystem.getBestStreak();
    }
    
    // Précision
    const accuracyElement = document.getElementById('accuracy-rate');
    if (accuracyElement) {
      const lessons = Object.values(this.userProgress.lessons);
      if (lessons.length > 0) {
        const avgScore = lessons.reduce((sum, lesson) => sum + (lesson.score || 0), 0) / lessons.length;
        accuracyElement.textContent = Math.round(avgScore) + '%';
      } else {
        accuracyElement.textContent = '0%';
      }
    }
    
    // Temps total
    const timeElement = document.getElementById('total-time');
    if (timeElement) {
      const lessons = Object.values(this.userProgress.lessons);
      const totalSeconds = lessons.reduce((sum, lesson) => sum + (lesson.timeSpent || 0), 0);
      const minutes = Math.floor(totalSeconds / 60);
      timeElement.textContent = minutes + ' min';
    }
  }
  
  renderLessons() {
    const lessonsGrid = document.getElementById('lessons-grid');
    if (!lessonsGrid || !window.FRANCAIS_LESSONS_DATA) {
      console.warn('⚠️ Grid des leçons ou données non disponibles');
      return;
    }
    
    lessonsGrid.innerHTML = '';
    
    const completedLessons = Object.keys(this.userProgress.lessons);
    const availableLessons = window.FRANCAIS_PROGRESSION ? 
      window.FRANCAIS_PROGRESSION.calculateNextLessons(this.userProgress) :
      Object.keys(window.FRANCAIS_LESSONS_DATA).slice(0, 3);
    
    Object.entries(window.FRANCAIS_LESSONS_DATA).forEach(([lessonId, lesson]) => {
      const card = this.createLessonCard(lessonId, lesson, {
        isCompleted: completedLessons.includes(lessonId),
        isAvailable: availableLessons.includes(lessonId) || completedLessons.includes(lessonId),
        userScore: this.userProgress.lessons[lessonId]?.score || 0
      });
      
      lessonsGrid.appendChild(card);
    });
  }
  
  createLessonCard(lessonId, lesson, status) {
    const card = document.createElement('div');
    card.className = `lesson-card ${status.isCompleted ? 'completed' : ''} ${!status.isAvailable ? 'locked' : ''}`;
    
    const statusIcon = status.isCompleted ? '✅' : 
                      status.isAvailable ? '📖' : '🔒';
    
    const scoreDisplay = status.isCompleted ? 
      `<div class="lesson-score">Score: ${status.userScore}%</div>` : '';
    
    card.innerHTML = `
      <div class="lesson-status ${status.isCompleted ? 'completed' : status.isAvailable ? 'available' : 'locked'}">
        ${statusIcon}
      </div>
      <h4 class="lesson-title">${lesson.title}</h4>
      <p class="lesson-description">${lesson.description}</p>
      <div class="lesson-stats">
        <span>⏱️ ${lesson.estimatedTime} min</span>
        <span>⭐ ${lesson.xpReward} XP</span>
        <span>📊 Niveau ${lesson.difficulty}</span>
      </div>
      ${scoreDisplay}
      <button class="start-lesson-btn" ${!status.isAvailable ? 'disabled' : ''}>
        ${status.isCompleted ? 'Refaire' : status.isAvailable ? 'Commencer' : 'Verrouillé'}
      </button>
    `;
    
    // Ajouter l'événement de clic
    const button = card.querySelector('.start-lesson-btn');
    if (button && status.isAvailable) {
      button.onclick = () => this.startLesson(lessonId);
    }
    
    return card;
  }
  
  startLesson(lessonId) {
    console.log(`🎯 Début de la leçon: ${lessonId}`);
    
    if (!window.FRANCAIS_LESSONS_DATA || !window.FRANCAIS_LESSONS_DATA[lessonId]) {
      console.error('❌ Leçon non trouvée:', lessonId);
      return;
    }
    
    this.currentLesson = window.FRANCAIS_LESSONS_DATA[lessonId];
    this.currentExercise = 0;
    this.sessionScore = 0;
    this.sessionStartTime = Date.now();
    
    // Basculer vers l'interface d'exercice
    this.showExerciseInterface();
    this.showCurrentExercise();
  }
  
  showExerciseInterface() {
    // Cacher les sections principales
    const sections = ['.lessons-section', '.stats-section', '.intro-section'];
    sections.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) element.style.display = 'none';
    });
    
    // Afficher l'interface d'exercice
    const exerciseContainer = document.getElementById('exercise-container');
    if (exerciseContainer) {
      exerciseContainer.style.display = 'block';
    }
  }
  
  showCurrentExercise() {
    if (!this.currentLesson || this.currentExercise >= this.currentLesson.exercises.length) {
      this.finishLesson();
      return;
    }
    
    const exercise = this.currentLesson.exercises[this.currentExercise];
    const progressPercent = (this.currentExercise / this.currentLesson.exercises.length) * 100;
    
    // Mettre à jour la progression
    const progressBar = document.getElementById('exercise-progress-bar');
    if (progressBar) {
      progressBar.style.width = progressPercent + '%';
    }
    
    // Afficher la question
    const questionElement = document.getElementById('exercise-question');
    if (questionElement) {
      questionElement.textContent = exercise.question;
    }
    
    const instructionElement = document.getElementById('exercise-instruction');
    if (instructionElement) {
      instructionElement.textContent = exercise.instruction || '';
    }
    
    // Générer les options
    this.renderExerciseOptions(exercise);
    
    // Réinitialiser les boutons
    const validateBtn = document.getElementById('validate-answer-btn');
    const continueBtn = document.getElementById('continue-btn');
    const feedbackContainer = document.getElementById('feedback-container');
    
    if (validateBtn) {
      validateBtn.disabled = true;
      validateBtn.onclick = () => this.validateAnswer(exercise);
    }
    
    if (continueBtn) {
      continueBtn.style.display = 'none';
      continueBtn.onclick = () => this.nextExercise();
    }
    
    if (feedbackContainer) {
      feedbackContainer.classList.remove('show');
    }
    
    this.selectedAnswer = null;
  }
  
  renderExerciseOptions(exercise) {
    const optionsContainer = document.getElementById('answer-options');
    if (!optionsContainer) return;
    
    optionsContainer.innerHTML = '';
    
    if (exercise.type === 'multiple_choice') {
      exercise.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'answer-option';
        optionElement.textContent = option;
        optionElement.onclick = () => this.selectAnswer(index);
        optionsContainer.appendChild(optionElement);
      });
    }
  }
  
  selectAnswer(index) {
    // Déselectionner toutes les options
    document.querySelectorAll('.answer-option').forEach(opt => {
      opt.classList.remove('selected');
    });
    
    // Sélectionner la nouvelle option
    const options = document.querySelectorAll('.answer-option');
    if (options[index]) {
      options[index].classList.add('selected');
    }
    
    this.selectedAnswer = index;
    
    // Activer le bouton valider
    const validateBtn = document.getElementById('validate-answer-btn');
    if (validateBtn) {
      validateBtn.disabled = false;
    }
  }
  
  validateAnswer(exercise) {
    const isCorrect = this.selectedAnswer === exercise.correct;
    
    if (isCorrect) {
      this.sessionScore++;
      this.showCorrectFeedback(exercise);
      if (this.streakSystem) {
        this.streakSystem.recordActivity();
      }
    } else {
      this.showIncorrectFeedback(exercise);
      if (this.heartsSystem) {
        this.heartsSystem.loseHeart();
      }
    }
    
    // Afficher le bouton continuer
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
      continueBtn.style.display = 'inline-block';
    }
    
    // Désactiver le bouton valider
    const validateBtn = document.getElementById('validate-answer-btn');
    if (validateBtn) {
      validateBtn.disabled = true;
    }
  }
  
  showCorrectFeedback(exercise) {
    const feedback = document.getElementById('feedback-container');
    if (feedback) {
      feedback.className = 'feedback-container feedback-correct show';
      feedback.innerHTML = `
        <strong>✅ Correct !</strong><br>
        ${exercise.explanation || 'Bien joué !'}
      `;
    }
  }
  
  showIncorrectFeedback(exercise) {
    const feedback = document.getElementById('feedback-container');
    if (feedback) {
      feedback.className = 'feedback-container feedback-incorrect show';
      feedback.innerHTML = `
        <strong>❌ Pas tout à fait...</strong><br>
        ${exercise.explanation || 'Réessaie !'}
        ${exercise.hint ? `<br><em>💡 Indice: ${exercise.hint}</em>` : ''}
      `;
    }
  }
  
  nextExercise() {
    this.currentExercise++;
    this.showCurrentExercise();
  }
  
  finishLesson() {
    const timeSpent = Math.floor((Date.now() - this.sessionStartTime) / 1000);
    const scorePercent = Math.round((this.sessionScore / this.currentLesson.exercises.length) * 100);
    
    // Calculer XP avec bonus
    let xpGained = this.currentLesson.xpReward;
    if (window.FRANCAIS_PROGRESSION) {
      xpGained = window.FRANCAIS_PROGRESSION.calculateXPBonus(xpGained, {
        streak: this.streakSystem?.getCurrentStreak() || 0,
        accuracy: scorePercent
      });
    }
    
    // Sauvegarder les progrès
    this.userProgress.lessons[this.currentLesson.id] = {
      completed: true,
      score: scorePercent,
      timeSpent: timeSpent,
      completedAt: new Date().toISOString()
    };
    
    this.userProgress.totalXP += xpGained;
    this.userProgress.lessonsCompleted = Object.keys(this.userProgress.lessons).length;
    this.saveUserProgress();
    
    // Afficher la célébration
    this.showCelebration(scorePercent, xpGained);
  }
  
  showCelebration(score, xpGained) {
    const overlay = document.getElementById('level-complete-overlay');
    const message = document.getElementById('celebration-message');
    
    if (overlay && message) {
      let celebrationText = '';
      if (score >= 90) celebrationText = '🌟 Excellent ! Tu maîtrises parfaitement !';
      else if (score >= 75) celebrationText = '👏 Très bien ! Continue comme ça !';
      else celebrationText = '💪 Bon travail ! Tu progresses !';
      
      message.innerHTML = `
        ${celebrationText}<br>
        <strong>Score: ${score}%</strong><br>
        <strong>+${xpGained} XP gagnés !</strong>
      `;
      
      overlay.classList.add('show');
    }
  }
  
  hideCelebration() {
    const overlay = document.getElementById('level-complete-overlay');
    if (overlay) {
      overlay.classList.remove('show');
    }
    this.returnToMainMenu();
  }
  
  returnToMainMenu() {
    // Masquer l'interface d'exercice
    const exerciseContainer = document.getElementById('exercise-container');
    if (exerciseContainer) {
      exerciseContainer.style.display = 'none';
    }
    
    // Réafficher les sections principales
    const sections = ['.lessons-section', '.stats-section', '.intro-section'];
    sections.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) element.style.display = 'block';
    });
    
    // Mettre à jour l'affichage
    this.renderDashboard();
    this.renderLessons();
  }
  
  showAvailableLessons() {
    const lessonsSection = document.querySelector('.lessons-section');
    if (lessonsSection) {
      lessonsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  showDetailedProgress() {
    const level = Math.floor(this.userProgress.totalXP / 100) + 1;
    const streak = this.streakSystem?.getCurrentStreak() || 0;
    const hearts = this.heartsSystem?.getCurrentHearts() || 5;
    
    alert(`📊 Ta Progression Française 📊
    
🎯 Niveau: ${level}
📚 Leçons terminées: ${this.userProgress.lessonsCompleted}
⭐ XP Total: ${this.userProgress.totalXP}
🔥 Streak actuel: ${streak}
💝 Cœurs: ${hearts}/5
    
Continue ton aventure française avec Curio ! 🦊`);
  }
}

// Export global
window.FrancaisApp = FrancaisApp;

console.log('✅ FrancaisApp classe définie');