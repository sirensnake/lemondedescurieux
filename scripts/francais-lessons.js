// ========================================
// LEÇONS DE FRANÇAIS - LE MONDE DES CURIEUX
// Architecture Duolingo-style complète
// Version 2.0 - 15 LEÇONS COMPLÈTES
// ========================================

// ========================================
// PARTIE 1 : DONNÉES DES LEÇONS (15 LEÇONS)
// ========================================

const FRENCH_LESSONS = [
  // ========================================
  // LEÇON 1 : VERBES AU PRÉSENT
  // ========================================
  {
    id: 1,
    title: "Verbes au Présent",
    icon: "📝",
    difficulty: "facile",
    xpReward: 20,
    theory: {
      title: "Le Présent de l'Indicatif",
      content: `<strong>Le présent</strong> exprime une action qui se déroule maintenant.<br><br><strong>Terminaisons (-er) :</strong> je -e, tu -es, il/elle -e, nous -ons, vous -ez, ils/elles -ent`,
      example: "Exemple : chanter → je chante, tu chantes"
    },
    exercises: [
      { id: 1, type: "conjugation", difficulty: "facile", question: "Conjugue CHANTER avec JE", answer: "chante", hint: "Terminaison : -e", explanation: "Je chante (radical chant- + terminaison -e)" },
      { id: 2, type: "conjugation", difficulty: "facile", question: "Conjugue JOUER avec TU", answer: "joues", hint: "Terminaison : -es", explanation: "Tu joues (radical jou- + terminaison -es)" },
      { id: 3, type: "fill_blank", difficulty: "moyen", question: "Les enfants ____ au parc. (jouer)", answer: "jouent", hint: "Ils/elles → -ent", explanation: "Ils jouent (radical jou- + terminaison -ent)" },
      { id: 4, type: "conjugation", difficulty: "moyen", question: "Conjugue PARLER avec NOUS", answer: "parlons", hint: "Terminaison : -ons", explanation: "Nous parlons (radical parl- + terminaison -ons)" }
    ]
  },

  // ========================================
  // LEÇON 2 : ACCORDS DANS LE GN
  // ========================================
  {
    id: 2,
    title: "Accords dans le GN",
    icon: "🎯",
    difficulty: "facile",
    xpReward: 25,
    theory: {
      title: "L'Accord dans le Groupe Nominal",
      content: `<strong>Règle :</strong> L'adjectif s'accorde en genre et nombre avec le nom.<br><br>Féminin : +e (petit → petite)<br>Pluriel : +s (petits, petites)`,
      example: "un chat noir → une chatte noire → des chats noirs"
    },
    exercises: [
      { id: 1, type: "identification", difficulty: "facile", question: "Dans 'un grand arbre', quel est l'adjectif ?", answer: "grand", hint: "L'adjectif qualifie le nom", explanation: "'Grand' qualifie 'arbre'" },
      { id: 2, type: "fill_blank", difficulty: "moyen", question: "Les voitures ____ (rapide)", answer: "rapides", hint: "Féminin pluriel", explanation: "Rapides (féminin pluriel +s)" },
      { id: 3, type: "transformation", difficulty: "moyen", question: "Au féminin : un garçon gentil", answer: "une fille gentille", hint: "Doublement du 'l'", explanation: "Gentil → gentille" },
      { id: 4, type: "fill_blank", difficulty: "difficile", question: "Des fleurs ____ (blanc)", answer: "blanches", hint: "Féminin pluriel : blanc → blanche", explanation: "Blanches (féminin pluriel)" }
    ]
  },

  // ========================================
  // LEÇON 3 : LE PASSÉ COMPOSÉ
  // ========================================
  {
    id: 3,
    title: "Le Passé Composé",
    icon: "⏮️",
    difficulty: "moyen",
    xpReward: 30,
    theory: {
      title: "Le Passé Composé",
      content: `<strong>Formation :</strong> AVOIR/ÊTRE au présent + PARTICIPE PASSÉ<br><br>Avec AVOIR : j'ai mangé<br>Avec ÊTRE : je suis allé(e)`,
      example: "Manger → j'ai mangé / Aller → je suis allé"
    },
    exercises: [
      { id: 1, type: "auxiliary_choice", difficulty: "facile", question: "Quel auxiliaire avec MANGER ?", answer: "avoir", hint: "La plupart → avoir", explanation: "Manger utilise 'avoir'" },
      { id: 2, type: "conjugation", difficulty: "facile", question: "JOUER au passé composé avec JE", answer: "ai joué", hint: "Avoir + participe", explanation: "J'ai joué" },
      { id: 3, type: "fill_blank", difficulty: "moyen", question: "Hier, nous ____ au parc. (aller)", answer: "sommes allés", hint: "Être + accord", explanation: "Nous sommes allés" },
      { id: 4, type: "conjugation", difficulty: "difficile", question: "VENIR au passé composé avec ELLE", answer: "est venue", hint: "Être + accord féminin", explanation: "Elle est venue" }
    ]
  },

  // ========================================
  // LEÇON 4 : L'IMPARFAIT
  // ========================================
  {
    id: 4,
    title: "L'Imparfait",
    icon: "🕰️",
    difficulty: "moyen",
    xpReward: 30,
    theory: {
      title: "L'Imparfait",
      content: `<strong>Formation :</strong> Radical NOUS au présent + terminaisons -ais, -ais, -ait, -ions, -iez, -aient<br><br>Exemple : nous jouons → jou- → je jouais`,
      example: "Jouer → nous jouons → je jouais, tu jouais"
    },
    exercises: [
      { id: 1, type: "conjugation", difficulty: "facile", question: "JOUER à l'imparfait avec JE", answer: "jouais", hint: "Terminaison : -ais", explanation: "Je jouais (jou- + ais)" },
      { id: 2, type: "conjugation", difficulty: "facile", question: "PARLER à l'imparfait avec TU", answer: "parlais", hint: "Terminaison : -ais", explanation: "Tu parlais (parl- + ais)" },
      { id: 3, type: "fill_blank", difficulty: "moyen", question: "Quand j'étais petit, je ____ beaucoup. (rire)", answer: "riais", hint: "Nous rions → ri- + ais", explanation: "Je riais" },
      { id: 4, type: "conjugation", difficulty: "moyen", question: "FINIR à l'imparfait avec NOUS", answer: "finissions", hint: "Finiss- + ions", explanation: "Nous finissions" }
    ]
  },

  // ========================================
  // LEÇON 5 : LE FUTUR SIMPLE
  // ========================================
  {
    id: 5,
    title: "Le Futur Simple",
    icon: "🔮",
    difficulty: "moyen",
    xpReward: 35,
    theory: {
      title: "Le Futur Simple",
      content: `<strong>Formation :</strong> INFINITIF + terminaisons -ai, -as, -a, -ons, -ez, -ont<br><br><strong>Irréguliers :</strong> ÊTRE → serai, AVOIR → aurai, ALLER → irai`,
      example: "Jouer → je jouerai / Être → je serai"
    },
    exercises: [
      { id: 1, type: "conjugation", difficulty: "facile", question: "JOUER au futur avec JE", answer: "jouerai", hint: "Infinitif + ai", explanation: "Je jouerai" },
      { id: 2, type: "conjugation", difficulty: "facile", question: "FINIR au futur avec TU", answer: "finiras", hint: "Infinitif + as", explanation: "Tu finiras" },
      { id: 3, type: "fill_blank", difficulty: "moyen", question: "Demain, nous ____ au parc. (aller)", answer: "irons", hint: "Irrégulier : ir- + ons", explanation: "Nous irons" },
      { id: 4, type: "irregular_verb", difficulty: "difficile", question: "ÊTRE au futur avec JE", answer: "serai", hint: "Irrégulier : ser- + ai", explanation: "Je serai" }
    ]
  },

  // ========================================
  // LEÇON 6 : LE CONDITIONNEL PRÉSENT
  // ========================================
  {
    id: 6,
    title: "Le Conditionnel Présent",
    icon: "🌟",
    difficulty: "difficile",
    xpReward: 40,
    theory: {
      title: "Le Conditionnel Présent",
      content: `<strong>Le conditionnel</strong> exprime une action soumise à condition, un souhait, une demande polie.<br><br><strong>Formation :</strong> INFINITIF + terminaisons de l'imparfait (-ais, -ais, -ait, -ions, -iez, -aient)<br><br><strong>⚠️ Verbes en -RE :</strong> Enlever le -e final<br><strong>⚠️ IRRÉGULIERS :</strong> ÊTRE → ser-, AVOIR → aur-, ALLER → ir-, FAIRE → fer-, VENIR → viendr-, VOIR → verr-`,
      example: "Jouer → je jouerais / Être → je serais / Prendre → je prendrais"
    },
    exercises: [
      { id: 1, type: "conjugation", difficulty: "moyen", question: "JOUER au conditionnel avec JE", answer: "jouerais", hint: "Infinitif + ais", explanation: "Je jouerais (infinitif jouer + -ais)" },
      { id: 2, type: "conjugation", difficulty: "moyen", question: "FINIR au conditionnel avec TU", answer: "finirais", hint: "Infinitif + ais", explanation: "Tu finirais (infinitif finir + -ais)" },
      { id: 3, type: "fill_blank", difficulty: "moyen", question: "Si j'avais le temps, je ____ plus. (lire)", answer: "lirais", hint: "Enlève le -e : lir- + ais", explanation: "Je lirais (lire → lir- + ais)" },
      { id: 4, type: "irregular_verb", difficulty: "difficile", question: "ÊTRE au conditionnel avec NOUS", answer: "serions", hint: "Irrégulier : ser- + ions", explanation: "Nous serions (être → ser- + ions)" },
      { id: 5, type: "irregular_verb", difficulty: "difficile", question: "AVOIR au conditionnel avec VOUS", answer: "auriez", hint: "Irrégulier : aur- + iez", explanation: "Vous auriez (avoir → aur- + iez)" },
      { id: 6, type: "contextualized", difficulty: "difficile", question: "Si tu venais, nous ____ contents. (être)", answer: "serions", hint: "Condition + conditionnel", explanation: "Nous serions (situation hypothétique)" },
      { id: 7, type: "production", difficulty: "difficile", question: "____ -tu m'aider ? (Demande polie avec POUVOIR)", answer: "pourrais", hint: "POUVOIR est irrégulier : pourr-", explanation: "Pourrais-tu (demande polie au conditionnel)" },
      { id: 8, type: "tense_choice", difficulty: "difficile", question: "Je (voudrais/veux) un café, s'il vous plaît.", answer: "voudrais", hint: "Demande polie = conditionnel", explanation: "Voudrais (le conditionnel est plus poli)" }
    ]
  },

  // ========================================
  // LEÇON 7 : L'IMPÉRATIF
  // ========================================
  {
    id: 7,
    title: "L'Impératif",
    icon: "⚡",
    difficulty: "moyen",
    xpReward: 30,
    theory: {
      title: "L'Impératif",
      content: `<strong>L'impératif</strong> sert à donner un ordre, un conseil, une consigne.<br><br><strong>3 personnes seulement :</strong> TU, NOUS, VOUS (sans le pronom)<br><br><strong>Terminaisons (-ER) :</strong><ul><li>TU : -e (mange !)</li><li>NOUS : -ons (mangeons !)</li><li>VOUS : -ez (mangez !)</li></ul><strong>⚠️ EXCEPTIONS :</strong> ÊTRE → sois/soyons/soyez, AVOIR → aie/ayons/ayez`,
      example: "Chanter → chante ! / chantons ! / chantez !"
    },
    exercises: [
      { id: 1, type: "conjugation", difficulty: "facile", question: "JOUER à l'impératif avec TU", answer: "joue", hint: "Pas de 's' pour les verbes en -er", explanation: "Joue ! (impératif 2e personne)" },
      { id: 2, type: "conjugation", difficulty: "facile", question: "PARLER à l'impératif avec VOUS", answer: "parlez", hint: "Terminaison : -ez", explanation: "Parlez ! (impératif 2e personne pluriel)" },
      { id: 3, type: "conjugation", difficulty: "moyen", question: "FINIR à l'impératif avec NOUS", answer: "finissons", hint: "Terminaison : -ons", explanation: "Finissons ! (impératif 1ère personne pluriel)" },
      { id: 4, type: "irregular_verb", difficulty: "moyen", question: "ÊTRE à l'impératif avec TU", answer: "sois", hint: "Verbe irrégulier", explanation: "Sois ! (impératif irrégulier d'être)" },
      { id: 5, type: "irregular_verb", difficulty: "difficile", question: "AVOIR à l'impératif avec VOUS", answer: "ayez", hint: "Verbe irrégulier", explanation: "Ayez ! (impératif irrégulier d'avoir)" },
      { id: 6, type: "contextualized", difficulty: "difficile", question: "____ ton manteau ! (mettre, TU)", answer: "mets", hint: "Présent 2e personne sans pronom", explanation: "Mets ! (impératif de mettre)" },
      { id: 7, type: "production", difficulty: "difficile", question: "____ attention en classe ! (faire, VOUS)", answer: "faites", hint: "Présent 2e personne pluriel sans pronom", explanation: "Faites ! (conseil à l'impératif)" }
    ]
  },

  // ========================================
  // LEÇON 8 : LES COMPLÉMENTS DU VERBE
  // ========================================
  {
    id: 8,
    title: "Les Compléments du Verbe",
    icon: "🎯",
    difficulty: "moyen",
    xpReward: 35,
    theory: {
      title: "Les Compléments du Verbe",
      content: `<strong>COD (Complément d'Objet Direct) :</strong> répond à "quoi ?" ou "qui ?"<br>Exemple : Je mange <strong>une pomme</strong>. (Je mange quoi ?)<br><br><strong>COI (Complément d'Objet Indirect) :</strong> répond à "à qui/quoi ?" ou "de qui/quoi ?"<br>Exemple : Je parle <strong>à mon ami</strong>. (Je parle à qui ?)<br><br><strong>Truc :</strong> Le COI a toujours une préposition (à, de, pour...)`,
      example: "Je vois <em>le chat</em> (COD) / Je pense <em>à toi</em> (COI)"
    },
    exercises: [
      { id: 1, type: "identification", difficulty: "facile", question: "Dans 'Je mange une pomme', quel est le COD ?", answer: "une pomme", hint: "Répond à 'je mange quoi ?'", explanation: "Une pomme (COD, pas de préposition)" },
      { id: 2, type: "identification", difficulty: "facile", question: "Dans 'Il parle à Marie', quel type de complément est 'à Marie' ?", answer: "coi", hint: "Il y a une préposition 'à'", explanation: "COI (préposition + complément)" },
      { id: 3, type: "fill_blank", difficulty: "moyen", question: "Je pense ____ vacances. (préposition)", answer: "aux", hint: "à + les = aux", explanation: "Aux vacances (COI avec préposition)" },
      { id: 4, type: "identification", difficulty: "moyen", question: "Dans 'Elle écrit une lettre', identifie le COD", answer: "une lettre", hint: "Elle écrit quoi ?", explanation: "Une lettre (COD direct)" },
      { id: 5, type: "transformation", difficulty: "difficile", question: "Remplace par un pronom : Je vois le chien", answer: "je le vois", hint: "le/la/les pour COD", explanation: "Je le vois (le = COD)" },
      { id: 6, type: "identification", difficulty: "difficile", question: "Dans 'Nous parlons de nos projets', quel est le COI ?", answer: "de nos projets", hint: "Préposition 'de'", explanation: "De nos projets (COI avec préposition de)" }
    ]
  },

  // ========================================
  // LEÇON 9 : LES PRONOMS PERSONNELS
  // ========================================
  {
    id: 9,
    title: "Les Pronoms Personnels",
    icon: "👥",
    difficulty: "moyen",
    xpReward: 35,
    theory: {
      title: "Les Pronoms Personnels",
      content: `<strong>Pronoms sujets :</strong> je, tu, il/elle, nous, vous, ils/elles<br><br><strong>Pronoms COD :</strong> me, te, le/la, nous, vous, les<br>Exemple : Je <strong>le</strong> vois (je vois lui/ça)<br><br><strong>Pronoms COI :</strong> me, te, lui, nous, vous, leur<br>Exemple : Je <strong>lui</strong> parle (je parle à lui/elle)`,
      example: "Je vois <em>Pierre</em> → Je <strong>le</strong> vois / Je parle <em>à Marie</em> → Je <strong>lui</strong> parle"
    },
    exercises: [
      { id: 1, type: "transformation", difficulty: "facile", question: "Remplace par un pronom : Je vois Marie", answer: "je la vois", hint: "Marie = elle = la", explanation: "Je la vois (la remplace Marie)" },
      { id: 2, type: "transformation", difficulty: "facile", question: "Remplace : Il mange les pommes", answer: "il les mange", hint: "les pommes = les", explanation: "Il les mange (les remplace les pommes)" },
      { id: 3, type: "fill_blank", difficulty: "moyen", question: "Je ____ téléphone. (à mes parents)", answer: "leur", hint: "COI pluriel = leur", explanation: "Je leur téléphone (leur = à eux)" },
      { id: 4, type: "transformation", difficulty: "moyen", question: "Remplace : Elle parle à son frère", answer: "elle lui parle", hint: "COI singulier = lui", explanation: "Elle lui parle (lui = à lui)" },
      { id: 5, type: "fill_blank", difficulty: "difficile", question: "Tu ____ donnes le livre ? (à moi)", answer: "me", hint: "COI 1ère personne = me", explanation: "Tu me donnes (me = à moi)" },
      { id: 6, type: "production", difficulty: "difficile", question: "Remplace TOUT par des pronoms : Je donne le cadeau à Marie", answer: "je le lui donne", hint: "le cadeau = le, à Marie = lui", explanation: "Je le lui donne (le = COD, lui = COI)" }
    ]
  },

  // ========================================
  // LEÇON 10 : LES DÉTERMINANTS
  // ========================================
  {
    id: 10,
    title: "Les Déterminants",
    icon: "🔤",
    difficulty: "facile",
    xpReward: 30,
    theory: {
      title: "Les Déterminants",
      content: `<strong>Articles définis :</strong> le, la, l', les (désigne quelque chose de précis)<br><strong>Articles indéfinis :</strong> un, une, des (quelque chose de non précis)<br><strong>Articles partitifs :</strong> du, de la, de l' (une partie de quelque chose)<br><br><strong>Déterminants possessifs :</strong> mon, ton, son, notre, votre, leur...<br><strong>Déterminants démonstratifs :</strong> ce, cet, cette, ces`,
      example: "<em>Le</em> chat (défini) / <em>Un</em> chat (indéfini) / <em>Du</em> pain (partitif) / <em>Mon</em> chat (possessif) / <em>Ce</em> chat (démonstratif)"
    },
    exercises: [
      { id: 1, type: "identification", difficulty: "facile", question: "Dans 'le chien', quel type de déterminant ?", answer: "défini", hint: "Le/la/les = défini", explanation: "Article défini (désigne un chien précis)" },
      { id: 2, type: "fill_blank", difficulty: "facile", question: "Je veux ____ pomme. (indéfini)", answer: "une", hint: "Un/une/des = indéfini", explanation: "Une pomme (article indéfini féminin)" },
      { id: 3, type: "fill_blank", difficulty: "moyen", question: "Il mange ____ pain. (partitif)", answer: "du", hint: "Du/de la/de l' = partitif", explanation: "Du pain (une partie du pain)" },
      { id: 4, type: "identification", difficulty: "moyen", question: "Dans 'mon livre', quel type de déterminant ?", answer: "possessif", hint: "Mon/ton/son...", explanation: "Déterminant possessif (possession)" },
      { id: 5, type: "fill_blank", difficulty: "difficile", question: "____ chats sont noirs. (démonstratif)", answer: "ces", hint: "Ce/cet/cette/ces", explanation: "Ces chats (démonstratif pluriel)" },
      { id: 6, type: "transformation", difficulty: "difficile", question: "Transforme au pluriel : le chat noir", answer: "les chats noirs", hint: "le → les, chat → chats, noir → noirs", explanation: "Les chats noirs (article défini pluriel + accords)" }
    ]
  },

  // ========================================
  // LEÇON 11 : LA PHRASE COMPLEXE
  // ========================================
  {
    id: 11,
    title: "La Phrase Complexe",
    icon: "🔗",
    difficulty: "difficile",
    xpReward: 40,
    theory: {
      title: "La Phrase Complexe",
      content: `<strong>Phrase simple :</strong> 1 seul verbe conjugué<br>Exemple : Le chat dort.<br><br><strong>Phrase complexe :</strong> 2 verbes ou + reliés par :<br><ul><li><strong>Juxtaposition :</strong> virgule, point-virgule (Il pleut, je reste.)</li><li><strong>Coordination :</strong> mais, ou, et, donc, or, ni, car (Il pleut <strong>donc</strong> je reste.)</li><li><strong>Subordination :</strong> qui, que, quand, si, parce que... (Je reste <strong>parce qu'</strong>il pleut.)</li></ul>`,
      example: "Simple : <em>Je mange</em> / Complexe : <em>Je mange</em> <strong>et</strong> <em>je bois</em>"
    },
    exercises: [
      { id: 1, type: "identification", difficulty: "facile", question: "Phrase simple ou complexe ? 'Le chien aboie.'", answer: "simple", hint: "Combien de verbes ?", explanation: "Simple (1 seul verbe : aboie)" },
      { id: 2, type: "identification", difficulty: "facile", question: "Combien de verbes ? 'Je cours et je saute.'", answer: "2", hint: "Compte les verbes conjugués", explanation: "2 verbes (cours, saute) = phrase complexe" },
      { id: 3, type: "fill_blank", difficulty: "moyen", question: "Il pleut ____ je prends mon parapluie. (coordination)", answer: "donc", hint: "Conséquence = donc", explanation: "Donc (coordination exprimant la conséquence)" },
      { id: 4, type: "identification", difficulty: "moyen", question: "Type de lien ? 'Je lis parce que j'aime ça.'", answer: "subordination", hint: "Parce que = subordination", explanation: "Subordination (parce que introduit une proposition subordonnée)" },
      { id: 5, type: "transformation", difficulty: "difficile", question: "Transforme en 2 phrases simples : 'Je chante et je danse.'", answer: "je chante|je danse", hint: "Sépare au niveau du 'et'", explanation: "Je chante. Je danse. (2 phrases simples)" },
      { id: 6, type: "production", difficulty: "difficile", question: "Relie avec une coordination : 'Il fait froid. Je mets un manteau.'", answer: "il fait froid donc je mets un manteau", hint: "Utilise 'donc' pour la conséquence", explanation: "Il fait froid donc je mets un manteau (coordination)" }
    ]
  },

  // ========================================
  // LEÇON 12 : LES HOMOPHONES COURANTS
  // ========================================
  {
    id: 12,
    title: "Les Homophones",
    icon: "🎭",
    difficulty: "moyen",
    xpReward: 35,
    theory: {
      title: "Les Homophones Courants",
      content: `<strong>Homophones :</strong> mots qui se prononcent pareil mais s'écrivent différemment<br><br><strong>a / à :</strong> a = verbe avoir, à = préposition<br><strong>et / est :</strong> et = et puis, est = verbe être<br><strong>son / sont :</strong> son = possessif, sont = verbe être<br><strong>ou / où :</strong> ou = ou bien, où = lieu<br><strong>ces / ses :</strong> ces = démonstratif, ses = possessif<br><strong>ce / se :</strong> ce = démonstratif, se = pronom réfléchi`,
      example: "Il <em>a</em> un chat <em>à</em> lui / Pierre <em>et</em> Marie, il <em>est</em> gentil"
    },
    exercises: [
      { id: 1, type: "fill_blank", difficulty: "facile", question: "Il ____ un chien. (verbe avoir)", answer: "a", hint: "Verbe avoir = a", explanation: "Il a (verbe avoir 3e personne)" },
      { id: 2, type: "fill_blank", difficulty: "facile", question: "Je vais ____ Paris. (préposition)", answer: "à", hint: "Préposition = à", explanation: "À Paris (préposition de lieu)" },
      { id: 3, type: "fill_blank", difficulty: "moyen", question: "Pierre ____ Marie sont là. (et puis)", answer: "et", hint: "Et puis = et", explanation: "Et (conjonction de coordination)" },
      { id: 4, type: "fill_blank", difficulty: "moyen", question: "Il ____ gentil. (verbe être)", answer: "est", hint: "Verbe être = est", explanation: "Il est (verbe être 3e personne)" },
      { id: 5, type: "fill_blank", difficulty: "difficile", question: "Ils ____ partis hier. (verbe être)", answer: "sont", hint: "Verbe être pluriel = sont", explanation: "Ils sont (verbe être 3e personne pluriel)" },
      { id: 6, type: "fill_blank", difficulty: "difficile", question: "____ livre est à moi. (démonstratif)", answer: "ce", hint: "Ce/cet/cette = démonstratif", explanation: "Ce livre (déterminant démonstratif)" },
      { id: 7, type: "contextualized", difficulty: "difficile", question: "Tu veux du thé ____ du café ? (choix)", answer: "ou", hint: "Ou bien = ou", explanation: "Ou (conjonction de choix)" },
      { id: 8, type: "fill_blank", difficulty: "difficile", question: "____ est ma maison ? (lieu)", answer: "où", hint: "Lieu = où avec accent", explanation: "Où (pronom interrogatif de lieu)" }
    ]
  },

  // ========================================
  // LEÇON 13 : L'ACCORD DU PARTICIPE PASSÉ
  // ========================================
  {
    id: 13,
    title: "Accord du Participe Passé",
    icon: "✨",
    difficulty: "difficile",
    xpReward: 45,
    theory: {
      title: "L'Accord du Participe Passé",
      content: `<strong>Avec ÊTRE :</strong> accord avec le sujet<br>Elle est parti<strong>e</strong> / Ils sont parti<strong>s</strong><br><br><strong>Avec AVOIR :</strong> PAS d'accord SAUF si COD placé AVANT<br>J'ai mangé la pomme (pas d'accord)<br>La pomme que j'ai mangé<strong>e</strong> (accord car COD avant)<br><br><strong>Astuce :</strong> Cherche le COD, s'il est avant le verbe → accord !`,
      example: "Elle est <em>partie</em> (être = accord) / J'ai <em>mangé</em> (avoir, pas de COD avant)"
    },
    exercises: [
      { id: 1, type: "fill_blank", difficulty: "moyen", question: "Elle est ____ hier. (partir)", answer: "partie", hint: "Être + féminin = accord", explanation: "Elle est partie (accord avec 'elle')" },
      { id: 2, type: "fill_blank", difficulty: "moyen", question: "Ils sont ____ tôt. (arriver)", answer: "arrivés", hint: "Être + masculin pluriel", explanation: "Ils sont arrivés (accord avec 'ils')" },
      { id: 3, type: "fill_blank", difficulty: "moyen", question: "J'ai ____ une pomme. (manger)", answer: "mangé", hint: "Avoir + pas de COD avant = pas d'accord", explanation: "J'ai mangé (COD après, pas d'accord)" },
      { id: 4, type: "fill_blank", difficulty: "difficile", question: "La pomme que j'ai ____ . (manger)", answer: "mangée", hint: "COD 'que' (= la pomme) est AVANT", explanation: "Mangée (COD féminin avant le verbe)" },
      { id: 5, type: "fill_blank", difficulty: "difficile", question: "Les fleurs qu'il a ____ . (cueillir)", answer: "cueillies", hint: "COD 'qu'' (= les fleurs) AVANT", explanation: "Cueillies (COD féminin pluriel avant)" },
      { id: 6, type: "error_detection", difficulty: "difficile", question: "Corrige : Elles ont mangées des bonbons.", answer: "elles ont mangé des bonbons", hint: "COD après avec avoir = pas d'accord", explanation: "Mangé (COD 'bonbons' est après)" },
      { id: 7, type: "contextualized", difficulty: "difficile", question: "Marie et Sophie sont ____ à Paris. (aller)", answer: "allées", hint: "Être + féminin pluriel", explanation: "Allées (accord féminin pluriel avec être)" }
    ]
  },

  // ========================================
  // LEÇON 14 : LES FAMILLES DE MOTS
  // ========================================
  {
    id: 14,
    title: "Les Familles de Mots",
    icon: "🌳",
    difficulty: "facile",
    xpReward: 30,
    theory: {
      title: "Les Familles de Mots",
      content: `<strong>Famille de mots :</strong> mots formés à partir d'un même radical<br><br><strong>Exemple famille TERRE :</strong><br>terre, terrestre, terrain, terrasse, terrier, enterrer, déterrer, atterrir<br><br><strong>Formation :</strong> radical + préfixe et/ou suffixe<br>Préfixes : dé-, re-, pré-, in-...<br>Suffixes : -tion, -eur, -age, -ment...`,
      example: "Famille de CHANT : chant, chanter, chanson, chanteur, chantonner, enchanter"
    },
    exercises: [
      { id: 1, type: "identification", difficulty: "facile", question: "Quel est le radical de : chanter, chanteur, chanson ?", answer: "chant", hint: "Partie commune à tous les mots", explanation: "Chant (radical commun)" },
      { id: 2, type: "production", difficulty: "facile", question: "Trouve un mot de la famille de DENT", answer: "dentiste|dentaire|dentition|denture", hint: "Métier, adjectif...", explanation: "Dentiste, dentaire, dentition... (famille de dent)" },
      { id: 3, type: "identification", difficulty: "moyen", question: "Intrus dans : jardin, jardiner, jardinier, jardinage, jarre", answer: "jarre", hint: "Lequel n'a pas le radical 'jardin' ?", explanation: "Jarre (pas de la famille de jardin)" },
      { id: 4, type: "production", difficulty: "moyen", question: "Forme un mot avec le préfixe RE- et FAIRE", answer: "refaire", hint: "Faire à nouveau = re + faire", explanation: "Refaire (préfixe re- = à nouveau)" },
      { id: 5, type: "production", difficulty: "difficile", question: "Trouve 2 mots de la famille de LAIT", answer: "laitier|laiterie|laitage|laiteux", hint: "Métier, lieu, produit...", explanation: "Laitier, laiterie, laitage, laiteux (famille de lait)" },
      { id: 6, type: "transformation", difficulty: "difficile", question: "Forme le nom à partir du verbe COURIR", answer: "course|coureur", hint: "L'action de courir = la ___", explanation: "Course ou coureur (noms de la famille de courir)" }
    ]
  },

  // ========================================
  // LEÇON 15 : SYNONYMES ET ANTONYMES
  // ========================================
  {
    id: 15,
    title: "Synonymes et Antonymes",
    icon: "↔️",
    difficulty: "facile",
    xpReward: 30,
    theory: {
      title: "Synonymes et Antonymes",
      content: `<strong>Synonymes :</strong> mots de sens proche<br>Exemple : maison = habitation, demeure, logement<br><br><strong>Antonymes :</strong> mots de sens contraire<br>Exemple : grand ↔ petit, monter ↔ descendre<br><br><strong>Astuce antonymes :</strong> souvent formés avec préfixes dé-, in-, mal-<br>Faire ↔ défaire / Heureux ↔ malheureux`,
      example: "Synonymes : <em>content = joyeux = heureux</em><br>Antonymes : <em>grand ↔ petit</em>"
    },
    exercises: [
      { id: 1, type: "identification", difficulty: "facile", question: "Synonyme de CONTENT ?", answer: "joyeux|heureux|gai", hint: "Mot de même sens", explanation: "Joyeux, heureux, gai (même sens que content)" },
      { id: 2, type: "identification", difficulty: "facile", question: "Antonyme de GRAND ?", answer: "petit", hint: "Contraire de grand", explanation: "Petit (contraire de grand)" },
      { id: 3, type: "identification", difficulty: "moyen", question: "Synonyme de MAISON ?", answer: "habitation|demeure|logement", hint: "Autre mot pour dire maison", explanation: "Habitation, demeure, logement (synonymes de maison)" },
      { id: 4, type: "production", difficulty: "moyen", question: "Antonyme de MONTER ?", answer: "descendre", hint: "Contraire de monter", explanation: "Descendre (action opposée à monter)" },
      { id: 5, type: "production", difficulty: "difficile", question: "Forme l'antonyme de FAIRE avec un préfixe", answer: "défaire", hint: "Préfixe dé- = contraire", explanation: "Défaire (dé- indique l'action inverse)" },
      { id: 6, type: "identification", difficulty: "difficile", question: "Synonyme de COMMENCER dans : 'Il commence son travail' ?", answer: "débuter|entamer", hint: "Autre verbe pour dire commencer", explanation: "Débuter, entamer (synonymes de commencer)" },
      { id: 7, type: "contextualized", difficulty: "difficile", question: "Remplace TRISTE par un synonyme : 'Elle est triste.'", answer: "malheureuse|chagrinée|affligée", hint: "Sentiment de tristesse", explanation: "Malheureuse, chagrinée, affligée (synonymes de triste)" }
    ]
  }
];

