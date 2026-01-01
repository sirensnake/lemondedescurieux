const missionHistoire = {
    id: "roi-soleil", // ID utilisé par le DOM (item-roi-soleil)
    badge: "👑",
    title: "Mission : Le Secret du Roi Soleil",
    steps: [
        {
            subject: "Histoire",
            question: "Curio remonte le temps jusqu'au XVIIe siècle. Quel roi a fait construire le château de Versailles ?",
            options: ["Louis XIV", "Henri IV", "Louis XVI"],
            correct: 0,
            feedback: "C'est exact ! Louis XIV, surnommé le Roi Soleil, a transformé un pavillon de chasse en un palais immense."
        },
        {
            subject: "Vie Quotidienne",
            question: "À Versailles, pour montrer sa puissance, le Roi invite les nobles à vivre avec lui. Comment appelle-t-on cet entourage ?",
            options: ["La Troupe", "La Cour", "Le Conseil"],
            correct: 1,
            feedback: "Bravo ! La Cour était composée de milliers de personnes qui suivaient des règles très strictes (l'étiquette)."
        },
        {
            subject: "Architecture & Arts",
            question: "Quelle est la galerie la plus célèbre du château, connue pour ses 357 miroirs ?",
            options: ["La Galerie des Batailles", "La Galerie des Glaces", "La Galerie des Rois"],
            correct: 1,
            feedback: "Magnifique ! La Galerie des Glaces servait à éblouir les visiteurs par sa lumière et sa richesse."
        }
    ]
};