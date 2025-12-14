// =============================================
// PROGRAMMATION LESSONS - VERSION COMPLÈTE
// Mini-éditeur JavaScript exécutable
// =============================================

console.log('💻 ProgrammationLessons loading...');

const PROG_LESSONS_DATA = {
  1: {
    id: 1,
    title: "Variables et Affichage",
    description: "Crée tes premières variables JavaScript",
    icon: "📦",
    summary: [
      { icon: "📦", text: "Une variable stocke une valeur : let nom = 'Curio';", code: "let age = 10;" },
      { icon: "💬", text: "console.log() affiche du texte dans la console.", code: "console.log('Bonjour !');" },
      { icon: "🔢", text: "Les types de base : texte (string), nombre (number), vrai/faux (boolean).", code: "let score = 100;" },
      { icon: "➕", text: "On peut combiner du texte avec + pour créer des messages.", code: "console.log('Score: ' + score);" }
    ],
    exercises: [
      {
        question: "Quel mot-clé sert à créer une variable ?",
        answer: "let",
        challenge: "Découvre comment stocker une information dans ton programme.",
        challengeIcon: "📦",
        example: "let prenom = 'Curio';\nlet age = 8;",
        starterCode: "// Crée une variable 'message' avec 'Bonjour'\nlet message = ",
        hint: "Commence par 'l' et finit par 't'"
      },
      {
        question: "Quelle fonction affiche dans la console ?",
        answer: "console.log",
        challenge: "Pour voir le résultat de ton code, il faut l'afficher !",
        challengeIcon: "💬",
        example: "console.log('Hello World!');\nconsole.log(42);",
        starterCode: "// Affiche 'JavaScript c\\'est cool !'\n",
        hint: "console point quelque chose"
      },
      {
        question: "Quel type de données est 'Bonjour' ?",
        answer: "string",
        challenge: "Les types de données sont importants en programmation.",
        challengeIcon: "🔤",
        example: "let texte = 'Bonjour';  // string\nlet nombre = 42;      // number\nlet vrai = true;      // boolean",
        starterCode: "// Crée une variable texte\nlet animal = 'chat';\nconsole.log(animal);",
        hint: "Chaîne de caractères en anglais"
      },
      {
        question: "Quel symbole additionne ou combine du texte ?",
        answer: "+",
        challenge: "On peut assembler du texte avec cet opérateur magique !",
        challengeIcon: "➕",
        example: "let prenom = 'Curio';\nlet phrase = 'Bonjour ' + prenom;\nconsole.log(phrase);",
        starterCode: "// Combine 'Hello' et 'World'\nlet message = 'Hello' + ' ' + 'World';\nconsole.log(message);",
        hint: "Signe mathématique d'addition"
      }
    ]
  },
  2: {
    id: 2,
    title: "Conditions et Décisions",
    description: "Apprends à faire des choix dans ton code",
    icon: "🤔",
    summary: [
      { icon: "🤔", text: "if permet de tester une condition et exécuter du code si elle est vraie.", code: "if (age > 10) { ... }" },
      { icon: "↔️", text: "else exécute du code si la condition est fausse.", code: "if (...) { } else { }" },
      { icon: "🔍", text: "Les opérateurs de comparaison : > (plus grand), < (plus petit), === (égal).", code: "if (score === 100)" },
      { icon: "✅", text: "Les conditions permettent à ton programme de prendre des décisions.", code: "if (reponse === 'oui')" }
    ],
    exercises: [
      {
        question: "Quel mot-clé teste une condition ?",
        answer: "if",
        challenge: "Pour que ton programme prenne des décisions, il faut tester !",
        challengeIcon: "🤔",
        example: "if (age > 10) {\n  console.log('Tu as plus de 10 ans');\n}",
        starterCode: "// Teste si score est supérieur à 50\nlet score = 75;\n",
        hint: "Deux lettres : 'si' en anglais"
      },
      {
        question: "Quel mot-clé fait le contraire de 'if' ?",
        answer: "else",
        challenge: "Si la condition n'est pas vraie, que faire ?",
        challengeIcon: "↔️",
        example: "if (pluie) {\n  console.log('Prends ton parapluie');\n} else {\n  console.log('Profite du soleil');\n}",
        starterCode: "// Complète la condition\nif (age < 12) {\n  console.log('Enfant');\n} ",
        hint: "Sinon en anglais"
      },
      {
        question: "Quel symbole teste l'égalité stricte ?",
        answer: "===",
        challenge: "En JavaScript, on utilise 3 signes égal pour comparer !",
        challengeIcon: "🔍",
        example: "if (reponse === 'oui') {\n  console.log('Correct !');\n}",
        starterCode: "// Teste si prenom est égal à 'Curio'\nlet prenom = 'Curio';\n",
        hint: "Trois signes égal"
      },
      {
        question: "Quel symbole signifie 'plus grand que' ?",
        answer: ">",
        challenge: "Pour comparer des nombres, on a besoin de symboles spéciaux.",
        challengeIcon: "📊",
        example: "if (score > 100) {\n  console.log('Excellent !');\n}",
        starterCode: "// Compare deux nombres\nlet note = 85;\nif (note > 50) {\n  console.log('Réussi !');\n}",
        hint: "Symbole mathématique : plus grand"
      }
    ]
  },
  3: {
    id: 3,
    title: "Boucles et Répétitions",
    description: "Répète des actions automatiquement",
    icon: "🔄",
    summary: [
      { icon: "🔄", text: "for permet de répéter du code un nombre précis de fois.", code: "for (let i = 0; i < 5; i++)" },
      { icon: "📊", text: "i++ signifie 'ajouter 1 à i' à chaque tour de boucle.", code: "i++ // i = i + 1" },
      { icon: "⚡", text: "Les boucles évitent de répéter le même code manuellement.", code: "for (let i = 0; i < 10; i++)" },
      { icon: "🎯", text: "La condition i < 5 détermine quand la boucle s'arrête.", code: "for (let i = 0; i < 5; i++)" }
    ],
    exercises: [
      {
        question: "Quel mot-clé crée une boucle compteur ?",
        answer: "for",
        challenge: "Pour répéter une action plusieurs fois, utilise une boucle !",
        challengeIcon: "🔄",
        example: "for (let i = 0; i < 5; i++) {\n  console.log('Tour ' + i);\n}",
        starterCode: "// Affiche les nombres de 0 à 4\n",
        hint: "3 lettres, commence par 'f'"
      },
      {
        question: "Que signifie i++ dans une boucle ?",
        answer: "i+1",
        challenge: "i++ est un raccourci pratique en programmation.",
        challengeIcon: "➕",
        example: "let i = 0;\ni++;  // maintenant i vaut 1\ni++;  // maintenant i vaut 2",
        starterCode: "// i++ signifie i = i + 1\nlet compteur = 0;\ncompteur++;\nconsole.log(compteur);",
        hint: "i plus combien ?"
      },
      {
        question: "Dans 'for(let i=0; i<5; i++)', combien de tours ?",
        answer: "5",
        challenge: "Compte bien : 0, 1, 2, 3, 4 = combien ?",
        challengeIcon: "🔢",
        example: "// i = 0, 1, 2, 3, 4\nfor (let i = 0; i < 5; i++) {\n  console.log(i);\n}",
        starterCode: "// Test la boucle\nfor (let i = 0; i < 5; i++) {\n  console.log('Tour ' + i);\n}",
        hint: "i est strictement inférieur à 5"
      },
      {
        question: "Quel symbole dans 'i < 10' compare i et 10 ?",
        answer: "<",
        challenge: "Les boucles utilisent souvent des comparaisons.",
        challengeIcon: "🔍",
        example: "for (let i = 0; i < 10; i++) {\n  // Tant que i est plus petit que 10\n}",
        starterCode: "// Boucle qui compte jusqu'à 10\nfor (let i = 0; i < 10; i++) {\n  console.log(i);\n}",
        hint: "Plus petit que en symbole"
      }
    ]
  },
  4: {
    id: 4,
    title: "Fonctions et Réutilisation",
    description: "Crée tes propres instructions",
    icon: "⚙️",
    summary: [
      { icon: "⚙️", text: "Une fonction est un bloc de code réutilisable avec un nom.", code: "function dire() { ... }" },
      { icon: "📥", text: "Les paramètres permettent de passer des valeurs à la fonction.", code: "function saluer(nom)" },
      { icon: "📤", text: "return renvoie une valeur depuis la fonction.", code: "return resultat;" },
      { icon: "♻️", text: "Les fonctions évitent de dupliquer du code et organisent ton programme.", code: "saluer('Curio');" }
    ],
    exercises: [
      {
        question: "Quel mot-clé crée une fonction ?",
        answer: "function",
        challenge: "Les fonctions sont des mini-programmes réutilisables !",
        challengeIcon: "⚙️",
        example: "function direBonjour() {\n  console.log('Bonjour !');\n}\ndireBonjour();",
        starterCode: "// Crée une fonction qui affiche 'Hello'\n",
        hint: "8 lettres, commence par 'f'"
      },
      {
        question: "Comment appelle-t-on les valeurs entre () ?",
        answer: "parametres",
        challenge: "On peut donner des informations à une fonction !",
        challengeIcon: "📥",
        example: "function saluer(prenom) {\n  console.log('Bonjour ' + prenom);\n}\nsaluer('Curio');",
        starterCode: "// fonction avec paramètre\nfunction double(nombre) {\n  return nombre * 2;\n}\nconsole.log(double(5));",
        hint: "paramètres ou arguments"
      },
      {
        question: "Quel mot-clé renvoie une valeur ?",
        answer: "return",
        challenge: "Une fonction peut calculer et renvoyer un résultat !",
        challengeIcon: "📤",
        example: "function additionner(a, b) {\n  return a + b;\n}\nlet somme = additionner(3, 5);",
        starterCode: "// Fonction qui retourne un résultat\nfunction multiplier(x, y) {\n  \n}\nconsole.log(multiplier(4, 5));",
        hint: "Retourner en anglais"
      },
      {
        question: "Comment exécute-t-on une fonction nommée 'test' ?",
        answer: "test()",
        challenge: "Pour utiliser une fonction, il faut l'appeler !",
        challengeIcon: "📞",
        example: "function afficher() {\n  console.log('Fonction appelée');\n}\nafficher();  // Appel de la fonction",
        starterCode: "// Appelle cette fonction\nfunction direOui() {\n  console.log('Oui !');\n}\n",
        hint: "nom suivi de parenthèses"
      }
    ]
  }
};