// ========================================
// PARTIE 2 : APPLICATION FRANCAIS
// ========================================

class FrancaisApp {
  constructor() {
    this.lessons = FRENCH_LESSONS;
    this.currentLesson = null;
    this.currentExerciseIndex = 0;
    this.score = 0;
    this.hearts = 5;
    this.xp = 0;
    this.streak = this.loadStreak();
    this.correctAnswers = 0;
    
    this.init();
  }
  
  init() {
    this.updateStats();
    this.displayLessons();
    this.checkStreak();
  }
  
  loadStreak() {
    const data = JSON.parse(localStorage.getItem('francais_streak') || '{"count": 0, "lastDate": null}');
    return data;
  }
  
  saveStreak() {
    localStorage.setItem('francais_streak', JSON.stringify(this.streak));
  }
  
  checkStreak() {
    const today = new Date().toDateString();
    if (this.streak.lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (this.streak.lastDate !== yesterday) {
        this.streak.count = 0;
      }
    }
  }
  
  updateStreak() {
    const today = new Date().toDateString();
    if (this.streak.lastDate !== today) {
      this.streak.count++;
      this.streak.lastDate = today;
      this.saveStreak();
      this.updateStats();
    }
  }
  
  updateStats() {
    document.getElementById('streak-display').textContent = `🔥 ${this.streak.count} jours`;
    document.getElementById('hearts-display').textContent = '❤️'.repeat(this.hearts);
    document.getElementById('xp-display').textContent = `${this.xp} XP`;
  }
  
