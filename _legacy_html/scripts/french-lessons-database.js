/**
 * BASE DE DONNÉES LEÇONS FRANÇAIS
 * Contenu éducatif CM1 avec mécaniques Duolingo intégrées
 * Compatible système de progression et badges
 */

const FRENCH_LESSONS_DATABASE = {
    
    // =====================================
    // UNITÉ 1 : GRAMMAIRE ESSENTIELLE
    // =====================================
    
    "verbes-present": {
        id: "verbes-present",
        title: "Verbes au présent",
        description: "Apprends à conjuguer les verbes du 1er groupe au présent",
        unit: "grammaire",
        level: "cm1",
        difficulty: 1,
        icon: "🏃",
        estimatedTime: 15,
        xpReward: 50,
        
        prerequisite: null,
        unlocks: ["verbes-passe"],
        
        objectives: [
            "Reconnaître les verbes du 1er groupe",
            "Conjuguer au présent : je, tu, il/elle",
            "Conjuguer au présent : nous, vous, ils/elles"
        ],
        
        exercises: [
            {
                type: "multiple_choice",
                instruction: "Choisis la bonne conjugaison du verbe 'chanter' :",
                question: "Je _____ une chanson.",
                options: ["chante", "chantes", "chantons", "chantez"],
                correct: 0,
                explanation: "Avec 'je', on conjugue : je chante (sans 's' à la fin)"
            },
            {
                type: "multiple_choice", 
                instruction: "Complète avec la bonne forme :",
                question: "Tu _____ dans la cour.",
                options: ["joue", "joues", "jouons", "jouez"],
                correct: 1,
                explanation: "Avec 'tu', on ajoute toujours un 's' : tu joues"
            },
            {
                type: "drag_and_drop",
                instruction: "Associe chaque pronom à la bonne conjugaison :",
                question: "Verbe : regarder",
                items: [
                    { id: "je", text: "Je" },
                    { id: "tu", text: "Tu" },
                    { id: "il", text: "Il" }
                ],
                targets: [
                    { id: "regarde1", text: "regarde", correct: "je" },
                    { id: "regardes", text: "regardes", correct: "tu" },
                    { id: "regarde2", text: "regarde", correct: "il" }
                ],
                explanation: "Je regarde, tu regardes, il regarde"
            },
            {
                type: "fill_blank",
                instruction: "Complete les phrases avec la bonne conjugaison :",
                sentences: [
                    {
                        text: "Nous _____ à la télé.",
                        verb: "regarder",
                        correct: "regardons",
                        hint: "Avec 'nous', on termine par -ons"
                    },
                    {
                        text: "Vous _____ très bien.",
                        verb: "chanter", 
                        correct: "chantez",
                        hint: "Avec 'vous', on termine par -ez"
                    }
                ]
            },
            {
                type: "multiple_choice",
                instruction: "Trouve l'intrus :",
                question: "Quel verbe N'est PAS du 1er groupe ?",
                options: ["marcher", "finir", "parler", "danser"],
                correct: 1,
                explanation: "'Finir' est du 2ème groupe (finit, finissent). Les autres sont du 1er groupe."
            }
        ],
        
        miniGame: {
            type: "conjugation_race",
            name: "Course de Conjugaison",
            description: "Conjugue le plus vite possible !",
            timeLimit: 60,
            verbs: ["chanter", "danser", "jouer", "regarder", "marcher"]
        },
        
        review: {
            summary: "Tu as appris à conjuguer les verbes du 1er groupe au présent !",
            keyPoints: [
                "Je chante (pas de 's')",
                "Tu chantes (avec 's')", 
                "Il/Elle chante (pas de 's')",
                "Nous chantons (-ons)",
                "Vous chantez (-ez)",
                "Ils/Elles chantent (-ent)"
            ]
        }
    },

    "verbes-passe": {
        id: "verbes-passe",
        title: "Verbes au passé",
        description: "Découvre le passé composé et l'imparfait",
        unit: "grammaire", 
        level: "cm1",
        difficulty: 2,
        icon: "🕰️",
        estimatedTime: 18,
        xpReward: 60,
        
        prerequisite: "verbes-present",
        unlocks: ["verbes-futur"],
        
        objectives: [
            "Différencier passé composé et imparfait",
            "Former le passé composé avec avoir",
            "Reconnaître l'imparfait"
        ],
        
        exercises: [
            {
                type: "multiple_choice",
                instruction: "Quel temps exprime une action terminée ?",
                question: "Hier, j'ai mangé une pomme.",
                options: ["Présent", "Passé composé", "Imparfait", "Futur"],
                correct: 1,
                explanation: "Le passé composé exprime une action finie : j'ai mangé (c'est terminé)"
            },
            {
                type: "multiple_choice",
                instruction: "Forme le passé composé :",
                question: "Tu _____ ton livre.",
                options: ["as lu", "a lu", "avez lu", "ont lu"],
                correct: 0,
                explanation: "Avec 'tu' : tu as + participe passé = tu as lu"
            },
            {
                type: "story_completion",
                instruction: "Complete l'histoire au passé composé :",
                story: "Hier, Marie _____ (aller) au parc. Elle _____ (jouer) avec ses amis. Puis ils _____ (rentrer) à la maison.",
                blanks: [
                    { correct: "est allée", hint: "Avec être : elle est..." },
                    { correct: "a joué", hint: "Avec avoir : elle a..." },
                    { correct: "sont rentrés", hint: "Avec être : ils sont..." }
                ]
            }
        ],
        
        miniGame: {
            type: "time_travel",
            name: "Voyage dans le Temps",
            description: "Remets les événements dans l'ordre chronologique !"
        }
    },

    "verbes-futur": {
        id: "verbes-futur",
        title: "Verbes au futur", 
        description: "Exprime tes projets avec le futur simple",
        unit: "grammaire",
        level: "cm1",
        difficulty: 2,
        icon: "🚀",
        estimatedTime: 16,
        xpReward: 55,
        
        prerequisite: "verbes-passe",
        unlocks: ["adjectifs"],
        
        objectives: [
            "Former le futur simple",
            "Reconnaître les terminaisons du futur",
            "Exprimer ses projets futurs"
        ],
        
        exercises: [
            {
                type: "multiple_choice",
                instruction: "Conjugue au futur :",
                question: "Demain, je _____ au cinéma.",
                options: ["vais", "irai", "suis allé", "allais"],
                correct: 1,
                explanation: "Au futur : j'irai (infinitif + terminaison -ai)"
            },
            {
                type: "pattern_recognition", 
                instruction: "Trouve la règle des terminaisons du futur :",
                examples: [
                    "Je chanterai", "Tu chanteras", "Il chantera",
                    "Nous chanterons", "Vous chanterez", "Ils chanteront"
                ],
                question: "Quelles sont les terminaisons du futur ?",
                correct: ["-ai", "-as", "-a", "-ons", "-ez", "-ont"],
                explanation: "Les terminaisons du futur sont toujours les mêmes pour tous les verbes !"
            }
        ]
    },

    // =====================================
    // UNITÉ 2 : ORTHOGRAPHE
    // =====================================
    
    "homonymes": {
        id: "homonymes",
        title: "Les homonymes",
        description: "Distingue les mots qui se prononcent pareil",
        unit: "orthographe",
        level: "cm1", 
        difficulty: 2,
        icon: "👥",
        estimatedTime: 12,
        xpReward: 45,
        
        prerequisite: "verbes-present",
        unlocks: ["accords"],
        
        objectives: [
            "Différencier son/sont",
            "Choisir entre a/à", 
            "Maîtriser ou/où"
        ],
        
        exercises: [
            {
                type: "multiple_choice",
                instruction: "Choisis la bonne orthographe :",
                question: "Les enfants _____ dans la cour.",
                options: ["son", "sont"],
                correct: 1,
                explanation: "'Sont' = verbe être (ils sont). 'Son' = possession (son ballon)"
            },
            {
                type: "context_choice",
                instruction: "Complète avec 'a' ou 'à' :",
                sentences: [
                    {
                        text: "Marie _____ une belle robe.",
                        correct: "a",
                        explanation: "Marie possède = elle 'a'"
                    },
                    {
                        text: "Je vais _____ l'école.",
                        correct: "à", 
                        explanation: "Direction = 'à' (vers l'école)"
                    }
                ]
            },
            {
                type: "detective_game",
                instruction: "Mène l'enquête ! Trouve les bonnes orthographes :",
                scenario: "L'inspecteur Curio enquête sur un vol. Aide-le à écrire son rapport !",
                blanks: [
                    {
                        text: "Le voleur _____ parti vers l'est.",
                        options: ["a", "à"],
                        correct: "a",
                        clue: "Action terminée = avoir"
                    },
                    {
                        text: "Les témoins _____ tous d'accord.",
                        options: ["son", "sont"], 
                        correct: "sont",
                        clue: "Pluriel = verbe être"
                    }
                ]
            }
        ],
        
        miniGame: {
            type: "homonyme_pairs",
            name: "Memory des Homonymes",
            description: "Associe chaque homonyme à sa définition !"
        }
    },

    "accords": {
        id: "accords",
        title: "Les accords",
        description: "Maîtrise l'accord du verbe avec le sujet",
        unit: "orthographe",
        level: "cm1",
        difficulty: 3, 
        icon: "🤝",
        estimatedTime: 20,
        xpReward: 65,
        
        prerequisite: "homonymes",
        unlocks: ["pluriels"],
        
        objectives: [
            "Identifier le sujet du verbe",
            "Accorder verbe et sujet au singulier",
            "Accorder verbe et sujet au pluriel"
        ],
        
        exercises: [
            {
                type: "subject_identification",
                instruction: "Trouve le sujet du verbe souligné :",
                sentences: [
                    {
                        text: "Les oiseaux __chantent__ dans l'arbre.",
                        verb: "chantent",
                        options: ["Les oiseaux", "dans l'arbre", "l'arbre"],
                        correct: 0,
                        explanation: "Qui est-ce qui chante ? Les oiseaux !"
                    }
                ]
            },
            {
                type: "agreement_correction",
                instruction: "Corrige les erreurs d'accord :",
                sentences: [
                    {
                        original: "Les enfants joue dans le jardin.",
                        correct: "Les enfants jouent dans le jardin.",
                        error: "joue → jouent",
                        explanation: "Sujet pluriel = verbe pluriel"
                    }
                ]
            }
        ]
    },

    // =====================================
    // UNITÉ 3 : EXPRESSION
    // =====================================
    
    "descriptions": {
        id: "descriptions",
        title: "Apprendre à décrire",
        description: "Enrichis tes descriptions avec des mots précis",
        unit: "expression",
        level: "cm1",
        difficulty: 2,
        icon: "🎨",
        estimatedTime: 14,
        xpReward: 50,
        
        prerequisite: "accords",
        unlocks: ["raconter"],
        
        objectives: [
            "Utiliser des adjectifs variés",
            "Structurer une description",
            "Enrichir son vocabulaire"
        ],
        
        exercises: [
            {
                type: "vocabulary_expansion",
                instruction: "Remplace 'beau' par un mot plus précis :",
                context: "Un beau paysage",
                options: ["magnifique", "splendide", "pittoresque", "tous"],
                correct: 3,
                explanation: "Tous ces mots sont plus précis que 'beau' !"
            },
            {
                type: "description_builder",
                instruction: "Construis une description en ajoutant des détails :",
                baseText: "Un chat.",
                steps: [
                    {
                        prompt: "Ajoute une couleur :",
                        example: "Un chat noir."
                    },
                    {
                        prompt: "Ajoute une taille :",
                        example: "Un petit chat noir."
                    },
                    {
                        prompt: "Ajoute une action :",
                        example: "Un petit chat noir qui dort."
                    }
                ]
            }
        ],
        
        miniGame: {
            type: "description_artist",
            name: "Artiste Descripteur", 
            description: "Décris l'image pour que Curio puisse la dessiner !"
        }
    },

    // =====================================
    // CONFIGURATION PROGRESSION
    // =====================================
    
    // Arbre de dépendances pour déblocage
    lessonDependencies: {
        "verbes-present": [],
        "verbes-passe": ["verbes-present"],
        "verbes-futur": ["verbes-passe"],
        "homonymes": ["verbes-present"],
        "accords": ["homonymes"],
        "pluriels": ["accords"],
        "descriptions": ["accords"],
        "raconter": ["descriptions"],
        "argumenter": ["raconter"]
    },

    // Calcul automatique XP par difficulté
    xpCalculation: {
        baseDifficulty1: 40,
        baseDifficulty2: 55,
        baseDifficulty3: 70,
        perfectBonus: 20,     // +20 XP si 100% correct
        streakMultiplier: 1.5 // x1.5 si streak actif
    },

    // Badges spéciaux débloqués par leçons
    lessonBadges: {
        "verbes-present": {
            id: "first_verbs",
            name: "Premier Verbe",
            icon: "🌟",
            description: "Tu as appris tes premiers verbes !"
        },
        "homonymes": {
            id: "detective_words", 
            name: "Détective des Mots",
            icon: "🔍",
            description: "Tu distingues les homonymes comme un pro !"
        },
        "descriptions": {
            id: "word_artist",
            name: "Artiste des Mots",
            icon: "🎨", 
            description: "Tes descriptions sont magnifiques !"
        }
    },

    // Templates d'exercices réutilisables
    exerciseTemplates: {
        multipleChoice: {
            name: "Choix Multiple",
            minOptions: 2,
            maxOptions: 4,
            showExplanation: true,
            allowMultipleAttempts: false
        },
        
        fillBlank: {
            name: "Texte à Trous",
            showHints: true,
            caseSensitive: false,
            acceptSynonyms: true
        },
        
        dragAndDrop: {
            name: "Glisser-Déposer", 
            visualFeedback: true,
            snapToGrid: true,
            shuffleItems: true
        }
    },

    // Mécaniques de difficulté adaptative
    adaptiveDifficulty: {
        easyThreshold: 90,    // Si >90% correct → niveau +1
        hardThreshold: 60,    // Si <60% correct → niveau -1
        maxAttempts: 3,       // 3 essais max par exercice
        hintUnlockScore: 70   // Indices débloqués si <70%
    },

    // Configuration des mini-jeux
    miniGames: {
        conjugationRace: {
            timeLimit: 60,
            minScore: 5,
            xpBonus: 10
        },
        homonymePairs: {
            pairCount: 8,
            timeLimit: 120,
            xpBonus: 15
        },
        descriptionArtist: {
            stages: 3,
            timePerStage: 90,
            xpBonus: 20
        }
    }
};

