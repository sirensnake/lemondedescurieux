/**
 * ==========================================
 * DONNÉES LEÇONS ANGLAIS CM1-CM2
 * Le Monde des Curieux
 * ==========================================
 * 15 leçons progressives avec audio Web Speech API
 */

const englishLessons = [
    // ========================================
    // LEÇON 1 : BASIC WORDS
    // ========================================
    {
        id: 'english-01-basic-words',
        title: 'Basic Words',
        emoji: '🎨',
        xp: 40,
        difficulty: 'facile',
        exercises: [
            { question: 'Comment dit-on "rouge" en anglais ?', answer: 'red', audio: 'red', hint: 'Pense à la couleur du sang : RED' },
            { question: 'Comment dit-on "bleu" en anglais ?', answer: 'blue', audio: 'blue', hint: 'Comme le ciel : BLUE' },
            { question: 'Comment dit-on "vert" en anglais ?', answer: 'green', audio: 'green', hint: 'Comme l\'herbe : GREEN' },
            { question: 'Comment dit-on "jaune" en anglais ?', answer: 'yellow', audio: 'yellow', hint: 'Comme le soleil : YELLOW' },
            { question: 'Comment dit-on "noir" en anglais ?', answer: 'black', audio: 'black', hint: 'Comme la nuit : BLACK' },
            { question: 'Comment dit-on "blanc" en anglais ?', answer: 'white', audio: 'white', hint: 'Comme la neige : WHITE' },
            { question: 'Traduis : un, deux, trois', answer: 'one two three', audio: 'one, two, three', hint: 'Les 3 premiers nombres : ONE, TWO, THREE' },
            { question: 'Comment dit-on "lundi" en anglais ?', answer: 'monday', audio: 'Monday', hint: 'Le premier jour : MONDAY' }
        ]
    },

    // ========================================
    // LEÇON 2 : FAMILY & FRIENDS
    // ========================================
    {
        id: 'english-02-family',
        title: 'Family & Friends',
        emoji: '👨‍👩‍👧‍👦',
        xp: 45,
        difficulty: 'facile',
        exercises: [
            { question: 'Comment dit-on "mère" en anglais ?', answer: 'mother', audio: 'mother', hint: 'Maman en anglais : MOTHER (ou MOM)' },
            { question: 'Comment dit-on "père" en anglais ?', answer: 'father', audio: 'father', hint: 'Papa en anglais : FATHER (ou DAD)' },
            { question: 'Comment dit-on "sœur" en anglais ?', answer: 'sister', audio: 'sister', hint: 'Ta sœur : SISTER' },
            { question: 'Comment dit-on "frère" en anglais ?', answer: 'brother', audio: 'brother', hint: 'Ton frère : BROTHER' },
            { question: 'Comment dit-on "ami" en anglais ?', answer: 'friend', audio: 'friend', hint: 'Un copain : FRIEND' },
            { question: 'Comment dit-on "grand-mère" en anglais ?', answer: 'grandmother', audio: 'grandmother', hint: 'Mamie : GRANDMOTHER (ou GRANDMA)' },
            { question: 'Comment dit-on "grand-père" en anglais ?', answer: 'grandfather', audio: 'grandfather', hint: 'Papy : GRANDFATHER (ou GRANDPA)' }
        ]
    },

    // ========================================
    // LEÇON 3 : FOOD & DRINKS
    // ========================================
    {
        id: 'english-03-food',
        title: 'Food & Drinks',
        emoji: '🍔',
        xp: 50,
        difficulty: 'facile',
        exercises: [
            { question: 'Comment dit-on "pomme" en anglais ?', answer: 'apple', audio: 'apple', hint: 'Le fruit rouge ou vert : APPLE' },
            { question: 'Comment dit-on "pain" en anglais ?', answer: 'bread', audio: 'bread', hint: 'Ce qu\'on mange au petit-déjeuner : BREAD' },
            { question: 'Comment dit-on "eau" en anglais ?', answer: 'water', audio: 'water', hint: 'À boire : WATER' },
            { question: 'Comment dit-on "lait" en anglais ?', answer: 'milk', audio: 'milk', hint: 'Boisson blanche : MILK' },
            { question: 'Comment dit-on "fromage" en anglais ?', answer: 'cheese', audio: 'cheese', hint: 'Jaune et bon : CHEESE' },
            { question: 'Comment dit-on "œuf" en anglais ?', answer: 'egg', audio: 'egg', hint: 'De la poule : EGG' },
            { question: 'Comment dit-on "poisson" en anglais ?', answer: 'fish', audio: 'fish', hint: 'Nage dans l\'eau : FISH' }
        ]
    },

    // ========================================
    // LEÇON 4 : ANIMALS
    // ========================================
    {
        id: 'english-04-animals',
        title: 'Animals',
        emoji: '🐶',
        xp: 50,
        difficulty: 'facile',
        exercises: [
            { question: 'Comment dit-on "chat" en anglais ?', answer: 'cat', audio: 'cat', hint: 'Miaou : CAT' },
            { question: 'Comment dit-on "chien" en anglais ?', answer: 'dog', audio: 'dog', hint: 'Ouaf : DOG' },
            { question: 'Comment dit-on "oiseau" en anglais ?', answer: 'bird', audio: 'bird', hint: 'Vole dans le ciel : BIRD' },
            { question: 'Comment dit-on "cheval" en anglais ?', answer: 'horse', audio: 'horse', hint: 'Galope : HORSE' },
            { question: 'Comment dit-on "vache" en anglais ?', answer: 'cow', audio: 'cow', hint: 'Donne du lait : COW' },
            { question: 'Comment dit-on "lapin" en anglais ?', answer: 'rabbit', audio: 'rabbit', hint: 'A de grandes oreilles : RABBIT' },
            { question: 'Comment dit-on "souris" en anglais ?', answer: 'mouse', audio: 'mouse', hint: 'Petite et grise : MOUSE' }
        ]
    },

    // ========================================
    // LEÇON 5 : SCHOOL LIFE
    // ========================================
    {
        id: 'english-05-school',
        title: 'School Life',
        emoji: '🎒',
        xp: 55,
        difficulty: 'moyen',
        exercises: [
            { question: 'Comment dit-on "école" en anglais ?', answer: 'school', audio: 'school', hint: 'Où on apprend : SCHOOL' },
            { question: 'Comment dit-on "professeur" en anglais ?', answer: 'teacher', audio: 'teacher', hint: 'Qui enseigne : TEACHER' },
            { question: 'Comment dit-on "livre" en anglais ?', answer: 'book', audio: 'book', hint: 'Pour lire : BOOK' },
            { question: 'Comment dit-on "stylo" en anglais ?', answer: 'pen', audio: 'pen', hint: 'Pour écrire : PEN' },
            { question: 'Comment dit-on "cahier" en anglais ?', answer: 'notebook', audio: 'notebook', hint: 'Pour les notes : NOTEBOOK' },
            { question: 'Comment dit-on "classe" en anglais ?', answer: 'classroom', audio: 'classroom', hint: 'La salle : CLASSROOM' },
            { question: 'Comment dit-on "devoirs" en anglais ?', answer: 'homework', audio: 'homework', hint: 'À la maison : HOMEWORK' }
        ]
    },

    // ========================================
    // LEÇON 6 : MY BODY
    // ========================================
    {
        id: 'english-06-body',
        title: 'My Body',
        emoji: '🙋',
        xp: 50,
        difficulty: 'moyen',
        exercises: [
            { question: 'Comment dit-on "tête" en anglais ?', answer: 'head', audio: 'head', hint: 'Sur les épaules : HEAD' },
            { question: 'Comment dit-on "œil" en anglais ?', answer: 'eye', audio: 'eye', hint: 'Pour voir : EYE (pluriel : EYES)' },
            { question: 'Comment dit-on "main" en anglais ?', answer: 'hand', audio: 'hand', hint: 'Avec 5 doigts : HAND' },
            { question: 'Comment dit-on "pied" en anglais ?', answer: 'foot', audio: 'foot', hint: 'Pour marcher : FOOT (pluriel : FEET)' },
            { question: 'Comment dit-on "bras" en anglais ?', answer: 'arm', audio: 'arm', hint: 'Entre épaule et main : ARM' },
            { question: 'Comment dit-on "jambe" en anglais ?', answer: 'leg', audio: 'leg', hint: 'Entre hanche et pied : LEG' },
            { question: 'Comment dit-on "bouche" en anglais ?', answer: 'mouth', audio: 'mouth', hint: 'Pour parler et manger : MOUTH' }
        ]
    },

    // ========================================
    // LEÇON 7 : CLOTHES
    // ========================================
    {
        id: 'english-07-clothes',
        title: 'Clothes',
        emoji: '👕',
        xp: 50,
        difficulty: 'moyen',
        exercises: [
            { question: 'Comment dit-on "chemise" en anglais ?', answer: 'shirt', audio: 'shirt', hint: 'Vêtement du haut : SHIRT' },
            { question: 'Comment dit-on "pantalon" en anglais ?', answer: 'trousers', audio: 'trousers', hint: 'Vêtement du bas : TROUSERS (ou PANTS)' },
            { question: 'Comment dit-on "chaussures" en anglais ?', answer: 'shoes', audio: 'shoes', hint: 'Aux pieds : SHOES' },
            { question: 'Comment dit-on "chapeau" en anglais ?', answer: 'hat', audio: 'hat', hint: 'Sur la tête : HAT' },
            { question: 'Comment dit-on "veste" en anglais ?', answer: 'jacket', audio: 'jacket', hint: 'Quand il fait froid : JACKET' },
            { question: 'Comment dit-on "chaussettes" en anglais ?', answer: 'socks', audio: 'socks', hint: 'Sous les chaussures : SOCKS' },
            { question: 'Comment dit-on "robe" en anglais ?', answer: 'dress', audio: 'dress', hint: 'Vêtement féminin : DRESS' }
        ]
    },

    // ========================================
    // LEÇON 8 : WEATHER & SEASONS
    // ========================================
    {
        id: 'english-08-weather',
        title: 'Weather & Seasons',
        emoji: '🌤️',
        xp: 55,
        difficulty: 'moyen',
        exercises: [
            { question: 'Comment dit-on "soleil" en anglais ?', answer: 'sun', audio: 'sun', hint: 'Brille dans le ciel : SUN' },
            { question: 'Comment dit-on "pluie" en anglais ?', answer: 'rain', audio: 'rain', hint: 'Tombe du ciel : RAIN' },
            { question: 'Comment dit-on "neige" en anglais ?', answer: 'snow', audio: 'snow', hint: 'Blanche et froide : SNOW' },
            { question: 'Comment dit-on "printemps" en anglais ?', answer: 'spring', audio: 'spring', hint: 'Après l\'hiver : SPRING' },
            { question: 'Comment dit-on "été" en anglais ?', answer: 'summer', audio: 'summer', hint: 'Saison chaude : SUMMER' },
            { question: 'Comment dit-on "automne" en anglais ?', answer: 'autumn', audio: 'autumn', hint: 'Feuilles tombent : AUTUMN (ou FALL)' },
            { question: 'Comment dit-on "hiver" en anglais ?', answer: 'winter', audio: 'winter', hint: 'Saison froide : WINTER' }
        ]
    },

    // ========================================
    // LEÇON 9 : ACTIONS & VERBS
    // ========================================
    {
        id: 'english-09-verbs',
        title: 'Actions & Verbs',
        emoji: '🏃',
        xp: 60,
        difficulty: 'moyen',
        exercises: [
            { question: 'Comment dit-on "courir" en anglais ?', answer: 'run', audio: 'run', hint: 'Aller vite : RUN' },
            { question: 'Comment dit-on "sauter" en anglais ?', answer: 'jump', audio: 'jump', hint: 'Monter en l\'air : JUMP' },
            { question: 'Comment dit-on "manger" en anglais ?', answer: 'eat', audio: 'eat', hint: 'Prendre de la nourriture : EAT' },
            { question: 'Comment dit-on "boire" en anglais ?', answer: 'drink', audio: 'drink', hint: 'Prendre un liquide : DRINK' },
            { question: 'Comment dit-on "dormir" en anglais ?', answer: 'sleep', audio: 'sleep', hint: 'La nuit : SLEEP' },
            { question: 'Comment dit-on "jouer" en anglais ?', answer: 'play', audio: 'play', hint: 'S\'amuser : PLAY' },
            { question: 'Comment dit-on "lire" en anglais ?', answer: 'read', audio: 'read', hint: 'Un livre : READ' }
        ]
    },

    // ========================================
    // LEÇON 10 : AT HOME
    // ========================================
    {
        id: 'english-10-home',
        title: 'At Home',
        emoji: '🏠',
        xp: 50,
        difficulty: 'moyen',
        exercises: [
            { question: 'Comment dit-on "maison" en anglais ?', answer: 'house', audio: 'house', hint: 'Où on habite : HOUSE' },
            { question: 'Comment dit-on "chambre" en anglais ?', answer: 'bedroom', audio: 'bedroom', hint: 'Pour dormir : BEDROOM' },
            { question: 'Comment dit-on "cuisine" en anglais ?', answer: 'kitchen', audio: 'kitchen', hint: 'Pour cuisiner : KITCHEN' },
            { question: 'Comment dit-on "salle de bain" en anglais ?', answer: 'bathroom', audio: 'bathroom', hint: 'Pour se laver : BATHROOM' },
            { question: 'Comment dit-on "salon" en anglais ?', answer: 'living room', audio: 'living room', hint: 'Pour regarder la TV : LIVING ROOM' },
            { question: 'Comment dit-on "jardin" en anglais ?', answer: 'garden', audio: 'garden', hint: 'Avec des fleurs : GARDEN' },
            { question: 'Comment dit-on "porte" en anglais ?', answer: 'door', audio: 'door', hint: 'Pour entrer : DOOR' }
        ]
    },

    // ========================================
    // LEÇON 11 : TIME & CALENDAR
    // ========================================
    {
        id: 'english-11-time',
        title: 'Time & Calendar',
        emoji: '⏰',
        xp: 60,
        difficulty: 'difficile',
        exercises: [
            { question: 'Comment dit-on "aujourd\'hui" en anglais ?', answer: 'today', audio: 'today', hint: 'Ce jour : TODAY' },
            { question: 'Comment dit-on "hier" en anglais ?', answer: 'yesterday', audio: 'yesterday', hint: 'Le jour d\'avant : YESTERDAY' },
            { question: 'Comment dit-on "demain" en anglais ?', answer: 'tomorrow', audio: 'tomorrow', hint: 'Le jour d\'après : TOMORROW' },
            { question: 'Comment dit-on "matin" en anglais ?', answer: 'morning', audio: 'morning', hint: 'Début de journée : MORNING' },
            { question: 'Comment dit-on "après-midi" en anglais ?', answer: 'afternoon', audio: 'afternoon', hint: 'Après le déjeuner : AFTERNOON' },
            { question: 'Comment dit-on "soir" en anglais ?', answer: 'evening', audio: 'evening', hint: 'Avant la nuit : EVENING' },
            { question: 'Comment dit-on "nuit" en anglais ?', answer: 'night', audio: 'night', hint: 'Quand il fait noir : NIGHT' }
        ]
    },

    // ========================================
    // LEÇON 12 : QUESTIONS
    // ========================================
    {
        id: 'english-12-questions',
        title: 'Questions',
        emoji: '❓',
        xp: 65,
        difficulty: 'difficile',
        exercises: [
            { question: 'Comment dit-on "Quel est ton nom ?" en anglais ?', answer: 'what is your name', audio: 'What is your name?', hint: 'WHAT IS YOUR NAME?' },
            { question: 'Comment dit-on "Quel âge as-tu ?" en anglais ?', answer: 'how old are you', audio: 'How old are you?', hint: 'HOW OLD ARE YOU?' },
            { question: 'Comment dit-on "Où habites-tu ?" en anglais ?', answer: 'where do you live', audio: 'Where do you live?', hint: 'WHERE DO YOU LIVE?' },
            { question: 'Comment dit-on "Comment vas-tu ?" en anglais ?', answer: 'how are you', audio: 'How are you?', hint: 'HOW ARE YOU?' },
            { question: 'Traduis "Qui est-ce ?" en anglais', answer: 'who is it', audio: 'Who is it?', hint: 'WHO IS IT?' },
            { question: 'Traduis "Pourquoi ?" en anglais', answer: 'why', audio: 'Why?', hint: 'WHY?' },
            { question: 'Traduis "Quand ?" en anglais', answer: 'when', audio: 'When?', hint: 'WHEN?' }
        ]
    },

    // ========================================
    // LEÇON 13 : GREETINGS
    // ========================================
    {
        id: 'english-13-greetings',
        title: 'Greetings',
        emoji: '👋',
        xp: 45,
        difficulty: 'facile',
        exercises: [
            { question: 'Comment dit-on "Bonjour" en anglais ?', answer: 'hello', audio: 'Hello', hint: 'Salutation courante : HELLO (ou HI)' },
            { question: 'Comment dit-on "Au revoir" en anglais ?', answer: 'goodbye', audio: 'Goodbye', hint: 'Pour partir : GOODBYE (ou BYE)' },
            { question: 'Comment dit-on "S\'il vous plaît" en anglais ?', answer: 'please', audio: 'Please', hint: 'Pour demander poliment : PLEASE' },
            { question: 'Comment dit-on "Merci" en anglais ?', answer: 'thank you', audio: 'Thank you', hint: 'Pour remercier : THANK YOU (ou THANKS)' },
            { question: 'Comment dit-on "Pardon" en anglais ?', answer: 'sorry', audio: 'Sorry', hint: 'Pour s\'excuser : SORRY' },
            { question: 'Comment dit-on "Bonne nuit" en anglais ?', answer: 'good night', audio: 'Good night', hint: 'Avant de dormir : GOOD NIGHT' },
            { question: 'Comment répond-on à "How are you?" ?', answer: 'i am fine', audio: 'I am fine', hint: 'Je vais bien : I AM FINE (ou I\'M GOOD)' }
        ]
    },

    // ========================================
    // LEÇON 14 : DIRECTIONS
    // ========================================
    {
        id: 'english-14-directions',
        title: 'Directions',
        emoji: '🧭',
        xp: 60,
        difficulty: 'difficile',
        exercises: [
            { question: 'Comment dit-on "gauche" en anglais ?', answer: 'left', audio: 'left', hint: 'Direction : LEFT' },
            { question: 'Comment dit-on "droite" en anglais ?', answer: 'right', audio: 'right', hint: 'Direction : RIGHT' },
            { question: 'Comment dit-on "tout droit" en anglais ?', answer: 'straight', audio: 'straight', hint: 'Direction : STRAIGHT (ou STRAIGHT AHEAD)' },
            { question: 'Comment dit-on "ici" en anglais ?', answer: 'here', audio: 'here', hint: 'À cet endroit : HERE' },
            { question: 'Comment dit-on "là-bas" en anglais ?', answer: 'there', audio: 'there', hint: 'À un autre endroit : THERE' },
            { question: 'Comment dit-on "près de" en anglais ?', answer: 'near', audio: 'near', hint: 'Proche : NEAR (ou CLOSE TO)' },
            { question: 'Comment dit-on "loin de" en anglais ?', answer: 'far', audio: 'far', hint: 'Éloigné : FAR (ou FAR FROM)' }
        ]
    },

    // ========================================
    // LEÇON 15 : FINAL EXAM
    // ========================================
    {
        id: 'english-15-exam',
        title: 'Final Exam',
        emoji: '🏆',
        xp: 100,
        difficulty: 'difficile',
        exercises: [
            { question: 'Traduis "Je suis un garçon" en anglais', answer: 'i am a boy', audio: 'I am a boy', hint: 'I AM A BOY' },
            { question: 'Traduis "J\'ai 9 ans" en anglais', answer: 'i am 9 years old', audio: 'I am nine years old', hint: 'I AM 9 YEARS OLD' },
            { question: 'Traduis "J\'aime les chats" en anglais', answer: 'i like cats', audio: 'I like cats', hint: 'I LIKE CATS' },
            { question: 'Comment dit-on "Ma famille" en anglais ?', answer: 'my family', audio: 'my family', hint: 'MY FAMILY' },
            { question: 'Traduis "Il fait beau" en anglais', answer: 'it is sunny', audio: 'It is sunny', hint: 'IT IS SUNNY (ou THE WEATHER IS NICE)' },
            { question: 'Traduis "Je vais à l\'école" en anglais', answer: 'i go to school', audio: 'I go to school', hint: 'I GO TO SCHOOL' },
            { question: 'Comment dit-on "Mon livre préféré" en anglais ?', answer: 'my favorite book', audio: 'my favorite book', hint: 'MY FAVORITE BOOK' },
            { question: 'Traduis "Je peux jouer ?" en anglais', answer: 'can i play', audio: 'Can I play?', hint: 'CAN I PLAY?' },
            { question: 'Comment dit-on "C\'est délicieux" en anglais ?', answer: 'it is delicious', audio: 'It is delicious', hint: 'IT IS DELICIOUS (ou IT\'S YUMMY)' },
            { question: 'Traduis "Bonne journée !" en anglais', answer: 'have a nice day', audio: 'Have a nice day!', hint: 'HAVE A NICE DAY!' }
        ]
    }
];

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = englishLessons;
}

console.log('✅ Données English chargées : ' + englishLessons.length + ' leçons');