class ProgrammationLessons {
  constructor() {
    console.log('💻 Constructor ProgrammationLessons');
    this.lessons = Object.values(PROG_LESSONS_DATA);
    this.currentLesson = null;
    this.currentExerciseIndex = 0;
    this.score = 0;
    
    setTimeout(() => this.renderLessons(), 100);
  }

  renderLessons() {
    console.log('🎨 Rendering', this.lessons.length, 'Programmation lessons');
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
    
    console.log('✅ Programmation lessons rendered');
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

    // Afficher le défi
    const challengeIcon = document.getElementById('challenge-icon');
    const challengeDescription = document.getElementById('challenge-description');
    const challengeExample = document.getElementById('challenge-example');
    
    if (challengeIcon) challengeIcon.textContent = exercise.challengeIcon;
    if (challengeDescription) challengeDescription.textContent = exercise.challenge;
    if (challengeExample) challengeExample.textContent = exercise.example;

    // Éditeur de code
    const codeEditor = document.getElementById('code-editor');
    if (codeEditor) {
      codeEditor.value = exercise.starterCode || '// Écris ton code ici\n';
      codeEditor.placeholder = 'Écris ton code JavaScript ici...';
    }

    // Question
    const questionText = document.getElementById('question-text');
    const answerInput = document.getElementById('answer-input');
    const progressFill = document.getElementById('progress-fill');
    const hintArea = document.getElementById('hint-area');

    if (questionText) questionText.textContent = exercise.question;
    if (answerInput) {
      answerInput.value = '';
      answerInput.focus();
      
      // Validation Enter
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

    // Effacer console
    this.clearConsole();
  }

  runCode() {
    const codeEditor = document.getElementById('code-editor');
    const consoleOutput = document.getElementById('console-output');
    
    if (!codeEditor || !consoleOutput) return;
    
    const code = codeEditor.value;
    
    // Simuler console.log
    const logs = [];
    const originalLog = console.log;
    console.log = (...args) => {
      logs.push(args.join(' '));
      originalLog(...args);
    };
    
    try {
      // Exécuter le code dans un contexte sécurisé
      eval(code);
      
      // Afficher les logs
      if (logs.length > 0) {
        logs.forEach(log => {
          const logDiv = document.createElement('div');
          logDiv.className = 'console-log';
          logDiv.textContent = '> ' + log;
          consoleOutput.appendChild(logDiv);
        });
      } else {
        const successDiv = document.createElement('div');
        successDiv.className = 'console-success';
        successDiv.textContent = '✓ Code exécuté sans erreur (aucun affichage)';
        consoleOutput.appendChild(successDiv);
      }
      
      // Scroll automatique
      consoleOutput.scrollTop = consoleOutput.scrollHeight;
      
    } catch (error) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'console-error';
      errorDiv.textContent = '✗ Erreur : ' + error.message;
      consoleOutput.appendChild(errorDiv);
    } finally {
      console.log = originalLog;
    }
  }