  displayLessons() {
    const grid = document.getElementById('lessons-grid');
    grid.innerHTML = '';
    
    this.lessons.forEach(lesson => {
      const card = document.createElement('div');
      card.className = 'lesson-card';
      card.innerHTML = `
        <div class="lesson-icon">${lesson.icon}</div>
        <div class="lesson-title">${lesson.title}</div>
        <div class="lesson-difficulty">${lesson.difficulty}</div>
        <div class="lesson-xp">+${lesson.xpReward} XP</div>
      `;
      card.onclick = () => this.startLesson(lesson);
      grid.appendChild(card);
    });
  }
  
  startLesson(lesson) {
    this.currentLesson = lesson;
    this.currentExerciseIndex = 0;
    this.correctAnswers = 0;
    this.hearts = 5;
    
    document.getElementById('lessons-list').style.display = 'none';
    document.getElementById('lesson-screen').style.display = 'block';
    document.getElementById('exercise-screen').style.display = 'block';
    document.getElementById('results-screen').style.display = 'none';
    
    this.showTheory();
  }
  
  showTheory() {
    const questionText = document.getElementById('question-text');
    questionText.innerHTML = `
      <div style="background: #f1faee; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
        <h3 style="color: #2a9d8f; margin-bottom: 1rem;">${this.currentLesson.theory.title}</h3>
        <div style="line-height: 1.6;">${this.currentLesson.theory.content}</div>
        <div style="margin-top: 1rem; font-style: italic; color: #666;">${this.currentLesson.theory.example}</div>
      </div>
      <button class="btn btn-primary" onclick="francaisApp.startExercises()" style="width: 100%; margin-top: 1rem;">
        Commencer les exercices →
      </button>
    `;
    
    document.getElementById('answer-input').style.display = 'none';
    document.getElementById('hint-area').style.display = 'none';
    document.querySelector('.button-area').style.display = 'none';
  }
  
