// francais_complete.js - Intégration complète des quiz français réels
class FrancaisComplete {
    constructor() {
        this.activeQuiz = null;
        this.dicteeWords = [
            "chat", "maison", "école", "jardin", "livre", 
            "enfant", "voiture", "chien", "soleil", "eau"
        ];
        this.vocabulaireWords = [
            { mot: "bibliothèque", definition: "Lieu où l'on range les livres", image: "📚" },
            { mot: "papillon", definition: "Insecte aux ailes colorées", image: "🦋" },
            { mot: "montagne", definition: "Grande élévation de terrain", image: "⛰️" },
            { mot: "océan", definition: "Grande étendue d'eau salée", image: "🌊" },
            { mot: "cuisine", definition: "Pièce où l'on prépare les repas", image: "🍳" },
            { mot: "guitare", definition: "Instrument de musique à cordes", image: "🎸" },
            { mot: "pharmacie", definition: "Magasin où l'on vend des médicaments", image: "💊" },
            { mot: "parapluie", definition: "Objet qui protège de la pluie", image: "☂️" }
        ];
        this.isInitialized = false;
    }
    
    init() {
        if (this.isInitialized) return;
        
        console.log("🔧 Initialisation FrancaisComplete...");
        this.overrideStartActivity();
        this.isInitialized = true;
        console.log("✅ FrancaisComplete initialisé avec succès");
    }
    
    overrideStartActivity() {
        // Remplacer la fonction startActivity existante
        window.startActivity = (type, xp) => {
            console.log(`🎮 Démarrage activité: ${type} (+${xp} XP)`);
            
            // Vérifier les cœurs
            if (window.heartSystem && window.heartSystem.heartsData.currentHearts < 1) {
                this.showNoHeartsMessage();
                return;
            }
            
            // Enregistrer l'activité pour les streaks
            if (window.streakManager) {
                window.streakManager.recordActivity();
            }
            
            // Lancer l'activité appropriée
            switch(type) {
                case 'grammaire':
                    this.startGrammaireQuiz();
                    break;
                case 'conjugaison':
                    this.startConjugaisonQuiz();
                    break;
                case 'dictee':
                    this.startDicteeInteractive();
                    break;
                case 'vocabulaire':
                    this.startVocabulaireQuiz();
                    break;
                default:
                    console.warn(`Activité non reconnue: ${type}`);
                    this.showComingSoon(type, xp);
            }
        };
    }
    
    startGrammaireQuiz() {
        console.log("📝 Démarrage Quiz Grammaire CM1");
        if (typeof grammaireQuiz !== 'undefined') {
            grammaireQuiz.init('quiz-container');
        } else {
            console.error("❌ grammaireQuiz non trouvé");
            this.showError("Quiz Grammaire non disponible");
        }
    }
    
    startConjugaisonQuiz() {
        console.log("🔄 Démarrage Quiz Conjugaison CM1");
        if (typeof conjugaisonQuiz !== 'undefined') {
            conjugaisonQuiz.init('quiz-container');
        } else {
            console.error("❌ conjugaisonQuiz non trouvé");
            this.showError("Quiz Conjugaison non disponible");
        }
    }
    
    startDicteeInteractive() {
        console.log("🎧 Démarrage Dictée Interactive");
        this.activeQuiz = 'dictee';
        this.showDicteeInterface();
    }
    
    startVocabulaireQuiz() {
        console.log("📚 Démarrage Quiz Vocabulaire");
        this.activeQuiz = 'vocabulaire';
        this.showVocabulaireInterface();
    }
    
