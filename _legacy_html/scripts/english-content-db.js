// english-content-db.js - Base de données de contenu pour section anglais

// ===== CONFIGURATION DE DIFFICULTÉ =====
const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',    // CM1 - Débutant
  ELEMENTARY: 'elementary', // CM2 - Élémentaire  
  INTERMEDIATE: 'intermediate', // 6ème - Intermédiaire
  ADVANCED: 'advanced'     // 5ème+ - Avancé
};

// ===== BASE DE DONNÉES VOCABULAIRE =====
const VOCABULARY_DB = {
  
  // === NIVEAU DÉBUTANT (CM1) ===
  [DIFFICULTY_LEVELS.BEGINNER]: {
    
    // Famille et maison
    family: [
      { word: 'Mother', french: 'Mère', category: 'famille', audio: 'mother.mp3' },
      { word: 'Father', french: 'Père', category: 'famille', audio: 'father.mp3' },
      { word: 'Sister', french: 'Sœur', category: 'famille', audio: 'sister.mp3' },
      { word: 'Brother', french: 'Frère', category: 'famille', audio: 'brother.mp3' },
      { word: 'House', french: 'Maison', category: 'habitat', audio: 'house.mp3' },
      { word: 'Room', french: 'Chambre', category: 'habitat', audio: 'room.mp3' },
      { word: 'Kitchen', french: 'Cuisine', category: 'habitat', audio: 'kitchen.mp3' }
    ],
    
    // Animaux
    animals: [
      { word: 'Cat', french: 'Chat', category: 'animaux', audio: 'cat.mp3' },
      { word: 'Dog', french: 'Chien', category: 'animaux', audio: 'dog.mp3' },
      { word: 'Bird', french: 'Oiseau', category: 'animaux', audio: 'bird.mp3' },
      { word: 'Fish', french: 'Poisson', category: 'animaux', audio: 'fish.mp3' },
      { word: 'Horse', french: 'Cheval', category: 'animaux', audio: 'horse.mp3' },
      { word: 'Cow', french: 'Vache', category: 'animaux', audio: 'cow.mp3' }
    ],
    
    // Nourriture
    food: [
      { word: 'Apple', french: 'Pomme', category: 'fruits', audio: 'apple.mp3' },
      { word: 'Banana', french: 'Banane', category: 'fruits', audio: 'banana.mp3' },
      { word: 'Bread', french: 'Pain', category: 'nourriture', audio: 'bread.mp3' },
      { word: 'Water', french: 'Eau', category: 'boissons', audio: 'water.mp3' },
      { word: 'Milk', french: 'Lait', category: 'boissons', audio: 'milk.mp3' },
      { word: 'Cake', french: 'Gâteau', category: 'desserts', audio: 'cake.mp3' }
    ],
    
    // Couleurs
    colors: [
      { word: 'Red', french: 'Rouge', category: 'couleurs', audio: 'red.mp3' },
      { word: 'Blue', french: 'Bleu', category: 'couleurs', audio: 'blue.mp3' },
      { word: 'Green', french: 'Vert', category: 'couleurs', audio: 'green.mp3' },
      { word: 'Yellow', french: 'Jaune', category: 'couleurs', audio: 'yellow.mp3' },
      { word: 'Black', french: 'Noir', category: 'couleurs', audio: 'black.mp3' },
      { word: 'White', french: 'Blanc', category: 'couleurs', audio: 'white.mp3' }
    ]
  },
  
  // === NIVEAU ÉLÉMENTAIRE (CM2) ===
  [DIFFICULTY_LEVELS.ELEMENTARY]: {
    
    // École et apprentissage
    school: [
      { word: 'Teacher', french: 'Professeur', category: 'école', audio: 'teacher.mp3' },
      { word: 'Student', french: 'Élève', category: 'école', audio: 'student.mp3' },
      { word: 'Classroom', french: 'Salle de classe', category: 'école', audio: 'classroom.mp3' },
      { word: 'Homework', french: 'Devoirs', category: 'école', audio: 'homework.mp3' },
      { word: 'Book', french: 'Livre', category: 'matériel', audio: 'book.mp3' },
      { word: 'Pencil', french: 'Crayon', category: 'matériel', audio: 'pencil.mp3' }
    ],
    
    // Vêtements
    clothes: [
      { word: 'Shirt', french: 'Chemise', category: 'vêtements', audio: 'shirt.mp3' },
      { word: 'Shoes', french: 'Chaussures', category: 'vêtements', audio: 'shoes.mp3' },
      { word: 'Hat', french: 'Chapeau', category: 'vêtements', audio: 'hat.mp3' },
      { word: 'Jacket', french: 'Veste', category: 'vêtements', audio: 'jacket.mp3' },
      { word: 'Dress', french: 'Robe', category: 'vêtements', audio: 'dress.mp3' }
    ],
    
    // Activités
    activities: [
      { word: 'Play', french: 'Jouer', category: 'verbes', audio: 'play.mp3' },
      { word: 'Read', french: 'Lire', category: 'verbes', audio: 'read.mp3' },
      { word: 'Write', french: 'Écrire', category: 'verbes', audio: 'write.mp3' },
      { word: 'Run', french: 'Courir', category: 'verbes', audio: 'run.mp3' },
      { word: 'Jump', french: 'Sauter', category: 'verbes', audio: 'jump.mp3' },
      { word: 'Dance', french: 'Danser', category: 'verbes', audio: 'dance.mp3' }
    ]
  },
  
  // === NIVEAU INTERMÉDIAIRE (6ème) ===
  [DIFFICULTY_LEVELS.INTERMEDIATE]: {
    
    // Émotions et sentiments
    emotions: [
      { word: 'Happy', french: 'Heureux/se', category: 'émotions', audio: 'happy.mp3' },
      { word: 'Sad', french: 'Triste', category: 'émotions', audio: 'sad.mp3' },
      { word: 'Angry', french: 'En colère', category: 'émotions', audio: 'angry.mp3' },
      { word: 'Excited', french: 'Excité/e', category: 'émotions', audio: 'excited.mp3' },
      { word: 'Surprised', french: 'Surpris/e', category: 'émotions', audio: 'surprised.mp3' },
      { word: 'Worried', french: 'Inquiet/ète', category: 'émotions', audio: 'worried.mp3' }
    ],
    
    // Temps et météo
    weather: [
      { word: 'Sunny', french: 'Ensoleillé', category: 'météo', audio: 'sunny.mp3' },
      { word: 'Rainy', french: 'Pluvieux', category: 'météo', audio: 'rainy.mp3' },
      { word: 'Cloudy', french: 'Nuageux', category: 'météo', audio: 'cloudy.mp3' },
      { word: 'Windy', french: 'Venteux', category: 'météo', audio: 'windy.mp3' },
      { word: 'Cold', french: 'Froid', category: 'météo', audio: 'cold.mp3' },
      { word: 'Hot', french: 'Chaud', category: 'météo', audio: 'hot.mp3' }
    ],
    
    // Technologie moderne
    technology: [
      { word: 'Computer', french: 'Ordinateur', category: 'technologie', audio: 'computer.mp3' },
      { word: 'Internet', french: 'Internet', category: 'technologie', audio: 'internet.mp3' },
      { word: 'Website', french: 'Site web', category: 'technologie', audio: 'website.mp3' },
      { word: 'Email', french: 'E-mail', category: 'technologie', audio: 'email.mp3' },
      { word: 'Password', french: 'Mot de passe', category: 'technologie', audio: 'password.mp3' }
    ]
  }
};

