/**
 * Quiz de Programmation - Le Monde des Curieux
 * Questions adaptées au niveau CM1
 */
const programmationQuizData = [
    {
        question: "Qu'est-ce qu'un algorithme?",
        options: [
            "Un type d'ordinateur", 
            "Une suite d'instructions pour résoudre un problème", 
            "Un langage de programmation", 
            "Un jeu vidéo"
        ],
        correctAnswer: 1,
        explanation: "Un algorithme est une suite d'instructions précises qui permettent de résoudre un problème ou d'accomplir une tâche",
        section: "Programmation",
        activity: "quiz_algorithme"
    },
    {
        question: "Qu'est-ce qu'une boucle en programmation?",
        options: [
            "Un cercle dessiné à l'écran", 
            "Une erreur dans le programme", 
            "Une instruction qui se répète plusieurs fois", 
            "Un type de jeu"
        ],
        correctAnswer: 2,
        explanation: "Une boucle est une instruction qui permet de répéter plusieurs fois les mêmes actions, sans avoir à réécrire le code",
        section: "Programmation",
        activity: "quiz_boucle"
    },
    {
        question: "Qu'est-ce qu'une variable en programmation?",
        options: [
            "Quelque chose qui change souvent", 
            "Un espace dans la mémoire de l'ordinateur qui stocke une information", 
            "Une erreur difficile à trouver", 
            "Un type de jeu vidéo"
        ],
        correctAnswer: 1,
        explanation: "Une variable est comme une boîte dans la mémoire de l'ordinateur où l'on peut stocker une information (un nombre, un texte...)",
        section: "Programmation",
        activity: "quiz_variable"
    },
    {
        question: "Qu'est-ce que Scratch?",
        options: [
            "Un langage de programmation avec des blocs colorés", 
            "Un jeu de dessin", 
            "Un virus informatique", 
            "Un type de robot"
        ],
        correctAnswer: 0,
        explanation: "Scratch est un langage de programmation avec des blocs colorés qui s'emboîtent, spécialement conçu pour apprendre à coder",
        section: "Programmation",
        activity: "quiz_scratch"
    },
    {
        question: "À quoi sert la condition 'si...alors' en programmation?",
        options: [
            "À poser une question", 
            "À faire une action seulement si une condition est vraie", 
            "À créer un jeu", 
            "À dessiner à l'écran"
        ],
        correctAnswer: 1,
        explanation: "La condition 'si...alors' permet au programme de prendre des décisions: si une condition est vraie, alors l'ordinateur exécute certaines instructions",
        section: "Programmation",
        activity: "quiz_condition"
    },
    {
        question: "Qu'est-ce que le débogage?",
        options: [
            "Nettoyer son ordinateur", 
            "Installer un nouveau programme", 
            "Trouver et corriger les erreurs dans un programme", 
            "Créer un nouveau jeu"
        ],
        correctAnswer: 2,
        explanation: "Le débogage consiste à trouver et corriger les erreurs (bugs) dans un programme pour qu'il fonctionne correctement",
        section: "Programmation",
        activity: "quiz_debogage"
    },
    {
        question: "Qu'est-ce qu'un pixel?",
        options: [
            "Un petit point lumineux qui forme les images sur les écrans", 
            "Un type de programmation", 
            "Un jeu vidéo", 
            "Un virus informatique"
        ],
        correctAnswer: 0,
        explanation: "Un pixel est le plus petit élément d'une image numérique, comme un petit point lumineux. Les écrans sont composés de milliers ou millions de pixels",
        section: "Programmation",
        activity: "quiz_pixel"
    },
    {
        question: "Comment appelle-t-on une erreur dans un programme?",
        options: [
            "Une panne", 
            "Un bug", 
            "Un crash", 
            "Un virus"
        ],
        correctAnswer: 1,
        explanation: "Une erreur dans un programme s'appelle un 'bug'. Le mot vient de l'anglais et fait référence à un insecte qui était entré dans un ancien ordinateur",
        section: "Programmation",
        activity: "quiz_bug"
    },
    {
        question: "Qu'est-ce qu'un robot?",
        options: [
            "Un ordinateur très puissant", 
            "Une machine programmable qui peut effectuer des actions dans le monde réel", 
            "Un personnage de dessin animé", 
            "Un virus informatique"
        ],
        correctAnswer: 1,
        explanation: "Un robot est une machine programmable qui peut effectuer des actions physiques dans le monde réel, suivant les instructions qu'on lui a données",
        section: "Programmation",
        activity: "quiz_robot"
    },
    {
        question: "Pourquoi apprendre à coder est-il utile, même si on ne veut pas devenir programmeur?",
        options: [
            "Ce n'est pas utile si on ne veut pas être programmeur", 
            "Juste pour jouer à des jeux vidéo", 
            "Pour développer sa logique et sa créativité dans tous les domaines", 
            "Uniquement pour réparer son ordinateur"
        ],
        correctAnswer: 2,
        explanation: "Apprendre à coder aide à développer la logique, la créativité et la résolution de problèmes, des compétences utiles dans tous les domaines",
        section: "Programmation",
        activity: "quiz_utilite"
    }
];

// Pour tester le chargement du fichier
console.log("Quiz de Programmation chargé avec " + programmationQuizData.length + " questions");