// ====================================
// HISTOIRE LESSONS - VERSION COMPLÈTE
// 4 leçons avec contexte historique et timeline
// ====================================

console.log('🏛️ HistoireLessons loading...');

const HISTOIRE_LESSONS_DATA = {
  1: {
    id: 1,
    title: "La Préhistoire",
    description: "L'époque des premiers humains",
    icon: "🦴",
    timeline: [
      { date: "-3 millions", event: "Premiers hominidés", icon: "👣" },
      { date: "-450 000", event: "Maîtrise du feu", icon: "🔥" },
      { date: "-40 000", event: "Art pariétal", icon: "🎨" },
      { date: "-10 000", event: "Début agriculture", icon: "🌾" }
    ],
    exercises: [
      {
        question: "Comment appelait-on les premiers humains ?",
        answer: "homo sapiens",
        context: "Les Homo Sapiens sont nos ancêtres directs, apparus il y a 300 000 ans en Afrique.",
        contextIcon: "👤",
        hint: "Leur nom scientifique commence par 'homo'"
      },
      {
        question: "Quelle découverte majeure a transformé la vie préhistorique ?",
        answer: "feu",
        context: "Le feu a permis de cuire les aliments, se chauffer et se protéger des animaux.",
        contextIcon: "🔥",
        hint: "C'est chaud et rouge"
      },
      {
        question: "Comment s'appellent les peintures dans les grottes ?",
        answer: "art parietal",
        context: "L'art pariétal désigne les peintures et gravures réalisées sur les parois des grottes.",
        contextIcon: "🎨",
        hint: "Art sur les parois"
      },
      {
        question: "Quel grand changement marque la fin de la Préhistoire ?",
        answer: "agriculture",
        context: "Le passage de la chasse-cueillette à l'agriculture a permis la sédentarisation.",
        contextIcon: "🌾",
        hint: "Cultiver la terre"
      }
    ]
  },
  2: {
    id: 2,
    title: "L'Égypte Antique",
    description: "Au temps des pharaons",
    icon: "🐫",
    timeline: [
      { date: "-3100", event: "Unification Égypte", icon: "👑" },
      { date: "-2560", event: "Grande Pyramide", icon: "🔺" },
      { date: "-1353", event: "Règne Toutankhamon", icon: "💀" },
      { date: "-30", event: "Fin dynasties", icon: "⚰️" }
    ],
    exercises: [
      {
        question: "Comment s'appellent les rois d'Égypte ?",
        answer: "pharaons",
        context: "Les pharaons étaient considérés comme des dieux vivants en Égypte ancienne.",
        contextIcon: "👑",
        hint: "Commence par 'pha'"
      },
      {
        question: "Quel monument célèbre abrite les tombes des pharaons ?",
        answer: "pyramides",
        context: "Les pyramides étaient des tombeaux géants pour préserver les corps des pharaons.",
        contextIcon: "🔺",
        hint: "Forme triangulaire en 3D"
      },
      {
        question: "Quel fleuve traverse l'Égypte ?",
        answer: "nil",
        context: "Le Nil est le plus long fleuve d'Afrique et était vital pour l'agriculture égyptienne.",
        contextIcon: "🌊",
        hint: "Un fleuve très long"
      },
      {
        question: "Comment s'appellent les écritures égyptiennes ?",
        answer: "hieroglyphes",
        context: "Les hiéroglyphes étaient l'écriture sacrée des anciens Égyptiens, faite de symboles.",
        contextIcon: "📜",
        hint: "Écriture avec des dessins"
      }
    ]
  },
  3: {
    id: 3,
    title: "Les Romains",
    description: "L'Empire qui a conquis le monde",
    icon: "🏛️",
    timeline: [
      { date: "-753", event: "Fondation de Rome", icon: "🏛️" },
      { date: "-27", event: "Début Empire", icon: "👑" },
      { date: "80", event: "Construction Colisée", icon: "🏟️" },
      { date: "476", event: "Chute Empire Romain", icon: "💥" }
    ],
    exercises: [
      {
        question: "Qui étaient les soldats romains ?",
        answer: "legionnaires",
        context: "Les légionnaires formaient l'armée romaine, organisée en légions de 5000 hommes.",
        contextIcon: "⚔️",
        hint: "Ils combattent en légion"
      },
      {
        question: "Comment s'appelle le célèbre amphithéâtre de Rome ?",
        answer: "colisee",
        context: "Le Colisée pouvait accueillir 50 000 spectateurs pour les combats de gladiateurs.",
        contextIcon: "🏟️",
        hint: "Commence par 'col'"
      },
      {
        question: "Quel célèbre général a conquis la Gaule ?",
        answer: "cesar",
        context: "Jules César a conquis la Gaule (actuelle France) entre -58 et -50.",
        contextIcon: "👤",
        hint: "Son nom commence par C"
      },
      {
        question: "Quelle langue parlaient les Romains ?",
        answer: "latin",
        context: "Le latin est l'ancêtre du français, de l'italien, de l'espagnol et du portugais.",
        contextIcon: "📖",
        hint: "Langue à l'origine du français"
      }
    ]
  },
  4: {
    id: 4,
    title: "Le Moyen Âge",
    description: "L'époque des chevaliers et châteaux",
    icon: "🏰",
    timeline: [
      { date: "476", event: "Chute Rome", icon: "💥" },
      { date: "800", event: "Charlemagne empereur", icon: "👑" },
      { date: "1096", event: "Première croisade", icon: "⚔️" },
      { date: "1492", event: "Découverte Amérique", icon: "🌍" }
    ],
    exercises: [
      {
        question: "Comment s'appellent les guerriers en armure ?",
        answer: "chevaliers",
        context: "Les chevaliers étaient des nobles guerriers qui protégeaient leur seigneur.",
        contextIcon: "⚔️",
        hint: "Ils montent à cheval"
      },
      {
        question: "Où vivaient les seigneurs ?",
        answer: "chateaux",
        context: "Les châteaux forts étaient à la fois des résidences et des forteresses défensives.",
        contextIcon: "🏰",
        hint: "Forteresse en pierre"
      },
      {
        question: "Quel empereur a unifié une grande partie de l'Europe ?",
        answer: "charlemagne",
        context: "Charlemagne, couronné empereur en 800, a créé un empire couvrant la France et l'Allemagne.",
        contextIcon: "👑",
        hint: "Charles le Grand"
      },
      {
        question: "Comment s'appellent les paysans qui travaillent pour un seigneur ?",
        answer: "serfs",
        context: "Les serfs cultivaient les terres du seigneur et lui devaient travail et impôts.",
        contextIcon: "🌾",
        hint: "Commence par 's'"
      }
    ]
  }
};