// ===== BASE DE DONNÉES GRAMMAIRE =====
const GRAMMAR_DB = {
  
  [DIFFICULTY_LEVELS.BEGINNER]: [
    {
      rule: 'verb_to_be_present',
      title: 'Le verbe "être" au présent',
      exercises: [
        {
          sentence: 'I ___ a student.',
          options: ['am', 'is', 'are'],
          correct: 'am',
          explanation: 'Avec "I", on utilise toujours "am".'
        },
        {
          sentence: 'She ___ my sister.',
          options: ['am', 'is', 'are'],
          correct: 'is',
          explanation: 'Avec "she", "he", "it", on utilise "is".'
        },
        {
          sentence: 'They ___ happy.',
          options: ['am', 'is', 'are'],
          correct: 'are',
          explanation: 'Avec "they", "we", "you", on utilise "are".'
        }
      ]
    },
    {
      rule: 'articles',
      title: 'Les articles "a" et "an"',
      exercises: [
        {
          sentence: 'I have ___ apple.',
          options: ['a', 'an'],
          correct: 'an',
          explanation: 'On utilise "an" devant les mots qui commencent par une voyelle.'
        },
        {
          sentence: 'This is ___ book.',
          options: ['a', 'an'],
          correct: 'a',
          explanation: 'On utilise "a" devant les mots qui commencent par une consonne.'
        }
      ]
    }
  ],
  
  [DIFFICULTY_LEVELS.ELEMENTARY]: [
    {
      rule: 'present_continuous',
      title: 'Le présent continu',
      exercises: [
        {
          sentence: 'I ___ playing football.',
          options: ['am', 'is', 'are'],
          correct: 'am',
          explanation: 'Present continuous: I am + verbe-ing'
        },
        {
          sentence: 'She ___ reading a book.',
          options: ['am', 'is', 'are'],
          correct: 'is',
          explanation: 'Present continuous: She is + verbe-ing'
        }
      ]
    },
    {
      rule: 'plural_nouns',
      title: 'Le pluriel des noms',
      exercises: [
        {
          sentence: 'I have two ___.',
          options: ['cat', 'cats'],
          correct: 'cats',
          explanation: 'Pour la plupart des noms, on ajoute "s" au pluriel.'
        }
      ]
    }
  ]
};

