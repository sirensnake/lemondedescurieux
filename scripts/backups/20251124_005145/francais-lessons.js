/* ============================================================================
   BASE DE DONNÉES DES LEÇONS - FRANÇAIS
   Fichier: scripts/francais-lessons.js
   ============================================================================ */

// Base de données des leçons simplifiée
const FRANCAIS_LESSONS_DATA = {
  "verbes-present": {
    id: "verbes-present",
    title: "Les Verbes au Présent",
    description: "Apprends à conjuguer les verbes du 1er groupe au présent",
    difficulty: 1,
    estimatedTime: 8,
    xpReward: 20,
    
    exercises: [
      {
        type: "multiple_choice",
        question: "Quelle est la conjugaison correcte du verbe 'chanter' avec 'je' ?",
        instruction: "Choisis la bonne terminaison",
        options: ["je chantes", "je chante", "je chanter", "je chantons"],
        correct: 1,
        explanation: "Avec 'je', les verbes du 1er groupe prennent la terminaison 'e'",
        hint: "Pense à la terminaison des verbes en -er avec 'je'"
      },
      {
        type: "multiple_choice",
        question: "Comment conjugue-t-on 'jouer' avec 'tu' ?",
        instruction: "Choisis la bonne réponse",
        options: ["tu joue", "tu joues", "tu jouer", "tu jouons"],
        correct: 1,
        explanation: "Avec 'tu', les verbes du 1er groupe prennent 'es'",
        hint: "Quelle terminaison avec 'tu' ?"
      },
      {
        type: "multiple_choice",
        question: "Quelle est la conjugaison de 'aimer' avec 'nous' ?",
        instruction: "Sélectionne la bonne forme",
        options: ["nous aimons", "nous aimez", "nous aiment", "nous aimes"],
        correct: 0,
        explanation: "Avec 'nous', les verbes du 1er groupe prennent 'ons'",
        hint: "Pense à la terminaison avec 'nous'"
      }
    ]
  },

  "orthographe-sons": {
    id: "orthographe-sons",
    title: "Les Sons [é] et [è]",
    description: "Distingue et écris correctement les sons é et è",
    difficulty: 2,
    estimatedTime: 10,
    xpReward: 25,
    
    exercises: [
      {
        type: "multiple_choice",
        question: "Quel son entends-tu dans le mot 'forêt' ?",
        instruction: "Écoute attentivement et choisis",
        options: ["[é] comme dans café", "[è] comme dans père", "[e] comme dans le"],
        correct: 1,
        explanation: "Le son 'ê' dans forêt se prononce [è] comme dans 'père'",
        hint: "Concentre-toi sur la prononciation du 'ê'"
      },
      {
        type: "multiple_choice",
        question: "Comment s'écrit le son [é] dans 'café' ?",
        instruction: "Choisis la bonne écriture",
        options: ["é", "è", "ê", "e"],
        correct: 0,
        explanation: "Le son [é] fermé s'écrit avec un accent aigu 'é'",
        hint: "C'est un accent qui monte vers la droite"
      }
    ]
  },

  "vocabulaire-famille": {
    id: "vocabulaire-famille",
    title: "Les Mots de la Famille",
    description: "Découvre les familles de mots et enrichis ton vocabulaire",
    difficulty: 1,
    estimatedTime: 12,
    xpReward: 30,
    
    exercises: [
      {
        type: "multiple_choice",
        question: "Quel mot appartient à la famille de 'terre' ?",
        instruction: "Sélectionne le mot de la même famille",
        options: ["terrible", "terrain", "tigre", "table"],
        correct: 1,
        explanation: "Terrain contient le radical 'terr-' qui vient de 'terre'",
        hint: "Cherche le mot qui contient 'terr'"
      },
      {
        type: "multiple_choice",
        question: "Lequel est de la famille de 'chant' ?",
        instruction: "Trouve le mot apparenté",
        options: ["chance", "chanteur", "champ", "chat"],
        correct: 1,
        explanation: "Chanteur vient de 'chant' + le suffixe '-eur'",
        hint: "Quel mot parle de musique ?"
      }
    ]
  }
};

// Système de progression simple
const FRANCAIS_PROGRESSION = {
  calculateNextLessons: function(userProgress) {
    const completed = Object.keys(userProgress.lessons || {});
    const available = Object.keys(FRANCAIS_LESSONS_DATA);
    
    return available.filter(lessonId => {
      const lesson = FRANCAIS_LESSONS_DATA[lessonId];
      return !completed.includes(lessonId) && lesson.difficulty <= (completed.length + 1);
    });
  },
  
  calculateXPBonus: function(baseXP, performance) {
    let bonus = 1;
    if (performance.streak >= 3) bonus += 0.3;
    if (performance.accuracy >= 90) bonus += 0.2;
    return Math.round(baseXP * bonus);
  }
};

// Export global pour le navigateur
if (typeof window !== 'undefined') {
  window.FRANCAIS_LESSONS_DATA = FRANCAIS_LESSONS_DATA;
  window.FRANCAIS_PROGRESSION = FRANCAIS_PROGRESSION;
  console.log('✅ Leçons françaises chargées:', Object.keys(FRANCAIS_LESSONS_DATA).length, 'leçons');
}

// Export pour Node.js (si nécessaire)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FRANCAIS_LESSONS_DATA, FRANCAIS_PROGRESSION };
}
// Export global
if (typeof window !== 'undefined') {
  window.FrenchLessons = FrenchLessons;
  console.log('✅ FrenchLessons loaded');
}

// Export global
if (typeof window !== 'undefined') {
  window.FrenchLessons = FrenchLessons;
  console.log('✅ FrenchLessons loaded');
}
