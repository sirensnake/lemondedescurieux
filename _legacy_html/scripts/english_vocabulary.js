// scripts/english_vocabulary.js - Base complète vocabulaire anglais CM1
class EnglishVocabularyDatabase {
    constructor() {
        this.units = {
            // === UNIT 1: BASIC WORDS ===
            basic_words: {
                title: "Basic Words",
                description: "Essential everyday words",
                level: 1,
                lessons: {
                    greetings: {
                        title: "Greetings & Politeness",
                        words: [
                            { en: "hello", fr: "bonjour", phonetic: "/həˈloʊ/", audio: "hello" },
                            { en: "goodbye", fr: "au revoir", phonetic: "/ɡʊdˈbaɪ/", audio: "goodbye" },
                            { en: "please", fr: "s'il vous plaît", phonetic: "/pliːz/", audio: "please" },
                            { en: "thank you", fr: "merci", phonetic: "/θæŋk juː/", audio: "thank you" },
                            { en: "yes", fr: "oui", phonetic: "/jɛs/", audio: "yes" },
                            { en: "no", fr: "non", phonetic: "/noʊ/", audio: "no" },
                            { en: "excuse me", fr: "excusez-moi", phonetic: "/ɪkˈskjuːz miː/", audio: "excuse me" },
                            { en: "sorry", fr: "désolé", phonetic: "/ˈsɔːri/", audio: "sorry" }
                        ]
                    },
                    
                    daily_words: {
                        title: "Daily Words",
                        words: [
                            { en: "water", fr: "eau", phonetic: "/ˈwɔːtər/", audio: "water", image: "💧" },
                            { en: "bread", fr: "pain", phonetic: "/brɛd/", audio: "bread", image: "🍞" },
                            { en: "milk", fr: "lait", phonetic: "/mɪlk/", audio: "milk", image: "🥛" },
                            { en: "apple", fr: "pomme", phonetic: "/ˈæpəl/", audio: "apple", image: "🍎" },
                            { en: "house", fr: "maison", phonetic: "/haʊs/", audio: "house", image: "🏠" },
                            { en: "car", fr: "voiture", phonetic: "/kɑːr/", audio: "car", image: "🚗" },
                            { en: "book", fr: "livre", phonetic: "/bʊk/", audio: "book", image: "📚" },
                            { en: "school", fr: "école", phonetic: "/skuːl/", audio: "school", image: "🏫" }
                        ]
                    }
                },
                
                exercises: [
                    {
                        type: "translation",
                        instruction: "Traduis en français",
                        format: "english_to_french"
                    },
                    {
                        type: "audio_recognition", 
                        instruction: "Écoute et écris le mot",
                        format: "audio_to_text"
                    },
                    {
                        type: "matching",
                        instruction: "Associe les mots à leur traduction",
                        format: "drag_drop"
                    }
                ]
            },

            // === UNIT 2: FAMILY & FRIENDS ===
            family: {
                title: "Family & Friends",
                description: "People and relationships",
                level: 1,
                lessons: {
                    family_members: {
                        title: "Family Members",
                        words: [
                            { en: "mother", fr: "mère", phonetic: "/ˈmʌðər/", audio: "mother", image: "👩" },
                            { en: "father", fr: "père", phonetic: "/ˈfɑːðər/", audio: "father", image: "👨" },
                            { en: "sister", fr: "sœur", phonetic: "/ˈsɪstər/", audio: "sister", image: "👧" },
                            { en: "brother", fr: "frère", phonetic: "/ˈbrʌðər/", audio: "brother", image: "👦" },
                            { en: "grandmother", fr: "grand-mère", phonetic: "/ˈɡrænmʌðər/", audio: "grandmother", image: "👵" },
                            { en: "grandfather", fr: "grand-père", phonetic: "/ˈɡrænfɑːðər/", audio: "grandfather", image: "👴" },
                            { en: "baby", fr: "bébé", phonetic: "/ˈbeɪbi/", audio: "baby", image: "👶" },
                            { en: "family", fr: "famille", phonetic: "/ˈfæməli/", audio: "family", image: "👨‍👩‍👧‍👦" }
                        ]
                    },
                    
                    friends_social: {
                        title: "Friends & Social",
                        words: [
                            { en: "friend", fr: "ami", phonetic: "/frɛnd/", audio: "friend", image: "🤝" },
                            { en: "boy", fr: "garçon", phonetic: "/bɔɪ/", audio: "boy", image: "👦" },
                            { en: "girl", fr: "fille", phonetic: "/ɡɜːrl/", audio: "girl", image: "👧" },
                            { en: "child", fr: "enfant", phonetic: "/tʃaɪld/", audio: "child", image: "🧒" },
                            { en: "teacher", fr: "professeur", phonetic: "/ˈtiːtʃər/", audio: "teacher", image: "👩‍🏫" },
                            { en: "student", fr: "élève", phonetic: "/ˈstuːdənt/", audio: "student", image: "🧑‍🎓" }
                        ]
                    }
                }
            },

            // === UNIT 3: COLORS & NUMBERS ===
            colors_numbers: {
                title: "Colors & Numbers",
                description: "Basic colors and counting",
                level: 1,
                lessons: {
                    colors: {
                        title: "Colors",
                        words: [
                            { en: "red", fr: "rouge", phonetic: "/rɛd/", audio: "red", image: "🔴" },
                            { en: "blue", fr: "bleu", phonetic: "/bluː/", audio: "blue", image: "🔵" },
                            { en: "green", fr: "vert", phonetic: "/ɡriːn/", audio: "green", image: "🟢" },
                            { en: "yellow", fr: "jaune", phonetic: "/ˈjɛloʊ/", audio: "yellow", image: "🟡" },
                            { en: "orange", fr: "orange", phonetic: "/ˈɔːrɪndʒ/", audio: "orange", image: "🟠" },
                            { en: "purple", fr: "violet", phonetic: "/ˈpɜːrpəl/", audio: "purple", image: "🟣" },
                            { en: "black", fr: "noir", phonetic: "/blæk/", audio: "black", image: "⚫" },
                            { en: "white", fr: "blanc", phonetic: "/waɪt/", audio: "white", image: "⚪" }
                        ]
                    },
                    
                    numbers: {
                        title: "Numbers 1-20",
                        words: [
                            { en: "one", fr: "un", phonetic: "/wʌn/", audio: "one", number: 1 },
                            { en: "two", fr: "deux", phonetic: "/tuː/", audio: "two", number: 2 },
                            { en: "three", fr: "trois", phonetic: "/θriː/", audio: "three", number: 3 },
                            { en: "four", fr: "quatre", phonetic: "/fɔːr/", audio: "four", number: 4 },
                            { en: "five", fr: "cinq", phonetic: "/faɪv/", audio: "five", number: 5 },
                            { en: "six", fr: "six", phonetic: "/sɪks/", audio: "six", number: 6 },
                            { en: "seven", fr: "sept", phonetic: "/ˈsɛvən/", audio: "seven", number: 7 },
                            { en: "eight", fr: "huit", phonetic: "/eɪt/", audio: "eight", number: 8 },
                            { en: "nine", fr: "neuf", phonetic: "/naɪn/", audio: "nine", number: 9 },
                            { en: "ten", fr: "dix", phonetic: "/tɛn/", audio: "ten", number: 10 }
                        ]
                    }
                }
            },

            // === UNIT 4: FOOD & DRINKS ===
            food: {
                title: "Food & Drinks", 
                description: "What we eat and drink",
                level: 2,
                lessons: {
                    basic_food: {
                        title: "Basic Food",
                        words: [
                            { en: "food", fr: "nourriture", phonetic: "/fuːd/", audio: "food", image: "🍽️" },
                            { en: "fruit", fr: "fruit", phonetic: "/fruːt/", audio: "fruit", image: "🍓" },
                            { en: "vegetable", fr: "légume", phonetic: "/ˈvɛdʒtəbəl/", audio: "vegetable", image: "🥕" },
                            { en: "meat", fr: "viande", phonetic: "/miːt/", audio: "meat", image: "🥩" },
                            { en: "fish", fr: "poisson", phonetic: "/fɪʃ/", audio: "fish", image: "🐟" },
                            { en: "egg", fr: "œuf", phonetic: "/ɛɡ/", audio: "egg", image: "🥚" },
                            { en: "cheese", fr: "fromage", phonetic: "/tʃiːz/", audio: "cheese", image: "🧀" },
                            { en: "rice", fr: "riz", phonetic: "/raɪs/", audio: "rice", image: "🍚" }
                        ]
                    },
                    
                    drinks: {
                        title: "Drinks",
                        words: [
                            { en: "drink", fr: "boisson", phonetic: "/drɪŋk/", audio: "drink", image: "🥤" },
                            { en: "tea", fr: "thé", phonetic: "/tiː/", audio: "tea", image: "🍵" },
                            { en: "coffee", fr: "café", phonetic: "/ˈkɔːfi/", audio: "coffee", image: "☕" },
                            { en: "juice", fr: "jus", phonetic: "/dʒuːs/", audio: "juice", image: "🧃" },
                            { en: "soda", fr: "soda", phonetic: "/ˈsoʊdə/", audio: "soda", image: "🥤" }
                        ]
                    }
                }
            },

            // === UNIT 5: ANIMALS ===
            animals: {
                title: "Animals",
                description: "Pets and wild animals", 
                level: 2,
                lessons: {
                    pets: {
                        title: "Pets",
                        words: [
                            { en: "dog", fr: "chien", phonetic: "/dɔːɡ/", audio: "dog", image: "🐕", sound: "woof" },
                            { en: "cat", fr: "chat", phonetic: "/kæt/", audio: "cat", image: "🐱", sound: "meow" },
                            { en: "bird", fr: "oiseau", phonetic: "/bɜːrd/", audio: "bird", image: "🐦", sound: "chirp" },
                            { en: "fish", fr: "poisson", phonetic: "/fɪʃ/", audio: "fish", image: "🐠" },
                            { en: "rabbit", fr: "lapin", phonetic: "/ˈræbɪt/", audio: "rabbit", image: "🐰" },
                            { en: "mouse", fr: "souris", phonetic: "/maʊs/", audio: "mouse", image: "🐭" }
                        ]
                    },
                    
                    wild_animals: {
                        title: "Wild Animals",
                        words: [
                            { en: "lion", fr: "lion", phonetic: "/ˈlaɪən/", audio: "lion", image: "🦁", sound: "roar" },
                            { en: "elephant", fr: "éléphant", phonetic: "/ˈɛlɪfənt/", audio: "elephant", image: "🐘" },
                            { en: "monkey", fr: "singe", phonetic: "/ˈmʌŋki/", audio: "monkey", image: "🐵" },
                            { en: "bear", fr: "ours", phonetic: "/bɛr/", audio: "bear", image: "🐻" },
                            { en: "tiger", fr: "tigre", phonetic: "/ˈtaɪɡər/", audio: "tiger", image: "🐅" },
                            { en: "horse", fr: "cheval", phonetic: "/hɔːrs/", audio: "horse", image: "🐴" }
                        ]
                    }
                }
            }
        };

        this.exerciseTypes = {
            // Exercices par type de compétence
            vocabulary: {
                translation: this.createTranslationExercise,
                listening: this.createListeningExercise,
                matching: this.createMatchingExercise,
                spelling: this.createSpellingExercise
            },
            
            grammar: {
                articles: this.createArticleExercise,
                plural: this.createPluralExercise,
                present: this.createPresentTenseExercise
            },
            
            speaking: {
                pronunciation: this.createPronunciationExercise,
                dialogue: this.createDialogueExercise
            }
        };
        
        this.progressionMap = {
            beginner: ["basic_words", "family"],
            intermediate: ["colors_numbers", "food"], 
            advanced: ["animals", "grammar_basics"]
        };
    }

