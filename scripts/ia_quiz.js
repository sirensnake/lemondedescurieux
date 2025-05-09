/**
 * Quiz d'Intelligence Artificielle - Le Monde des Curieux
 * Questions adaptées au niveau CM1
 */
const iaQuizData = [
    {
        question: "Qu'est-ce que l'Intelligence Artificielle?",
        options: [
            "Un robot qui ressemble à un humain", 
            "Une technologie qui permet aux ordinateurs d'apprendre et de résoudre des problèmes", 
            "Un ordinateur très rapide", 
            "Un jeu vidéo"
        ],
        correctAnswer: 1,
        explanation: "L'IA est une technologie qui permet aux ordinateurs d'apprendre et de résoudre des problèmes comme le ferait un humain",
        section: "IA",
        activity: "quiz_definition"
    },
    {
        question: "Laquelle de ces activités utilise l'Intelligence Artificielle?",
        options: [
            "Dessiner avec un crayon", 
            "Jouer à la marelle", 
            "Demander à un assistant virtuel comme Siri de raconter une blague", 
            "Faire du vélo"
        ],
        correctAnswer: 2,
        explanation: "Les assistants virtuels comme Siri, Alexa ou Google Assistant utilisent l'IA pour comprendre nos questions et y répondre",
        section: "IA",
        activity: "quiz_exemples"
    },
    {
        question: "Comment l'IA apprend-elle?",
        options: [
            "En lisant des livres", 
            "En allant à l'école", 
            "En regardant des vidéos", 
            "En analysant beaucoup d'exemples"
        ],
        correctAnswer: 3,
        explanation: "L'IA apprend en analysant de nombreux exemples, un peu comme toi quand tu apprends à reconnaître les animaux après en avoir vu plusieurs",
        section: "IA",
        activity: "quiz_apprentissage"
    },
    {
        question: "Lequel de ces métiers utilise beaucoup l'IA?",
        options: [
            "Boulanger", 
            "Coiffeur", 
            "Jardinier", 
            "Médecin qui interprète des radiographies"
        ],
        correctAnswer: 3,
        explanation: "Les médecins utilisent l'IA pour aider à analyser des radiographies et détecter des maladies",
        section: "IA",
        activity: "quiz_metiers"
    },
    {
        question: "Que peut faire l'IA?",
        options: [
            "Uniquement des calculs mathématiques", 
            "Reconnaître des images, traduire des langues et jouer à des jeux", 
            "Avoir de vrais sentiments", 
            "Voyager dans l'espace"
        ],
        correctAnswer: 1,
        explanation: "L'IA peut reconnaître des images, traduire des langues, jouer à des jeux et bien d'autres choses, mais n'a pas de vrais sentiments",
        section: "IA",
        activity: "quiz_capacites"
    },
    {
        question: "Pourquoi doit-on être prudent avec les informations données par l'IA?",
        options: [
            "Parce que l'IA est dangereuse", 
            "Parce que l'IA peut être triste si on ne la croit pas", 
            "Parce que l'IA peut parfois se tromper ou répéter des erreurs", 
            "Parce que l'IA coûte cher à utiliser"
        ],
        correctAnswer: 2,
        explanation: "L'IA peut parfois se tromper ou répéter des erreurs, donc il faut toujours vérifier les informations qu'elle donne",
        section: "IA",
        activity: "quiz_limites"
    },
    {
        question: "Qu'est-ce qu'un robot?",
        options: [
            "La même chose que l'IA", 
            "Une machine programmable qui peut effectuer des actions physiques", 
            "Un personnage dans les dessins animés", 
            "Un ordinateur très puissant"
        ],
        correctAnswer: 1,
        explanation: "Un robot est une machine programmable qui peut effectuer des actions physiques, alors que l'IA est un programme informatique",
        section: "IA",
        activity: "quiz_robots"
    },
    {
        question: "Comment l'IA peut-elle aider à protéger l'environnement?",
        options: [
            "Elle ne peut pas aider l'environnement", 
            "En ramassant les déchets", 
            "En prédisant les catastrophes naturelles pour mieux s'y préparer", 
            "En arrêtant la pollution"
        ],
        correctAnswer: 2,
        explanation: "L'IA peut analyser des données pour prédire les catastrophes naturelles et aider les scientifiques à comprendre le changement climatique",
        section: "IA",
        activity: "quiz_environnement"
    },
    {
        question: "Pourquoi l'IA ne peut-elle pas remplacer complètement les humains?",
        options: [
            "Parce qu'elle est trop chère", 
            "Parce qu'elle n'a pas de créativité, d'empathie ou de jugement moral comme les humains", 
            "Parce qu'elle tombe en panne trop souvent", 
            "Parce qu'elle est trop lente"
        ],
        correctAnswer: 1,
        explanation: "L'IA n'a pas de créativité, d'empathie ou de jugement moral comme les humains, elle complète leurs capacités mais ne peut pas les remplacer",
        section: "IA",
        activity: "quiz_humains_ia"
    },
    {
        question: "Comment utilises-tu déjà l'IA dans ta vie quotidienne?",
        options: [
            "Je n'utilise jamais l'IA", 
            "Quand je regarde des vidéos recommandées sur YouTube", 
            "Quand je lis un livre", 
            "Quand je fais du sport"
        ],
        correctAnswer: 1,
        explanation: "YouTube utilise l'IA pour recommander des vidéos basées sur ce que tu as déjà regardé",
        section: "IA",
        activity: "quiz_quotidien"
    }
];

// Pour tester le chargement du fichier
console.log("Quiz d'Intelligence Artificielle chargé avec " + iaQuizData.length + " questions");