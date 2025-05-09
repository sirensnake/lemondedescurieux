/**
 * Quiz de Français - Le Monde des Curieux
 * Questions adaptées au niveau CM1
 */
const francaisQuizData = [
    {
        question: "Quel est le féminin de 'chanteur'?",
        options: ["chanteuse", "chanteresse", "chanterine", "chanterelle"],
        correctAnswer: 0,
        explanation: "Le féminin de 'chanteur' est 'chanteuse'",
        section: "Français",
        activity: "quiz_genre"
    },
    {
        question: "Identifie le COD dans la phrase: 'Je mange une pomme.'",
        options: ["Je", "mange", "une pomme", "Il n'y a pas de COD"],
        correctAnswer: 2,
        explanation: "Le COD (Complément d'Objet Direct) répond à la question 'quoi?'. Je mange quoi? → une pomme",
        section: "Français",
        activity: "quiz_grammaire"
    },
    {
        question: "Quel temps est utilisé dans la phrase: 'Demain, j'irai au cinéma.'?",
        options: ["Présent", "Passé composé", "Imparfait", "Futur simple"],
        correctAnswer: 3,
        explanation: "La phrase 'Demain, j'irai au cinéma' est au futur simple",
        section: "Français",
        activity: "quiz_conjugaison"
    },
    {
        question: "Que signifie l'expression 'Avoir un chat dans la gorge'?",
        options: ["Avoir un animal de compagnie", "Avoir mal à la gorge", "Être enroué", "Parler fort"],
        correctAnswer: 2,
        explanation: "L'expression 'Avoir un chat dans la gorge' signifie être enroué, avoir du mal à parler",
        section: "Français",
        activity: "quiz_expressions"
    },
    {
        question: "Quel est le pluriel de 'cheval'?",
        options: ["chevals", "chevaus", "chevaux", "chevales"],
        correctAnswer: 2,
        explanation: "Le pluriel de 'cheval' est 'chevaux'",
        section: "Français",
        activity: "quiz_pluriel"
    },
    {
        question: "Quel est le synonyme de 'content'?",
        options: ["Triste", "Fatigué", "Heureux", "Fâché"],
        correctAnswer: 2,
        explanation: "Un synonyme de 'content' est 'heureux'",
        section: "Français",
        activity: "quiz_synonymes"
    },
    {
        question: "Dans la phrase 'Le chat dort sur le canapé', quel est le verbe?",
        options: ["Le chat", "dort", "sur", "le canapé"],
        correctAnswer: 1,
        explanation: "Le verbe dans cette phrase est 'dort' (infinitif: dormir)",
        section: "Français",
        activity: "quiz_nature_mots"
    },
    {
        question: "Comment appelle-t-on les mots qui se prononcent de la même façon mais s'écrivent différemment?",
        options: ["Des synonymes", "Des antonymes", "Des homonymes", "Des paronymes"],
        correctAnswer: 2,
        explanation: "Ce sont des homonymes (exemple: vert/vers/verre)",
        section: "Français",
        activity: "quiz_vocabulaire"
    },
    {
        question: "Quel est le contraire de 'généreux'?",
        options: ["Égoïste", "Gentil", "Aimable", "Intelligent"],
        correctAnswer: 0,
        explanation: "Le contraire (antonyme) de 'généreux' est 'égoïste'",
        section: "Français",
        activity: "quiz_antonymes"
    },
    {
        question: "Quelle est la nature du mot 'rapidement'?",
        options: ["Nom", "Adjectif", "Verbe", "Adverbe"],
        correctAnswer: 3,
        explanation: "Le mot 'rapidement' est un adverbe qui décrit comment une action est faite",
        section: "Français",
        activity: "quiz_grammaire_avance"
    }
];

// Pour tester le chargement du fichier
console.log("Quiz de Français chargé avec " + francaisQuizData.length + " questions");