    // === GÉNÉRATEURS D'EXERCICES ===
    createTranslationExercise(words, count = 8) {
        const selectedWords = this.shuffleArray(words).slice(0, count);
        
        return {
            type: "translation",
            title: "Translate to French",
            instruction: "Écris la traduction française",
            questions: selectedWords.map(word => ({
                question: word.en,
                correct: word.fr,
                phonetic: word.phonetic,
                audio: word.audio,
                image: word.image
            }))
        };
    }

    createListeningExercise(words, count = 6) {
        const selectedWords = this.shuffleArray(words).slice(0, count);
        
        return {
            type: "listening",
            title: "Listen and Type",
            instruction: "Écoute et écris le mot en anglais",
            questions: selectedWords.map(word => ({
                audio: word.audio,
                correct: word.en,
                hint: word.fr,
                phonetic: word.phonetic
            }))
        };
    }

    createMatchingExercise(words, count = 8) {
        const selectedWords = this.shuffleArray(words).slice(0, count);
        const englishWords = selectedWords.map(w => w.en);
        const frenchWords = this.shuffleArray(selectedWords.map(w => w.fr));
        
        return {
            type: "matching",
            title: "Match Words",
            instruction: "Associe les mots anglais à leur traduction française",
            englishWords,
            frenchWords,
            correctPairs: selectedWords.map(w => ({ en: w.en, fr: w.fr }))
        };
    }