  startExercises() {
    document.getElementById('answer-input').style.display = 'block';
    document.querySelector('.button-area').style.display = 'flex';
    this.showExercise();
  }
  
  showExercise() {
    if (this.currentExerciseIndex >= this.currentLesson.exercises.length) {
      this.showResults();
      return;
    }
    
    const exercise = this.currentLesson.exercises[this.currentExerciseIndex];
    const progress = ((this.currentExerciseIndex + 1) / this.currentLesson.exercises.length) * 100;
    
    document.getElementById('progress-fill').style.width = progress + '%';
    document.getElementById('question-text').textContent = exercise.question;
    document.getElementById('answer-input').value = '';
    document.getElementById('hint-area').innerHTML = '';
    document.getElementById('hearts-exercise').textContent = '❤️'.repeat(this.hearts);
    document.getElementById('answer-input').focus();
  }
  
  showHint() {
    const exercise = this.currentLesson.exercises[this.currentExerciseIndex];
    const hintArea = document.getElementById('hint-area');
    hintArea.innerHTML = `<div style="background: #fff3cd; padding: 1rem; border-radius: 8px; margin-top: 1rem;">💡 ${exercise.hint}</div>`;
  }
  
  normalizeText(text) {
    // Normaliser : minuscules, sans accents, sans espaces multiples
    return text
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Enlever accents
      .replace(/\s+/g, ' ') // Espaces multiples → simple
      .trim();
  }
  
