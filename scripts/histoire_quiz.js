/**
 * Quiz d'Histoire-Géographie - Le Monde des Curieux
 * Questions adaptées au niveau CM1
 */
const histoireQuizData = [
    {
        question: "Qui a peint la Joconde?",
        options: ["Michel-Ange", "Léonard de Vinci", "Pablo Picasso", "Vincent van Gogh"],
        correctAnswer: 1,
        explanation: "La Joconde a été peinte par Léonard de Vinci au début du XVIe siècle",
        section: "Histoire-Géo",
        activity: "quiz_art"
    },
    {
        question: "Quel est le plus long fleuve de France?",
        options: ["Le Rhône", "La Seine", "La Loire", "La Garonne"],
        correctAnswer: 2,
        explanation: "La Loire est le plus long fleuve de France avec plus de 1000 km",
        section: "Histoire-Géo",
        activity: "quiz_geographie_france"
    },
    {
        question: "Qui était le roi de France pendant la Révolution française?",
        options: ["Louis XIV", "Louis XV", "Louis XVI", "Napoléon Bonaparte"],
        correctAnswer: 2,
        explanation: "Louis XVI était le roi de France pendant la Révolution française",
        section: "Histoire-Géo",
        activity: "quiz_revolution"
    },
    {
        question: "Quel océan se trouve entre l'Europe et l'Amérique?",
        options: ["Océan Pacifique", "Océan Indien", "Océan Atlantique", "Océan Arctique"],
        correctAnswer: 2,
        explanation: "L'océan Atlantique se trouve entre l'Europe et l'Amérique",
        section: "Histoire-Géo",
        activity: "quiz_oceans"
    },
    {
        question: "Quelle est la capitale de l'Italie?",
        options: ["Milan", "Rome", "Naples", "Venise"],
        correctAnswer: 1,
        explanation: "Rome est la capitale de l'Italie",
        section: "Histoire-Géo",
        activity: "quiz_capitales"
    },
    {
        question: "Comment s'appelle la période qui vient après la Préhistoire?",
        options: ["Le Moyen Âge", "L'Antiquité", "La Renaissance", "Les Temps modernes"],
        correctAnswer: 1,
        explanation: "L'Antiquité vient après la Préhistoire, suivie du Moyen Âge, puis de la Renaissance",
        section: "Histoire-Géo",
        activity: "quiz_periodes"
    },
    {
        question: "Quel est le pays le plus peuplé du monde?",
        options: ["L'Inde", "Les États-Unis", "La Chine", "Le Brésil"],
        correctAnswer: 2,
        explanation: "La Chine est le pays le plus peuplé du monde, suivi de près par l'Inde",
        section: "Histoire-Géo",
        activity: "quiz_population"
    },
    {
        question: "Comment s'appelle la ligne imaginaire qui fait le tour de la Terre à égale distance des deux pôles?",
        options: ["Le Tropique", "Le Méridien", "L'Équateur", "Le Parallèle"],
        correctAnswer: 2,
        explanation: "L'Équateur est la ligne imaginaire qui fait le tour de la Terre à égale distance des pôles Nord et Sud",
        section: "Histoire-Géo",
        activity: "quiz_globe"
    },
    {
        question: "Quel monument parisien a été construit pour l'Exposition universelle de 1889?",
        options: ["L'Arc de Triomphe", "La Tour Eiffel", "Le Louvre", "Notre-Dame de Paris"],
        correctAnswer: 1,
        explanation: "La Tour Eiffel a été construite pour l'Exposition universelle de 1889 à Paris",
        section: "Histoire-Géo",
        activity: "quiz_monuments"
    },
    {
        question: "Quelle chaîne de montagnes sépare la France et l'Espagne?",
        options: ["Les Alpes", "Le Jura", "Les Pyrénées", "Les Vosges"],
        correctAnswer: 2,
        explanation: "Les Pyrénées sont la chaîne de montagnes qui forme une frontière naturelle entre la France et l'Espagne",
        section: "Histoire-Géo",
        activity: "quiz_montagnes"
    }
];

// Pour tester le chargement du fichier
console.log("Quiz d'Histoire-Géographie chargé avec " + histoireQuizData.length + " questions");