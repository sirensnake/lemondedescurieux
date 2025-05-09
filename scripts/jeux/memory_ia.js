/**
 * Jeu de Memory sur l'Intelligence Artificielle
 * Le Monde des Curieux
 */
class MemoryGame {
    constructor(containerId, options = {}) {
        // Options par défaut
        this.options = Object.assign({
            pairsCount: 6,
            cardBackText: '?',
            timeLimit: 60, // secondes (0 = pas de limite)
            showTimer: true,
            cardTheme: 'ia', // thème des cartes
            animationSpeed: 400,
            onGameComplete: null
        }, options);
        
        // Éléments du DOM
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Conteneur ${containerId} introuvable`);
            return;
        }
        
        // État du jeu
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.isLocked = false;
        this.timer = null;
        this.timeRemaining = this.options.timeLimit;
        this.moveCount = 0;
        
        // Définir les paires de cartes
        this.cardPairs = this.getCardPairs();
        
        // Initialiser le jeu
        this.init();
    }
    
    /**
     * Retourne les paires de cartes selon le thème choisi
     * @returns {Array} Paires de cartes
     */
    getCardPairs() {
        const pairs = [
            { id: 'robot', face: '🤖', title: 'Robot', description: 'Un robot peut être contrôlé par une IA' },
            { id: 'cerveau', face: '🧠', title: 'Cerveau', description: 'L\'IA s\'inspire du cerveau humain' },
            { id: 'ordinateur', face: '💻', title: 'Ordinateur', description: 'Les IA fonctionnent sur des ordinateurs' },
            { id: 'donnees', face: '📊', title: 'Données', description: 'Les IA apprennent grâce aux données' },
            { id: 'satellite', face: '🛰️', title: 'Satellite', description: 'Des IA analysent les images satellites' },
            { id: 'ampoule', face: '💡', title: 'Idée', description: 'L\'IA aide à résoudre des problèmes' },
            { id: 'loupe', face: '🔍', title: 'Recherche', description: 'L\'IA améliore les moteurs de recherche' },
            { id: 'appareil', face: '📱', title: 'Smartphone', description: 'Ton téléphone utilise de l\'IA' }
        ];
        
        // Mélanger et prendre le nombre de paires souhaitées
        return this.shuffleArray(pairs).slice(0, this.options.pairsCount);
    }
    
    /**
     * Mélange un tableau
     * @param {Array} array - Tableau à mélanger
     * @returns {Array} Tableau mélangé
     */
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    /**
     * Initialise le jeu
     */
    init() {
        // Créer l'interface du jeu
        this.createGameInterface();
        
        // Créer les cartes
        this.createCards();
        
        // Afficher les cartes
        this.renderCards();
        
        // Démarrer le timer si nécessaire
        if (this.options.timeLimit > 0 && this.options.showTimer) {
            this.startTimer();
        }
    }
    
    /**
     * Crée l'interface du jeu
     */
    createGameInterface() {
        // Vider le conteneur
        this.container.innerHTML = '';
        
        // Créer le template de base
        this.container.innerHTML = `
            <div class="memory-game-container">
                <div class="memory-game-header">
                    <div class="memory-score">
                        Paires trouvées: <span id="memory-matched-count">0</span>/${this.options.pairsCount}
                    </div>
                    ${this.options.showTimer ? `
                        <div class="memory-timer">
                            Temps: <span id="memory-timer-display">${this.formatTime(this.timeRemaining)}</span>
                        </div>
                    ` : ''}
                    <div class="memory-moves">
                        Coups: <span id="memory-moves-count">0</span>
                    </div>
                </div>
                <div id="memory-card-grid" class="memory-card-grid"></div>
                <div class="memory-game-footer">
                    <button id="memory-restart-btn" class="memory-btn">Recommencer</button>
                </div>
                <div id="memory-game-message" class="memory-game-message hidden"></div>
            </div>
        `;
        
        // Référence aux éléments
        this.cardGrid = document.getElementById('memory-card-grid');
        this.matchedCountDisplay = document.getElementById('memory-matched-count');
        this.movesCountDisplay = document.getElementById('memory-moves-count');
        this.timerDisplay = document.getElementById('memory-timer-display');
        this.gameMessage = document.getElementById('memory-game-message');
        this.restartButton = document.getElementById('memory-restart-btn');
        
        // Ajouter l'écouteur pour le bouton de redémarrage
        this.restartButton.addEventListener('click', () => this.restartGame());
    }
    
    /**
     * Crée les cartes du jeu
     */
    createCards() {
        // Créer un tableau avec deux cartes pour chaque paire
        const allCards = [];
        
        this.cardPairs.forEach(pair => {
            // Créer deux cartes avec le même id de paire
            for (let i = 0; i < 2; i++) {
                allCards.push({
                    id: `${pair.id}-${i}`,
                    pairId: pair.id,
                    face: pair.face,
                    title: pair.title,
                    description: pair.description,
                    isFlipped: false,
                    isMatched: false
                });
            }
        });
        
        // Mélanger les cartes
        this.cards = this.shuffleArray(allCards);
    }
    
    /**
     * Affiche les cartes dans la grille
     */
    renderCards() {
        this.cardGrid.innerHTML = '';
        
        this.cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'memory-card';
            cardElement.dataset.id = card.id;
            cardElement.dataset.pairId = card.pairId;
            
            // Définir le contenu de la carte
            cardElement.innerHTML = `
                <div class="memory-card-inner">
                    <div class="memory-card-back">
                        ${this.options.cardBackText}
                    </div>
                    <div class="memory-card-front">
                        <div class="memory-card-icon">${card.face}</div>
                        <div class="memory-card-title">${card.title}</div>
                    </div>
                </div>
            `;
            
            // Ajouter les états de la carte
            if (card.isFlipped) cardElement.classList.add('flipped');
            if (card.isMatched) cardElement.classList.add('matched');
            
            // Ajouter l'écouteur d'événement
            cardElement.addEventListener('click', () => this.flipCard(card.id));
            
            // Ajouter la carte à la grille
            this.cardGrid.appendChild(cardElement);
        });
    }
    
    /**
     * Retourne une carte
     * @param {string} cardId - Identifiant de la carte
     */
    flipCard(cardId) {
        // Ignorer si le jeu est verrouillé ou si la carte est déjà retournée/matchée
        const cardIndex = this.cards.findIndex(card => card.id === cardId);
        if (
            this.isLocked || 
            cardIndex === -1 || 
            this.cards[cardIndex].isFlipped || 
            this.cards[cardIndex].isMatched
        ) {
            return;
        }
        
        // Retourner la carte
        this.cards[cardIndex].isFlipped = true;
        document.querySelector(`.memory-card[data-id="${cardId}"]`).classList.add('flipped');
        
        // Ajouter la carte aux cartes retournées
        this.flippedCards.push(this.cards[cardIndex]);
        
        // Vérifier si on a retourné deux cartes
        if (this.flippedCards.length === 2) {
            // Incrémenter le compteur de coups
            this.moveCount++;
            this.movesCountDisplay.textContent = this.moveCount;
            
            // Vérifier si les cartes correspondent
            this.checkForMatch();
        }
    }
    
    /**
     * Vérifie si les deux cartes retournées correspondent
     */
    checkForMatch() {
        this.isLocked = true;
        
        const [card1, card2] = this.flippedCards;
        
        if (card1.pairId === card2.pairId) {
            // Les cartes correspondent
            this.handleMatchedCards();
        } else {
            // Les cartes ne correspondent pas
            setTimeout(() => {
                this.flipCardsBack();
            }, this.options.animationSpeed);
        }
    }
    
    /**
     * Gère les cartes qui correspondent
     */
    handleMatchedCards() {
        // Marquer les cartes comme matchées
        this.flippedCards.forEach(card => {
            card.isMatched = true;
            const cardElement = document.querySelector(`.memory-card[data-id="${card.id}"]`);
            cardElement.classList.add('matched');
            
            // Afficher une info-bulle avec la description
            this.showCardDescription(cardElement, card);
        });
        
        // Incrémenter le compteur de paires
        this.matchedPairs++;
        this.matchedCountDisplay.textContent = this.matchedPairs;
        
        // Réinitialiser les cartes retournées
        this.flippedCards = [];
        this.isLocked = false;
        
        // Vérifier si le jeu est terminé
        if (this.matchedPairs === this.options.pairsCount) {
            this.handleGameComplete();
        }
    }
    
    /**
     * Affiche la description d'une carte
     * @param {HTMLElement} cardElement - Élément de la carte
     * @param {Object} card - Données de la carte
     */
    showCardDescription(cardElement, card) {
        // Créer une info-bulle
        const tooltip = document.createElement('div');
        tooltip.className = 'memory-card-tooltip';
        tooltip.textContent = card.description;
        
        // Ajouter l'info-bulle à la carte
        cardElement.appendChild(tooltip);
        
        // Afficher l'info-bulle
        setTimeout(() => {
            tooltip.classList.add('visible');
            
            // Masquer l'info-bulle après quelques secondes
            setTimeout(() => {
                tooltip.classList.remove('visible');
                setTimeout(() => {
                    tooltip.remove();
                }, 500);
            }, 3000);
        }, 500);
    }
    
    /**
     * Retourne les cartes face cachée
     */
    flipCardsBack() {
        this.flippedCards.forEach(card => {
            card.isFlipped = false;
            document.querySelector(`.memory-card[data-id="${card.id}"]`).classList.remove('flipped');
        });
        
        // Réinitialiser les cartes retournées
        this.flippedCards = [];
        this.isLocked = false;
    }
    
    /**
     * Gère la fin du jeu
     */
    handleGameComplete() {
        // Arrêter le timer
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // Afficher le message de fin
        this.gameMessage.innerHTML = `
            <h3>Bravo ! 🎉</h3>
            <p>Tu as trouvé toutes les paires en ${this.moveCount} coups${this.options.timeLimit > 0 ? ` et ${this.options.timeLimit - this.timeRemaining} secondes` : ''} !</p>
            <p>Tu connais maintenant quelques concepts de l'intelligence artificielle.</p>
            <button id="memory-new-game-btn" class="memory-btn">Nouvelle partie</button>
        `;
        
        this.gameMessage.classList.remove('hidden');
        
        // Écouteur pour le bouton de nouvelle partie
        document.getElementById('memory-new-game-btn').addEventListener('click', () => {
            this.restartGame();
            this.gameMessage.classList.add('hidden');
        });
        
        // Enregistrer la progression
        if (typeof markProgress === 'function') {
            markProgress('IA', 'memory_game_complete');
        }
        
        // Appeler le callback si fourni
        if (typeof this.options.onGameComplete === 'function') {
            this.options.onGameComplete({
                moveCount: this.moveCount,
                timeSpent: this.options.timeLimit > 0 ? this.options.timeLimit - this.timeRemaining : 0
            });
        }
    }
    
    /**
     * Démarre le timer
     */
    startTimer() {
        if (this.options.timeLimit <= 0) return;
        
        this.timer = setInterval(() => {
            this.timeRemaining--;
            
            if (this.timerDisplay) {
                this.timerDisplay.textContent = this.formatTime(this.timeRemaining);
            }
            
            if (this.timeRemaining <= 0) {
                clearInterval(this.timer);
                this.handleTimeUp();
            }
        }, 1000);
    }
    
    /**
     * Gère la fin du temps
     */
    handleTimeUp() {
        this.isLocked = true;
        
        // Afficher le message de fin de temps
        this.gameMessage.innerHTML = `
            <h3>Temps écoulé ! ⏱️</h3>
            <p>Tu as trouvé ${this.matchedPairs} paires sur ${this.options.pairsCount}.</p>
            <p>Continue de t'entraîner pour être plus rapide !</p>
            <button id="memory-restart-btn-timeout" class="memory-btn">Réessayer</button>
        `;
        
        this.gameMessage.classList.remove('hidden');
        
        // Écouteur pour le bouton de redémarrage
        document.getElementById('memory-restart-btn-timeout').addEventListener('click', () => {
            this.restartGame();
            this.gameMessage.classList.add('hidden');
        });
    }
    
    /**
     * Redémarre le jeu
     */
    restartGame() {
        // Arrêter le timer
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // Réinitialiser l'état du jeu
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.isLocked = false;
        this.timeRemaining = this.options.timeLimit;
        this.moveCount = 0;
        
        // Générer de nouvelles cartes
        this.cardPairs = this.getCardPairs();
        this.createCards();
        
        // Mettre à jour l'affichage
        this.renderCards();
        if (this.matchedCountDisplay) this.matchedCountDisplay.textContent = '0';
        if (this.movesCountDisplay) this.movesCountDisplay.textContent = '0';
        if (this.timerDisplay) this.timerDisplay.textContent = this.formatTime(this.timeRemaining);
        
        // Masquer le message
        if (this.gameMessage) this.gameMessage.classList.add('hidden');
        
        // Redémarrer le timer
        if (this.options.timeLimit > 0 && this.options.showTimer) {
            this.startTimer();
        }
    }
    
    /**
     * Formate le temps en minutes:secondes
     * @param {number} seconds - Nombre de secondes
     * @returns {string} Temps formaté
     */
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
}

// Initialiser le jeu quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    const memoryContainer = document.getElementById('memory-game-container');
    if (memoryContainer) {
        new MemoryGame('memory-game-container', {
            pairsCount: 6,
            timeLimit: 60,
            showTimer: true,
            onGameComplete: (stats) => {
                console.log('Jeu terminé !', stats);
                // Vous pouvez ajouter une logique supplémentaire ici
            }
        });
    }
});