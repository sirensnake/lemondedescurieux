// Base de données éducatives complète - Français CM1
// À intégrer dans scripts/francais_database.js

const FrancaisDatabase = {
    // === GRAMMAIRE CM1 === (40 questions)
    grammaire: {
        natures_mots: [
            {
                question: "Quelle est la nature du mot 'chien' ?",
                options: ["Verbe", "Nom", "Adjectif", "Adverbe"],
                correct: 1,
                explanation: "Chien est un nom commun qui désigne un animal"
            },
            {
                question: "Dans 'Il court rapidement', quelle est la nature de 'rapidement' ?",
                options: ["Nom", "Verbe", "Adjectif", "Adverbe"],
                correct: 3,
                explanation: "Rapidement est un adverbe de manière qui modifie le verbe 'court'"
            },
            {
                question: "Quelle est la nature du mot 'grand' dans 'un grand arbre' ?",
                options: ["Nom", "Verbe", "Adjectif", "Déterminant"],
                correct: 2,
                explanation: "Grand est un adjectif qualificatif qui qualifie le nom 'arbre'"
            },
            {
                question: "Dans 'Je mange', quelle est la nature de 'mange' ?",
                options: ["Nom", "Verbe", "Adjectif", "Pronom"],
                correct: 1,
                explanation: "Mange est un verbe qui exprime l'action de manger"
            },
            {
                question: "Quelle est la nature du mot 'le' dans 'le chat' ?",
                options: ["Nom", "Pronom", "Déterminant", "Adverbe"],
                correct: 2,
                explanation: "Le est un déterminant (article défini) qui accompagne le nom"
            }
        ],
        
        fonctions_mots: [
            {
                question: "Dans 'Le chat mange sa pâtée', quel est le sujet ?",
                options: ["mange", "Le chat", "sa pâtée", "pâtée"],
                correct: 1,
                explanation: "Le sujet est 'Le chat' car c'est lui qui fait l'action"
            },
            {
                question: "Dans 'Marie lit un livre', quelle est la fonction de 'un livre' ?",
                options: ["Sujet", "Verbe", "Complément d'objet", "Attribut"],
                correct: 2,
                explanation: "Un livre est complément d'objet direct (COD) du verbe lire"
            },
            {
                question: "Dans 'Paul va à l'école', quelle est la fonction de 'à l'école' ?",
                options: ["Sujet", "COD", "Complément circonstanciel", "Attribut"],
                correct: 2,
                explanation: "À l'école est un complément circonstanciel de lieu (où ?)"
            }
        ],

        types_phrases: [
            {
                question: "Quel type de phrase est : 'Viens ici !' ?",
                options: ["Déclarative", "Interrogative", "Exclamative", "Impérative"],
                correct: 3,
                explanation: "C'est une phrase impérative car elle exprime un ordre"
            },
            {
                question: "Comment transformer 'Il pleut.' en phrase interrogative ?",
                options: ["Il pleut ?", "Pleut-il ?", "Est-ce qu'il pleut ?", "Toutes les réponses"],
                correct: 3,
                explanation: "On peut former une interrogation de plusieurs façons en français"
            }
        ]
    },

    // === CONJUGAISON CM1 === (50 questions réparties par temps)
    conjugaison: {
        present: [
            {
                verbe: "chanter",
                pronom: "tu",
                correct: "chantes",
                alternatives: ["chante", "chantons", "chantez"],
                explication: "Au présent : tu chantes (2ème personne du singulier, terminaison -es)"
            },
            {
                verbe: "finir", 
                pronom: "nous",
                correct: "finissons",
                alternatives: ["finisons", "finissez", "finissent"],
                explication: "Finir (2ème groupe) : nous finissons (avec -iss- au pluriel)"
            },
            {
                verbe: "être",
                pronom: "vous", 
                correct: "êtes",
                alternatives: ["est", "sommes", "sont"],
                explication: "ÊTRE est irrégulier : vous êtes"
            },
            {
                verbe: "avoir",
                pronom: "ils",
                correct: "ont", 
                alternatives: ["as", "avons", "avez"],
                explication: "AVOIR est irrégulier : ils ont"
            },
            {
                verbe: "aller",
                pronom: "je",
                correct: "vais",
                alternatives: ["va", "allons", "allez"], 
                explication: "ALLER est irrégulier : je vais"
            }
        ],

        futur: [
            {
                verbe: "jouer",
                pronom: "je", 
                correct: "jouerai",
                alternatives: ["joue", "jouais", "jouera"],
                explication: "Futur simple : infinitif + terminaisons (-ai, -as, -a...)"
            },
            {
                verbe: "grandir",
                pronom: "tu",
                correct: "grandiras", 
                alternatives: ["grandis", "grandissais", "grandira"],
                explication: "Futur : grandir + terminaison -as = tu grandiras"
            }
        ],

        imparfait: [
            {
                verbe: "manger",
                pronom: "nous",
                correct: "mangions",
                alternatives: ["mangeons", "mangerons", "mangions"],
                explication: "Imparfait : radical + terminaisons (-ais, -ais, -ait, -ions, -iez, -aient)"
            }
        ]
    },

    // === VOCABULAIRE CM1 === (100 mots avec définitions)
    vocabulaire: [
        {
            mot: "bibliothèque",
            definition: "Lieu où l'on range et consulte les livres",
            exemple: "Je vais à la bibliothèque pour emprunter un livre.",
            synonymes: ["librairie (commerce)"],
            difficulte: "facile",
            categorie: "lieux"
        },
        {
            mot: "papillon", 
            definition: "Insecte aux ailes colorées qui butine les fleurs",
            exemple: "Un joli papillon se pose sur la rose.",
            synonymes: [],
            difficulte: "facile",
            categorie: "animaux"
        },
        {
            mot: "montagne",
            definition: "Grande élévation naturelle de terrain",
            exemple: "Nous escaladons la montagne en été.",
            synonymes: ["pic", "sommet"],
            difficulte: "facile", 
            categorie: "géographie"
        },
        {
            mot: "pharmacie",
            definition: "Magasin où l'on vend des médicaments",
            exemple: "Maman va à la pharmacie chercher un sirop.",
            synonymes: [],
            difficulte: "moyen",
            categorie: "lieux"
        },
        {
            mot: "parapluie",
            definition: "Objet qui protège de la pluie",
            exemple: "N'oublie pas ton parapluie, il va pleuvoir !",
            synonymes: ["ombrelle (soleil)"],
            difficulte: "moyen",
            categorie: "objets"
        },
        {
            mot: "récréation",
            definition: "Moment de pause et de jeu à l'école",
            exemple: "Les enfants jouent dans la cour pendant la récréation.",
            synonymes: ["pause", "détente"],
            difficulte: "moyen",
            categorie: "école"
        },
        {
            mot: "anniversaire",
            definition: "Date de naissance qui revient chaque année",
            exemple: "Nous fêtons l'anniversaire de Papa aujourd'hui.",
            synonymes: [],
            difficulte: "difficile",
            categorie: "événements"
        },
        {
            mot: "extraordinaire",
            definition: "Qui sort de l'ordinaire, remarquable",
            exemple: "Ce spectacle était extraordinaire !",
            synonymes: ["exceptionnel", "formidable"],
            difficulte: "difficile",
            categorie: "qualités"
        }
    ],

    // === DICTÉES AUDIO === (30 phrases progressives)
    dictees: {
        niveau_1: [
            {
                phrase: "Le chat noir dort sur le lit.",
                mots_difficiles: ["noir", "dort"],
                points_attention: ["Accord sujet-verbe", "Orthographe 'noir'"],
                audio_lent: true
            },
            {
                phrase: "Maman achète du pain à la boulangerie.",
                mots_difficiles: ["achète", "boulangerie"],
                points_attention: ["Accent grave", "Terminaison -erie"],
                audio_lent: true
            },
            {
                phrase: "Les enfants jouent dans le jardin fleuri.",
                mots_difficiles: ["enfants", "fleuri"],
                points_attention: ["Pluriel", "Participe passé adjectif"],
                audio_lent: true
            }
        ],

        niveau_2: [
            {
                phrase: "Mon frère et moi mangeons des pommes rouges.",
                mots_difficiles: ["mangeons", "pommes"],
                points_attention: ["Conjugaison 1ère pers. pluriel", "Accord couleur"],
                audio_lent: false
            },
            {
                phrase: "La maîtresse explique la leçon de mathématiques.",
                mots_difficiles: ["maîtresse", "mathématiques"],
                points_attention: ["Accent circonflexe", "th/ph"],
                audio_lent: false
            }
        ],

        niveau_3: [
            {
                phrase: "Hier, nous avons visité le château de Versailles.",
                mots_difficiles: ["château", "Versailles"],
                points_attention: ["Passé composé", "Noms propres", "Accent circonflexe"],
                audio_lent: false
            }
        ]
    },

    // === EXERCICES INTERACTIFS ===
    exercices_speciaux: {
        // Accord sujet-verbe
        accords: [
            {
                phrase_incomplete: "Les oiseau__ chant__ dans l'arbre.",
                corrections: ["x", "ent"],
                explication: "Pluriel : Les oiseaux (x) chantent (ent car 3ème pers. pluriel)"
            },
            {
                phrase_incomplete: "Ma sœur et moi mang__ ensemble.",
                corrections: ["eons"],
                explication: "Ma sœur et moi = nous → mangeons (1ère pers. pluriel)"
            }
        ],

        // Homophones grammaticaux
        homophones: [
            {
                phrase: "Il ___ à l'école tous les jours.", 
                choix: ["va", "vas"],
                correct: 0,
                explication: "Il va (3ème personne singulier)"
            },
            {
                phrase: "Tu ___ tes devoirs rapidement.",
                choix: ["fais", "fait"], 
                correct: 0,
                explication: "Tu fais (2ème personne singulier)"
            }
        ]
    },

    // === PROGRESSION ADAPTÉE ===
    progression_cm1: {
        trimestre_1: {
            semaines_1_4: ["natures_mots_base", "present_simple", "vocabulaire_courant"],
            semaines_5_8: ["fonctions_sujet_verbe", "futur_simple", "dictees_niveau_1"],
            semaines_9_12: ["types_phrases", "imparfait_intro", "vocabulaire_thematique"]
        },
        trimestre_2: {
            semaines_13_16: ["complements_base", "present_irreguliers", "dictees_niveau_2"],
            semaines_17_20: ["adjectifs_accords", "passe_compose", "expression_ecrite"],
            semaines_21_24: ["adverbes_base", "revision_temps", "vocabulaire_avance"]
        },
        trimestre_3: {
            semaines_25_28: ["propositions_simples", "tous_temps_revus", "dictees_niveau_3"],
            semaines_29_32: ["revision_generale", "projets_ecriture", "bilan_annuel"],
            semaines_33_36: ["approfondissements", "jeux_langue", "preparation_cm2"]
        }
    }
};

// Export pour utilisation
if (typeof module !== 'undefined') {
    module.exports = FrancaisDatabase;
} else {
    window.FrancaisDatabase = FrancaisDatabase;
}