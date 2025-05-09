// scripts/jeux/vrai_faux_ia.js
const vraiFauxIA = [
    {
        question: "L'intelligence artificielle peut ressentir de vraies émotions.",
        reponse: false,
        explication: "Les IA ne ressentent pas d'émotions comme les humains. Elles peuvent simuler des émotions, mais ne les éprouvent pas réellement."
    },
    {
        question: "Une IA apprend en analysant beaucoup d'exemples.",
        reponse: true,
        explication: "C'est correct ! Les IA apprennent par l'analyse de nombreux exemples, c'est ce qu'on appelle l'apprentissage automatique."
    },
    {
        question: "Les robots et l'intelligence artificielle sont exactement la même chose.",
        reponse: false,
        explication: "Les robots sont des machines physiques qui peuvent être contrôlées par une IA, mais l'IA est un programme informatique qui peut exister sans corps physique."
    },
    {
        question: "Une IA peut jouer aux échecs mieux qu'un champion humain.",
        reponse: true,
        explication: "Effectivement, des IA comme Deep Blue ou AlphaZero ont battu les meilleurs joueurs d'échecs humains."
    },
    {
        question: "Les assistants vocaux comme Siri et Alexa utilisent l'intelligence artificielle.",
        reponse: true,
        explication: "Correct ! Ces assistants utilisent l'IA pour comprendre nos questions et y répondre."
    }
];

// Fonction pour initialiser le jeu
function initialiserVraiFaux(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let questionActuelle = 0;
    let score = 0;
    
    function afficherQuestion() {
        const question = vraiFauxIA[questionActuelle];
        
        container.innerHTML = `
            <div class="vrai-faux-card">
                <h3>Question ${questionActuelle + 1}/${vraiFauxIA.length}</h3>
                <p class="vrai-faux-question">${question.question}</p>
                <div class="vrai-faux-buttons">
                    <button id="btn-vrai" class="vrai-btn">VRAI</button>
                    <button id="btn-faux" class="faux-btn">FAUX</button>
                </div>
                <div id="feedback" class="vrai-faux-feedback hidden"></div>
                <button id="btn-suivant" class="btn-suivant hidden">Question suivante</button>
                <div class="vrai-faux-score">Score: <span id="score-display">${score}</span>/${vraiFauxIA.length}</div>
            </div>
        `;
        
        // Ajouter les écouteurs d'événements
        document.getElementById('btn-vrai').addEventListener('click', () => verifierReponse(true));
        document.getElementById('btn-faux').addEventListener('click', () => verifierReponse(false));
        document.getElementById('btn-suivant').addEventListener('click', questionSuivante);
    }
    
    function verifierReponse(reponseUtilisateur) {
        const question = vraiFauxIA[questionActuelle];
        const estCorrect = reponseUtilisateur === question.reponse;
        
        // Désactiver les boutons
        document.getElementById('btn-vrai').disabled = true;
        document.getElementById('btn-faux').disabled = true;
        
        // Mettre en évidence le bouton sélectionné
        const boutonSelectionne = reponseUtilisateur ? 'btn-vrai' : 'btn-faux';
        document.getElementById(boutonSelectionne).classList.add(estCorrect ? 'correct' : 'incorrect');
        
        // Afficher le feedback
        const feedback = document.getElementById('feedback');
        feedback.classList.remove('hidden');
        
        if (estCorrect) {
            score++;
            document.getElementById('score-display').textContent = score;
            feedback.classList.add('correct-feedback');
            feedback.textContent = `Bravo ! ${question.explication}`;
        } else {
            feedback.classList.add('incorrect-feedback');
            feedback.textContent = `Dommage ! ${question.explication}`;
        }
        
        // Afficher le bouton suivant
        document.getElementById('btn-suivant').classList.remove('hidden');
        
        // Enregistrer la progression
        if (typeof markProgress === 'function') {
            markProgress('IA', 'vrai_faux_' + (questionActuelle + 1));
        }
    }
    
    function questionSuivante() {
        questionActuelle++;
        
        if (questionActuelle < vraiFauxIA.length) {
            afficherQuestion();
        } else {
            // Fin du jeu
            container.innerHTML = `
                <div class="vrai-faux-card resultat-final">
                    <h3>Bravo, tu as terminé !</h3>
                    <p>Ton score final est de ${score}/${vraiFauxIA.length}</p>
                    <div class="message-final">
                        ${score === vraiFauxIA.length ? 
                          'Parfait ! Tu connais très bien le sujet !' : 
                          score >= vraiFauxIA.length / 2 ? 
                          'Bien joué ! Continue à apprendre sur l\'IA.' : 
                          'Continue à apprendre, tu t\'amélioreras !'}
                    </div>
                    <button id="btn-rejouer" class="btn-rejouer">Rejouer</button>
                </div>
            `;
            
            document.getElementById('btn-rejouer').addEventListener('click', () => {
                questionActuelle = 0;
                score = 0;
                afficherQuestion();
            });
        }
    }
    
    // Démarrer le jeu
    afficherQuestion();
}

// Si le script est chargé directement sur une page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('vrai-faux-container')) {
        initialiserVraiFaux('vrai-faux-container');
    }
});