// scripts/adaptive-quiz-engine.js
class AdaptiveQuizEngine {
  constructor(subject, difficulty = 'medium') {
    this.subject = subject;
    this.difficulty = difficulty;
    this.questionBank = this.loadQuestions();
    this.userPerformance = this.loadPerformance();
    this.currentQuestion = 0;
    this.hearts = 5;
    this.streak = 0;
    this.xp = 0;
  }
  
  loadQuestions() {
    // Structure JSON par difficulté
    return {
      easy: [
        {
          id: 'fr_easy_1',
          type: 'multiple_choice',
          question: 'Quel est le verbe dans cette phrase : "Le chat dort." ?',
          options: ['Le', 'chat', 'dort'],
          correct: 2,
          xp: 10,
          explanation: 'Le verbe est "dort" car il exprime une action.'
        }
        // ... plus de questions
      ],
      medium: [ /* ... */ ],
      hard: [ /* ... */ ]
    };
  }
  
  startQuiz() {
    this.renderQuestion(this.getCurrentQuestion());
    this.startTimer();
  }
  
  getCurrentQuestion() {
    const questions = this.questionBank[this.difficulty];
    return questions[this.currentQuestion];
  }
  
  checkAnswer(selectedIndex) {
    const question = this.getCurrentQuestion();
    const isCorrect = selectedIndex === question.correct;
    
    if (isCorrect) {
      this.handleCorrectAnswer(question);
    } else {
      this.handleWrongAnswer(question);
    }
    
    this.adjustDifficulty();
    this.nextQuestion();
  }
  
  handleCorrectAnswer(question) {
    // XP avec bonus streak
    let earnedXP = question.xp;
    if (this.streak >= 3) {
      earnedXP *= 1.5; // Bonus streak
    }
    
    this.xp += earnedXP;
    this.streak++;
    
    // Animation célébration
    this.showFeedback('correct', {
      xp: earnedXP,
      streak: this.streak,
      explanation: question.explanation
    });
    
    // Notification système XP global
    window.xpManager.addXP(earnedXP, this.subject);
  }
  
  handleWrongAnswer(question) {
    this.hearts--;
    this.streak = 0;
    
    if (this.hearts === 0) {
      this.endQuiz('no_hearts');
      return;
    }
    
    // Feedback constructif
    this.showFeedback('incorrect', {
      heartsLeft: this.hearts,
      explanation: question.explanation,
      correctAnswer: question.options[question.correct]
    });
  }
  
  adjustDifficulty() {
    // Adaptation automatique basée sur performance
    const recentPerformance = this.userPerformance.slice(-5);
    const successRate = recentPerformance.filter(r => r.correct).length / recentPerformance.length;
    
    if (successRate >= 0.8 && this.difficulty !== 'hard') {
      this.difficulty = 'medium'; // Augmenter
      this.notifyDifficultyChange('increased');
    } else if (successRate <= 0.4 && this.difficulty !== 'easy') {
      this.difficulty = 'easy'; // Diminuer
      this.notifyDifficultyChange('decreased');
    }
  }
}