// =====================================
// FONCTIONS UTILITAIRES
// =====================================

/**
 * Récupère une leçon par ID
 */
function getFrenchLesson(lessonId) {
    return FRENCH_LESSONS_DATABASE[lessonId] || null;
}

/**
 * Vérifie si une leçon est débloquée
 */
function isLessonUnlocked(lessonId, completedLessons = {}) {
    const dependencies = FRENCH_LESSONS_DATABASE.lessonDependencies[lessonId] || [];
    
    return dependencies.every(depId => 
        completedLessons[depId] && completedLessons[depId].completed
    );
}

/**
 * Calcule l'XP à attribuer pour une leçon
 */
function calculateLessonXP(lessonId, accuracy, hasStreak = false) {
    const lesson = getFrenchLesson(lessonId);
    if (!lesson) return 0;
    
    const config = FRENCH_LESSONS_DATABASE.xpCalculation;
    let baseXP;
    
    switch (lesson.difficulty) {
        case 1: baseXP = config.baseDifficulty1; break;
        case 2: baseXP = config.baseDifficulty2; break;
        case 3: baseXP = config.baseDifficulty3; break;
        default: baseXP = 50;
    }
    
    // Bonus précision
    if (accuracy >= 100) {
        baseXP += config.perfectBonus;
    }
    
    // Multiplicateur streak
    if (hasStreak) {
        baseXP = Math.round(baseXP * config.streakMultiplier);
    }
    
    return baseXP;
}