// ===== BASE DE DONNÉES PHRASES D'ÉCOUTE =====
const LISTENING_DB = {
  
  [DIFFICULTY_LEVELS.BEGINNER]: [
    {
      id: 'greeting_hello',
      text: 'Hello, how are you?',
      french: 'Bonjour, comment allez-vous ?',
      audioFile: 'hello_how_are_you.mp3',
      slowAudioFile: 'hello_how_are_you_slow.mp3',
      difficulty: 'easy',
      category: 'salutations'
    },
    {
      id: 'intro_name',
      text: 'My name is Sarah.',
      french: 'Mon nom est Sarah.',
      audioFile: 'my_name_is_sarah.mp3',
      slowAudioFile: 'my_name_is_sarah_slow.mp3',
      difficulty: 'easy',
      category: 'présentation'
    },
    {
      id: 'counting_123',
      text: 'One, two, three.',
      french: 'Un, deux, trois.',
      audioFile: 'one_two_three.mp3',
      slowAudioFile: 'one_two_three_slow.mp3',
      difficulty: 'easy',
      category: 'nombres'
    }
  ],
  
  [DIFFICULTY_LEVELS.ELEMENTARY]: [
    {
      id: 'daily_routine',
      text: 'I wake up at seven o\'clock.',
      french: 'Je me réveille à sept heures.',
      audioFile: 'wake_up_seven.mp3',
      slowAudioFile: 'wake_up_seven_slow.mp3',
      difficulty: 'medium',
      category: 'routine'
    },
    {
      id: 'food_preferences',
      text: 'I like apples but I don\'t like bananas.',
      french: 'J\'aime les pommes mais je n\'aime pas les bananes.',
      audioFile: 'like_apples_not_bananas.mp3',
      slowAudioFile: 'like_apples_not_bananas_slow.mp3',
      difficulty: 'medium',
      category: 'préférences'
    }
  ]
};

// ===== BASE DE DONNÉES EXPRESSION ORALE =====
const SPEAKING_DB = {
  
  [DIFFICULTY_LEVELS.BEGINNER]: [
    {
      frenchText: 'Bonjour',
      expectedEnglish: 'Hello',
      category: 'salutations',
      tips: 'Prononce "HEH-low"',
      alternatives: ['Hi', 'Good morning']
    },
    {
      frenchText: 'Comment vous appelez-vous ?',
      expectedEnglish: 'What is your name?',
      category: 'questions',
      tips: 'Attention à l\'intonation montante',
      alternatives: ['What\'s your name?']
    },
    {
      frenchText: 'J\'ai dix ans',
      expectedEnglish: 'I am ten years old',
      category: 'age',
      tips: 'Prononce "ten" comme "taine"',
      alternatives: ['I\'m ten']
    }
  ],
  
  [DIFFICULTY_LEVELS.ELEMENTARY]: [
    {
      frenchText: 'Quelle heure est-il ?',
      expectedEnglish: 'What time is it?',
      category: 'temps',
      tips: 'Intonation montante sur "it"',
      alternatives: ['What\'s the time?']
    },
    {
      frenchText: 'Je vais à l\'école en bus',
      expectedEnglish: 'I go to school by bus',
      category: 'transport',
      tips: 'Prononce "bus" avec un "a" court',
      alternatives: ['I take the bus to school']
    }
  ]
};

