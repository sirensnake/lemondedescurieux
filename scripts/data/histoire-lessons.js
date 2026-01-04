/**
 * ==========================================
 * DONNÉES LEÇONS HISTOIRE CM1-CM2
 * Le Monde des Curieux
 * ==========================================
 * 15 leçons chronologiques avec contextes historiques
 */

const histoireLessons = [
    // ========================================
    // LEÇON 1 : PRÉHISTOIRE - PALÉOLITHIQUE
    // ========================================
    {
        id: 'histoire-01-paleolithique',
        title: 'Préhistoire : Paléolithique',
        emoji: '🦴',
        xp: 45,
        difficulty: 'facile',
        context: 'Le Paléolithique (pierre ancienne) s\'étend de -3 millions d\'années à -10 000 ans. Les hommes sont nomades, chasseurs-cueilleurs, et découvrent le feu.',
        contextIcon: '🔥',
        exercises: [
            { question: 'Comment appelle-t-on les hommes du Paléolithique ?', answer: 'nomades', hint: 'NOMADES (ils se déplacent pour suivre les troupeaux)' },
            { question: 'Quelle grande découverte du Paléolithique change la vie des hommes ?', answer: 'le feu', hint: 'LE FEU (vers -400 000 ans, pour se chauffer et cuire)' },
            { question: 'Comment s\'appelle l\'homme préhistorique le plus connu ?', answer: 'homo sapiens', hint: 'HOMO SAPIENS (notre ancêtre direct, "homme sage")' },
            { question: 'Où vivaient les hommes du Paléolithique ?', answer: 'dans des grottes', hint: 'DANS DES GROTTES (ou des abris naturels)' },
            { question: 'Comment se nourrissaient-ils principalement ?', answer: 'chasse et cueillette', hint: 'CHASSE ET CUEILLETTE (animaux et plantes sauvages)' },
            { question: 'Quel célèbre site préhistorique français a des peintures ?', answer: 'lascaux', hint: 'LASCAUX (grottes ornées de peintures rupestres)' },
            { question: 'En quelle matière fabriquaient-ils leurs outils ?', answer: 'pierre', hint: 'PIERRE (silex taillé pour couper et gratter)' }
        ]
    },

    // ========================================
    // LEÇON 2 : PRÉHISTOIRE - NÉOLITHIQUE
    // ========================================
    {
        id: 'histoire-02-neolithique',
        title: 'Préhistoire : Néolithique',
        emoji: '🌾',
        xp: 45,
        difficulty: 'facile',
        context: 'Le Néolithique (pierre nouvelle) débute vers -10 000 ans. Les hommes deviennent sédentaires grâce à l\'agriculture et l\'élevage.',
        contextIcon: '🏡',
        exercises: [
            { question: 'Comment appelle-t-on les hommes du Néolithique ?', answer: 'sédentaires', hint: 'SÉDENTAIRES (ils restent au même endroit)' },
            { question: 'Quelle révolution marque le début du Néolithique ?', answer: 'agriculture', hint: 'AGRICULTURE (cultiver des plantes)' },
            { question: 'Que font les hommes avec les animaux au Néolithique ?', answer: 'élevage', hint: 'ÉLEVAGE (domestication des animaux)' },
            { question: 'Comment s\'appellent les grandes pierres dressées ?', answer: 'menhirs', hint: 'MENHIRS (grosses pierres verticales)' },
            { question: 'Comment s\'appelle un cercle de pierres ?', answer: 'cromlech', hint: 'CROMLECH (ou dolmen pour table de pierre)' },
            { question: 'En quoi sont fabriqués les premiers récipients ?', answer: 'terre cuite', hint: 'TERRE CUITE (poterie, céramique)' },
            { question: 'Quelle activité artisanale se développe ?', answer: 'tissage', hint: 'TISSAGE (fabrication de tissus avec le lin)' }
        ]
    },

    // ========================================
    // LEÇON 3 : ANTIQUITÉ ÉGYPTIENNE
    // ========================================
    {
        id: 'histoire-03-egypte',
        title: 'Antiquité : Égypte',
        emoji: '🐫',
        xp: 50,
        difficulty: 'moyen',
        context: 'La civilisation égyptienne s\'épanouit de -3000 à -30 av. J-C le long du Nil. Les pharaons règnent et construisent des pyramides gigantesques.',
        contextIcon: '🔺',
        exercises: [
            { question: 'Comment s\'appelle le roi d\'Égypte ?', answer: 'pharaon', hint: 'PHARAON (chef politique et religieux)' },
            { question: 'Quel fleuve traverse l\'Égypte ?', answer: 'le nil', hint: 'LE NIL (fleuve vital pour l\'agriculture)' },
            { question: 'Comment s\'appellent les tombeaux des pharaons ?', answer: 'pyramides', hint: 'PYRAMIDES (ou mastabas pour les nobles)' },
            { question: 'Quel pharaon célèbre a une tombe intacte découverte ?', answer: 'toutankhamon', hint: 'TOUTÂNKHAMON (tombe découverte en 1922)' },
            { question: 'Comment s\'appelle l\'écriture égyptienne ?', answer: 'hiéroglyphes', hint: 'HIÉROGLYPHES (écriture sacrée avec symboles)' },
            { question: 'Comment préparait-on les morts pour l\'au-delà ?', answer: 'momification', hint: 'MOMIFICATION (conservation du corps)' },
            { question: 'Quel monument mi-homme mi-lion garde les pyramides ?', answer: 'sphinx', hint: 'SPHINX de Gizeh (lion à tête humaine)' }
        ]
    },

    // ========================================
    // LEÇON 4 : GRÈCE ANTIQUE
    // ========================================
    {
        id: 'histoire-04-grece',
        title: 'Antiquité : Grèce',
        emoji: '🏛️',
        xp: 50,
        difficulty: 'moyen',
        context: 'La Grèce antique (-800 à -146) invente la démocratie, les Jeux Olympiques et développe philosophie, théâtre et sciences.',
        contextIcon: '⚡',
        exercises: [
            { question: 'Quelle cité invente la démocratie ?', answer: 'athènes', hint: 'ATHÈNES (démocratie = pouvoir du peuple)' },
            { question: 'Où se déroulent les premiers Jeux Olympiques ?', answer: 'olympie', hint: 'OLYMPIE (tous les 4 ans, en l\'honneur de Zeus)' },
            { question: 'Comment s\'appelle le temple principal d\'Athènes ?', answer: 'parthénon', hint: 'PARTHÉNON (temple dédié à Athéna)' },
            { question: 'Quel philosophe célèbre boit la ciguë ?', answer: 'socrate', hint: 'SOCRATE (condamné à mort, maître de Platon)' },
            { question: 'Quel héros combat le Minotaure ?', answer: 'thésée', hint: 'THÉSÉE (dans le labyrinthe de Crète)' },
            { question: 'Quelle cité est connue pour ses guerriers ?', answer: 'sparte', hint: 'SPARTE (éducation militaire stricte)' },
            { question: 'Comment s\'appelle le dieu des dieux grecs ?', answer: 'zeus', hint: 'ZEUS (roi de l\'Olympe, dieu de la foudre)' }
        ]
    },

    // ========================================
    // LEÇON 5 : EMPIRE ROMAIN
    // ========================================
    {
        id: 'histoire-05-rome',
        title: 'Antiquité : Rome',
        emoji: '🏺',
        xp: 55,
        difficulty: 'moyen',
        context: 'L\'Empire romain domine le bassin méditerranéen de -27 av. J-C à 476 ap. J-C. Rome construit routes, aqueducs et diffuse sa culture.',
        contextIcon: '🦅',
        exercises: [
            { question: 'Qui est le premier empereur romain ?', answer: 'auguste', hint: 'AUGUSTE (neveu de César, 27 av. J-C)' },
            { question: 'Comment s\'appelle la région dominée par Rome ?', answer: 'empire', hint: 'EMPIRE (autour de la Méditerranée)' },
            { question: 'Où se battaient les gladiateurs ?', answer: 'colisée', hint: 'COLISÉE (ou amphithéâtre)' },
            { question: 'Comment s\'appellent les conquérants de territoires ?', answer: 'légions', hint: 'LÉGIONS (armée romaine organisée)' },
            { question: 'Quelle construction permet d\'amener l\'eau ?', answer: 'aqueduc', hint: 'AQUEDUC (pont pour transporter l\'eau)' },
            { question: 'Comment s\'appelle la place publique romaine ?', answer: 'forum', hint: 'FORUM (centre politique et commercial)' },
            { question: 'Quel général célèbre conquiert la Gaule ?', answer: 'jules césar', hint: 'JULES CÉSAR (de -58 à -51)' },
            { question: 'Quelle langue parlaient les Romains ?', answer: 'latin', hint: 'LATIN (origine des langues romanes)' }
        ]
    },

    // ========================================
    // LEÇON 6 : MOYEN ÂGE - CHÂTEAUX FORTS
    // ========================================
    {
        id: 'histoire-06-chateaux',
        title: 'Moyen Âge : Châteaux Forts',
        emoji: '🏰',
        xp: 50,
        difficulty: 'moyen',
        context: 'Le Moyen Âge s\'étend de 476 à 1492. Les seigneurs construisent des châteaux forts pour se protéger et contrôler leurs terres.',
        contextIcon: '⚔️',
        exercises: [
            { question: 'Comment s\'appelle la tour principale du château ?', answer: 'donjon', hint: 'DONJON (tour la plus haute et fortifiée)' },
            { question: 'Comment s\'appelle le fossé autour du château ?', answer: 'douves', hint: 'DOUVES (remplies d\'eau pour la défense)' },
            { question: 'Quel pont mobile permet de franchir les douves ?', answer: 'pont-levis', hint: 'PONT-LEVIS (se lève et se baisse)' },
            { question: 'Comment s\'appellent les ouvertures pour tirer des flèches ?', answer: 'meurtrières', hint: 'MEURTRIÈRES (fentes étroites)' },
            { question: 'Qui vit dans le château avec le seigneur ?', answer: 'chevaliers', hint: 'CHEVALIERS (guerriers à cheval)' },
            { question: 'Comment s\'appelle la cérémonie pour devenir chevalier ?', answer: 'adoubement', hint: 'ADOUBEMENT (rituel sacré)' },
            { question: 'Quelle pièce sert aux banquets ?', answer: 'salle des fêtes', hint: 'SALLE DES FÊTES (ou grande salle)' }
        ]
    },

    // ========================================
    // LEÇON 7 : MOYEN ÂGE - ROIS DE FRANCE
    // ========================================
    {
        id: 'histoire-07-rois',
        title: 'Moyen Âge : Rois de France',
        emoji: '👑',
        xp: 55,
        difficulty: 'moyen',
        context: 'Les Capétiens règnent sur la France de 987 à 1328. Les rois renforcent progressivement leur pouvoir face aux seigneurs.',
        contextIcon: '⚜️',
        exercises: [
            { question: 'Quel roi fonde la dynastie des Capétiens en 987 ?', answer: 'hugues capet', hint: 'HUGUES CAPET (élu roi de France)' },
            { question: 'Quel roi part en croisade et meurt à Tunis ?', answer: 'saint louis', hint: 'SAINT LOUIS (Louis IX, roi pieux)' },
            { question: 'Sous quel arbre rendait-il la justice ?', answer: 'chêne', hint: 'CHÊNE (à Vincennes)' },
            { question: 'Quel roi agrandit beaucoup le royaume ?', answer: 'philippe auguste', hint: 'PHILIPPE AUGUSTE (victoire de Bouvines 1214)' },
            { question: 'Comment s\'appelle la guerre de religion du Moyen Âge ?', answer: 'croisades', hint: 'CROISADES (expéditions en Terre Sainte)' },
            { question: 'Dans quelle ville les rois se font sacrer ?', answer: 'reims', hint: 'REIMS (cathédrale du sacre)' },
            { question: 'Quelle héroïne aide Charles VII à être sacré ?', answer: 'jeanne d\'arc', hint: 'JEANNE D\'ARC (libère Orléans en 1429)' }
        ]
    },

    // ========================================
    // LEÇON 8 : RENAISSANCE
    // ========================================
    {
        id: 'histoire-08-renaissance',
        title: 'Renaissance',
        emoji: '🎨',
        xp: 50,
        difficulty: 'moyen',
        context: 'La Renaissance (XVe-XVIe siècles) voit renaître les arts, les sciences et l\'humanisme. Les artistes italiens rayonnent en Europe.',
        contextIcon: '🖼️',
        exercises: [
            { question: 'Quel peintre italien peint la Joconde ?', answer: 'léonard de vinci', hint: 'LÉONARD DE VINCI (génie universel)' },
            { question: 'Quel roi invite Léonard en France ?', answer: 'françois premier', hint: 'FRANÇOIS Ier (roi de 1515 à 1547)' },
            { question: 'Quel château de la Loire François Ier fait-il construire ?', answer: 'chambord', hint: 'CHAMBORD (chef-d\'œuvre architectural)' },
            { question: 'Quelle invention de Gutenberg révolutionne les livres ?', answer: 'imprimerie', hint: 'IMPRIMERIE (vers 1450, caractères mobiles)' },
            { question: 'Quel navigateur découvre l\'Amérique en 1492 ?', answer: 'christophe colomb', hint: 'CHRISTOPHE COLOMB (cherchait les Indes)' },
            { question: 'Quel artiste peint la chapelle Sixtine ?', answer: 'michel-ange', hint: 'MICHEL-ANGE (plafond et Jugement dernier)' },
            { question: 'Dans quel pays la Renaissance débute-t-elle ?', answer: 'italie', hint: 'ITALIE (Florence, Rome, Venise)' }
        ]
    },

    // ========================================
    // LEÇON 9 : RÉVOLUTION FRANÇAISE
    // ========================================
    {
        id: 'histoire-09-revolution',
        title: 'Révolution Française',
        emoji: '⚖️',
        xp: 60,
        difficulty: 'difficile',
        context: 'La Révolution française (1789-1799) renverse la monarchie absolue. Le peuple prend le pouvoir et proclame les droits de l\'homme.',
        contextIcon: '🗽',
        exercises: [
            { question: 'En quelle année commence la Révolution française ?', answer: '1789', hint: '1789 (prise de la Bastille le 14 juillet)' },
            { question: 'Quelle prison parisienne est prise le 14 juillet ?', answer: 'bastille', hint: 'BASTILLE (symbole de l\'absolutisme royal)' },
            { question: 'Quel roi est guillotiné en 1793 ?', answer: 'louis xvi', hint: 'LOUIS XVI (roi de France)' },
            { question: 'Comment s\'appelle la devise de la République ?', answer: 'liberté égalité fraternité', hint: 'LIBERTÉ, ÉGALITÉ, FRATERNITÉ' },
            { question: 'Quel document proclame les droits de l\'homme ?', answer: 'déclaration des droits de l\'homme', hint: 'DÉCLARATION DES DROITS DE L\'HOMME (août 1789)' },
            { question: 'Comment s\'appelle la période de terreur ?', answer: 'terreur', hint: 'TERREUR (1793-1794, Robespierre)' },
            { question: 'Quelle chanson devient l\'hymne français ?', answer: 'marseillaise', hint: 'MARSEILLAISE (composée en 1792)' }
        ]
    },

    // ========================================
    // LEÇON 10 : NAPOLÉON
    // ========================================
    {
        id: 'histoire-10-napoleon',
        title: 'Napoléon Bonaparte',
        emoji: '🦅',
        xp: 55,
        difficulty: 'moyen',
        context: 'Napoléon Bonaparte (1769-1821) devient empereur en 1804. Il conquiert l\'Europe mais finit exilé après Waterloo en 1815.',
        contextIcon: '👨‍✈️',
        exercises: [
            { question: 'En quelle année Napoléon devient-il empereur ?', answer: '1804', hint: '1804 (sacre à Notre-Dame de Paris)' },
            { question: 'Sur quelle île Napoléon naît-il ?', answer: 'corse', hint: 'CORSE (Ajaccio, 1769)' },
            { question: 'Quelle bataille importante gagne-t-il en 1805 ?', answer: 'austerlitz', hint: 'AUSTERLITZ (victoire éclatante)' },
            { question: 'Quelle dernière bataille perd-il en 1815 ?', answer: 'waterloo', hint: 'WATERLOO (Belgique, défaite finale)' },
            { question: 'Sur quelle île est-il exilé après Waterloo ?', answer: 'sainte-hélène', hint: 'SAINTE-HÉLÈNE (Atlantique Sud, où il meurt)' },
            { question: 'Quel code de lois écrit-il ?', answer: 'code civil', hint: 'CODE CIVIL (ou Code Napoléon, 1804)' },
            { question: 'Où ses cendres reposent-elles à Paris ?', answer: 'invalides', hint: 'INVALIDES (tombeau sous le dôme)' }
        ]
    },

    // ========================================
    // LEÇON 11 : XIXe SIÈCLE - INDUSTRIALISATION
    // ========================================
    {
        id: 'histoire-11-industrie',
        title: 'XIXe : Industrialisation',
        emoji: '🏭',
        xp: 50,
        difficulty: 'moyen',
        context: 'Le XIXe siècle voit la révolution industrielle transformer l\'économie. Les machines à vapeur révolutionnent transports et production.',
        contextIcon: '🚂',
        exercises: [
            { question: 'Quelle invention permet de faire fonctionner les trains ?', answer: 'machine à vapeur', hint: 'MACHINE À VAPEUR (James Watt)' },
            { question: 'Comment s\'appelle la matière première de l\'industrie ?', answer: 'charbon', hint: 'CHARBON (extrait des mines)' },
            { question: 'Où travaillent les ouvriers dans les usines ?', answer: 'fabriques', hint: 'FABRIQUES (ou manufactures)' },
            { question: 'Quel nouveau moyen de transport sur rails apparaît ?', answer: 'train', hint: 'TRAIN (chemin de fer, locomotives)' },
            { question: 'Comment s\'appelle la tour métallique construite en 1889 ?', answer: 'tour eiffel', hint: 'TOUR EIFFEL (Exposition universelle Paris)' },
            { question: 'Quel inventeur français crée le cinéma ?', answer: 'lumière', hint: 'Frères LUMIÈRE (1895, cinématographe)' },
            { question: 'Quelle énergie commence à remplacer la vapeur ?', answer: 'électricité', hint: 'ÉLECTRICITÉ (fin XIXe siècle)' }
        ]
    },

    // ========================================
    // LEÇON 12 : PREMIÈRE GUERRE MONDIALE
    // ========================================
    {
        id: 'histoire-12-ww1',
        title: 'Première Guerre Mondiale',
        emoji: '🪖',
        xp: 60,
        difficulty: 'difficile',
        context: 'La Grande Guerre (1914-1918) oppose deux alliances d\'empires. C\'est une guerre de tranchées terrible qui fait 10 millions de morts.',
        contextIcon: '🕊️',
        exercises: [
            { question: 'Quelles années dure la Première Guerre mondiale ?', answer: '1914-1918', hint: '1914-1918 (4 ans de conflit)' },
            { question: 'Comment s\'appellent les soldats français ?', answer: 'poilus', hint: 'POILUS (surnom affectueux)' },
            { question: 'Dans quoi se battaient les soldats ?', answer: 'tranchées', hint: 'TRANCHÉES (fossés creusés dans la terre)' },
            { question: 'Quelle grande bataille dure 10 mois en 1916 ?', answer: 'verdun', hint: 'VERDUN (bataille la plus meurtrière)' },
            { question: 'Quel jour férié commémore la fin de la guerre ?', answer: '11 novembre', hint: '11 NOVEMBRE 1918 (armistice)' },
            { question: 'Quel traité de paix est signé en 1919 ?', answer: 'versailles', hint: 'VERSAILLES (traité très dur pour l\'Allemagne)' },
            { question: 'Quel président français négocie la paix ?', answer: 'clemenceau', hint: 'CLEMENCEAU (le Tigre)' }
        ]
    },

    // ========================================
    // LEÇON 13 : SECONDE GUERRE MONDIALE
    // ========================================
    {
        id: 'histoire-13-ww2',
        title: 'Seconde Guerre Mondiale',
        emoji: '✈️',
        xp: 65,
        difficulty: 'difficile',
        context: 'La Seconde Guerre mondiale (1939-1945) est le conflit le plus meurtrier de l\'histoire. L\'Allemagne nazie envahit l\'Europe avant d\'être vaincue.',
        contextIcon: '🎖️',
        exercises: [
            { question: 'Quelles années dure la Seconde Guerre mondiale ?', answer: '1939-1945', hint: '1939-1945 (6 ans de guerre totale)' },
            { question: 'Quel dictateur allemand déclenche la guerre ?', answer: 'hitler', hint: 'HITLER (chef nazi)' },
            { question: 'Quel général appelle à résister depuis Londres ?', answer: 'de gaulle', hint: 'DE GAULLE (appel du 18 juin 1940)' },
            { question: 'Comment s\'appelle le débarquement allié en 1944 ?', answer: 'débarquement', hint: 'DÉBARQUEMENT (6 juin 1944, Normandie)' },
            { question: 'Quel jour férié célèbre la fin de la guerre en Europe ?', answer: '8 mai', hint: '8 MAI 1945 (capitulation allemande)' },
            { question: 'Quelle bombe met fin à la guerre au Japon ?', answer: 'atomique', hint: 'BOMBE ATOMIQUE (Hiroshima, Nagasaki)' },
            { question: 'Quelle organisation internationale est créée après ?', answer: 'onu', hint: 'ONU (Organisation des Nations Unies, 1945)' }
        ]
    },

    // ========================================
    // LEÇON 14 : XXe SIÈCLE - DÉCOLONISATION
    // ========================================
    {
        id: 'histoire-14-decolonisation',
        title: 'XXe : Décolonisation',
        emoji: '🌍',
        xp: 55,
        difficulty: 'moyen',
        context: 'Après 1945, les colonies européennes obtiennent leur indépendance. C\'est la fin des empires coloniaux et l\'émergence du Tiers-Monde.',
        contextIcon: '🗺️',
        exercises: [
            { question: 'Quel grand pays asiatique devient indépendant en 1947 ?', answer: 'inde', hint: 'INDE (indépendance britannique)' },
            { question: 'Qui guide l\'indépendance de l\'Inde pacifiquement ?', answer: 'gandhi', hint: 'GANDHI (résistance non-violente)' },
            { question: 'En quelle année l\'Algérie devient-elle indépendante ?', answer: '1962', hint: '1962 (accords d\'Évian)' },
            { question: 'Quel continent se libère massivement dans les années 60 ?', answer: 'afrique', hint: 'AFRIQUE (années 1960, "année africaine")' },
            { question: 'Comment s\'appelle la séparation USA-URSS ?', answer: 'guerre froide', hint: 'GUERRE FROIDE (1947-1991, sans combat direct)' },
            { question: 'Quel mur symbolise la division de l\'Europe ?', answer: 'mur de berlin', hint: 'MUR DE BERLIN (1961-1989)' },
            { question: 'En quelle année tombe le mur de Berlin ?', answer: '1989', hint: '1989 (réunification Allemagne)' }
        ]
    },

    // ========================================
    // LEÇON 15 : MONUMENTS HISTORIQUES
    // ========================================
    {
        id: 'histoire-15-monuments',
        title: 'Monuments Historiques',
        emoji: '🗿',
        xp: 100,
        difficulty: 'moyen',
        context: 'Les monuments historiques français témoignent de siècles d\'histoire. Chaque époque a laissé ses chefs-d\'œuvre architecturaux.',
        contextIcon: '🏛️',
        exercises: [
            { question: 'Quel monument parisien est une cathédrale gothique ?', answer: 'notre-dame', hint: 'NOTRE-DAME de Paris (XIIe-XIIIe siècle)' },
            { question: 'Où se trouve le palais des rois de France ?', answer: 'versailles', hint: 'VERSAILLES (château de Louis XIV)' },
            { question: 'Quel arc célèbre est sur les Champs-Élysées ?', answer: 'arc de triomphe', hint: 'ARC DE TRIOMPHE (Napoléon, 1836)' },
            { question: 'Quel pont médiéval est à Avignon ?', answer: 'pont d\'avignon', hint: 'PONT D\'AVIGNON (Saint-Bénézet)' },
            { question: 'Quel célèbre château est dans la Loire ?', answer: 'chambord', hint: 'CHAMBORD (François Ier, Renaissance)' },
            { question: 'Quel monument romain est à Nîmes ?', answer: 'arènes', hint: 'ARÈNES (amphithéâtre romain)' },
            { question: 'Quel château abrite la galerie des Glaces ?', answer: 'versailles', hint: 'VERSAILLES (chef-d\'œuvre du classicisme)' },
            { question: 'Quelle abbaye est sur un rocher en Normandie ?', answer: 'mont-saint-michel', hint: 'MONT-SAINT-MICHEL (merveille de l\'Occident)' },
            { question: 'Où les rois de France sont-ils enterrés ?', answer: 'saint-denis', hint: 'SAINT-DENIS (basilique nécropole)' },
            { question: 'Quel musée parisien était un palais royal ?', answer: 'louvre', hint: 'LOUVRE (forteresse puis palais)' }
        ]
    }
];

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = histoireLessons;
}

console.log('✅ Données Histoire chargées : ' + histoireLessons.length + ' leçons');