    showDicteeInterface() {
        const container = document.getElementById('quiz-container');
        if (!container) {
            console.error("❌ Container quiz-container non trouvé");
            return;
        }
        
        const randomWord = this.dicteeWords[Math.floor(Math.random() * this.dicteeWords.length)];
        
        container.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto; text-align: center;">
                <h3 style="color: #264653; margin-bottom: 2rem; font-family: 'Press Start 2P', monospace; font-size: 16px;">
                    🎧 Dictée Interactive
                </h3>
                
                <div style="background: #e8f5e8; padding: 2rem; border-radius: 8px; margin-bottom: 2rem;">
                    <p style="color: #2e7d32; margin-bottom: 1rem; font-size: 16px;">
                        Écoute le mot et écris-le correctement :
                    </p>
                    
                    <button onclick="francaisComplete.speakWord('${randomWord}')" style="
                        background: linear-gradient(135deg, #4caf50, #81c784);
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 16px;
                        margin-bottom: 2rem;
                    ">
                        🔊 Écouter le mot
                    </button>
                    
                    <div style="margin-bottom: 2rem;">
                        <input type="text" id="dictee-input" placeholder="Écris le mot ici..." style="
                            border: 2px solid #2a9d8f;
                            border-radius: 8px;
                            padding: 1rem;
                            font-size: 18px;
                            text-align: center;
                            width: 80%;
                            max-width: 300px;
                        " onkeypress="if(event.key==='Enter') francaisComplete.checkDictee('${randomWord}')">
                    </div>
                    
                    <button onclick="francaisComplete.checkDictee('${randomWord}')" style="
                        background: linear-gradient(135deg, #2a9d8f, #264653);
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                    ">
                        ✓ Vérifier
                    </button>
                </div>
                
                <button onclick="location.reload()" style="
                    background: #666;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                ">
                    🔄 Retour aux activités
                </button>
            </div>
        `;
        
        // Focus sur l'input
        setTimeout(() => {
            const input = document.getElementById('dictee-input');
            if (input) input.focus();
        }, 100);
    }
    
    showVocabulaireInterface() {
        const container = document.getElementById('quiz-container');
        if (!container) return;
        
        const randomWord = this.vocabulaireWords[Math.floor(Math.random() * this.vocabulaireWords.length)];
        const wrongOptions = this.vocabulaireWords
            .filter(w => w.mot !== randomWord.mot)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(w => w.definition);
        
        const allOptions = [randomWord.definition, ...wrongOptions].sort(() => Math.random() - 0.5);
        
        container.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto; text-align: center;">
                <h3 style="color: #457b9d; margin-bottom: 2rem; font-family: 'Press Start 2P', monospace; font-size: 16px;">
                    📚 Quiz Vocabulaire
                </h3>
                
                <div style="background: #e3f2fd; padding: 2rem; border-radius: 8px; margin-bottom: 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">${randomWord.image}</div>
                    <h4 style="color: #1976d2; margin-bottom: 2rem; font-size: 24px;">
                        ${randomWord.mot}
                    </h4>
                    
                    <p style="color: #1976d2; margin-bottom: 2rem; font-size: 16px;">
                        Quelle est la définition de ce mot ?
                    </p>
                    
                    <div style="display: grid; gap: 1rem;">
                        ${allOptions.map(option => `
                            <button onclick="francaisComplete.checkVocabulaire('${option}', '${randomWord.definition}')" style="
                                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                                border: 2px solid #dee2e6;
                                padding: 1rem;
                                border-radius: 8px;
                                cursor: pointer;
                                text-align: left;
                                font-size: 14px;
                                transition: all 0.3s;
                            " onmouseover="this.style.transform='translateY(-2px)'; this.style.borderColor='#457b9d';" 
                               onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='#dee2e6';">
                                ${option}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <button onclick="location.reload()" style="
                    background: #666;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                ">
                    🔄 Retour aux activités
                </button>
            </div>
        `;
    }
    
    speakWord(word) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'fr-FR';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        } else {
            alert(`Le mot à écrire est : ${word}`);
        }
    }
    
    checkDictee(correctWord) {
        const userInput = document.getElementById('dictee-input').value.trim().toLowerCase();
        const isCorrect = userInput === correctWord.toLowerCase();
        
        const container = document.getElementById('quiz-container');
        container.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto; text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">
                    ${isCorrect ? '🎉' : '😔'}
                </div>
                
                <h3 style="color: ${isCorrect ? '#4caf50' : '#e76f51'}; margin-bottom: 2rem; font-family: 'Press Start 2P', monospace; font-size: 16px;">
                    ${isCorrect ? 'Bravo ! Bien écrit !' : 'Pas tout à fait...'}
                </h3>
                
                <div style="background: #f1faee; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                    <p style="color: #264653; margin-bottom: 1rem;">
                        <strong>Ta réponse :</strong> ${userInput}
                    </p>
                    <p style="color: #264653; margin: 0;">
                        <strong>Mot correct :</strong> ${correctWord}
                    </p>
                </div>
                
                <div style="background: linear-gradient(135deg, #2a9d8f, #264653); padding: 1rem; border-radius: 8px; margin-bottom: 2rem; color: white;">
                    <p style="margin: 0; font-family: 'Press Start 2P', monospace; font-size: 12px;">
                        ${isCorrect ? '+30 XP gagné !' : '+10 XP (effort récompensé)'}
                    </p>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <button onclick="francaisComplete.startDicteeInteractive()" style="
                        background: linear-gradient(135deg, #4caf50, #81c784);
                        color: white;
                        border: none;
                        padding: 1rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 12px;
                    ">
                        🔄 Autre mot
                    </button>
                    <button onclick="location.reload()" style="
                        background: linear-gradient(135deg, #2a9d8f, #264653);
                        color: white;
                        border: none;
                        padding: 1rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 12px;
                    ">
                        🏠 Retour activités
                    </button>
                </div>
            </div>
        `;
        
        // Ajouter XP
        if (window.xpManager) {
            window.xpManager.addXP(isCorrect ? 30 : 10, 'dictee_interactive');
            if (window.updateDisplays) window.updateDisplays();
        }
        
        // Gérer les cœurs
        if (!isCorrect && window.heartSystem) {
            window.heartSystem.loseHeart();
            if (window.heartSystem.updateHeartsDisplay) {
                window.heartSystem.updateHeartsDisplay();
            }
        }
    }
    
    checkVocabulaire(selectedDefinition, correctDefinition) {
        const isCorrect = selectedDefinition === correctDefinition;
        
        const container = document.getElementById('quiz-container');
        container.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto; text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">
                    ${isCorrect ? '🎉' : '😔'}
                </div>
                
                <h3 style="color: ${isCorrect ? '#4caf50' : '#e76f51'}; margin-bottom: 2rem; font-family: 'Press Start 2P', monospace; font-size: 16px;">
                    ${isCorrect ? 'Excellente réponse !' : 'Pas encore...'}
                </h3>
                
                ${!isCorrect ? `
                    <div style="background: #ffebee; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                        <p style="color: #c62828; margin: 0;">
                            <strong>La bonne réponse était :</strong><br>
                            ${correctDefinition}
                        </p>
                    </div>
                ` : ''}
                
                <div style="background: linear-gradient(135deg, #457b9d, #1d3557); padding: 1rem; border-radius: 8px; margin-bottom: 2rem; color: white;">
                    <p style="margin: 0; font-family: 'Press Start 2P', monospace; font-size: 12px;">
                        ${isCorrect ? '+15 XP gagné !' : '+5 XP (effort récompensé)'}
                    </p>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <button onclick="francaisComplete.startVocabulaireQuiz()" style="
                        background: linear-gradient(135deg, #ff9800, #ffb74d);
                        color: white;
                        border: none;
                        padding: 1rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 12px;
                    ">
                        🔄 Autre mot
                    </button>
                    <button onclick="location.reload()" style="
                        background: linear-gradient(135deg, #457b9d, #1d3557);
                        color: white;
                        border: none;
                        padding: 1rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 12px;
                    ">
                        🏠 Retour activités
                    </button>
                </div>
            </div>
        `;
        
        // Ajouter XP
        if (window.xpManager) {
            window.xpManager.addXP(isCorrect ? 15 : 5, 'vocabulaire_quiz');
            if (window.updateDisplays) window.updateDisplays();
        }
        
        // Gérer les cœurs
        if (!isCorrect && window.heartSystem) {
            window.heartSystem.loseHeart();
            if (window.heartSystem.updateHeartsDisplay) {
                window.heartSystem.updateHeartsDisplay();
            }
        }
    }
    
    showNoHeartsMessage() {
        const container = document.getElementById('quiz-container');
        if (container) {
            container.innerHTML = `
                <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto; text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">😔</div>
                    <h3 style="color: #e76f51; margin-bottom: 1rem; font-family: 'Press Start 2P', monospace; font-size: 16px;">
                        Plus de cœurs !
                    </h3>
                    <p style="color: #264653; margin-bottom: 2rem;">
                        Attends qu'ils se régénèrent ou continue demain pour garder ton streak !
                    </p>
                    <button onclick="location.reload()" style="
                        background: linear-gradient(135deg, #2a9d8f, #264653);
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                    ">
                        🔄 Retour aux activités
                    </button>
                </div>
            `;
        }
    }
    
    showError(message) {
        const container = document.getElementById('quiz-container');
        if (container) {
            container.innerHTML = `
                <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto; text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
                    <h3 style="color: #e76f51; margin-bottom: 1rem;">Erreur</h3>
                    <p style="color: #264653; margin-bottom: 2rem;">${message}</p>
                    <button onclick="location.reload()" style="
                        background: #666;
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 8px;
                        cursor: pointer;
                    ">
                        🔄 Recharger la page
                    </button>
                </div>
            `;
        }
    }
    
    showComingSoon(type, xp) {
        const container = document.getElementById('quiz-container');
        if (container) {
            container.innerHTML = `
                <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto; text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🚧</div>
                    <h3 style="color: #ff9800; margin-bottom: 1rem; font-family: 'Press Start 2P', monospace; font-size: 16px;">
                        Bientôt disponible !
                    </h3>
                    <p style="color: #264653; margin-bottom: 2rem;">
                        L'activité "${type}" sera bientôt prête !<br>
                        Récompense prévue : +${xp} XP
                    </p>
                    <button onclick="location.reload()" style="
                        background: linear-gradient(135deg, #2a9d8f, #264653);
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                    ">
                        🔄 Retour aux activités
                    </button>
                </div>
            `;
        }
    }
}

// Instance globale
const francaisComplete = new FrancaisComplete();

// Auto-initialisation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    // Attendre que les autres scripts soient chargés
    setTimeout(() => {
        francaisComplete.init();
    }, 1500);
});