  checkAnswer() {
    const exercise = this.currentLesson.exercises[this.currentExerciseIndex];
    const rawInput = document.getElementById('answer-input').value;
    const userAnswer = this.normalizeText(rawInput);
    
    // Vérifier si le champ est vide
    if (!userAnswer) {
      this.showFeedback(false, "⚠️ Écris ta réponse d'abord !");
      return;
    }
    
    const correctAnswers = exercise.answer.toLowerCase().split('|').map(ans => this.normalizeText(ans));
    
    const isCorrect = correctAnswers.some(ans => userAnswer === ans);
    
    if (isCorrect) {
      this.showFeedback(true, exercise.explanation);
      this.correctAnswers++;
      this.score += 10;
      setTimeout(() => {
        this.currentExerciseIndex++;
        this.showExercise();
      }, 2000);
    } else {
      this.hearts--;
      this.updateStats();
      document.getElementById('hearts-exercise').textContent = '❤️'.repeat(this.hearts);
      
      if (this.hearts <= 0) {
        this.showFeedback(false, "💔 Plus de cœurs ! Fin de la leçon.", true);
        setTimeout(() => this.showResults(), 2000);
      } else {
        this.showFeedback(false, `La bonne réponse était : <strong>${correctAnswers[0]}</strong><br><br>${exercise.explanation}`);
      }
    }
  }
  
