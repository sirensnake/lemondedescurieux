const missionFrancais = {
    id: "francais_01",
    badge: "🔍",
    title: "Curio : Détective des Mots",
    steps: [
        {
            subject: "Grammaire - Nature des mots",
            question: "Dans la phrase : 'Le petit renard court vite', quelle est la nature du mot **petit** ?",
            options: ["Un nom", "Un adjectif", "Un verbe"],
            correct: 1,
            feedback: "Bravo ! 'Petit' donne une précision sur le renard, c'est donc un adjectif qualificatif."
        },
        {
            subject: "Grammaire - Le Verbe",
            question: "Curio cherche l'action dans la phrase : 'Les enfants mangent une pomme'. Quel est le verbe ?",
            options: ["enfants", "pomme", "mangent"],
            correct: 2,
            feedback: "Correct ! 'Mangent' est l'action, c'est le verbe manger conjugué au présent."
        },
        {
            subject: "Orthographe - Accords",
            question: "Comment écrit-on correctement : 'Les curieux ____ les étoiles' ?",
            options: ["regarde", "regardent", "regardes"],
            correct: 1,
            feedback: "Excellent ! Le sujet est 'Les curieux' (pluriel), donc le verbe prend la terminaison -ent."
        },
        {
            subject: "Vocabulaire - Synonymes",
            question: "Trouve un synonyme du mot **immense** :",
            options: ["Géant", "Minuscule", "Rapide"],
            correct: 0,
            feedback: "Parfait ! Un synonyme est un mot qui a le même sens. Immense et Géant se ressemblent."
        }
    ]
};