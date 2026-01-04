/**
 * ==========================================
 * DONNÉES LEÇONS FRANÇAIS CM1-CM2
 * Le Monde des Curieux
 * ==========================================
 * 15 leçons progressives : grammaire, conjugaison, orthographe
 */

const francaisLessons = [
    // ========================================
    // LEÇON 1 : VERBES AU PRÉSENT
    // ========================================
    {
        id: 'francais-01-present',
        title: 'Verbes au Présent',
        emoji: '📝',
        xp: 40,
        difficulty: 'facile',
        exercises: [
            { question: 'Conjugue "chanter" à la 1ère personne du singulier (je)', answer: 'je chante', hint: 'JE CHANTE (verbe du 1er groupe en -er)' },
            { question: 'Conjugue "finir" à la 2ème personne du singulier (tu)', answer: 'tu finis', hint: 'TU FINIS (verbe du 2ème groupe en -ir)' },
            { question: 'Conjugue "être" à la 3ème personne du singulier (il/elle)', answer: 'il est', hint: 'IL/ELLE EST (verbe être irrégulier)' },
            { question: 'Conjugue "avoir" à la 1ère personne du pluriel (nous)', answer: 'nous avons', hint: 'NOUS AVONS (verbe avoir irrégulier)' },
            { question: 'Conjugue "aller" à la 2ème personne du pluriel (vous)', answer: 'vous allez', hint: 'VOUS ALLEZ (verbe aller irrégulier)' },
            { question: 'Conjugue "faire" à la 3ème personne du pluriel (ils/elles)', answer: 'ils font', hint: 'ILS/ELLES FONT (verbe faire irrégulier)' },
            { question: 'Conjugue "manger" à la 1ère personne du singulier (je)', answer: 'je mange', hint: 'JE MANGE (attention au E après le G)' },
            { question: 'Conjugue "venir" à la 3ème personne du singulier (il/elle)', answer: 'il vient', hint: 'IL/ELLE VIENT (verbe venir irrégulier)' }
        ]
    },

    // ========================================
    // LEÇON 2 : PASSÉ COMPOSÉ
    // ========================================
    {
        id: 'francais-02-passe-compose',
        title: 'Passé Composé',
        emoji: '⏰',
        xp: 50,
        difficulty: 'moyen',
        exercises: [
            { question: 'Conjugue "manger" au passé composé avec JE', answer: 'j\'ai mangé', hint: 'J\'AI MANGÉ (auxiliaire avoir + participe en -é)' },
            { question: 'Conjugue "finir" au passé composé avec TU', answer: 'tu as fini', hint: 'TU AS FINI (auxiliaire avoir + participe en -i)' },
            { question: 'Conjugue "aller" au passé composé avec IL', answer: 'il est allé', hint: 'IL EST ALLÉ (auxiliaire être + participe en -é)' },
            { question: 'Conjugue "venir" au passé composé avec ELLE', answer: 'elle est venue', hint: 'ELLE EST VENUE (auxiliaire être + accord féminin)' },
            { question: 'Conjugue "faire" au passé composé avec NOUS', answer: 'nous avons fait', hint: 'NOUS AVONS FAIT (participe irrégulier)' },
            { question: 'Conjugue "prendre" au passé composé avec VOUS', answer: 'vous avez pris', hint: 'VOUS AVEZ PRIS (participe irrégulier)' },
            { question: 'Conjugue "partir" au passé composé avec ILS', answer: 'ils sont partis', hint: 'ILS SONT PARTIS (auxiliaire être + accord pluriel)' }
        ]
    },

    // ========================================
    // LEÇON 3 : FUTUR SIMPLE
    // ========================================
    {
        id: 'francais-03-futur',
        title: 'Futur Simple',
        emoji: '🔮',
        xp: 50,
        difficulty: 'moyen',
        exercises: [
            { question: 'Conjugue "chanter" au futur avec JE', answer: 'je chanterai', hint: 'JE CHANTERAI (infinitif + terminaison -ai)' },
            { question: 'Conjugue "finir" au futur avec TU', answer: 'tu finiras', hint: 'TU FINIRAS (infinitif + terminaison -as)' },
            { question: 'Conjugue "être" au futur avec IL', answer: 'il sera', hint: 'IL SERA (radical SER- + terminaison -a)' },
            { question: 'Conjugue "avoir" au futur avec NOUS', answer: 'nous aurons', hint: 'NOUS AURONS (radical AUR- + terminaison -ons)' },
            { question: 'Conjugue "aller" au futur avec VOUS', answer: 'vous irez', hint: 'VOUS IREZ (radical IR- + terminaison -ez)' },
            { question: 'Conjugue "faire" au futur avec ELLES', answer: 'elles feront', hint: 'ELLES FERONT (radical FER- + terminaison -ont)' },
            { question: 'Conjugue "venir" au futur avec JE', answer: 'je viendrai', hint: 'JE VIENDRAI (radical VIENDR- + terminaison -ai)' }
        ]
    },

    // ========================================
    // LEÇON 4 : ACCORDS SUJET-VERBE
    // ========================================
    {
        id: 'francais-04-accords',
        title: 'Accords Sujet-Verbe',
        emoji: '🎯',
        xp: 45,
        difficulty: 'moyen',
        exercises: [
            { question: 'Complète : Les enfants (jouer) dans le jardin', answer: 'jouent', hint: 'JOUENT (sujet pluriel = verbe au pluriel)' },
            { question: 'Complète : Tu (être) très gentil', answer: 'es', hint: 'ES (verbe être avec TU)' },
            { question: 'Complète : Nous (aller) à l\'école', answer: 'allons', hint: 'ALLONS (verbe aller avec NOUS)' },
            { question: 'Complète : Elle (avoir) un chat', answer: 'a', hint: 'A (verbe avoir à la 3ème personne singulier)' },
            { question: 'Complète : Vous (faire) vos devoirs', answer: 'faites', hint: 'FAITES (verbe faire avec VOUS)' },
            { question: 'Complète : Les oiseaux (chanter) le matin', answer: 'chantent', hint: 'CHANTENT (sujet pluriel + verbe en -ent)' },
            { question: 'Complète : On (pouvoir) y arriver', answer: 'peut', hint: 'PEUT (ON = 3ème personne singulier)' }
        ]
    },

    // ========================================
    // LEÇON 5 : PLURIELS DIFFICILES
    // ========================================
    {
        id: 'francais-05-pluriels',
        title: 'Pluriels Difficiles',
        emoji: '🔢',
        xp: 50,
        difficulty: 'moyen',
        exercises: [
            { question: 'Pluriel de "cheval"', answer: 'chevaux', hint: 'CHEVAUX (pluriel en -aux)' },
            { question: 'Pluriel de "bijou"', answer: 'bijoux', hint: 'BIJOUX (exception en -oux)' },
            { question: 'Pluriel de "nez"', answer: 'nez', hint: 'NEZ (invariable, déjà terminé par -z)' },
            { question: 'Pluriel de "œil"', answer: 'yeux', hint: 'YEUX (pluriel très irrégulier)' },
            { question: 'Pluriel de "bateau"', answer: 'bateaux', hint: 'BATEAUX (pluriel en -eaux)' },
            { question: 'Pluriel de "landau"', answer: 'landaus', hint: 'LANDAUS (exception, pluriel normal en -s)' },
            { question: 'Pluriel de "chou"', answer: 'choux', hint: 'CHOUX (exception en -oux)' },
            { question: 'Pluriel de "travail"', answer: 'travaux', hint: 'TRAVAUX (pluriel en -aux)' }
        ]
    },

    // ========================================
    // LEÇON 6 : HOMOPHONES (A/À, ET/EST...)
    // ========================================
    {
        id: 'francais-06-homophones',
        title: 'Homophones',
        emoji: '🎭',
        xp: 55,
        difficulty: 'moyen',
        exercises: [
            { question: 'Complète : Il va ___ l\'école (a/à)', answer: 'à', hint: 'À (préposition de lieu, avec accent)' },
            { question: 'Complète : Il ___ un chien (a/à)', answer: 'a', hint: 'A (verbe avoir, sans accent)' },
            { question: 'Complète : Le chat ___ la souris (et/est)', answer: 'et', hint: 'ET (conjonction de coordination)' },
            { question: 'Complète : Il ___ grand (et/est)', answer: 'est', hint: 'EST (verbe être à la 3ème personne)' },
            { question: 'Complète : ___ es-tu ? (ou/où)', answer: 'où', hint: 'OÙ (question de lieu, avec accent)' },
            { question: 'Complète : Tu viens ___ pas ? (ou/où)', answer: 'ou', hint: 'OU (alternative, sans accent)' },
            { question: 'Complète : ___ frère joue (son/sont)', answer: 'son', hint: 'SON (déterminant possessif)' },
            { question: 'Complète : Ils ___ gentils (son/sont)', answer: 'sont', hint: 'SONT (verbe être au pluriel)' }
        ]
    },

    // ========================================
    // LEÇON 7 : PONCTUATION
    // ========================================
    {
        id: 'francais-07-ponctuation',
        title: 'Ponctuation',
        emoji: '❓',
        xp: 40,
        difficulty: 'facile',
        exercises: [
            { question: 'Quel signe à la fin d\'une question ?', answer: 'point d\'interrogation', hint: 'POINT D\'INTERROGATION (?)' },
            { question: 'Quel signe à la fin d\'une phrase normale ?', answer: 'point', hint: 'POINT (.)' },
            { question: 'Quel signe pour montrer la surprise ?', answer: 'point d\'exclamation', hint: 'POINT D\'EXCLAMATION (!)' },
            { question: 'Quel signe pour séparer des mots dans une liste ?', answer: 'virgule', hint: 'VIRGULE (,)' },
            { question: 'Quels signes pour les paroles de quelqu\'un ?', answer: 'guillemets', hint: 'GUILLEMETS («  »)' },
            { question: 'Quel signe pour une pause dans la phrase ?', answer: 'virgule', hint: 'VIRGULE (,)' },
            { question: 'Combien de points dans les points de suspension ?', answer: 'trois', hint: 'TROIS points (...)' }
        ]
    },

    // ========================================
    // LEÇON 8 : NATURE DES MOTS
    // ========================================
    {
        id: 'francais-08-nature',
        title: 'Nature des Mots',
        emoji: '🏷️',
        xp: 50,
        difficulty: 'moyen',
        exercises: [
            { question: 'Quelle est la nature de "chien" ?', answer: 'nom', hint: 'NOM (désigne un animal)' },
            { question: 'Quelle est la nature de "beau" ?', answer: 'adjectif', hint: 'ADJECTIF (qualifie le nom)' },
            { question: 'Quelle est la nature de "courir" ?', answer: 'verbe', hint: 'VERBE (action)' },
            { question: 'Quelle est la nature de "le" dans "le chat" ?', answer: 'déterminant', hint: 'DÉTERMINANT (accompagne le nom)' },
            { question: 'Quelle est la nature de "très" dans "très grand" ?', answer: 'adverbe', hint: 'ADVERBE (modifie l\'adjectif)' },
            { question: 'Quelle est la nature de "et" ?', answer: 'conjonction', hint: 'CONJONCTION (relie deux éléments)' },
            { question: 'Quelle est la nature de "il" dans "il mange" ?', answer: 'pronom', hint: 'PRONOM (remplace un nom)' }
        ]
    },

    // ========================================
    // LEÇON 9 : COD/COI
    // ========================================
    {
        id: 'francais-09-complements',
        title: 'COD / COI',
        emoji: '🎯',
        xp: 60,
        difficulty: 'difficile',
        exercises: [
            { question: 'Dans "Je mange une pomme", quel est le COD ?', answer: 'une pomme', hint: 'UNE POMME (complément d\'objet direct, pas de préposition)' },
            { question: 'Dans "Il parle à Marie", quel est le COI ?', answer: 'à marie', hint: 'À MARIE (complément d\'objet indirect, avec préposition À)' },
            { question: 'Dans "Elle lit un livre", quel est le COD ?', answer: 'un livre', hint: 'UN LIVRE (quoi ? = COD)' },
            { question: 'Dans "Nous pensons à toi", quel est le COI ?', answer: 'à toi', hint: 'À TOI (à qui ? = COI)' },
            { question: 'Dans "Tu écris une lettre", quel est le COD ?', answer: 'une lettre', hint: 'UNE LETTRE (tu écris quoi ? = COD)' },
            { question: 'Dans "Je téléphone à mon ami", quel est le COI ?', answer: 'à mon ami', hint: 'À MON AMI (à qui ? = COI)' },
            { question: 'Quel type de complément répond à "quoi ?" ?', answer: 'cod', hint: 'COD (Complément d\'Objet Direct)' }
        ]
    },

    // ========================================
    // LEÇON 10 : ADJECTIFS QUALIFICATIFS
    // ========================================
    {
        id: 'francais-10-adjectifs',
        title: 'Adjectifs Qualificatifs',
        emoji: '🎨',
        xp: 45,
        difficulty: 'moyen',
        exercises: [
            { question: 'Accorde "petit" avec "fille"', answer: 'petite', hint: 'PETITE (féminin + e)' },
            { question: 'Accorde "grand" avec "maisons" (féminin pluriel)', answer: 'grandes', hint: 'GRANDES (féminin + es)' },
            { question: 'Accorde "joli" avec "fleurs" (féminin pluriel)', answer: 'jolies', hint: 'JOLIES (féminin + es)' },
            { question: 'Accorde "heureux" avec "garçons" (masculin pluriel)', answer: 'heureux', hint: 'HEUREUX (invariable au masculin pluriel)' },
            { question: 'Accorde "blanc" avec "robe" (féminin)', answer: 'blanche', hint: 'BLANCHE (féminin en -che)' },
            { question: 'Accorde "gentil" avec "fille" (féminin)', answer: 'gentille', hint: 'GENTILLE (double L au féminin)' },
            { question: 'Accorde "vieux" avec "maison" (féminin)', answer: 'vieille', hint: 'VIEILLE (féminin irrégulier)' }
        ]
    },

    // ========================================
    // LEÇON 11 : SYNONYMES ET ANTONYMES
    // ========================================
    {
        id: 'francais-11-synonymes',
        title: 'Synonymes & Antonymes',
        emoji: '🔄',
        xp: 50,
        difficulty: 'moyen',
        exercises: [
            { question: 'Synonyme de "joyeux"', answer: 'heureux', hint: 'HEUREUX (ou content, gai)' },
            { question: 'Antonyme de "grand"', answer: 'petit', hint: 'PETIT (contraire de grand)' },
            { question: 'Synonyme de "maison"', answer: 'habitation', hint: 'HABITATION (ou demeure, logement)' },
            { question: 'Antonyme de "chaud"', answer: 'froid', hint: 'FROID (contraire de chaud)' },
            { question: 'Synonyme de "beau"', answer: 'joli', hint: 'JOLI (ou magnifique)' },
            { question: 'Antonyme de "monter"', answer: 'descendre', hint: 'DESCENDRE (contraire de monter)' },
            { question: 'Synonyme de "rapidement"', answer: 'vite', hint: 'VITE (ou prestement)' },
            { question: 'Antonyme de "facile"', answer: 'difficile', hint: 'DIFFICILE (contraire de facile)' }
        ]
    },

    // ========================================
    // LEÇON 12 : VOCABULAIRE THÉMATIQUE
    // ========================================
    {
        id: 'francais-12-vocabulaire',
        title: 'Vocabulaire Thématique',
        emoji: '📖',
        xp: 45,
        difficulty: 'facile',
        exercises: [
            { question: 'Famille du mot "terre" : _____ain (habitant)', answer: 'terrien', hint: 'TERRIEN (habitant de la Terre)' },
            { question: 'Famille du mot "mer" : _____itime (relatif à la mer)', answer: 'maritime', hint: 'MARITIME (relatif à la mer)' },
            { question: 'Préfixe pour dire "avant" : _____histoire', answer: 'préhistoire', hint: 'PRÉHISTOIRE (pré- = avant)' },
            { question: 'Préfixe pour dire "sous" : _____marin', answer: 'sous-marin', hint: 'SOUS-MARIN (sous- = en dessous)' },
            { question: 'Suffixe pour le métier : boulang_____', answer: 'boulanger', hint: 'BOULANGER (-er pour le métier)' },
            { question: 'Suffixe pour le lieu : boucher_____ (où travaille le boucher)', answer: 'boucherie', hint: 'BOUCHERIE (-erie pour le lieu)' },
            { question: 'Quel mot pour "planter des arbres" ?', answer: 'reboiser', hint: 'REBOISER (re- + bois + er)' }
        ]
    },

    // ========================================
    // LEÇON 13 : TYPES DE PHRASES
    // ========================================
    {
        id: 'francais-13-phrases',
        title: 'Types de Phrases',
        emoji: '💬',
        xp: 40,
        difficulty: 'facile',
        exercises: [
            { question: 'Quel type : "Ferme la porte !" ?', answer: 'impérative', hint: 'IMPÉRATIVE (ordre ou conseil)' },
            { question: 'Quel type : "Es-tu prêt ?" ?', answer: 'interrogative', hint: 'INTERROGATIVE (pose une question)' },
            { question: 'Quel type : "Quelle belle journée !" ?', answer: 'exclamative', hint: 'EXCLAMATIVE (exprime un sentiment fort)' },
            { question: 'Quel type : "Le chat dort." ?', answer: 'déclarative', hint: 'DÉCLARATIVE (donne une information)' },
            { question: 'Transforme en négative : "Il vient."', answer: 'il ne vient pas', hint: 'IL NE VIENT PAS (ne...pas)' },
            { question: 'Transforme en interrogative : "Tu es là."', answer: 'es-tu là', hint: 'ES-TU LÀ ? (inversion sujet-verbe)' },
            { question: 'Quelle forme : "Ne cours pas !" ?', answer: 'impérative négative', hint: 'IMPÉRATIVE NÉGATIVE (ordre + négation)' }
        ]
    },

    // ========================================
    // LEÇON 14 : ANALYSE DE PHRASE
    // ========================================
    {
        id: 'francais-14-analyse',
        title: 'Analyse de Phrase',
        emoji: '🔍',
        xp: 60,
        difficulty: 'difficile',
        exercises: [
            { question: 'Dans "Le chat noir mange", quel est le sujet ?', answer: 'le chat noir', hint: 'LE CHAT NOIR (qui fait l\'action ?)' },
            { question: 'Dans "Le chat noir mange", quel est le verbe ?', answer: 'mange', hint: 'MANGE (action)' },
            { question: 'Dans "Marie lit un livre", quel est le sujet ?', answer: 'marie', hint: 'MARIE (qui fait l\'action ?)' },
            { question: 'Dans "Marie lit un livre", quel est le COD ?', answer: 'un livre', hint: 'UN LIVRE (lit quoi ?)' },
            { question: 'Dans "Le grand chien", quel mot qualifie "chien" ?', answer: 'grand', hint: 'GRAND (adjectif qualificatif)' },
            { question: 'Dans "Nous allons à l\'école", où allons-nous ?', answer: 'à l\'école', hint: 'À L\'ÉCOLE (complément de lieu)' },
            { question: 'Dans "Demain, je partirai", quel est le complément de temps ?', answer: 'demain', hint: 'DEMAIN (quand ?)' }
        ]
    },

    // ========================================
    // LEÇON 15 : EXAMEN FINAL
    // ========================================
    {
        id: 'francais-15-exam',
        title: 'Examen Final',
        emoji: '🏆',
        xp: 100,
        difficulty: 'difficile',
        exercises: [
            { question: 'Conjugue "aller" au passé composé avec NOUS', answer: 'nous sommes allés', hint: 'NOUS SOMMES ALLÉS (être + participe)' },
            { question: 'Accorde "nouveau" avec "voitures" (féminin pluriel)', answer: 'nouvelles', hint: 'NOUVELLES (irrégulier au féminin)' },
            { question: 'Complète : Il ___ un cadeau (a/à)', answer: 'a', hint: 'A (verbe avoir)' },
            { question: 'Pluriel de "travail"', answer: 'travaux', hint: 'TRAVAUX (pluriel en -aux)' },
            { question: 'Synonyme de "commencer"', answer: 'débuter', hint: 'DÉBUTER (ou entamer)' },
            { question: 'Dans "Je donne un jouet à Paul", quel est le COI ?', answer: 'à paul', hint: 'À PAUL (donne à qui ?)' },
            { question: 'Conjugue "être" au futur avec ILS', answer: 'ils seront', hint: 'ILS SERONT (radical SER-)' },
            { question: 'Quel type de phrase : "Range ta chambre !"', answer: 'impérative', hint: 'IMPÉRATIVE (ordre)' },
            { question: 'Transforme en négative : "Elle vient."', answer: 'elle ne vient pas', hint: 'ELLE NE VIENT PAS' },
            { question: 'Antonyme de "entrer"', answer: 'sortir', hint: 'SORTIR (contraire d\'entrer)' }
        ]
    }
];

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = francaisLessons;
}

console.log('✅ Données Français chargées : ' + francaisLessons.length + ' leçons');