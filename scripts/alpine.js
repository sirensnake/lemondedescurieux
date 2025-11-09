// Exemple de conversion quiz vers Alpine.js
Alpine.data('quizComponent', () => ({
  questions: [],
  currentQuestion: 0,
  score: 0,
  hearts: 5,
  
  async loadQuiz(subject) {
    this.questions = await import(`./data/quiz-${subject}.json`);
  },
  
  checkAnswer(answer) {
    if (answer !== this.questions[this.currentQuestion].correct) {
      this.hearts--;
      this.trackEvent('wrong_answer', { subject, question: this.currentQuestion });
    }
    // ...
  }
}));