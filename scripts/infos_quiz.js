/**
 * Quiz Infos - Le Monde des Curieux
 * Questions adaptées au niveau CM1
 */
const infosQuizData = [
    {
        question: "Quelles sont les sources d'information fiables?",
        options: [
            "Toutes les vidéos sur internet", 
            "Les messages reçus sur les réseaux sociaux", 
            "Les sites d'information reconnus et les encyclopédies", 
            "Les publicités à la télévision"
        ],
        correctAnswer: 2,
        explanation: "Les sites d'information reconnus et les encyclopédies sont généralement des sources plus fiables car ils vérifient leurs informations",
        section: "Infos",
        activity: "quiz_sources"
    },
    {
        question: "Pourquoi est-il important de vérifier les informations qu'on trouve sur internet?",
        options: [
            "Ce n'est pas important, tout est vrai sur internet", 
            "Pour ne pas croire et partager de fausses informations", 
            "Parce que c'est amusant", 
            "Uniquement pour les devoirs scolaires"
        ],
        correctAnswer: 1,
        explanation: "Vérifier les informations est essentiel pour ne pas croire et partager de fausses informations (fake news)",
        section: "Infos",
        activity: "quiz_verification"
    },
    {
        question: "Qu'est-ce qu'un journal?",
        options: [
            "Un cahier personnel où l'on écrit ses secrets", 
            "Une publication qui donne des informations sur l'actualité", 
            "Un livre de contes", 
            "Un message envoyé à un ami"
        ],
        correctAnswer: 1,
        explanation: "Un journal est une publication (papier ou numérique) qui donne des informations sur l'actualité, les événements récents",
        section: "Infos",
        activity: "quiz_journal"
    },
    {
        question: "Que signifie être objectif quand on parle d'une information?",
        options: [
            "Parler de quelque chose qu'on peut toucher", 
            "Présenter les faits sans y mêler ses opinions personnelles", 
            "Donner son avis sur un sujet", 
            "Raconter une histoire imaginaire"
        ],
        correctAnswer: 1,
        explanation: "Être objectif signifie présenter les faits tels qu'ils sont, sans y mêler ses opinions personnelles ou ses émotions",
        section: "Infos",
        activity: "quiz_objectivite"
    },
    {
        question: "Qu'est-ce qu'un fait dans une information?",
        options: [
            "Une opinion personnelle", 
            "Un événement qui s'est réellement produit et peut être vérifié", 
            "Une histoire inventée", 
            "Un avis donné par un journaliste"
        ],
        correctAnswer: 1,
        explanation: "Un fait est un événement qui s'est réellement produit et peut être vérifié, contrairement à une opinion qui est un avis personnel",
        section: "Infos",
        activity: "quiz_fait"
    },
    {
        question: "Qu'est-ce qu'un titre accrocheur?",
        options: [
            "Un titre qui donne toutes les informations", 
            "Un titre très long", 
            "Un titre qui attire l'attention, parfois en exagérant", 
            "Un titre écrit en majuscules"
        ],
        correctAnswer: 2,
        explanation: "Un titre accrocheur est conçu pour attirer l'attention et donner envie de lire l'article, mais il peut parfois exagérer ou simplifier l'information",
        section: "Infos",
        activity: "quiz_titre"
    },
    {
        question: "Pourquoi les journalistes doivent-ils vérifier leurs sources?",
        options: [
            "Ce n'est pas nécessaire", 
            "Pour éviter de diffuser de fausses informations", 
            "Pour écrire plus vite", 
            "Pour avoir plus d'images"
        ],
        correctAnswer: 1,
        explanation: "Les journalistes doivent vérifier leurs sources pour s'assurer que les informations qu'ils diffusent sont exactes et éviter de propager des erreurs",
        section: "Infos",
        activity: "quiz_journalistes"
    },
    {
        question: "Comment peut-on s'informer sur l'actualité?",
        options: [
            "Uniquement en regardant des dessins animés", 
            "En jouant à des jeux vidéo", 
            "En lisant des journaux, en écoutant la radio ou en regardant des émissions d'information", 
            "En lisant uniquement des bandes dessinées"
        ],
        correctAnswer: 2,
        explanation: "On peut s'informer sur l'actualité en lisant des journaux (papier ou en ligne), en écoutant la radio, en regardant le journal télévisé ou d'autres émissions d'information",
        section: "Infos",
        activity: "quiz_sinformer"
    },
    {
        question: "Qu'est-ce qu'une rumeur?",
        options: [
            "Une information vérifiée", 
            "Une information qui se répand sans qu'on sache si elle est vraie", 
            "Une nouvelle importante", 
            "Un article de journal"
        ],
        correctAnswer: 1,
        explanation: "Une rumeur est une information qui se répand de bouche à oreille ou sur internet, sans qu'on sache vraiment si elle est vraie ou d'où elle vient",
        section: "Infos",
        activity: "quiz_rumeur"
    },
    {
        question: "À quoi sert la rubrique 'International' dans un journal?",
        options: [
            "À parler uniquement de la France", 
            "À donner des informations sur ce qui se passe dans d'autres pays", 
            "À parler de sport", 
            "À raconter des histoires inventées"
        ],
        correctAnswer: 1,
        explanation: "La rubrique 'International' d'un journal donne des informations sur ce qui se passe dans d'autres pays que celui où est publié le journal",
        section: "Infos",
        activity: "quiz_international"
    }
];

// Pour tester le chargement du fichier
console.log("Quiz d'Infos chargé avec " + infosQuizData.length + " questions");