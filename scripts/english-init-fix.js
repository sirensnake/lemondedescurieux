// FIX IMMÉDIAT : scripts/english-init-fix.js
// À ajouter avant la fermeture du </body> dans english_duolingo_style.html

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initialisation section anglais Duolingo-style...');
    
    // Vérifier que toutes les classes sont disponibles
    const checkClasses = () => {
        if (typeof EnglishStreakSystem === 'undefined') {
            console.error('❌ EnglishStreakSystem non chargé');
            return false;
        }
        if (typeof EnglishHeartsSystem === 'undefined') {
            console.error('❌ EnglishHeartsSystem non chargé');
            return false;
        }
        if (typeof EnglishLessonSystem === 'undefined') {
            console.error('❌ EnglishLessonSystem non chargé');
            return false;
        }
        return true;
    };
    
    // Fonction d'initialisation sécurisée
    const initializeEnglishSystem = () => {
        if (!checkClasses()) {
            console.log('⏳ Attente du chargement des classes...');
            setTimeout(initializeEnglishSystem, 100);
            return;
        }
        
        console.log('✅ Toutes les classes sont chargées');
        
        try {
            // Initialiser les systèmes dans le bon ordre
            window.englishStreakSystem = new EnglishStreakSystem();
            console.log('✅ Streak system initialisé');
            
            window.englishHeartsSystem = new EnglishHeartsSystem();
            window.englishHeartsSystem.initializeUI();
            console.log('✅ Hearts system initialisé');
            
            window.englishLesson = new EnglishLessonSystem();
            console.log('✅ Lesson system initialisé');
            
            // Fonction globale pour démarrer une leçon
            window.startFirstLesson = function() {
                console.log('🎯 Démarrage première leçon');
                window.englishLesson.startLesson(0);
            };
            
            console.log('🎉 Système anglais Duolingo-style prêt !');
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation :', error);
        }
    };
    
    // Démarrer l'initialisation
    initializeEnglishSystem();
});

// Script à injecter pour remplacer le contenu actuel de english_duolingo_style.html
// entre les balises <script> existantes avant </body>