// ===== QUESTIONS CULTURELLES =====
const CULTURE_DB = {
  [DIFFICULTY_LEVELS.ELEMENTARY]: [
    {
      question: 'Quelle est la capitale de l\'Angleterre ?',
      options: ['London', 'Manchester', 'Birmingham', 'Liverpool'],
      correct: 'London',
      explanation: 'Londres (London) est la capitale de l\'Angleterre et du Royaume-Uni.',
      funFact: 'London a plus de 8 millions d\'habitants !'
    },
    {
      question: 'Quel sport a été inventé en Angleterre ?',
      options: ['Football', 'Basketball', 'Tennis', 'Baseball'],
      correct: 'Football',
      explanation: 'Le football moderne a été codifié en Angleterre au 19ème siècle.',
      funFact: 'Les Anglais appellent notre football "football" et le football américain "American football".'
    }
  ],
  
  [DIFFICULTY_LEVELS.INTERMEDIATE]: [
    {
      question: 'Combien d\'États composent les États-Unis ?',
      options: ['48', '49', '50', '51'],
      correct: '50',
      explanation: 'Les États-Unis comptent 50 États depuis 1959.',
      funFact: 'L\'Alaska et Hawaï ont été les derniers États à rejoindre l\'Union.'
    }
  ]
};

// ===== FONCTIONS UTILITAIRES =====
class EnglishContentManager {
  constructor() {
    this.currentLevel = DIFFICULTY_LEVELS.BEGINNER;
  }
  
  setLevel(level) {
    if (Object.values(DIFFICULTY_LEVELS).includes(level)) {
      this.currentLevel = level;
      console.log(`📚 Niveau défini: ${level}`);
    }
  }
  
  getVocabularyByCategory(category, level = null) {
    const targetLevel = level || this.currentLevel;
    const levelData = VOCABULARY_DB[targetLevel];
    
    if (!levelData || !levelData[category]) {
      console.warn(`Catégorie ${category} non trouvée pour le niveau ${targetLevel}`);
      return [];
    }
    
    return levelData[category];
  }
  
  getAllVocabulary(level = null) {
    const targetLevel = level || this.currentLevel;
    const levelData = VOCABULARY_DB[targetLevel];
    
    if (!levelData) return [];
    
    return Object.values(levelData).flat();
  }
  
  generateVocabularyQuiz(count = 10, categories = null) {
    let allWords = [];
    
    if (categories) {
      categories.forEach(category => {
        allWords = allWords.concat(this.getVocabularyByCategory(category));
      });
    } else {
      allWords = this.getAllVocabulary();
    }
    
    // Mélanger et prendre le nombre voulu
    const shuffled = this.shuffleArray(allWords);
    const selectedWords = shuffled.slice(0, count);
    
    return selectedWords.map((word, index) => {
      // Générer des distracteurs (mauvaises réponses)
      const distractors = this.generateDistractors(word, allWords, 3);
      const options = this.shuffleArray([word.french, ...distractors]);
      
      return {
        id: index + 1,
        type: 'vocabulary',
        word: word.word,
        correct: word.french,
        options: options,
        explanation: `"${word.word}" se traduit par "${word.french}" en français.`,
        category: word.category,
        audioFile: word.audio
      };
    });
  }
  
  generateDistractors(targetWord, allWords, count) {
    // Filtrer pour éviter la bonne réponse et prendre des mots de même catégorie si possible
    const sameCategory = allWords.filter(w => 
      w.category === targetWord.category && w.french !== targetWord.french
    );
    
    const otherWords = allWords.filter(w => 
      w.category !== targetWord.category && w.french !== targetWord.french
    );
    
    let distractors = [];
    
    // Prendre d'abord des mots de même catégorie (plus difficile)
    const sameCategoryShuffled = this.shuffleArray(sameCategory);
    distractors = distractors.concat(
      sameCategoryShuffled.slice(0, Math.min(count - 1, sameCategoryShuffled.length))
        .map(w => w.french)
    );
    
    // Compléter avec d'autres mots si nécessaire
    if (distractors.length < count) {
      const otherShuffled = this.shuffleArray(otherWords);
      const needed = count - distractors.length;
      distractors = distractors.concat(
        otherShuffled.slice(0, needed).map(w => w.french)
      );
    }
    
    return distractors;
  }
  
