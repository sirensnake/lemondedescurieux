// ====================================
// ENGLISH LESSONS - VERSION COMPLÈTE
// 4 leçons avec prononciation audio
// ====================================

console.log('🇬🇧 EnglishLessons loading...');

const ENGLISH_LESSONS_DATA = {
  1: {
    id: 1,
    title: "Basic Words",
    description: "Learn essential vocabulary",
    icon: "📖",
    exercises: [
      {
        question: "Translate: Chat",
        answer: "cat",
        audio: "cat",
        hint: "It's a small furry animal that says 'meow'"
      },
      {
        question: "Translate: Chien",
        answer: "dog",
        audio: "dog",
        hint: "It's a friendly animal that barks"
      },
      {
        question: "Translate: Maison",
        answer: "house",
        audio: "house",
        hint: "It's where you live"
      },
      {
        question: "Translate: Livre",
        answer: "book",
        audio: "book",
        hint: "You read it"
      },
      {
        question: "Translate: Voiture",
        answer: "car",
        audio: "car",
        hint: "You drive it on the road"
      }
    ]
  },
  2: {
    id: 2,
    title: "Colors",
    description: "Master the rainbow",
    icon: "🌈",
    exercises: [
      {
        question: "Translate: Rouge",
        answer: "red",
        audio: "red",
        hint: "The color of strawberries"
      },
      {
        question: "Translate: Bleu",
        answer: "blue",
        audio: "blue",
        hint: "The color of the sky"
      },
      {
        question: "Translate: Vert",
        answer: "green",
        audio: "green",
        hint: "The color of grass"
      },
      {
        question: "Translate: Jaune",
        answer: "yellow",
        audio: "yellow",
        hint: "The color of the sun"
      },
      {
        question: "Translate: Noir",
        answer: "black",
        audio: "black",
        hint: "The darkest color"
      }
    ]
  },
  3: {
    id: 3,
    title: "Family & Friends",
    description: "Talk about people you love",
    icon: "👨‍👩‍👧‍👦",
    exercises: [
      {
        question: "Translate: Mère",
        answer: "mother",
        audio: "mother",
        hint: "Your female parent"
      },
      {
        question: "Translate: Père",
        answer: "father",
        audio: "father",
        hint: "Your male parent"
      },
      {
        question: "Translate: Frère",
        answer: "brother",
        audio: "brother",
        hint: "Your male sibling"
      },
      {
        question: "Translate: Sœur",
        answer: "sister",
        audio: "sister",
        hint: "Your female sibling"
      },
      {
        question: "Translate: Ami",
        answer: "friend",
        audio: "friend",
        hint: "Someone you like to spend time with"
      }
    ]
  },
  4: {
    id: 4,
    title: "Numbers",
    description: "Count from 1 to 10",
    icon: "🔢",
    exercises: [
      {
        question: "Translate: Un",
        answer: "one",
        audio: "one",
        hint: "The first number"
      },
      {
        question: "Translate: Deux",
        answer: "two",
        audio: "two",
        hint: "After one"
      },
      {
        question: "Translate: Trois",
        answer: "three",
        audio: "three",
        hint: "After two"
      },
      {
        question: "Translate: Cinq",
        answer: "five",
        audio: "five",
        hint: "The number of fingers on one hand"
      },
      {
        question: "Translate: Dix",
        answer: "ten",
        audio: "ten",
        hint: "The number of fingers on both hands"
      }
    ]
  }
};

class EnglishLessons {
  constructor() {
    console.log('🇬🇧 Constructor EnglishLessons');
    this.lessons = Object.values(ENGLISH_LESSONS_DATA);
    this.currentLesson = null;
    this.currentExerciseIndex = 0;
    this.score = 0;
    
    // Web Speech API pour prononciation
    this.speech = window.speechSynthesis;
    this.currentAudio = null;
    
    setTimeout(() => this.renderLessons(), 100);
  }

  renderLessons() {
    console.log('🎨 Rendering', this.lessons.length, 'English lessons');
    const grid = document.getElementById('lessons-grid');
    if (!grid) {
      console.error('❌ lessons-grid not found');
      return;
    }
    
    grid.innerHTML = '';
    
    this.lessons.forEach(lesson => {
      const card = document.createElement('div');
      card.className = 'lesson-card';
      card.innerHTML = `
        <div class="lesson-icon">${lesson.icon}</div>
        <div class="lesson-title">${lesson.title}</div>
        <div class="lesson-desc">${lesson.description}</div>
        <button class="lesson-button">⭐ Start</button>
      `;
      
      card.querySelector('.lesson-button').onclick = () => {
        console.log('🎓 Starting:', lesson.title);
        this.startLesson(lesson.id);
      };
      
      grid.appendChild(card);
    });
    
    console.log('✅ English lessons rendered');
  }

  startLesson(lessonId) {
    this.currentLesson = this.lessons.find(l => l.id === lessonId);
    this.currentExerciseIndex = 0;
    this.score = 0;
    
    this.showExerciseScreen();
    this.renderExercise();
  }

