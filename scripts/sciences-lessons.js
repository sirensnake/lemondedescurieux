// ====================================
// SCIENCES LESSONS - VERSION COMPLÈTE
// 4 thèmes avec expériences visuelles
// ====================================

console.log('🔬 SciencesLessons loading...');

const SCIENCES_LESSONS_DATA = {
  1: {
    id: 1,
    title: "Le Système Solaire",
    description: "Explore les planètes et les étoiles",
    icon: "🌍",
    summary: [
      { icon: "☀️", text: "Le Soleil est une étoile qui fournit lumière et chaleur à notre système." },
      { icon: "🌍", text: "La Terre est la 3ème planète, seule à avoir de l'eau liquide et de la vie." },
      { icon: "🌙", text: "La Lune tourne autour de la Terre en environ 28 jours." },
      { icon: "🪐", text: "Il y a 8 planètes dans notre système solaire." }
    ],
    exercises: [
      {
        question: "Quelle est l'étoile au centre de notre système ?",
        answer: "soleil",
        experiment: "Le Soleil est une boule de gaz brûlante qui produit de l'énergie par fusion nucléaire.",
        experimentIcon: "☀️",
        visual: "☀️",
        visualClass: "visual-sun",
        hint: "C'est ce qui nous éclaire le jour"
      },
      {
        question: "Sur quelle planète vivons-nous ?",
        answer: "terre",
        experiment: "La Terre est la seule planète connue avec de la vie grâce à son eau et son atmosphère.",
        experimentIcon: "🌍",
        visual: "🌍",
        visualClass: "visual-earth",
        hint: "La planète bleue"
      },
      {
        question: "Quel satellite naturel tourne autour de la Terre ?",
        answer: "lune",
        experiment: "La Lune reflète la lumière du Soleil et provoque les marées sur Terre.",
        experimentIcon: "🌙",
        visual: "🌙",
        visualClass: "visual-earth",
        hint: "On la voit la nuit"
      },
      {
        question: "Combien y a-t-il de planètes dans le système solaire ?",
        answer: "8",
        experiment: "Mercure, Vénus, Terre, Mars, Jupiter, Saturne, Uranus, Neptune = 8 planètes",
        experimentIcon: "🪐",
        visual: "☿️♀️🌍♂️♃♄♅♆",
        visualClass: "",
        hint: "Entre 5 et 10"
      }
    ]
  },
  2: {
    id: 2,
    title: "Le Cycle de l'Eau",
    description: "Comprends comment l'eau circule",
    icon: "💧",
    summary: [
      { icon: "💧", text: "L'eau change d'état : liquide, solide (glace), gazeux (vapeur)." },
      { icon: "☁️", text: "L'évaporation transforme l'eau liquide en vapeur qui monte dans le ciel." },
      { icon: "🌧️", text: "La condensation forme des nuages, puis la pluie retombe." },
      { icon: "🌊", text: "L'eau retourne dans les océans, les rivières et recommence le cycle." }
    ],
    exercises: [
      {
        question: "Comment s'appelle le passage de l'eau liquide à la vapeur ?",
        answer: "evaporation",
        experiment: "Quand l'eau chauffe, elle se transforme en vapeur invisible qui monte dans l'air.",
        experimentIcon: "💨",
        visual: "💧 → ☁️",
        visualClass: "visual-water",
        hint: "Commence par 'éva'"
      },
      {
        question: "Que forme la vapeur d'eau dans le ciel ?",
        answer: "nuages",
        experiment: "La vapeur refroidit en altitude et forme des gouttelettes qui créent les nuages.",
        experimentIcon: "☁️",
        visual: "☁️ ☁️ ☁️",
        visualClass: "visual-water",
        hint: "Blancs et flottants"
      },
      {
        question: "Comment s'appelle l'eau qui tombe du ciel ?",
        answer: "pluie",
        experiment: "Quand les gouttelettes dans les nuages deviennent trop lourdes, elles tombent.",
        experimentIcon: "🌧️",
        visual: "☁️ → 🌧️",
        visualClass: "",
        hint: "Ça mouille"
      },
      {
        question: "Où va l'eau de pluie après être tombée ?",
        answer: "riviere",
        experiment: "L'eau ruisselle sur le sol et retourne dans les rivières, puis les océans.",
        experimentIcon: "🌊",
        visual: "🌧️ → 🏞️ → 🌊",
        visualClass: "",
        hint: "Cours d'eau naturel"
      }
    ]
  },
  3: {
    id: 3,
    title: "Le Corps Humain",
    description: "Découvre comment fonctionne ton corps",
    icon: "🫀",
    summary: [
      { icon: "🫀", text: "Le cœur pompe le sang dans tout le corps, environ 100 000 fois par jour." },
      { icon: "🫁", text: "Les poumons permettent de respirer et d'échanger oxygène et CO2." },
      { icon: "🧠", text: "Le cerveau contrôle toutes les actions du corps et permet de penser." },
      { icon: "🦴", text: "Le squelette contient 206 os qui soutiennent et protègent le corps." }
    ],
    exercises: [
      {
        question: "Quel organe pompe le sang dans tout le corps ?",
        answer: "coeur",
        experiment: "Le cœur bat environ 70 fois par minute pour faire circuler le sang.",
        experimentIcon: "🫀",
        visual: "🫀",
        visualClass: "visual-sun",
        hint: "Bat dans la poitrine"
      },
      {
        question: "Avec quels organes respires-tu ?",
        answer: "poumons",
        experiment: "Les poumons captent l'oxygène de l'air et rejettent le dioxyde de carbone.",
        experimentIcon: "🫁",
        visual: "🫁 🫁",
        visualClass: "",
        hint: "On en a deux"
      },
      {
        question: "Quel organe te permet de penser et de bouger ?",
        answer: "cerveau",
        experiment: "Le cerveau contient environ 86 milliards de neurones qui transmettent les informations.",
        experimentIcon: "🧠",
        visual: "🧠",
        visualClass: "visual-atom",
        hint: "Dans la tête"
      },
      {
        question: "Comment s'appelle l'ensemble de tous les os ?",
        answer: "squelette",
        experiment: "Le squelette protège les organes et permet de se tenir debout et de bouger.",
        experimentIcon: "🦴",
        visual: "🦴 🦴 🦴",
        visualClass: "",
        hint: "Structure osseuse"
      }
    ]
  },
  4: {
    id: 4,
    title: "Les États de la Matière",
    description: "Solide, liquide, gaz : comprends tout !",
    icon: "⚗️",
    summary: [
      { icon: "🧊", text: "L'état solide : forme fixe, molécules serrées (ex: glace, bois)." },
      { icon: "💧", text: "L'état liquide : prend la forme du récipient, molécules mobiles (ex: eau)." },
      { icon: "💨", text: "L'état gazeux : remplit tout l'espace, molécules très libres (ex: air)." },
      { icon: "🔥", text: "La chaleur fait passer d'un état à l'autre : fusion, évaporation, solidification." }
    ],
    exercises: [
      {
        question: "Quel est l'état de la glace ?",
        answer: "solide",
        experiment: "Dans un solide, les molécules sont très serrées et ne bougent presque pas.",
        experimentIcon: "🧊",
        visual: "🧊",
        visualClass: "",
        hint: "Dur et rigide"
      },
      {
        question: "Quel est l'état de l'eau du robinet ?",
        answer: "liquide",
        experiment: "Dans un liquide, les molécules glissent les unes sur les autres librement.",
        experimentIcon: "💧",
        visual: "💧",
        visualClass: "visual-water",
        hint: "Coule et prend la forme"
      },
      {
        question: "Quel est l'état de l'air que tu respires ?",
        answer: "gaz",
        experiment: "Dans un gaz, les molécules sont très éloignées et bougent dans tous les sens.",
        experimentIcon: "💨",
        visual: "💨",
        visualClass: "",
        hint: "Invisible et partout"
      },
      {
        question: "Comment s'appelle le passage de solide à liquide ?",
        answer: "fusion",
        experiment: "La fusion se produit quand on chauffe un solide : la glace fond et devient eau.",
        experimentIcon: "🔥",
        visual: "🧊 + 🔥 → 💧",
        visualClass: "",
        hint: "La glace qui fond"
      }
    ]
  }
};