  getGrammarExercises(rule = null, level = null) {
    const targetLevel = level || this.currentLevel;
    const levelData = GRAMMAR_DB[targetLevel] || [];
    
    if (rule) {
      const ruleData = levelData.find(r => r.rule === rule);
      return ruleData ? ruleData.exercises : [];
    }
    
    return levelData.flatMap(r => r.exercises);
  }
  
  getListeningExercises(level = null, category = null) {
    const targetLevel = level || this.currentLevel;
    let exercises = LISTENING_DB[targetLevel] || [];
    
    if (category) {
      exercises = exercises.filter(e => e.category === category);
    }
    
    return exercises;
  }
  
  getSpeakingExercises(level = null, category = null) {
    const targetLevel = level || this.currentLevel;
    let exercises = SPEAKING_DB[targetLevel] || [];
    
    if (category) {
      exercises = exercises.filter(e => e.category === category);
    }
    
    return exercises;
  }
  
  getCultureQuestions(level = null) {
    const targetLevel = level || this.currentLevel;
    return CULTURE_DB[targetLevel] || [];
  }
  
  // Générateur de leçons complètes
  generateMixedLesson(vocabularyCount = 4, grammarCount = 2, listeningCount = 2, speakingCount = 2) {
    const lesson = [];
    
    // Vocabulaire
    const vocabQuestions = this.generateVocabularyQuiz(vocabularyCount);
    lesson.push(...vocabQuestions);
    
    // Grammaire
    const grammarExercises = this.getGrammarExercises();
    const selectedGrammar = this.shuffleArray(grammarExercises).slice(0, grammarCount);
    selectedGrammar.forEach((exercise, index) => {
      lesson.push({
        id: lesson.length + 1,
        type: 'grammar',
        sentenceStart: exercise.sentence.split('___')[0],
        sentenceEnd: exercise.sentence.split('___')[1] || '',
        grammarOptions: exercise.options,
        correct: exercise.correct,
        explanation: exercise.explanation
      });
    });
    
    // Écoute
    const listeningExercises = this.getListeningExercises();
    const selectedListening = this.shuffleArray(listeningExercises).slice(0, listeningCount);
    selectedListening.forEach((exercise, index) => {
      lesson.push({
        id: lesson.length + 1,
        type: 'listening',
        audioUrl: `audio/${exercise.audioFile}`,
        slowAudioUrl: `audio/${exercise.slowAudioFile}`,
        correct: exercise.text,
        explanation: `La phrase en anglais est "${exercise.text}", qui signifie "${exercise.french}".`,
        french: exercise.french
      });
    });
    
    // Expression orale
    const speakingExercises = this.getSpeakingExercises();
    const selectedSpeaking = this.shuffleArray(speakingExercises).slice(0, speakingCount);
    selectedSpeaking.forEach((exercise, index) => {
      lesson.push({
        id: lesson.length + 1,
        type: 'speaking',
        frenchPhrase: exercise.frenchText,
        expectedEnglish: exercise.expectedEnglish,
        explanation: `En anglais, on dit "${exercise.expectedEnglish}". ${exercise.tips}`,
        alternatives: exercise.alternatives
      });
    });
    
    // Mélanger toutes les questions
    return this.shuffleArray(lesson).map((question, index) => ({
      ...question,
      id: index + 1
    }));
  }
  
  // Évaluation de niveau
  assessLevel(userAnswers) {
    const correctCount = userAnswers.filter(a => a.correct).length;
    const totalQuestions = userAnswers.length;
    const percentage = (correctCount / totalQuestions) * 100;
    
    if (percentage >= 90) {
      return DIFFICULTY_LEVELS.ADVANCED;
    } else if (percentage >= 75) {
      return DIFFICULTY_LEVELS.INTERMEDIATE;
    } else if (percentage >= 60) {
      return DIFFICULTY_LEVELS.ELEMENTARY;
    } else {
      return DIFFICULTY_LEVELS.BEGINNER;
    }
  }
  
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// ===== EXPORT GLOBAL =====
window.DIFFICULTY_LEVELS = DIFFICULTY_LEVELS;
window.EnglishContentManager = EnglishContentManager;

// Instance globale pour l'app
window.englishContent = new EnglishContentManager();

console.log('📚 English Content Database loaded successfully');
console.log('📊 Available levels:', Object.values(DIFFICULTY_LEVELS));
console.log('📝 Total vocabulary entries:', Object.values(VOCABULARY_DB).reduce((total, level) => {
  return total + Object.values(level).reduce((levelTotal, category) => levelTotal + category.length, 0);
}, 0));