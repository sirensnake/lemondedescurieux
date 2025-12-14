// ====================================
// MATHS LESSONS - Système Duolingo
// Architecture identique au français
// ====================================

const MATHS_LESSONS_DATA = {
  1: {
    id: 1,
    title: "Tables de Multiplication",
    description: "Maîtrise les tables de 2 à 5",
    icon: "✖️",
    locked: false,
    exercises: [
      {
        type: "calculation",
        question: "3 × 4 = ?",
        answer: "12",
        hint: "Compte de 4 en 4 trois fois : 4, 8, 12"
      },
      {
        type: "calculation",
        question: "5 × 6 = ?",
        answer: "30",
        hint: "5 fois 6 = une demi-douzaine de 5"
      },
      {
        type: "calculation",
        question: "7 × 3 = ?",
        answer: "21",
        hint: "7 + 7 + 7 = ?"
      },
      {
        type: "calculation",
        question: "4 × 8 = ?",
        answer: "32",
        hint: "Pense à 4 × 4 = 16, puis double !"
      },
      {
        type: "calculation",
        question: "9 × 5 = ?",
        answer: "45",
        hint: "Presque 10 × 5, enlève juste 5"
      }
    ]
  },
  2: {
    id: 2,
    title: "Additions avec Retenue",
    description: "Additionne les grands nombres",
    icon: "➕",
    locked: false,
    exercises: [
      {
        type: "calculation",
        question: "125 + 48 = ?",
        answer: "173",
        hint: "5 + 8 = 13 (retenue 1), puis 2 + 4 + 1 = 7"
      },
      {
        type: "calculation",
        question: "267 + 156 = ?",
        answer: "423",
        hint: "Commence par les unités : 7 + 6"
      },
      {
        type: "calculation",
        question: "89 + 76 = ?",
        answer: "165",
        hint: "9 + 6 = 15, écris 5 retenue 1"
      },
      {
        type: "calculation",
        question: "345 + 289 = ?",
        answer: "634",
        hint: "Attention aux retenues : 5+9, 4+8+1, 3+2+1"
      }
    ]
  },
  3: {
    id: 3,
    title: "Soustractions",
    description: "Soustrais sans te tromper",
    icon: "➖",
    locked: false,
    exercises: [
      {
        type: "calculation",
        question: "85 - 23 = ?",
        answer: "62",
        hint: "5 - 3 = 2, puis 8 - 2 = 6"
      },
      {
        type: "calculation",
        question: "142 - 67 = ?",
        answer: "75",
        hint: "Emprunte 1 dizaine pour les unités"
      },
      {
        type: "calculation",
        question: "200 - 145 = ?",
        answer: "55",
        hint: "Transforme 200 en 199 + 1"
      },
      {
        type: "calculation",
        question: "324 - 158 = ?",
        answer: "166",
        hint: "Emprunte si nécessaire colonne par colonne"
      }
    ]
  },
  4: {
    id: 4,
    title: "Les Fractions",
    description: "Découvre les parts et les fractions",
    icon: "🍕",
    locked: false,
    exercises: [
      {
        type: "calculation",
        question: "1/2 de 10 = ?",
        answer: "5",
        hint: "La moitié de 10, c'est diviser par 2"
      },
      {
        type: "calculation",
        question: "1/4 de 20 = ?",
        answer: "5",
        hint: "Un quart, c'est diviser par 4"
      },
      {
        type: "calculation",
        question: "3/4 de 12 = ?",
        answer: "9",
        hint: "D'abord trouve 1/4 de 12, puis multiplie par 3"
      },
      {
        type: "calculation",
        question: "2/3 de 15 = ?",
        answer: "10",
        hint: "15 ÷ 3 = 5, puis 5 × 2"
      }
    ]
  }
};

class MathsLessons {
  constructor(storage, heartsSystem, streakSystem) {
    console.log('🔢 MathsLessons initializing...');
    
    this.storage = storage;
    this.heartsSystem = heartsSystem;
    this.streakSystem = streakSystem;
    
    this.currentLesson = null;
    this.currentExerciseIndex = 0;
    this.currentExercises = [];
    this.score = 0;
    
    this.lessons = Object.values(MATHS_LESSONS_DATA);
    this.loadProgress();
    
    setTimeout(() => {
      this.renderLessons();
    }, 300);
    
    console.log('✅ MathsLessons initialized');
  }

  loadProgress() {
    const completed = this.storage?.get('maths_completed_lessons') || [];
    
    this.lessons.forEach((lesson, index) => {
      if (index === 0) {
        lesson.locked = false;
      } else if (completed.includes(this.lessons[index - 1].id)) {
        lesson.locked = false;
      }
    });
  }

  renderLessons() {
    console.log('🎨 Rendering maths lessons...');
    
    const lessonsGrid = document.getElementById('lessons-grid');
    if (!lessonsGrid) {
        console.error('❌ Element #lessons-grid not found');
        return;
    }
    
    lessonsGrid.innerHTML = '';
    
    this.lessons.forEach(lesson => {
        const card = document.createElement('div');
        card.className = 'lesson-card' + (lesson.locked ? ' locked' : '');
        card.dataset.lessonId = lesson.id;
        
        card.innerHTML = `
            <div class="lesson-icon">${lesson.icon}</div>
            <div class="lesson-title">${lesson.title}</div>
            <div class="lesson-desc">${lesson.description}</div>
            <button class="lesson-button" ${lesson.locked ? 'disabled' : ''}>
                ${lesson.locked ? '🔒 Verrouillé' : '⭐ Commencer'}
            </button>
        `;
        
        if (!lesson.locked) {
            const button = card.querySelector('.lesson-button');
            button.addEventListener('click', () => {
                this.startLesson(lesson.id);
            });
        }
        
        lessonsGrid.appendChild(card);
    });
    
    console.log(`✅ Rendered ${this.lessons.length} maths lessons`);
  }