  showFeedback(correct, explanation, isGameOver = false) {
    // Supprimer ancienne popup si existe
    const oldPopup = document.getElementById('custom-feedback-popup');
    if (oldPopup) oldPopup.remove();
    
    // Créer nouvelle popup
    const popup = document.createElement('div');
    popup.id = 'custom-feedback-popup';
    popup.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999999;
      animation: fadeIn 0.3s ease;
    `;
    
    const emoji = correct ? '🎉' : (isGameOver ? '💔' : '❌');
    const title = correct ? 'Excellent !' : (isGameOver ? 'Fin de la leçon' : 'Pas tout à fait...');
    const bgColor = correct ? 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' : 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)';
    const titleColor = correct ? '#2a9d8f' : '#e76f51';
    
    popup.innerHTML = `
      <div style="
        background: ${bgColor};
        padding: 3rem 2rem;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        text-align: center;
        max-width: 500px;
        width: 90%;
        animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      ">
        <div style="font-size: 5rem; margin-bottom: 1rem; animation: bounce 0.6s ease;">${emoji}</div>
        <div style="
          font-family: 'Press Start 2P', Arial, sans-serif;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: ${titleColor};
          font-weight: bold;
          line-height: 1.4;
        ">${title}</div>
        <div style="
          font-family: Arial, sans-serif;
          font-size: 1.1rem;
          line-height: 1.6;
          color: #333;
        ">${explanation}</div>
      </div>
    `;
    
    // Ajouter animations CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes scaleIn {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
    `;
    document.head.appendChild(style);
    
    // Ajouter au body
    document.body.appendChild(popup);
    
    // Fermeture automatique
    setTimeout(() => {
      popup.style.animation = 'fadeIn 0.3s ease reverse';
      setTimeout(() => popup.remove(), 300);
    }, correct ? 2000 : 3000);
  }
  
  showResults() {
    this.updateStreak();
    
    const earnedXP = Math.round((this.correctAnswers / this.currentLesson.exercises.length) * this.currentLesson.xpReward);
    this.xp += earnedXP;
    this.updateStats();
    
    const percentage = Math.round((this.correctAnswers / this.currentLesson.exercises.length) * 100);
    
    document.getElementById('exercise-screen').style.display = 'none';
    document.getElementById('results-screen').style.display = 'block';
    
    document.getElementById('result-correct').textContent = this.correctAnswers;
    document.getElementById('result-xp').textContent = earnedXP;
    document.getElementById('result-hearts').textContent = this.hearts;
    document.getElementById('result-score').textContent = percentage + '%';
  }
  
  backToLessons() {
    document.getElementById('lesson-screen').style.display = 'none';
    document.getElementById('lessons-list').style.display = 'block';
    this.currentLesson = null;
  }
}

// ========================================
// INITIALISATION
// ========================================

let francaisApp;

document.addEventListener('DOMContentLoaded', () => {
  francaisApp = new FrancaisApp();
  
  // Gérer la touche Entrée pour soumettre
  document.getElementById('answer-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      francaisApp.checkAnswer();
    }
  });
});
