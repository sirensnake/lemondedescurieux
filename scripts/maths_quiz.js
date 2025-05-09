/**
 * Quiz de Mathématiques - Le Monde des Curieux
 * Questions adaptées au niveau CM1
 */
const mathsQuizData = [
    {
        question: "Combien font 24 × 3?",
        options: ["62", "72", "82", "92"],
        correctAnswer: 1,
        explanation: "24 × 3 = 72",
        section: "Mathématiques",
        activity: "quiz_multiplication"
    },
    {
        question: "Quel est le périmètre d'un carré de 7 cm de côté?",
        options: ["21 cm", "28 cm", "49 cm", "14 cm"],
        correctAnswer: 1,
        explanation: "Le périmètre d'un carré est 4 × côté, donc 4 × 7 = 28 cm",
        section: "Mathématiques",
        activity: "quiz_perimetre"
    },
    {
        question: "Quelle fraction est équivalente à 0,5?",
        options: ["1/5", "1/2", "5/10", "2/4"],
        correctAnswer: 1,
        explanation: "0,5 = 1/2 (les réponses 2/4 et 5/10 sont aussi correctes, mais 1/2 est la fraction irréductible)",
        section: "Mathématiques",
        activity: "quiz_fractions"
    },
    {
        question: "Combien de faces possède un cube?",
        options: ["4", "6", "8", "12"],
        correctAnswer: 1,
        explanation: "Un cube possède 6 faces carrées",
        section: "Mathématiques",
        activity: "quiz_geometrie"
    },
    {
        question: "Quel angle mesure exactement un quart de tour?",
        options: ["45°", "90°", "180°", "360°"],
        correctAnswer: 1,
        explanation: "Un quart de tour correspond à un angle droit qui mesure 90°",
        section: "Mathématiques",
        activity: "quiz_angles"
    },
    {
        question: "Combien y a-t-il de minutes dans 2 heures?",
        options: ["60 minutes", "120 minutes", "180 minutes", "240 minutes"],
        correctAnswer: 1,
        explanation: "1 heure = 60 minutes, donc 2 heures = 2 × 60 = 120 minutes",
        section: "Mathématiques",
        activity: "quiz_mesures"
    },
    {
        question: "Quelle figure géométrique a 3 côtés?",
        options: ["Un carré", "Un triangle", "Un cercle", "Un rectangle"],
        correctAnswer: 1,
        explanation: "Un triangle a exactement 3 côtés",
        section: "Mathématiques",
        activity: "quiz_figures"
    },
    {
        question: "Quel nombre vient juste après 999?",
        options: ["1000", "1001", "9999", "10000"],
        correctAnswer: 0,
        explanation: "Le nombre qui vient juste après 999 est 1000",
        section: "Mathématiques",
        activity: "quiz_numeration"
    },
    {
        question: "Combien font 150 + 75?",
        options: ["125", "200", "225", "250"],
        correctAnswer: 2,
        explanation: "150 + 75 = 225",
        section: "Mathématiques",
        activity: "quiz_addition"
    },
    {
        question: "Dans un problème, je cherche combien il me reste d'argent. Quelle opération dois-je faire?",
        options: ["Une addition", "Une soustraction", "Une multiplication", "Une division"],
        correctAnswer: 1,
        explanation: "Pour trouver ce qu'il reste, on fait une soustraction (on soustrait ce qu'on a dépensé de ce qu'on avait au départ)",
        section: "Mathématiques",
        activity: "quiz_problemes"
    }
];

// Pour tester le chargement du fichier
console.log("Quiz de Mathématiques chargé avec " + mathsQuizData.length + " questions");