  startLesson(lessonId) {
    const lesson = this.lessons.find(l => l.id === lessonId);
    
    if (!lesson) {
      console.error('❌ Lesson not found:', lessonId);
      return;
    }

    if (lesson.locked) {
      alert('Cette leçon est encore verrouillée !\nComplète les leçons précédentes d\'abord.');
      return;
    }

    console.log('🎓 Starting maths lesson:', lesson.title);

    this.currentLesson = lesson;
    this.currentExercises = [...lesson.exercises];
    this.currentExerciseIndex = 0;
    this.score = 0;

    this.showExerciseScreen();
    this.renderExercise();
  }

  showExerciseScreen() {
    const lessonsScreen = document.getElementById('lessons-screen');
    const lessonScreen = document.getElementById('lesson-screen');

    if (lessonsScreen) lessonsScreen.classList.remove('active');
    if (lessonScreen) lessonScreen.classList.add('active');
  }

  renderExercise() {
    const container = document.getElementById('exercise-container');
    if (!container) return;

    if (this.currentExerciseIndex >= this.currentExercises.length) {
      this.showLessonComplete();
      return;
    }

    const exercise = this.currentExercises[this.currentExerciseIndex];
    const progress = ((this.currentExerciseIndex + 1) / this.currentExercises.length * 100).toFixed(0);

    container.innerHTML = `
      <div class="exercise-header">
        <div class="exercise-progress">
          <div class="progress-bar" style="width: ${progress}%"></div>
        </div>
        <div class="exercise-number">Question ${this.currentExerciseIndex + 1}/${this.currentExercises.length}</div>
      </div>

      <div class="exercise-content">
        <div class="exercise-icon">${this.currentLesson.icon}</div>
        <h2 class="exercise-question">${exercise.question}</h2>
        
        <input 
          type="number" 
          id="exercise-input" 
          class="exercise-input"
          placeholder="Ta réponse..."
          autocomplete="off"
        />

        <button id="hint-button" class="exercise-hint">💡 Indice</button>
        <div id="hint-text" class="hint-text" style="display: none;">
          ${exercise.hint}
        </div>

        <div id="feedback" class="exercise-feedback"></div>

        <button id="submit-button" class="exercise-submit">Vérifier</button>
      </div>
    `;

    this.attachExerciseHandlers(exercise);
  }

  attachExerciseHandlers(exercise) {
    const input = document.getElementById('exercise-input');
    const submitBtn = document.getElementById('submit-button');
    const hintBtn = document.getElementById('hint-button');
    const hintText = document.getElementById('hint-text');

    input?.focus();

    hintBtn?.addEventListener('click', () => {
      if (hintText) {
        hintText.style.display = hintText.style.display === 'none' ? 'block' : 'none';
      }
    });

    const checkAnswer = () => {
      const userAnswer = input?.value.trim();
      const correctAnswer = exercise.answer;
      const feedback = document.getElementById('feedback');

      if (!userAnswer) {
        feedback.innerHTML = '⚠️ Entre ta réponse d\'abord !';
        feedback.className = 'exercise-feedback warning';
        return;
      }

      // Validation numérique stricte
      if (userAnswer === correctAnswer) {
        this.score++;
        
        feedback.innerHTML = '✅ Bravo ! C\'est correct !';
        feedback.className = 'exercise-feedback correct';
        
        if (this.streakSystem) {
          this.streakSystem.recordActivity();
        }
      } else {
        feedback.innerHTML = `❌ Pas tout à fait... La réponse était : <strong>${exercise.answer}</strong>`;
        feedback.className = 'exercise-feedback incorrect';
        
        if (this.heartsSystem) {
          this.heartsSystem.loseHeart();
        }
      }

      // CRITIQUE : Retirer les listeners AVANT de changer le bouton
      submitBtn.removeEventListener('click', checkAnswer);
      input.removeEventListener('keypress', handleKeyPress);

      submitBtn.textContent = 'Suivant →';
      submitBtn.onclick = () => {
        this.currentExerciseIndex++;
        this.renderExercise();
      };
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') checkAnswer();
    };

    submitBtn?.addEventListener('click', checkAnswer);
    input?.addEventListener('keypress', handleKeyPress);
  }

  showLessonComplete() {
    const container = document.getElementById('exercise-container');
    if (!container) return;

    const totalExercises = this.currentExercises.length;
    const percentage = Math.round((this.score / totalExercises) * 100);
    const xpEarned = this.score * 10;

    if (this.storage) {
      const currentXP = this.storage.get('totalXP') || 0;
      this.storage.set('totalXP', currentXP + xpEarned);
    }

    container.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <h2 style="font-size: 2rem; margin-bottom: 2rem;">🎉 Leçon Terminée !</h2>
        
        <div style="font-size: 4rem; margin: 2rem 0;">
          ${percentage >= 80 ? '⭐⭐⭐' : percentage >= 60 ? '⭐⭐' : '⭐'}
        </div>

        <div style="font-size: 1.5rem; margin-bottom: 2rem;">
          Score: ${this.score}/${totalExercises} (${percentage}%)
        </div>

        <div style="font-size: 1.2rem; color: #2a9d8f; margin-bottom: 3rem;">
          +${xpEarned} XP gagnés !
        </div>

        <button 
          onclick="location.reload()" 
          class="exercise-submit"
          style="max-width: 300px; margin: 0 auto;"
        >
          Retour aux Leçons
        </button>
      </div>
    `;
  }
}

window.MathsLessons = MathsLessons;
console.log('✅ MathsLessons loaded');