class SciencesLessons {
  constructor() {
    console.log('🔬 Constructor SciencesLessons');
    this.lessons = Object.values(SCIENCES_LESSONS_DATA);
    this.currentLesson = null;
    this.currentExerciseIndex = 0;
    this.score = 0;
    
    setTimeout(() => this.renderLessons(), 100);
  }

  renderLessons() {
    console.log('🎨 Rendering', this.lessons.length, 'Sciences lessons');
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
    
    console.log('✅ Sciences lessons rendered');
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

    // Afficher l'expérience scientifique
    const experimentIcon = document.getElementById('experiment-icon');
    const experimentDescription = document.getElementById('experiment-description');
    const experimentVisual = document.getElementById('experiment-visual');
    
    if (experimentIcon) experimentIcon.textContent = exercise.experimentIcon;
    if (experimentDescription) experimentDescription.textContent = exercise.experiment;
    if (experimentVisual) {
      experimentVisual.textContent = exercise.visual;
      experimentVisual.className = 'experiment-visual ' + (exercise.visualClass || '');
    }

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
      this.showFeedback('✅ Excellent ! Bonne réponse scientifique !', 'correct');
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

    // Afficher le résumé scientifique
    this.renderSummary();

    console.log('🏆 Résultats:', this.score + '/' + totalExercises, '(' + percentage + '%)');
  }

  renderSummary() {
    const scienceSummary = document.getElementById('science-summary');
    if (!scienceSummary || !this.currentLesson.summary) return;

    let html = '<h3 style="color: #047857; margin-bottom: 1rem;">📚 Ce que tu as appris</h3>';
    
    this.currentLesson.summary.forEach(fact => {
      html += `
        <div class="science-fact">
          <div class="fact-icon">${fact.icon}</div>
          <div class="fact-text">${fact.text}</div>
        </div>
      `;
    });

    scienceSummary.innerHTML = html;
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

console.log('✅ SciencesLessons loaded');
const sciencesApp = new SciencesLessons();
