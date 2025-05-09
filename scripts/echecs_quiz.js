/**
 * Quiz d'Échecs - Le Monde des Curieux
 * Questions adaptées au niveau débutant-intermédiaire
 */
const echecsQuizData = [
    {
        question: "Comment se déplace le cavalier aux échecs?",
        options: ["En diagonale", "En L", "Tout droit", "Dans toutes les directions"],
        correctAnswer: 1,
        explanation: "Le cavalier se déplace en L: 2 cases dans une direction puis 1 case perpendiculairement",
        section: "Échecs",
        activity: "quiz_pieces"
    },
    {
        question: "Quelle pièce ne peut pas reculer?",
        options: ["Le fou", "La tour", "Le pion", "La dame"],
        correctAnswer: 2,
        explanation: "Le pion ne peut se déplacer qu'en avant (sauf pour capturer en diagonale)",
        section: "Échecs",
        activity: "quiz_deplacements"
    },
    {
        question: "Comment appelle-t-on la situation où un roi est attaqué?",
        options: ["Mat", "Pat", "Échec", "Prise"],
        correctAnswer: 2,
        explanation: "Quand un roi est attaqué, on dit qu'il est en échec",
        section: "Échecs",
        activity: "quiz_termes"
    },
    {
        question: "Que se passe-t-il quand un pion atteint la dernière rangée?",
        options: ["Il est retiré du jeu", "Il est promu en une autre pièce", "Il reste sur place", "Il revient à sa position de départ"],
        correctAnswer: 1,
        explanation: "Quand un pion atteint la dernière rangée, il est promu et peut être transformé en dame, tour, fou ou cavalier",
        section: "Échecs",
        activity: "quiz_regles"
    },
    {
        question: "Combien de cases comportent un échiquier standard?",
        options: ["36", "49", "64", "81"],
        correctAnswer: 2,
        explanation: "Un échiquier standard comporte 64 cases (8×8)",
        section: "Échecs",
        activity: "quiz_materiel"
    },
    {
        question: "Quel coup permet de protéger le roi en le déplaçant de deux cases et en déplaçant aussi une tour?",
        options: ["L'échec", "Le roque", "La prise en passant", "Le mat"],
        correctAnswer: 1,
        explanation: "Le roque est un coup spécial qui permet de mettre le roi à l'abri tout en développant une tour",
        section: "Échecs",
        activity: "quiz_coups_speciaux"
    },
    {
        question: "Quelle pièce peut sauter par-dessus les autres?",
        options: ["La tour", "Le fou", "La dame", "Le cavalier"],
        correctAnswer: 3,
        explanation: "Le cavalier est la seule pièce qui peut sauter par-dessus les autres pièces",
        section: "Échecs",
        activity: "quiz_particularites"
    },
    {
        question: "Comment appelle-t-on la fin d'une partie d'échecs quand le roi est attaqué et ne peut plus échapper?",
        options: ["Échec et mat", "Pat", "Nulle", "Abandon"],
        correctAnswer: 0,
        explanation: "Échec et mat signifie que le roi est attaqué et ne peut plus échapper, ce qui met fin à la partie",
        section: "Échecs",
        activity: "quiz_fins_partie"
    },
    {
        question: "Quelle est la valeur d'un cavalier par rapport à un pion?",
        options: ["2 pions", "3 pions", "5 pions", "9 pions"],
        correctAnswer: 1,
        explanation: "Un cavalier vaut généralement environ 3 pions",
        section: "Échecs",
        activity: "quiz_valeurs"
    },
    {
        question: "Quelle action n'est pas permise aux échecs?",
        options: ["Prendre le roi adverse", "Mettre son propre roi en échec", "Sacrifier sa dame", "Promouvoir un pion"],
        correctAnswer: 1,
        explanation: "Il est interdit de jouer un coup qui mettrait ou laisserait son propre roi en échec",
        section: "Échecs",
        activity: "quiz_interdictions"
    }
];

// Pour tester le chargement du fichier
console.log("Quiz d'Échecs chargé avec " + echecsQuizData.length + " questions");