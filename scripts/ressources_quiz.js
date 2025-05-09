/**
 * Quiz Ressources pédagogiques - Le Monde des Curieux
 * Questions adaptées au niveau CM1
 */
const ressourcesQuizData = [
    {
        question: "Qu'est-ce qu'une source d'information fiable?",
        options: [
            "N'importe quel site internet", 
            "Une vidéo avec beaucoup de vues", 
            "Un document écrit par des experts ou venant d'institutions reconnues", 
            "Un message envoyé par un ami"
        ],
        correctAnswer: 2,
        explanation: "Une source fiable est généralement un document produit par des experts ou venant d'institutions reconnues, comme les encyclopédies, les sites éducatifs officiels ou les livres scolaires",
        section: "Ressources",
        activity: "quiz_sources"
    },
    {
        question: "Comment savoir si une information trouvée sur internet est vraie?",
        options: [
            "Si elle a beaucoup de likes", 
            "Si elle est partagée par beaucoup de personnes", 
            "En vérifiant sur plusieurs sources différentes et fiables", 
            "Si elle a de belles images"
        ],
        correctAnswer: 2,
        explanation: "Pour vérifier si une information est vraie, il faut la chercher sur plusieurs sources différentes et fiables, et comparer ce qu'elles disent",
        section: "Ressources",
        activity: "quiz_verification"
    },
    {
        question: "Qu'est-ce qu'une bibliothèque numérique?",
        options: [
            "Un ordinateur dans une bibliothèque", 
            "Un site internet qui contient des livres et documents numériques", 
            "Une application pour ranger ses fichiers", 
            "Un livre électronique"
        ],
        correctAnswer: 1,
        explanation: "Une bibliothèque numérique est un site internet qui contient des livres, documents et ressources sous forme numérique, souvent consultables gratuitement",
        section: "Ressources",
        activity: "quiz_bibliotheque"
    },
    {
        question: "Pourquoi faut-il citer ses sources quand on fait un exposé?",
        options: [
            "Ce n'est pas nécessaire", 
            "Pour avoir une meilleure note", 
            "Pour montrer qu'on a travaillé", 
            "Pour respecter le travail des autres et permettre de vérifier les informations"
        ],
        correctAnswer: 3,
        explanation: "Citer ses sources est important pour respecter le travail des personnes qui ont créé l'information et pour permettre aux autres de vérifier si les informations sont fiables",
        section: "Ressources",
        activity: "quiz_citation"
    },
    {
        question: "Comment s'appelle l'action de copier-coller le travail de quelqu'un d'autre sans le citer?",
        options: [
            "Une recherche", 
            "Le plagiat", 
            "Une citation", 
            "Un résumé"
        ],
        correctAnswer: 1,
        explanation: "Le plagiat est l'action de copier le travail de quelqu'un d'autre et de le présenter comme le sien, sans citer la source. C'est considéré comme malhonnête",
        section: "Ressources",
        activity: "quiz_plagiat"
    },
    {
        question: "Qu'est-ce qu'un moteur de recherche?",
        options: [
            "Un programme qui permet de trouver des informations sur internet", 
            "Un programme pour créer des sites web", 
            "Le moteur d'une voiture", 
            "Un type d'ordinateur"
        ],
        correctAnswer: 0,
        explanation: "Un moteur de recherche est un programme qui permet de trouver des informations sur internet en tapant des mots-clés, comme Google, Qwant Junior ou Ecosia",
        section: "Ressources",
        activity: "quiz_moteur"
    },
    {
        question: "Qu'est-ce qu'un mot-clé dans une recherche?",
        options: [
            "Un mot de passe", 
            "Un mot secret", 
            "Un mot important qui aide à trouver l'information recherchée", 
            "Le nom d'un site internet"
        ],
        correctAnswer: 2,
        explanation: "Un mot-clé est un mot important qui aide le moteur de recherche à trouver l'information que l'on cherche, comme 'dinosaure', 'planète' ou 'recette'",
        section: "Ressources",
        activity: "quiz_motcle"
    },
    {
        question: "Pourquoi est-il important de diversifier ses sources d'information?",
        options: [
            "Ce n'est pas important", 
            "Pour avoir plus de devoirs à faire", 
            "Pour avoir différents points de vue et une information plus complète", 
            "Juste pour les exposés à l'école"
        ],
        correctAnswer: 2,
        explanation: "Diversifier ses sources permet d'avoir différents points de vue sur un sujet et une information plus complète et équilibrée",
        section: "Ressources",
        activity: "quiz_diversite"
    },
    {
        question: "Qu'est-ce qu'une fake news (fausse nouvelle)?",
        options: [
            "Une information inventée ou déformée, présentée comme vraie", 
            "Une actualité récente", 
            "Une nouvelle sur un fait divers", 
            "Une information secrète"
        ],
        correctAnswer: 0,
        explanation: "Une fake news est une information inventée ou déformée, mais présentée comme vraie pour tromper les gens. Il est important d'apprendre à les repérer",
        section: "Ressources",
        activity: "quiz_fakenews"
    },
    {
        question: "Pourquoi certains sites sont spécialement conçus pour les enfants?",
        options: [
            "Pour gagner plus d'argent", 
            "Parce que c'est obligatoire", 
            "Pour proposer un contenu adapté à l'âge et protéger des contenus inappropriés", 
            "Pour rendre internet plus coloré"
        ],
        correctAnswer: 2,
        explanation: "Les sites pour enfants sont conçus pour proposer un contenu adapté à l'âge, avec un langage compréhensible et une protection contre les contenus inappropriés",
        section: "Ressources",
        activity: "quiz_sitesjeunesse"
    }
];

// Pour tester le chargement du fichier
console.log("Quiz Ressources pédagogiques chargé avec " + ressourcesQuizData.length + " questions");