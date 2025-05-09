/**
 * Quiz de Philosophie - Le Monde des Curieux
 * Questions adaptées au niveau CM1
 */
const philosophieQuizData = [
    {
        question: "Qu'est-ce que la philosophie?",
        options: [
            "Une sorte de sport", 
            "L'art de se poser des questions et de réfléchir sur le monde", 
            "Une recette de cuisine", 
            "Une matière qu'on étudie uniquement à l'université"
        ],
        correctAnswer: 1,
        explanation: "La philosophie, c'est l'art de se poser des questions et de réfléchir sur le monde qui nous entoure",
        section: "Philosophie",
        activity: "quiz_definition"
    },
    {
        question: "Qui était Socrate?",
        options: [
            "Un sportif célèbre", 
            "Un personnage de dessin animé", 
            "Un philosophe grec qui posait beaucoup de questions", 
            "Un scientifique qui a inventé l'électricité"
        ],
        correctAnswer: 2,
        explanation: "Socrate était un philosophe grec très célèbre qui enseignait en posant des questions pour faire réfléchir ses élèves",
        section: "Philosophie",
        activity: "quiz_socrate"
    },
    {
        question: "Qu'est-ce que le bonheur selon la philosophie?",
        options: [
            "Avoir beaucoup de jouets", 
            "Une question que chacun doit réfléchir par lui-même", 
            "Être toujours content", 
            "Avoir beaucoup d'amis"
        ],
        correctAnswer: 1,
        explanation: "Le bonheur est une grande question philosophique que chacun doit explorer par lui-même, car il peut signifier des choses différentes selon les personnes",
        section: "Philosophie",
        activity: "quiz_bonheur"
    },
    {
        question: "Pourquoi est-il important de réfléchir par soi-même?",
        options: [
            "Ce n'est pas important", 
            "Pour ne pas avoir à écouter les autres", 
            "Pour développer sa propre pensée et être moins influencé", 
            "Uniquement pour les devoirs de philosophie"
        ],
        correctAnswer: 2,
        explanation: "Réfléchir par soi-même nous permet de développer notre propre pensée et d'être moins facilement influencés par les autres",
        section: "Philosophie",
        activity: "quiz_pensee"
    },
    {
        question: "Qu'est-ce que l'amitié en philosophie?",
        options: [
            "Avoir beaucoup de copains", 
            "Un lien spécial basé sur le respect et la confiance", 
            "Jouer ensemble à la récréation", 
            "Inviter des amis à son anniversaire"
        ],
        correctAnswer: 1,
        explanation: "En philosophie, l'amitié est considérée comme un lien spécial entre des personnes, basé sur le respect, la confiance et l'appréciation mutuelle",
        section: "Philosophie",
        activity: "quiz_amitie"
    },
    {
        question: "Qu'est-ce qu'une valeur morale?",
        options: [
            "Le prix d'un objet", 
            "Un principe qui nous guide pour savoir ce qui est bien ou mal", 
            "Une note à l'école", 
            "Une couleur"
        ],
        correctAnswer: 1,
        explanation: "Une valeur morale est un principe qui nous guide dans nos choix pour déterminer ce qui est bien ou mal, juste ou injuste",
        section: "Philosophie",
        activity: "quiz_morale"
    },
    {
        question: "Que signifie être libre?",
        options: [
            "Faire tout ce que l'on veut", 
            "Ne jamais avoir de devoirs", 
            "Pouvoir choisir en respectant les autres", 
            "Ne pas aller à l'école"
        ],
        correctAnswer: 2,
        explanation: "Être libre ne signifie pas faire tout ce qu'on veut, mais pouvoir faire des choix en respectant les autres et les règles de la vie en société",
        section: "Philosophie",
        activity: "quiz_liberte"
    },
    {
        question: "Comment peut-on savoir si quelque chose est vrai?",
        options: [
            "Si c'est écrit sur internet", 
            "Si quelqu'un nous le dit", 
            "En vérifiant avec plusieurs sources fiables", 
            "C'est impossible de savoir"
        ],
        correctAnswer: 2,
        explanation: "Pour savoir si une information est vraie, il faut la vérifier en utilisant plusieurs sources fiables et en réfléchissant par soi-même",
        section: "Philosophie",
        activity: "quiz_verite"
    },
    {
        question: "Pourquoi est-il important de respecter la nature?",
        options: [
            "Ce n'est pas important", 
            "Uniquement pour avoir de beaux paysages", 
            "Parce que nous en faisons partie et en dépendons pour vivre", 
            "Seulement si on aime les animaux"
        ],
        correctAnswer: 2,
        explanation: "Il est important de respecter la nature car nous en faisons partie et nous dépendons d'elle pour vivre (air, eau, nourriture)",
        section: "Philosophie",
        activity: "quiz_nature"
    },
    {
        question: "Comment peut-on devenir plus sage?",
        options: [
            "En devenant très vieux", 
            "En lisant beaucoup de livres", 
            "En réfléchissant à ses expériences et en apprenant de ses erreurs", 
            "C'est impossible de devenir sage"
        ],
        correctAnswer: 2,
        explanation: "On devient plus sage en réfléchissant à ses expériences, en apprenant de ses erreurs et en restant curieux d'apprendre",
        section: "Philosophie",
        activity: "quiz_sagesse"
    }
];

// Pour tester le chargement du fichier
console.log("Quiz de Philosophie chargé avec " + philosophieQuizData.length + " questions");