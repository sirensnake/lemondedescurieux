// ====================================
// FRANCAIS LESSONS - VERSION COMPLÈTE
// 4 leçons, 19 exercices au total
// ====================================

console.log('📚 FrenchLessons loading...');

const FRANCAIS_LESSONS_DATA = {
  1: {
    id: 1,
    title: "Verbes au Présent",
    description: "Conjugaison des verbes du 1er groupe",
    icon: "📖",
    exercises: [
      {
        question: "Je (chanter) _____ une chanson.",
        answer: "chante",
        hint: "Verbe du 1er groupe au présent avec 'je'"
      },
      {
        question: "Tu (jouer) _____ au football.",
        answer: "joues",
        hint: "Verbe du 1er groupe au présent avec 'tu'"
      },
      {
        question: "Il (marcher) _____ dans la rue.",
        answer: "marche",
        hint: "Verbe du 1er groupe au présent avec 'il'"
      },
      {
        question: "Nous (danser) _____ ensemble.",
        answer: "dansons",
        hint: "Verbe du 1er groupe au présent avec 'nous'"
      },
      {
        question: "Vous (parler) _____ français.",
        answer: "parlez",
        hint: "Verbe du 1er groupe au présent avec 'vous'"
      }
    ]
  },
  2: {
    id: 2,
    title: "Accords dans le GN",
    description: "Accords adjectifs et noms",
    icon: "✨",
    exercises: [
      {
        question: "Le chat (noir) _____.",
        answer: "noir",
        hint: "Masculin singulier - pas d'accord nécessaire"
      },
      {
        question: "La (grand) _____ maison.",
        answer: "grande",
        hint: "Féminin singulier - ajoute un 'e'"
      },
      {
        question: "Les chiens (méchant) _____.",
        answer: "méchants",
        hint: "Masculin pluriel - ajoute un 's'"
      },
      {
        question: "Les (beau) _____ fleurs.",
        answer: "belles",
        hint: "Féminin pluriel - 'beau' devient 'belles'"
      }
    ]
  },
  3: {
    id: 3,
    title: "Le Passé Composé",
    description: "Raconte ce qui s'est passé",
    icon: "⏰",
    exercises: [
      {
        question: "Hier, j'(manger) _____ une pizza.",
        answer: "ai mangé",
        hint: "Auxiliaire 'avoir' + participe passé en -é"
      },
      {
        question: "Tu (finir) _____ tes devoirs ?",
        answer: "as fini",
        hint: "Auxiliaire 'avoir' avec 'tu' + participe passé en -i"
      },
      {
        question: "Elle (chanter) _____ une chanson.",
        answer: "a chanté",
        hint: "Auxiliaire 'avoir' à la 3ème personne + participe passé"
      },
      {
        question: "Nous (jouer) _____ au football.",
        answer: "avons joué",
        hint: "Auxiliaire 'avoir' avec 'nous' + participe passé"
      },
      {
        question: "Vous (regarder) _____ le film ?",
        answer: "avez regardé",
        hint: "Auxiliaire 'avoir' avec 'vous' + participe passé"
      }
    ]
  },
  4: {
    id: 4,
    title: "L'Imparfait",
    description: "Décris les habitudes du passé",
    icon: "📚",
    exercises: [
      {
        question: "Quand j'étais petit, je (jouer) _____ souvent.",
        answer: "jouais",
        hint: "Radical 'jou-' + terminaison -ais"
      },
      {
        question: "Tu (aimer) _____ les bonbons ?",
        answer: "aimais",
        hint: "Imparfait à la 2ème personne du singulier"
      },
      {
        question: "Il (avoir) _____ un chat noir.",
        answer: "avait",
        hint: "Verbe 'avoir' à l'imparfait, 3ème personne"
      },
      {
        question: "Nous (être) _____ contents.",
        answer: "étions",
        hint: "Verbe 'être' à l'imparfait avec 'nous'"
      },
      {
        question: "Vous (habiter) _____ à Paris ?",
        answer: "habitiez",
        hint: "Imparfait à la 2ème personne du pluriel"
      }
    ]
  }
};

class FrenchLessons {
  constructor() {
    console.log('📚 Constructor FrenchLessons');
    this.lessons = Object.values(FRANCAIS_LESSONS_DATA);
    this.currentLesson = null;
    this.currentExerciseIndex = 0;
    this.score = 0;
    
    setTimeout(() => this.renderLessons(), 100);
  }

  renderLessons() {
    console.log('🎨 Rendering', this.lessons.length, 'lessons');
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
        <button class="lesson-button">⭐ Commencer</button>
      `;
      
      card.querySelector('.lesson-button').onclick = () => {
        console.log('🎓 Starting:', lesson.title);
        this.startLesson(lesson.id);
      };
      
      grid.appendChild(card);
    });
    
    console.log('✅ Lessons rendered');
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
      this.showFeedback('⚠️ Entre ta réponse d\'abord !', 'warning');
      return;
    }

    if (userAnswer === correctAnswer) {
      this.score++;
      this.showFeedback('✅ Bravo ! C\'est correct !', 'correct');
      setTimeout(() => this.nextExercise(), 1500);
    } else {
      this.showFeedback(`❌ Pas tout à fait... La réponse était : ${exercise.answer}`, 'incorrect');
      setTimeout(() => this.nextExercise(), 2500);
    }
  }

  showFeedback(message, type) {
    const feedback = document.getElementById('feedback');
    if (feedback) {
      feedback.textContent = message;
      feedback.className = 'feedback show feedback-' + type;
      
      setTimeout(() => {
        feedback.className = 'feedback';
      }, type === 'correct' ? 1500 : 2500);
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

    console.log('🏆 Résultats:', this.score + '/' + totalExercises, '(' + percentage + '%)');
  }

  backToLessons() {
    const lessonScreen = document.getElementById('lesson-screen');
    const lessonsList = document.getElementById('lessons-list');
    
    if (lessonScreen) lessonScreen.style.display = 'none';
    if (lessonsList) lessonsList.style.display = 'block';
    
    this.currentLesson = null;
    this.currentExerciseIndex = 0;
    this.score = 0;
  }
}

console.log('✅ FrenchLessons loaded');
const francaisApp = new FrenchLessons();
