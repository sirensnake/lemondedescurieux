// ====================================
// FRANCAIS LESSONS - FIX DOUBLE SCORE
// CORRECTION : removeEventListener avant addEventListener
// ====================================

const FRANCAIS_LESSONS_DATA = {
  1: {
    id: 1,
    title: "Verbes au Présent",
    description: "Conjugaison des verbes du 1er groupe",
    icon: "📖",
    locked: false,
    exercises: [
      {
        type: "fillblank",
        question: "Je (chanter) _____ une chanson.",
        answer: "chante",
        hint: "Verbe du 1er groupe au présent avec 'je'"
      },
      {
        type: "fillblank",
        question: "Tu (jouer) _____ au football.",
        answer: "joues",
        hint: "Verbe du 1er groupe au présent avec 'tu'"
      },
      {
        type: "fillblank",
        question: "Il (marcher) _____ dans la rue.",
        answer: "marche",
        hint: "Verbe du 1er groupe au présent avec 'il'"
      },
      {
        type: "fillblank",
        question: "Nous (danser) _____ ensemble.",
        answer: "dansons",
        hint: "Verbe du 1er groupe au présent avec 'nous'"
      },
      {
        type: "fillblank",
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
    locked: false,
    exercises: [
      {
        type: "fillblank",
        question: "Le chat (noir) _____.",
        answer: "noir",
        hint: "Masculin singulier - adjectif de couleur APRÈS le nom"
      },
      {
        type: "fillblank",
        question: "La (grand) _____ maison.",
        answer: "grande",
        hint: "Féminin singulier - adjectif de taille (BAGS) AVANT le nom"
      },
      {
        type: "fillblank",
        question: "Les chiens (méchant) _____.",
        answer: "méchants",
        hint: "Masculin pluriel - adjectif de caractère APRÈS le nom"
      },
      {
        type: "fillblank",
        question: "Les (beau) _____ fleurs.",
        answer: "belles",
        hint: "Féminin pluriel - adjectif de beauté (BAGS) AVANT le nom"
      }
    ]
  },
  3: {
    id: 3,
    title: "Le Passé Composé",
    description: "Raconte ce qui s'est passé",
    icon: "⏰",
    locked: true,
    exercises: []
  },
  4: {
    id: 4,
    title: "L'Imparfait",
    description: "Décris les habitudes du passé",
    icon: "📚",
    locked: true,
    exercises: []
  }
};

class FrenchLessons {
  constructor(storage, heartsSystem, streakSystem) {
    console.log('📚 FrenchLessons initializing...');
    
    this.storage = storage;
    this.heartsSystem = heartsSystem;
    this.streakSystem = streakSystem;
    
    this.currentLesson = null;
    this.currentExerciseIndex = 0;
    this.currentExercises = [];
    this.score = 0;
    
    this.lessons = Object.values(FRANCAIS_LESSONS_DATA);
    this.loadProgress();
    
    setTimeout(() => {
      this.renderLessons();
    }, 300);
    
    console.log('✅ FrenchLessons initialized');
  }

  loadProgress() {
    const completed = this.storage?.get('french_completed_lessons') || [];
    
    this.lessons.forEach((lesson, index) => {
      if (index === 0) {
        lesson.locked = false;
      } else if (completed.includes(this.lessons[index - 1].id)) {
        lesson.locked = false;
      }
    });
  }

  renderLessons() {
    console.log('🎨 Rendering lessons...');
    
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
    
    console.log(`✅ Rendered ${this.lessons.length} lessons`);
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

    console.log('🎓 Starting lesson:', lesson.title);

    this.currentLesson = lesson;
    this.currentExercises = [...lesson.exercises];
    this.currentExerciseIndex = 0;
    this.score = 0;

    console.log('🔢 Initial score:', this.score);

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
          type="text" 
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

    // ← FIX CRITIQUE : Utiliser une fonction nommée pour pouvoir la retirer
    const checkAnswer = () => {
      const userAnswer = input?.value.trim().toLowerCase();
      const correctAnswer = exercise.answer.toLowerCase();
      const feedback = document.getElementById('feedback');

      if (!userAnswer) {
        feedback.innerHTML = '⚠️ Entre ta réponse d\'abord !';
        feedback.className = 'exercise-feedback warning';
        return;
      }

      if (userAnswer === correctAnswer) {
        console.log('✅ Correct! Score before:', this.score);
        this.score++;  // ← UN SEUL INCRÉMENT
        console.log('✅ Score after:', this.score);
        
        feedback.innerHTML = '✅ Bravo ! C\'est correct !';
        feedback.className = 'exercise-feedback correct';
        
        if (this.streakSystem) {
          this.streakSystem.recordActivity();
        }
      } else {
        console.log('❌ Incorrect! Score unchanged:', this.score);
        
        feedback.innerHTML = `❌ Pas tout à fait... La réponse était : <strong>${exercise.answer}</strong>`;
        feedback.className = 'exercise-feedback incorrect';
        
        if (this.heartsSystem) {
          this.heartsSystem.loseHeart();
        }
      }

      // ← FIX : RETIRER le listener avant de changer le bouton
      submitBtn.removeEventListener('click', checkAnswer);
      input.removeEventListener('keypress', handleKeyPress);

      submitBtn.textContent = 'Suivant →';
      submitBtn.onclick = () => {
        this.currentExerciseIndex++;
        this.renderExercise();
      };
    };

    // ← FIX : Fonction nommée pour pouvoir la retirer
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

    console.log('📊 Lesson Complete Debug:', {
      'Final Score': this.score,
      'Total Exercises': totalExercises,
      'Division': this.score / totalExercises,
      'Multiplied by 100': (this.score / totalExercises) * 100,
      'Rounded': percentage,
      'Final Percentage': percentage + '%',
      'XP Earned': xpEarned
    });

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

window.FrenchLessons = FrenchLessons;
console.log('✅ FrenchLessons loaded');