/**
 * Obtient la prochaine leçon recommandée
 */
function getNextRecommendedLesson(completedLessons = {}) {
    const allLessons = Object.keys(FRENCH_LESSONS_DATABASE.lessonDependencies);
    
    for (const lessonId of allLessons) {
        if (!completedLessons[lessonId] && isLessonUnlocked(lessonId, completedLessons)) {
            return getFrenchLesson(lessonId);
        }
    }
    
    return null; // Toutes les leçons sont complétées
}

/**
 * Génère des statistiques de progression
 */
function generateProgressStats(completedLessons = {}) {
    const totalLessons = Object.keys(FRENCH_LESSONS_DATABASE.lessonDependencies).length;
    const completed = Object.keys(completedLessons).filter(id => 
        completedLessons[id] && completedLessons[id].completed
    ).length;
    
    const unitsProgress = {
        grammaire: 0,
        orthographe: 0, 
        expression: 0
    };
    
    Object.entries(completedLessons).forEach(([lessonId, data]) => {
        if (data.completed) {
            const lesson = getFrenchLesson(lessonId);
            if (lesson && lesson.unit) {
                unitsProgress[lesson.unit]++;
            }
        }
    });
    
    return {
        totalProgress: Math.round((completed / totalLessons) * 100),
        lessonsCompleted: completed,
        totalLessons,
        unitsProgress,
        nextLesson: getNextRecommendedLesson(completedLessons)
    };
}

// Export pour utilisation dans l'app principale
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FRENCH_LESSONS_DATABASE,
        getFrenchLesson,
        isLessonUnlocked,
        calculateLessonXP,
        getNextRecommendedLesson,
        generateProgressStats
    };
} else {
    window.FRENCH_LESSONS_DATABASE = FRENCH_LESSONS_DATABASE;
    window.getFrenchLesson = getFrenchLesson;
    window.isLessonUnlocked = isLessonUnlocked;
    window.calculateLessonXP = calculateLessonXP;
    window.getNextRecommendedLesson = getNextRecommendedLesson;
    window.generateProgressStats = generateProgressStats;
}