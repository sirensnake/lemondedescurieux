/**
 * ==========================================
 * DONNÉES LEÇONS MATHÉMATIQUES CM1-CM2
 * Le Monde des Curieux
 * ==========================================
 * 15 leçons progressives avec hints pédagogiques
 */

const mathsLessons = [
    // ========================================
    // LEÇON 1 : TABLES DE MULTIPLICATION
    // ========================================
    {
        id: 'maths-01-multiplications',
        title: 'Tables de Multiplication',
        emoji: '✖️',
        xp: 50,
        difficulty: 'facile',
        exercises: [
            { question: '7 × 8 = ?', answer: '56', hint: 'Astuce : 7 × 8 = (7 × 10) - (7 × 2) = 70 - 14 = 56' },
            { question: '9 × 6 = ?', answer: '54', hint: 'Pense à 9 × 6 = (10 × 6) - 6 = 60 - 6 = 54' },
            { question: '8 × 7 = ?', answer: '56', hint: 'C\'est la même que 7 × 8 ! La multiplication est commutative.' },
            { question: '6 × 9 = ?', answer: '54', hint: 'Compte par 6 : 6, 12, 18, 24, 30, 36, 42, 48, 54' },
            { question: '12 × 5 = ?', answer: '60', hint: '12 × 5 = (10 × 5) + (2 × 5) = 50 + 10 = 60' },
            { question: '8 × 9 = ?', answer: '72', hint: '8 × 9 = (8 × 10) - 8 = 80 - 8 = 72' },
            { question: '7 × 6 = ?', answer: '42', hint: 'Astuce : 7 × 6 = 7 × (5 + 1) = 35 + 7 = 42' },
            { question: '11 × 9 = ?', answer: '99', hint: '11 × 9 = (10 × 9) + 9 = 90 + 9 = 99' }
        ]
    },

    // ========================================
    // LEÇON 2 : ADDITIONS À 3 CHIFFRES
    // ========================================
    {
        id: 'maths-02-additions',
        title: 'Additions à 3 Chiffres',
        emoji: '➕',
        xp: 45,
        difficulty: 'facile',
        exercises: [
            { question: '346 + 227 = ?', answer: '573', hint: 'Commence par les unités : 6 + 7 = 13 (pose 3, retenue 1)' },
            { question: '489 + 365 = ?', answer: '854', hint: 'Attention aux retenues : 9 + 5 = 14, 8 + 6 + 1 = 15' },
            { question: '572 + 149 = ?', answer: '721', hint: 'Astuce : 572 + 150 - 1 = 722 - 1 = 721' },
            { question: '638 + 284 = ?', answer: '922', hint: 'Décompose : 638 + 200 = 838, puis + 84 = 922' },
            { question: '795 + 468 = ?', answer: '1263', hint: 'N\'oublie pas : le résultat peut dépasser 1000 !' },
            { question: '523 + 399 = ?', answer: '922', hint: 'Arrondis : 523 + 400 = 923, puis - 1 = 922' },
            { question: '814 + 697 = ?', answer: '1511', hint: 'Pense : 814 + 700 = 1514, puis - 3 = 1511' }
        ]
    },

    // ========================================
    // LEÇON 3 : SOUSTRACTIONS AVEC RETENUES
    // ========================================
    {
        id: 'maths-03-soustractions',
        title: 'Soustractions Complexes',
        emoji: '➖',
        xp: 50,
        difficulty: 'moyen',
        exercises: [
            { question: '534 - 278 = ?', answer: '256', hint: 'Emprunte à la dizaine : 534 devient 4 14 - 8, puis 2 13 - 7' },
            { question: '802 - 456 = ?', answer: '346', hint: 'Astuce : 802 - 400 = 402, puis 402 - 56 = 346' },
            { question: '623 - 387 = ?', answer: '236', hint: 'Méthode : soustrais 400, puis ajoute 13 → 223 + 13 = 236' },
            { question: '710 - 543 = ?', answer: '167', hint: 'Décompose : 710 - 500 = 210, puis 210 - 43 = 167' },
            { question: '905 - 678 = ?', answer: '227', hint: 'Pense : 905 - 700 = 205, puis 205 + 22 = 227' },
            { question: '1000 - 763 = ?', answer: '237', hint: 'Compte à rebours : 763 + 237 = 1000' },
            { question: '841 - 596 = ?', answer: '245', hint: 'Arrondis : 841 - 600 = 241, puis + 4 = 245' }
        ]
    },

    // ========================================
    // LEÇON 4 : FRACTIONS SIMPLES
    // ========================================
    {
        id: 'maths-04-fractions',
        title: 'Introduction aux Fractions',
        emoji: '🍕',
        xp: 60,
        difficulty: 'moyen',
        exercises: [
            { question: 'Combien de quarts dans 1 entier ?', answer: '4', hint: '1 entier = 4/4. Donc 4 quarts = 1 entier.' },
            { question: '1/2 de 8 = ?', answer: '4', hint: 'Divise 8 en 2 parties égales : 8 ÷ 2 = 4' },
            { question: '3/4 de 12 = ?', answer: '9', hint: '1/4 de 12 = 3, donc 3/4 = 3 × 3 = 9' },
            { question: 'Combien de moitiés dans 3 entiers ?', answer: '6', hint: '1 entier = 2 moitiés, donc 3 entiers = 3 × 2 = 6' },
            { question: '1/4 + 1/4 = ?/4', answer: '2', hint: 'Additionne les numérateurs : 1 + 1 = 2. Résultat : 2/4' },
            { question: '2/3 de 9 = ?', answer: '6', hint: '1/3 de 9 = 3, donc 2/3 = 2 × 3 = 6' },
            { question: '1/2 + 1/4 = ?/4', answer: '3', hint: 'Transforme 1/2 en 2/4, puis 2/4 + 1/4 = 3/4' }
        ]
    },

    // ========================================
    // LEÇON 5 : DIVISIONS SIMPLES
    // ========================================
    {
        id: 'maths-05-divisions',
        title: 'Divisions à 1 Chiffre',
        emoji: '➗',
        xp: 55,
        difficulty: 'moyen',
        exercises: [
            { question: '48 ÷ 6 = ?', answer: '8', hint: 'Pense : 6 × ? = 48. C\'est la table de 6 !' },
            { question: '63 ÷ 7 = ?', answer: '9', hint: 'Table de 7 : 7 × 9 = 63' },
            { question: '56 ÷ 8 = ?', answer: '7', hint: 'Rappelle-toi : 8 × 7 = 56' },
            { question: '72 ÷ 9 = ?', answer: '8', hint: 'Vérifie : 9 × 8 = 72' },
            { question: '81 ÷ 9 = ?', answer: '9', hint: 'C\'est un carré parfait : 9 × 9 = 81' },
            { question: '54 ÷ 6 = ?', answer: '9', hint: 'Compte par 6 jusqu\'à 54 : 6, 12, 18... 54' },
            { question: '45 ÷ 5 = ?', answer: '9', hint: 'Table de 5 : 5 × 9 = 45' }
        ]
    },

    // ========================================
    // LEÇON 6 : NOMBRES DÉCIMAUX
    // ========================================
    {
        id: 'maths-06-decimaux',
        title: 'Découverte des Décimaux',
        emoji: '📏',
        xp: 65,
        difficulty: 'moyen',
        exercises: [
            { question: '0,5 + 0,3 = ?', answer: '0,8', hint: 'Additionne après la virgule : 5 + 3 = 8' },
            { question: '1,2 + 0,4 = ?', answer: '1,6', hint: '2 dixièmes + 4 dixièmes = 6 dixièmes' },
            { question: '2,5 - 0,8 = ?', answer: '1,7', hint: 'Emprunte 1 entier : 2,5 = 1,15 puis 15 - 8 = 7' },
            { question: 'Combien de dixièmes dans 1,3 ?', answer: '13', hint: '1,3 = 1 + 0,3 = 10 dixièmes + 3 dixièmes = 13' },
            { question: '0,7 + 0,6 = ?', answer: '1,3', hint: '7 + 6 = 13 dixièmes = 1,3' },
            { question: '3,4 - 1,2 = ?', answer: '2,2', hint: 'Soustrais entiers et dixièmes séparément : 3 - 1 = 2, 4 - 2 = 2' },
            { question: '0,25 × 4 = ?', answer: '1', hint: '0,25 = 1/4, donc 4 × (1/4) = 1' }
        ]
    },

    // ========================================
    // LEÇON 7 : NOMBRES JUSQU'À 1000
    // ========================================
    {
        id: 'maths-07-mille',
        title: 'Compter jusqu\'à 1000',
        emoji: '🔢',
        xp: 40,
        difficulty: 'facile',
        exercises: [
            { question: 'Combien de centaines dans 743 ?', answer: '7', hint: 'Regarde le chiffre des centaines : 7' },
            { question: '500 + 300 = ?', answer: '800', hint: '5 centaines + 3 centaines = 8 centaines' },
            { question: 'Quel nombre suit 999 ?', answer: '1000', hint: 'Après 999 on passe au millier !' },
            { question: 'Combien de dizaines dans 840 ?', answer: '84', hint: '840 = 84 dizaines (ou 840 ÷ 10)' },
            { question: '1000 - 1 = ?', answer: '999', hint: 'Juste avant 1000 c\'est 999' },
            { question: 'Écris en chiffres : sept cent vingt-trois', answer: '723', hint: '7 centaines, 2 dizaines, 3 unités' },
            { question: 'Range du plus petit au plus grand : 567 ou 576 ?', answer: '567', hint: 'Compare les dizaines : 6 < 7, donc 567 < 576' }
        ]
    },

    // ========================================
    // LEÇON 8 : PÉRIMÈTRES
    // ========================================
    {
        id: 'maths-08-perimetres',
        title: 'Calcul de Périmètres',
        emoji: '📐',
        xp: 70,
        difficulty: 'moyen',
        exercises: [
            { question: 'Périmètre d\'un carré de côté 5 cm ?', answer: '20', hint: 'Carré = 4 côtés égaux, donc 5 × 4 = 20 cm' },
            { question: 'Rectangle : longueur 8 cm, largeur 3 cm. Périmètre ?', answer: '22', hint: 'Formule : (L + l) × 2 = (8 + 3) × 2 = 22 cm' },
            { question: 'Carré de côté 7 cm. Périmètre ?', answer: '28', hint: '7 + 7 + 7 + 7 = 28 cm' },
            { question: 'Triangle équilatéral de côté 6 cm. Périmètre ?', answer: '18', hint: 'Équilatéral = 3 côtés égaux, donc 6 × 3 = 18 cm' },
            { question: 'Rectangle : longueur 10 cm, largeur 4 cm. Périmètre ?', answer: '28', hint: '(10 + 4) × 2 = 14 × 2 = 28 cm' },
            { question: 'Carré dont le périmètre est 32 cm. Côté ?', answer: '8', hint: '32 ÷ 4 = 8 cm par côté' },
            { question: 'Hexagone régulier de côté 5 cm. Périmètre ?', answer: '30', hint: '6 côtés égaux : 5 × 6 = 30 cm' }
        ]
    },

    // ========================================
    // LEÇON 9 : MESURES DE LONGUEUR
    // ========================================
    {
        id: 'maths-09-mesures',
        title: 'Conversions de Longueurs',
        emoji: '📏',
        xp: 55,
        difficulty: 'moyen',
        exercises: [
            { question: 'Combien de cm dans 1 mètre ?', answer: '100', hint: '1 m = 100 cm (centi = centième)' },
            { question: '3 m = ? cm', answer: '300', hint: '3 × 100 = 300 cm' },
            { question: '250 cm = ? m', answer: '2,5', hint: '250 ÷ 100 = 2,5 m (ou 2 m 50 cm)' },
            { question: 'Combien de mm dans 1 cm ?', answer: '10', hint: '1 cm = 10 mm (milli = millième)' },
            { question: '5 cm = ? mm', answer: '50', hint: '5 × 10 = 50 mm' },
            { question: '1 km = ? m', answer: '1000', hint: 'Kilo = mille, donc 1 km = 1000 m' },
            { question: '2,5 m = ? cm', answer: '250', hint: '2,5 × 100 = 250 cm' }
        ]
    },

    // ========================================
    // LEÇON 10 : CALCUL MENTAL RAPIDE
    // ========================================
    {
        id: 'maths-10-calcul-mental',
        title: 'Calcul Mental Rapide',
        emoji: '🧠',
        xp: 60,
        difficulty: 'moyen',
        exercises: [
            { question: '25 + 37 = ?', answer: '62', hint: 'Décompose : 25 + 30 = 55, puis + 7 = 62' },
            { question: '50 × 6 = ?', answer: '300', hint: '50 = 5 × 10, donc 5 × 6 × 10 = 300' },
            { question: '88 - 19 = ?', answer: '69', hint: 'Soustrais 20, puis ajoute 1 : 88 - 20 + 1 = 69' },
            { question: '15 × 4 = ?', answer: '60', hint: '15 × 2 = 30, donc 30 × 2 = 60' },
            { question: '99 + 78 = ?', answer: '177', hint: 'Arrondis : 100 + 78 = 178, puis - 1 = 177' },
            { question: '12 × 11 = ?', answer: '132', hint: '12 × 10 = 120, puis + 12 = 132' },
            { question: '64 ÷ 4 = ?', answer: '16', hint: 'Divise par 2 deux fois : 64 ÷ 2 = 32, 32 ÷ 2 = 16' }
        ]
    },

    // ========================================
    // LEÇON 11 : GÉOMÉTRIE DE BASE
    // ========================================
    {
        id: 'maths-11-geometrie',
        title: 'Formes Géométriques',
        emoji: '🔷',
        xp: 50,
        difficulty: 'facile',
        exercises: [
            { question: 'Combien de côtés a un triangle ?', answer: '3', hint: 'Tri = trois en latin' },
            { question: 'Combien d\'angles droits dans un carré ?', answer: '4', hint: 'Un carré a 4 angles de 90°' },
            { question: 'Combien de sommets a un rectangle ?', answer: '4', hint: 'Rectangle = 4 sommets (coins)' },
            { question: 'Combien de côtés a un hexagone ?', answer: '6', hint: 'Hexa = six en grec' },
            { question: 'Une figure à 5 côtés s\'appelle ?', answer: 'pentagone', hint: 'Penta = cinq' },
            { question: 'Combien de côtés égaux dans un triangle équilatéral ?', answer: '3', hint: 'Équilatéral = tous les côtés égaux' },
            { question: 'Combien de diagonales dans un carré ?', answer: '2', hint: 'Relie les coins opposés : 2 diagonales' }
        ]
    },

    // ========================================
    // LEÇON 12 : DURÉES ET HEURES
    // ========================================
    {
        id: 'maths-12-durees',
        title: 'Calculs de Durées',
        emoji: '⏰',
        xp: 65,
        difficulty: 'moyen',
        exercises: [
            { question: 'Combien de minutes dans 1 heure ?', answer: '60', hint: '1 h = 60 min' },
            { question: '2 h 30 min = ? min', answer: '150', hint: '2 × 60 + 30 = 120 + 30 = 150 min' },
            { question: 'De 9h à 11h, combien d\'heures ?', answer: '2', hint: '11 - 9 = 2 heures' },
            { question: '180 min = ? h', answer: '3', hint: '180 ÷ 60 = 3 heures' },
            { question: 'De 14h15 à 15h45, combien de minutes ?', answer: '90', hint: 'De 14h15 à 15h15 = 60 min, puis + 30 = 90 min' },
            { question: 'Combien de secondes dans 1 minute ?', answer: '60', hint: '1 min = 60 secondes' },
            { question: '1 h 15 min + 45 min = ? h', answer: '2', hint: '15 + 45 = 60 min = 1 h, donc 1 h + 1 h = 2 h' }
        ]
    },

    // ========================================
    // LEÇON 13 : GRANDS NOMBRES
    // ========================================
    {
        id: 'maths-13-grands-nombres',
        title: 'Nombres à 4 et 5 Chiffres',
        emoji: '💯',
        xp: 55,
        difficulty: 'moyen',
        exercises: [
            { question: 'Combien de milliers dans 5 347 ?', answer: '5', hint: 'Chiffre des milliers = 5' },
            { question: '10 000 - 1 = ?', answer: '9999', hint: 'Juste avant 10 000 c\'est 9 999' },
            { question: 'Écris en chiffres : douze mille trois cent cinquante', answer: '12350', hint: '12 milliers, 3 centaines, 5 dizaines, 0 unités' },
            { question: '7 000 + 500 + 40 + 3 = ?', answer: '7543', hint: 'Additionne par position : 7 543' },
            { question: 'Quel est le nombre suivant 19 999 ?', answer: '20000', hint: 'Après 19 999 on passe à 20 000' },
            { question: 'Décompose 8 426 : combien de centaines ?', answer: '84', hint: '8 426 = 84 centaines + 26 unités' },
            { question: 'Range du plus petit au plus grand : 9 876 ou 9 867 ?', answer: '9867', hint: 'Compare les dizaines : 6 < 7, donc 9 867 < 9 876' }
        ]
    },

    // ========================================
    // LEÇON 14 : PROPORTIONNALITÉ
    // ========================================
    {
        id: 'maths-14-proportionnel',
        title: 'Situations Proportionnelles',
        emoji: '⚖️',
        xp: 70,
        difficulty: 'difficile',
        exercises: [
            { question: '3 pommes coûtent 6 €. Combien coûtent 5 pommes ?', answer: '10', hint: '1 pomme = 6 ÷ 3 = 2 €, donc 5 × 2 = 10 €' },
            { question: 'En 2 heures je parcours 10 km. Combien en 5 heures ?', answer: '25', hint: 'Vitesse = 10 ÷ 2 = 5 km/h, donc 5 × 5 = 25 km' },
            { question: '4 stylos = 8 €. Prix de 1 stylo ?', answer: '2', hint: '8 ÷ 4 = 2 € par stylo' },
            { question: 'Pour 6 personnes il faut 12 œufs. Combien pour 9 ?', answer: '18', hint: '6 personnes = 12 œufs, donc 9 = (12 ÷ 6) × 9 = 18' },
            { question: '5 kg de tomates = 15 €. Prix de 3 kg ?', answer: '9', hint: '1 kg = 15 ÷ 5 = 3 €, donc 3 × 3 = 9 €' },
            { question: 'Un train parcourt 120 km en 2 h. Combien en 3 h ?', answer: '180', hint: 'Vitesse = 120 ÷ 2 = 60 km/h, donc 3 × 60 = 180 km' },
            { question: '8 bonbons coûtent 4 €. Combien avec 10 € ?', answer: '20', hint: '1 € = 8 ÷ 4 = 2 bonbons, donc 10 × 2 = 20 bonbons' }
        ]
    },

    // ========================================
    // LEÇON 15 : EXAMEN FINAL MATHÉMATIQUES
    // ========================================
    {
        id: 'maths-15-examen',
        title: 'Examen Final Maths',
        emoji: '🏆',
        xp: 100,
        difficulty: 'difficile',
        exercises: [
            { question: '(12 × 5) + (8 × 3) = ?', answer: '84', hint: 'Calcule d\'abord les multiplications : 60 + 24' },
            { question: 'Aire d\'un carré de côté 9 cm = ?', answer: '81', hint: 'Aire = côté × côté = 9 × 9 = 81 cm²' },
            { question: '3/4 de 20 = ?', answer: '15', hint: '1/4 de 20 = 5, donc 3/4 = 3 × 5 = 15' },
            { question: '456 + 789 = ?', answer: '1245', hint: 'Attention aux retenues multiples !' },
            { question: '2,5 km = ? m', answer: '2500', hint: '2,5 × 1000 = 2 500 m' },
            { question: 'De 8h45 à 10h15, combien de minutes ?', answer: '90', hint: 'De 8h45 à 9h45 = 60 min, puis + 30 = 90 min' },
            { question: '144 ÷ 12 = ?', answer: '12', hint: 'Table de 12 : 12 × 12 = 144' },
            { question: 'Périmètre rectangle : L = 15 cm, l = 8 cm ?', answer: '46', hint: '(15 + 8) × 2 = 23 × 2 = 46 cm' },
            { question: '5 cahiers = 12,50 €. Prix de 1 cahier ?', answer: '2,5', hint: '12,50 ÷ 5 = 2,50 € (ou 2,5 €)' },
            { question: 'Combien de centaines dans 12 784 ?', answer: '127', hint: '12 784 = 127 centaines + 84 unités' }
        ]
    }
];

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = mathsLessons;
}

console.log('✅ Données Maths chargées : ' + mathsLessons.length + ' leçons');