    createSpellingExercise(words, count = 6) {
        const selectedWords = this.shuffleArray(words).slice(0, count);
        
        return {
            type: "spelling",
            title: "Spell the Word",
            instruction: "Épelle le mot à partir de sa traduction",
            questions: selectedWords.map(word => ({
                french: word.fr,
                correct: word.en,
                scrambled: this.scrambleWord(word.en),
                audio: word.audio,
                image: word.image
            }))
        };
    }

    // === MÉTHODES UTILITAIRES ===
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    scrambleWord(word) {
        return word.split('').sort(() => Math.random() - 0.5).join('');
    }

    // === API PUBLIQUE ===
    getUnit(unitId) {
        return this.units[unitId];
    }

    getLesson(unitId, lessonId) {
        return this.units[unitId]?.lessons[lessonId];
    }

    getLessonWords(unitId, lessonId) {
        return this.getLesson(unitId, lessonId)?.words || [];
    }

    generateExercise(unitId, lessonId, exerciseType, count) {
        const words = this.getLessonWords(unitId, lessonId);
        if (!words.length) return null;

        const generator = this.exerciseTypes.vocabulary[exerciseType];
        if (!generator) return null;

        return generator.call(this, words, count);
    }

    getProgressionForLevel(level) {
        if (level <= 3) return this.progressionMap.beginner;
        if (level <= 6) return this.progressionMap.intermediate;
        return this.progressionMap.advanced;
    }

    // === AUDIO SYNTHESIS ===
    speakWord(word, lang = 'en-US', rate = 0.8) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = lang;
            utterance.rate = rate;
            speechSynthesis.speak(utterance);
            return true;
        }
        return false;
    }
}

// Instance globale
const englishVocabularyDB = new EnglishVocabularyDatabase();

// Export
if (typeof window !== 'undefined') {
    window.EnglishVocabularyDatabase = EnglishVocabularyDatabase;
    window.englishVocabularyDB = englishVocabularyDB;
}