class HistoireLessons {
  constructor() {
    console.log('🏛️ Constructor HistoireLessons');
    this.lessons = Object.values(HISTOIRE_LESSONS_DATA);
    this.currentLesson = null;
    this.currentExerciseIndex = 0;
    this.score = 0;
    
    setTimeout(() => this.renderLessons(), 100);
  }

  renderLessons() {
    console.log('🎨 Rendering', this.lessons.length, 'Histoire lessons');
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
    
    console.log('✅ Histoire lessons rendered');
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

    // Afficher le contexte historique
    const contextIcon = document.getElementById('context-icon');
    const contextText = document.getElementById('context-text');
    if (contextIcon) contextIcon.textContent = exercise.contextIcon;
    if (contextText) contextText.textContent = exercise.context;

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
      this.showFeedback('✅ Bravo ! C\'est exact !', 'correct');
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

    // Afficher la timeline récapitulative
    this.renderTimeline();

    console.log('🏆 Résultats:', this.score + '/' + totalExercises, '(' + percentage + '%)');
  }

  renderTimeline() {
    const timelineSummary = document.getElementById('timeline-summary');
    if (!timelineSummary || !this.currentLesson.timeline) return;

    let html = '<h3 style="color: #92400e; margin-bottom: 1rem;">📜 Frise Chronologique</h3>';
    
    this.currentLesson.timeline.forEach(item => {
      html += `
        <div class="timeline-item">
          <div class="timeline-icon">${item.icon}</div>
          <div class="timeline-date">${item.date}</div>
          <div class="timeline-event">${item.event}</div>
        </div>
      `;
    });

    timelineSummary.innerHTML = html;
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

console.log('✅ HistoireLessons loaded');
const histoireApp = new HistoireLessons();