  showExerciseScreen() {
    const lessonsList = document.getElementById('lessons-list');
    const lessonScreen = document.getElementById('lesson-screen');
    const exerciseScreen = document.getElementById('exercise-screen');
    const resultsScreen = document.getElementById('results-screen');
    
    if (lessonsList) lessonsList.style.display = 'none';
    if (lessonScreen) lessonScreen.style.display = 'block';
    if (exerciseScreen) exerciseScreen.style.display = 'block';
    if (resultsScreen) resultsScreen.style.display = 'none';
  }

  renderExercise() {
    if (this.currentExerciseIndex >= this.currentLesson.exercises.length) {
      this.showResults();
      return;
    }

    const exercise = this.currentLesson.exercises[this.currentExerciseIndex];
    const progress = ((this.currentExerciseIndex + 1) / this.currentLesson.exercises.length * 100);

    const questionText = document.getElementById('question-text');
    const answerInput = document.getElementById('answer-input');
    const progressFill = document.getElementById('progress-fill');
    const hintArea = document.getElementById('hint-area');

    if (questionText) questionText.textContent = exercise.question;
    if (answerInput) {
      answerInput.value = '';
      answerInput.focus();
      
      // Détection touche Enter pour valider
      answerInput.onkeydown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.checkAnswer();
        }
      };
    }
    if (progressFill) progressFill.style.width = progress + '%';
    if (hintArea) {
      hintArea.textContent = '';
      hintArea.style.display = 'none';
    }
    
    // Sauvegarder l'audio pour le bouton
    this.currentAudio = exercise.audio;
  }

  playAudio() {
    if (!this.currentAudio) return;
    
    // Arrêter toute lecture en cours
    this.speech.cancel();
    
    // Créer nouvelle instance
    const utterance = new SpeechSynthesisUtterance(this.currentAudio);
    utterance.lang = 'en-US';
    utterance.rate = 0.8; // Vitesse ralentie pour enfants
    utterance.pitch = 1.0;
    
    console.log('🔊 Playing:', this.currentAudio);
    this.speech.speak(utterance);
    
    // Animation bouton
    const btn = document.getElementById('audio-btn');
    if (btn) {
      btn.style.transform = 'scale(1.2)';
      setTimeout(() => {
        btn.style.transform = 'scale(1)';
      }, 300);
    }
  }

  showHint() {
    const exercise = this.currentLesson.exercises[this.currentExerciseIndex];
    const hintArea = document.getElementById('hint-area');
    
    if (hintArea && exercise.hint) {
      hintArea.textContent = '💡 ' + exercise.hint;
      hintArea.style.display = 'block';
    }
  }

  checkAnswer() {
    const exercise = this.currentLesson.exercises[this.currentExerciseIndex];
    const answerInput = document.getElementById('answer-input');
    
    if (!answerInput) return;
    
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = exercise.answer.toLowerCase();

    if (!userAnswer) {
      this.showFeedback('⚠️ Enter your answer first!', 'warning');
      return;
    }

    if (userAnswer === correctAnswer) {
      this.score++;
      this.showFeedback('✅ Great! Correct!', 'correct');
      
      // Prononcer la réponse correcte
      setTimeout(() => this.playAudio(), 500);
      
      setTimeout(() => this.nextExercise(), 2000);
    } else {
      this.showFeedback(`❌ Not quite... The answer was: ${exercise.answer}`, 'incorrect');
      
      // Prononcer la correction
      setTimeout(() => this.playAudio(), 800);
      
      setTimeout(() => this.nextExercise(), 3000);
    }
  }

  showFeedback(message, type) {
    const feedback = document.getElementById('feedback');
    if (feedback) {
      feedback.textContent = message;
      feedback.className = 'feedback show feedback-' + type;
      
      setTimeout(() => {
        feedback.className = 'feedback';
      }, type === 'correct' ? 2000 : 3000);
    }
  }

  nextExercise() {
    this.currentExerciseIndex++;
    this.renderExercise();
  }

  showResults() {
    const exerciseScreen = document.getElementById('exercise-screen');
    const resultsScreen = document.getElementById('results-screen');
    
    if (exerciseScreen) exerciseScreen.style.display = 'none';
    if (resultsScreen) resultsScreen.style.display = 'block';

    const totalExercises = this.currentLesson.exercises.length;
    const percentage = Math.round((this.score / totalExercises) * 100);
    const xpEarned = this.score * 10;

    const resultCorrect = document.getElementById('result-correct');
    const resultXp = document.getElementById('result-xp');
    const resultScore = document.getElementById('result-score');

    if (resultCorrect) resultCorrect.textContent = this.score + '/' + totalExercises;
    if (resultXp) resultXp.textContent = xpEarned;
    if (resultScore) resultScore.textContent = percentage + '%';

    console.log('🏆 Results:', this.score + '/' + totalExercises, '(' + percentage + '%)');
  }

  backToLessons() {
    const lessonScreen = document.getElementById('lesson-screen');
    const lessonsList = document.getElementById('lessons-list');
    
    if (lessonScreen) lessonScreen.style.display = 'none';
    if (lessonsList) lessonsList.style.display = 'block';
    
    this.currentLesson = null;
    this.currentExerciseIndex = 0;
    this.score = 0;
    this.currentAudio = null;
    
    // Arrêter toute lecture audio
    if (this.speech) this.speech.cancel();
  }
}

console.log('✅ EnglishLessons loaded');
const englishApp = new EnglishLessons();