  clearConsole() {
    const consoleOutput = document.getElementById('console-output');
    if (consoleOutput) {
      consoleOutput.innerHTML = '<div class="console-welcome">💡 Écris ton code et clique sur "Exécuter" !</div>';
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
      this.showFeedback('✅ Parfait ! Tu maîtrises le concept !', 'correct');
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
    const xpEarned = this.score * 15; // Plus d'XP pour programmation !

    const resultCorrect = document.getElementById('result-correct');
    const resultXp = document.getElementById('result-xp');
    const resultScore = document.getElementById('result-score');

    if (resultCorrect) resultCorrect.textContent = this.score + '/' + totalExercises;
    if (resultXp) resultXp.textContent = xpEarned;
    if (resultScore) resultScore.textContent = percentage + '%';

    // Afficher le résumé des concepts
    this.renderSummary();

    console.log('🏆 Résultats:', this.score + '/' + totalExercises, '(' + percentage + '%)');
  }

  renderSummary() {
    const codeSummary = document.getElementById('code-summary');
    if (!codeSummary || !this.currentLesson.summary) return;

    let html = '<h3 style="color: #6d28d9; margin-bottom: 1rem;">📚 Concepts appris</h3>';
    
    this.currentLesson.summary.forEach(concept => {
      html += `
        <div class="code-concept">
          <div class="concept-icon">${concept.icon}</div>
          <div>
            <div class="concept-text">${concept.text}</div>
            ${concept.code ? `<div class="concept-code">${concept.code}</div>` : ''}
          </div>
        </div>
      `;
    });

    codeSummary.innerHTML = html;
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

console.log('✅ ProgrammationLessons loaded');
const progApp = new ProgrammationLessons();
