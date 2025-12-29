const missionRobots = {
    id: "robots_01",
    badge: "🤖",
    title: "Univers des Robots",
    steps: [
        {
            subject: "Programmation",
            question: "Pour donner un ordre à un robot comme Curio, on utilise un langage spécial. Comment s'appelle-t-il ?",
            options: ["Le code", "Le secret", "Le grimoire"],
            correct: 0,
            feedback: "Bravo ! Le code est une suite d'instructions que le robot exécute."
        },
        {
            subject: "Sciences",
            question: "Lequel de ces objets est un véritable robot capable de prendre des décisions seul ?",
            options: ["Un grille-pain", "Un aspirateur autonome", "Un vélo"],
            correct: 1,
            feedback: "Exact ! Un robot peut capter son environnement (obstacles) et agir sans aide."
        },
        {
            subject: "Logique",
            question: "Si Curio doit faire 3 pas en avant, puis 2 pas en arrière. À combien de pas est-il de son départ ?",
            options: ["1 pas", "5 pas", "0 pas"],
            correct: 0,
            feedback: "C'est ça ! 3 - 2 = 1. Tu as l'esprit d'un programmeur !"
        }
    ]
};