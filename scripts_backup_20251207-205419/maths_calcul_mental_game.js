class MinecraftMathGame {
    constructor(containerId, options = {}) {
      this.container = document.getElementById(containerId);
      this.options = {
        duration: 60,
        difficulty: 'normal',
        operations: ['addition', 'subtraction', 'multiplication'],
        saveScores: true,
        ...options
      };
      
      this.score = 0;
      this.timeLeft = this.options.duration;
      this.isPlaying = false;
      this.timer = null;
      this.currentProblem = null;
      this.streak = 0; // Combo de bonnes réponses consécutives
      this.xpLevel = 1; // Niveau d'XP
      this.xpPoints = 0; // Points d'XP actuels
      this.xpNeeded = 10; // Points d'XP nécessaires pour monter de niveau
      
      // Sons Minecraft
      this.sounds = {
        click: new Audio('sounds/minecraft/click.mp3'),
        success: new Audio('sounds/minecraft/orb.mp3'),
        fail: new Audio('sounds/minecraft/break.mp3'),
        levelUp: new Audio('sounds/minecraft/levelup.mp3'),
        gameOver: new Audio('sounds/minecraft/anvil_land.mp3')
      };
      
      this.init();
    }
    
    init() {
      // Créer l'interface du jeu avec éléments Minecraft
      this.container.innerHTML = `
        <div class="math-game">
          <div class="game-header">
            <div class="game-score">
              <span class="minecraft-icon diamond"></span>
              Score: <span id="score-value">0</span>
            </div>
            <div class="game-timer">
              <span class="minecraft-icon redstone"></span>
              Temps: <span id="time-left">${this.options.duration}</span>s
            </div>
          </div>
          
          <div class="game-content">
            <div class="game-problem" id="math-problem">
              <div class="problem-text">Prêt à miner des nombres ?</div>
            </div>
            
            <div class="game-input">
              <input type="number" id="answer-input" placeholder="Ta réponse" disabled>
              <button id="submit-answer" class="game-button">
                <span class="minecraft-icon emerald"></span>Valider
              </button>
            </div>
            
            <div class="game-feedback" id="feedback"></div>
            
            <!-- Barre de combo -->
            <div class="combo-display" id="combo-display" style="display: none;">
              <span>Combo: <span id="combo-count">0</span>x</span>
            </div>
          </div>
          
          <div class="game-controls">
            <button id="start-game" class="game-button primary">
              Commencer l'aventure
            </button>
            <button id="help-button" class="game-button">
              Manuel du mineur
            </button>
          </div>
          
          <!-- Barre d'XP -->
          <div class="xp-bar-container">
            <div class="xp-level">Niveau <span id="xp-level">1</span></div>
            <div class="xp-bar" id="xp-bar"></div>
          </div>
        </div>
      `;
      
      // Récupération des éléments DOM
      this.scoreElement = document.getElementById('score-value');
      this.timeElement = document.getElementById('time-left');
      this.problemElement = document.getElementById('math-problem');
      this.inputElement = document.getElementById('answer-input');
      this.submitButton = document.getElementById('submit-answer');
      this.feedbackElement = document.getElementById('feedback');
      this.startButton = document.getElementById('start-game');
      this.helpButton = document.getElementById('help-button');
      this.comboDisplay = document.getElementById('combo-display');
      this.comboCount = document.getElementById('combo-count');
      this.xpLevelElement = document.getElementById('xp-level');
      this.xpBarElement = document.getElementById('xp-bar');
      
      // Ajout des écouteurs d'événements
      this.startButton.addEventListener('click', () => {
        this.playSound('click');
        this.startGame();
      });
      this.submitButton.addEventListener('click', () => {
        this.playSound('click');
        this.checkAnswer();
      });
      this.inputElement.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.checkAnswer();
      });
      this.helpButton.addEventListener('click', () => {
        this.playSound('click');
        this.showHelp();
      });
      
      // Chargement des meilleurs scores
      this.loadHighScores();
    }
    
    startGame() {
      // Réinitialisation des variables
      this.score = 0;
      this.timeLeft = this.options.duration;
      this.isPlaying = true;
      this.streak = 0;
      this.xpLevel = 1;
      this.xpPoints = 0;
      this.xpNeeded = 10;
      
      // Mise à jour de l'interface
      this.scoreElement.textContent = '0';
      this.timeElement.textContent = this.timeLeft;
      this.feedbackElement.textContent = '';
      this.startButton.textContent = 'Recommencer';
      this.inputElement.disabled = false;
      this.inputElement.focus();
      this.comboDisplay.style.display = 'none';
      this.updateXPBar();
      
      // Génération du premier problème
      this.generateProblem();
      
      // Démarrage du timer
      this.timer = setInterval(() => {
        this.timeLeft--;
        this.timeElement.textContent = this.timeLeft;
        
        if (this.timeLeft <= 0) {
          this.endGame();
        }
      }, 1000);
    }
    
    generateProblem() {
      // Choix aléatoire du type d'opération avec terminologie Minecraft
      const operationType = this.options.operations[
        Math.floor(Math.random() * this.options.operations.length)
      ];
      
      // Génération des nombres en fonction de la difficulté
      let num1, num2, answer, operator, problemText, minecraftContext;
      
      // Contextes Minecraft pour les problèmes
      const contexts = [
        "blocs", "diamants", "émeraudes", "pommes", "lingots", "redstone", "zombies"
      ];
      
      minecraftContext = contexts[Math.floor(Math.random() * contexts.length)];
      
      switch (operationType) {
        case 'addition':
          num1 = this.getRandomNumber(this.options.difficulty, 'addition', 'first');
          num2 = this.getRandomNumber(this.options.difficulty, 'addition', 'second');
          answer = num1 + num2;
          operator = '+';
          break;
          
        case 'subtraction':
          num1 = this.getRandomNumber(this.options.difficulty, 'subtraction', 'first');
          num2 = this.getRandomNumber(this.options.difficulty, 'subtraction', 'second');
          if (num2 > num1) [num1, num2] = [num2, num1];
          answer = num1 - num2;
          operator = '-';
          break;
          
        case 'multiplication':
          num1 = this.getRandomNumber(this.options.difficulty, 'multiplication', 'first');
          num2 = this.getRandomNumber(this.options.difficulty, 'multiplication', 'second');
          answer = num1 * num2;
          operator = '×';
          break;
      }
      
      // Texte du problème avec contexte Minecraft
      problemText = `${num1} ${operator} ${num2} = ?`;
      
      // Mise à jour de l'interface
      this.problemElement.innerHTML = `
        <div class="problem-text">${problemText}</div>
        <div class="problem-context">Tu as ${num1} ${minecraftContext}...</div>
      `;
      this.inputElement.value = '';
      
      // Sauvegarde du problème actuel
      this.currentProblem = {
        text: problemText,
        answer: answer,
        operationType: operationType,
        context: minecraftContext
      };
    }
    
    getRandomNumber(difficulty, operation, position) {
      // Même fonction que l'original
      let min = 1;
      let max = 10;
      
      switch (difficulty) {
        case 'easy':
          max = (operation === 'multiplication') ? 5 : 10;
          break;
        case 'normal':
          max = (operation === 'multiplication') ? 10 : 50;
          break;
        case 'hard':
          min = (operation === 'multiplication') ? 5 : 10;
          max = (operation === 'multiplication') ? 20 : 100;
          break;
      }
      
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    checkAnswer() {
      if (!this.isPlaying) return;
      
      const userAnswer = parseInt(this.inputElement.value);
      
      if (isNaN(userAnswer)) {
        this.feedbackElement.textContent = 'Entre un nombre valide!';
        this.feedbackElement.className = 'game-feedback warning';
        return;
      }
      
      // Vérification de la réponse
      const isCorrect = userAnswer === this.currentProblem.answer;
      
      // Mise à jour du score et du feedback
      if (isCorrect) {
        // Gestion du streak (combo)
        this.streak++;
        
        // Bonus de points pour les combos
        let streakMultiplier = 1;
        if (this.streak >= 5) streakMultiplier = 2;
        if (this.streak >= 10) streakMultiplier = 3;
        
        // Calcul des points
        const basePoints = this.getPointsForOperation(this.currentProblem.operationType);
        const earnedPoints = basePoints * streakMultiplier;
        
        // Mise à jour du score
        this.score += earnedPoints;
        this.scoreElement.textContent = this.score;
        
        // Ajout d'XP
        this.addXP(basePoints);
        
        // Affichage du combo
        if (this.streak >= 2) {
          this.comboDisplay.style.display = 'block';
          this.comboCount.textContent = this.streak;
        }
        
        // Feedback Minecraft
        const feedbacks = [
          "Super! Tu as trouvé un diamant! +",
          "Parfait! Tu as miné un bloc d'émeraude! +",
          "Excellent! Tu as forgé un lingot! +"
        ];
        
        this.feedbackElement.textContent = feedbacks[Math.floor(Math.random() * feedbacks.length)] 
          + earnedPoints + " points";
        this.feedbackElement.className = 'game-feedback correct';
        
        // Son de succès
        this.playSound('success');
        
        // Générer un nouveau problème
        this.generateProblem();
      } else {
        // Réinitialisation du streak
        this.streak = 0;
        this.comboDisplay.style.display = 'none';
        
        // Feedback d'erreur style Minecraft
        this.feedbackElement.textContent = "Un creeper a explosé ta réponse! Essaie encore!";
        this.feedbackElement.className = 'game-feedback incorrect';
        
        // Effet de dégâts
        this.problemElement.classList.add('damage-effect');
        setTimeout(() => {
          this.problemElement.classList.remove('damage-effect');
        }, 500);
        
        // Son d'échec
        this.playSound('fail');
      }
    }
    
    getPointsForOperation(operation) {
      // Points par opération (comme dans la version originale)
      switch (operation) {
        case 'addition': return 1;
        case 'subtraction': return 2;
        case 'multiplication': return 3;
        default: return 1;
      }
    }
    
    addXP(amount) {
      // Ajouter des points d'XP
      this.xpPoints += amount;
      
      // Vérifier si le joueur monte de niveau
      if (this.xpPoints >= this.xpNeeded) {
        this.xpLevel++;
        this.xpPoints -= this.xpNeeded;
        this.xpNeeded = Math.floor(this.xpNeeded * 1.5); // Augmentation de l'XP nécessaire
        
        // Afficher l'animation de level up
        this.showLevelUpMessage();
        
        // Son de level up
        this.playSound('levelUp');
      }
      
      // Mettre à jour la barre d'XP
      this.updateXPBar();
    }
    
    updateXPBar() {
      // Mise à jour de l'affichage de l'XP
      this.xpLevelElement.textContent = this.xpLevel;
      const percentage = (this.xpPoints / this.xpNeeded) * 100;
      this.xpBarElement.style.width = `${percentage}%`;
    }
    
    showLevelUpMessage() {
      // Créer un message de level up style Minecraft
      const levelUpMsg = document.createElement('div');
      levelUpMsg.className = 'level-up-message';
      levelUpMsg.textContent = `Niveau ${this.xpLevel} atteint!`;
      levelUpMsg.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: gold;
        color: black;
        padding: 10px 20px;
        font-size: 24px;
        border: 2px solid #2d2d2d;
        z-index: 100;
        animation: floatUp 2s forwards;
      `;
      
      this.container.appendChild(levelUpMsg);
      
      // Supprimer après l'animation
      setTimeout(() => {
        this.container.removeChild(levelUpMsg);
      }, 2000);
    }
    
    endGame() {
      // Arrêt du jeu
      clearInterval(this.timer);
      this.isPlaying = false;
      
      // Mise à jour de l'interface
      this.inputElement.disabled = true;
      
      // Message de fin de jeu style Minecraft
      this.feedbackElement.textContent = `La nuit est tombée! Score final: ${this.score} points, Niveau ${this.xpLevel} atteint!`;
      this.feedbackElement.className = 'game-feedback game-over';
      
      // Son de fin de jeu
      this.playSound('gameOver');
      
      // Sauvegarde du score
      if (this.options.saveScores) {
        this.saveScore();
      }
      
      // Affichage du tableau des scores
      this.showHighScores();
    }
    
    saveScore() {
      // Sauvegarde des scores (comme dans la version originale)
      const highScores = JSON.parse(localStorage.getItem('mathGameHighScores')) || [];
      
      highScores.push({
        score: this.score,
        level: this.xpLevel,
        difficulty: this.options.difficulty,
        date: new Date().toISOString()
      });
      
      highScores.sort((a, b) => b.score - a.score);
      const topScores = highScores.slice(0, 10);
      
      localStorage.setItem('mathGameHighScores', JSON.stringify(topScores));
      
      // Mise à jour du système de progression
      if (typeof markProgress === 'function') {
        markProgress("Mathématiques", "jeu_calcul_mental");
        
        // Badges spécifiques Minecraft
        if (this.score >= 50) markProgress("Mathématiques", "badge_mineur_expert");
        if (this.xpLevel >= 5) markProgress("Mathématiques", "badge_maitre_des_nombres");
      }
    }
    
    loadHighScores() {
      // Chargement des scores (comme dans la version originale)
      return JSON.parse(localStorage.getItem('mathGameHighScores')) || [];
    }
    
    showHighScores() {
      // Affichage des scores (style Minecraft)
      const highScores = this.loadHighScores();
      
      let scoresHTML = '<h3>Tableau des explorateurs</h3>';
      
      if (highScores.length === 0) {
        scoresHTML += '<p>Aucun aventurier n\'a encore marqué de points.</p>';
      } else {
        scoresHTML += '<ol class="high-scores-list">';
        highScores.slice(0, 5).forEach((entry, index) => {
          const date = new Date(entry.date).toLocaleDateString();
          const levelInfo = entry.level ? ` - Niveau ${entry.level}` : '';
          scoresHTML += `<li>${entry.score} points${levelInfo} (${this.getDifficultyName(entry.difficulty)}) - ${date}</li>`;
        });
        scoresHTML += '</ol>';
      }
      
      const highScoresElement = document.createElement('div');
      highScoresElement.className = 'high-scores';
      highScoresElement.innerHTML = scoresHTML;
      
      this.feedbackElement.parentNode.insertBefore(highScoresElement, this.feedbackElement.nextSibling);
    }
    
    getDifficultyName(difficulty) {
      // Noms des difficultés style Minecraft
      switch(difficulty) {
        case 'easy': return 'Paisible';
        case 'normal': return 'Normal';
        case 'hard': return 'Difficile';
        default: return difficulty;
      }
    }
    
    showHelp() {
      // Aide style Minecraft
      const helpContent = `
        <div class="help-overlay">
          <div class="help-content">
            <h3>Manuel du mineur de nombres</h3>
            <p>Bienvenue dans l'aventure Mathcraft! Résous des opérations pour collecter des ressources.</p>
            <ul>
              <li>Tu as ${this.options.duration} secondes pour miner le plus de points possible.</li>
              <li>Additions: 1 point (comme le bois)</li>
              <li>Soustractions: 2 points (comme la pierre)</li>
              <li>Multiplications: 3 points (comme le fer)</li>
              <li>Enchaîne les bonnes réponses pour obtenir des combos et multiplier tes points!</li>
              <li>Gagne de l'XP et monte de niveau pour devenir un maître mineur!</li>
            </ul>
            <p>Mode actuel: <strong>${this.getDifficultyName(this.options.difficulty)}</strong></p>
            <button id="close-help" class="game-button">Fermer le manuel</button>
          </div>
        </div>
      `;
      
      const helpElement = document.createElement('div');
      helpElement.innerHTML = helpContent;
      document.body.appendChild(helpElement);
      
      document.getElementById('close-help').addEventListener('click', () => {
        this.playSound('click');
        document.body.removeChild(helpElement);
      });
    }
    
    playSound(soundName) {
      // Jouer un son si disponible
      if (this.sounds[soundName]) {
        // Réinitialiser le son pour pouvoir le rejouer
        this.sounds[soundName].currentTime = 0;
        this.sounds[soundName].play().catch(e => {
          // Gestion silencieuse des erreurs de lecture audio
          console.log(`Impossible de jouer le son: ${e.message}`);
        });
      }
    }
  }
  
  // Injecter les styles CSS pour l'animation de level up
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    @keyframes floatUp {
      0% { transform: translate(-50%, -50%); opacity: 1; }
      100% { transform: translate(-50%, -150%); opacity: 0; }
    }
    
    /* Animation pour les blocs qui se brisent */
    @keyframes blockBreak {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.5; }
      100% { transform: scale(0); opacity: 0; }
    }
  `;
  document.head.appendChild(styleElement);
  
  // Initialisation du jeu
  document.addEventListener('DOMContentLoaded', function() {
    // Créer une div pour le jeu s'il n'existe pas déjà
    let gameContainer = document.getElementById('math-game-container');
    if (!gameContainer) {
      gameContainer = document.createElement('div');
      gameContainer.id = 'math-game-container';
      
      // Trouver un endroit approprié pour insérer le jeu
      const contentSection = document.querySelector('.content');
      if (contentSection) {
        contentSection.appendChild(gameContainer);
      } else {
        document.body.appendChild(gameContainer);
      }
    }
    
    // Précharger les ressources
    const gameAssets = {
      sounds: [
        'sounds/minecraft/click.mp3',
        'sounds/minecraft/orb.mp3',
        'sounds/minecraft/break.mp3',
        'sounds/minecraft/levelup.mp3',
        'sounds/minecraft/anvil_land.mp3'
      ],
      images: [
        'images/minecraft/diamond.png',
        'images/minecraft/emerald.png',
        'images/minecraft/redstone.png'
      ]
    };
    
    // Initialiser le jeu
    const game = new MinecraftMathGame('math-game-container', {
      difficulty: 'normal',
      duration: 60,
      operations: ['addition', 'subtraction', 'multiplication']
    });
  });
  // Amélioration de scripts/maths_calcul_mental_game.js
class CalculMentalGame {
  constructor(difficulty = 'easy') {
    this.difficulty = difficulty;
    this.score = 0;
    this.timeLeft = 60;
    this.isRunning = false;
  }
  
  generateQuestion() {
    // Génération de questions adaptées au niveau
  }
  
  startGame() {
    // Démarrage du jeu
  }
  
  checkAnswer(userAnswer) {
    // Vérification de la réponse
  }
  
  endGame() {
    // Fin du jeu et affichage des résultats
  }
}