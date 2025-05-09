/**
 * Quiz de Sciences - Le Monde des Curieux
 * Questions adaptées au niveau CM1
 */
const sciencesQuizData = [
    {
        question: "Quelle est la planète la plus proche du Soleil?",
        options: ["Vénus", "Terre", "Mars", "Mercure"],
        correctAnswer: 3,
        explanation: "Mercure est la planète la plus proche du Soleil",
        section: "Sciences",
        activity: "quiz_systeme_solaire"
    },
    {
        question: "Quel gaz les plantes absorbent-elles pour la photosynthèse?",
        options: ["Oxygène", "Azote", "Dioxyde de carbone", "Hydrogène"],
        correctAnswer: 2,
        explanation: "Les plantes absorbent le dioxyde de carbone (CO2) et rejettent de l'oxygène",
        section: "Sciences",
        activity: "quiz_plantes"
    },
    {
        question: "Quel est l'os le plus long du corps humain?",
        options: ["Humérus", "Fémur", "Tibia", "Colonne vertébrale"],
        correctAnswer: 1,
        explanation: "Le fémur est l'os le plus long du corps humain, situé dans la cuisse",
        section: "Sciences",
        activity: "quiz_corps_humain"
    },
    {
        question: "Qu'est-ce qui provoque les saisons sur Terre?",
        options: ["La distance entre la Terre et le Soleil", "L'inclinaison de l'axe terrestre", "La rotation de la Terre", "Les nuages"],
        correctAnswer: 1,
        explanation: "Les saisons sont provoquées par l'inclinaison de l'axe terrestre pendant la révolution de la Terre autour du Soleil",
        section: "Sciences",
        activity: "quiz_saisons"
    },
    {
        question: "Quel animal peut vivre à la fois dans l'eau et sur terre?",
        options: ["Poisson", "Chien", "Grenouille", "Écureuil"],
        correctAnswer: 2,
        explanation: "La grenouille est un amphibien qui peut vivre à la fois dans l'eau et sur terre",
        section: "Sciences",
        activity: "quiz_animaux"
    },
    {
        question: "Comment s'appelle le processus par lequel l'eau se transforme en vapeur?",
        options: ["Solidification", "Condensation", "Évaporation", "Fusion"],
        correctAnswer: 2,
        explanation: "L'évaporation est le processus par lequel l'eau liquide se transforme en vapeur d'eau",
        section: "Sciences",
        activity: "quiz_etats_eau"
    },
    {
        question: "Laquelle de ces planètes est connue pour ses anneaux?",
        options: ["Jupiter", "Saturne", "Mars", "Vénus"],
        correctAnswer: 1,
        explanation: "Saturne est connue pour ses magnifiques anneaux, bien que d'autres planètes comme Jupiter aient aussi des anneaux moins visibles",
        section: "Sciences",
        activity: "quiz_planetes"
    },
    {
        question: "Quel organe permet de respirer?",
        options: ["Le cœur", "L'estomac", "Les poumons", "Le cerveau"],
        correctAnswer: 2,
        explanation: "Les poumons sont les organes de la respiration, ils permettent d'absorber l'oxygène et de rejeter le dioxyde de carbone",
        section: "Sciences",
        activity: "quiz_respiration"
    },
    {
        question: "Lequel de ces animaux est un mammifère?",
        options: ["Tortue", "Dauphin", "Crocodile", "Perroquet"],
        correctAnswer: 1,
        explanation: "Le dauphin est un mammifère marin qui respire avec des poumons et allaite ses petits",
        section: "Sciences",
        activity: "quiz_classifications"
    },
    {
        question: "Quelle est la principale source d'énergie pour la Terre?",
        options: ["La Lune", "Le Soleil", "Le vent", "Les étoiles"],
        correctAnswer: 1,
        explanation: "Le Soleil est la principale source d'énergie pour la Terre, fournissant lumière et chaleur",
        section: "Sciences",
        activity: "quiz_energie"
    }
];

// Pour tester le chargement du fichier
console.log("Quiz de Sciences chargé avec " + sciencesQuizData.length + " questions");