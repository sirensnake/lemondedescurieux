/**
 * Quiz d'Anglais - Le Monde des Curieux
 * Questions adaptées au niveau CM1
 */
const englishQuizData = [
    {
        question: "Comment dit-on 'pomme' en anglais?",
        options: ["Apple", "Orange", "Banana", "Pear"],
        correctAnswer: 0,
        explanation: "Pomme se dit 'apple' en anglais",
        section: "Anglais",
        activity: "quiz_fruits"
    },
    {
        question: "Que signifie 'hello'?",
        options: ["Au revoir", "Bonjour", "Merci", "S'il vous plaît"],
        correctAnswer: 1,
        explanation: "'Hello' signifie 'bonjour' en français",
        section: "Anglais",
        activity: "quiz_salutations"
    },
    {
        question: "Comment dit-on 'rouge' en anglais?",
        options: ["Blue", "Green", "Red", "Yellow"],
        correctAnswer: 2,
        explanation: "Rouge se dit 'red' en anglais",
        section: "Anglais",
        activity: "quiz_couleurs"
    },
    {
        question: "Quelle est la traduction de 'dog'?",
        options: ["Chat", "Souris", "Chien", "Lapin"],
        correctAnswer: 2,
        explanation: "'Dog' signifie 'chien' en français",
        section: "Anglais",
        activity: "quiz_animaux"
    },
    {
        question: "Que signifie 'school'?",
        options: ["Maison", "École", "Magasin", "Parc"],
        correctAnswer: 1,
        explanation: "'School' signifie 'école' en français",
        section: "Anglais",
        activity: "quiz_lieux"
    },
    {
        question: "Comment dit-on 'livre' en anglais?",
        options: ["Book", "Pen", "Pencil", "Notebook"],
        correctAnswer: 0,
        explanation: "Livre se dit 'book' en anglais",
        section: "Anglais",
        activity: "quiz_ecole"
    },
    {
        question: "Quelle est la traduction de 'family'?",
        options: ["Amis", "École", "Famille", "Maison"],
        correctAnswer: 2,
        explanation: "'Family' signifie 'famille' en français",
        section: "Anglais",
        activity: "quiz_famille"
    },
    {
        question: "Comment demande-t-on 'Comment t'appelles-tu?' en anglais?",
        options: ["How are you?", "What's your name?", "Where are you from?", "How old are you?"],
        correctAnswer: 1,
        explanation: "'What's your name?' signifie 'Comment t'appelles-tu?' en français",
        section: "Anglais",
        activity: "quiz_questions"
    },
    {
        question: "Quel est le pluriel de 'child' en anglais?",
        options: ["Childs", "Childrens", "Children", "Childer"],
        correctAnswer: 2,
        explanation: "Le pluriel irrégulier de 'child' (enfant) est 'children' (enfants)",
        section: "Anglais",
        activity: "quiz_grammaire"
    },
    {
        question: "Comment dit-on les jours de la semaine en anglais?",
        options: ["Monday, Tuesday, Wednesday...", "Lundi, Mardi, Mercredi...", "Januar, Februar, März...", "Enero, Febrero, Marzo..."],
        correctAnswer: 0,
        explanation: "Les jours de la semaine en anglais sont: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday",
        section: "Anglais",
        activity: "quiz_temps"
    }
];

// Pour tester le chargement du fichier
console.log("Quiz d'Anglais chargé avec " + englishQuizData.length + " questions");