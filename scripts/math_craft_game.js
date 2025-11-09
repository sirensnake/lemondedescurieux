/**
 * Jeu de calcul mental style Minecraft
 * Pour Le Monde des Curieux
 */

class MathCraftGame {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      this.score = 0;
      this.timeLeft = 60;
      this.isPlaying = false;
      this.timer = null;
      this.currentProblem = null;
      
      this.init();
    }
    
    init() {
      // Créer l'interface du jeu
      this.container.innerHTML = `
        <div class="math-game">
          <div class="game-header">
            <div class="game-score">
              Score: <span id="score-value">0</span>
            </div>
            <div class="game-timer">
              Temps: <span id="time-left">60</span>s
            </div>
          </div>
          
          <div class="game-content">
            <div class="game-problem" id="math-problem">
              <div class="problem-text">Prêt à miner des nombres ?</div>
            </div>
            
            <div class="game-input">
              <input type="number" id="answer-input" placeholder="Ta réponse" disabled>
              <button id="submit-answer" class="game-button">Valider</button>
            </div>
            
            <div class="game-feedback" id="feedback"></div>
          </div>
          
          <div class="game-controls">
            <button id="start-game" class="game-button primary">
              Commencer l'aventure
            </button>
            <button id="help-button" class="game-button">
              Manuel du mineur
            </button>
          </div>
        </div>
      `;
      
      // Récupérer les éléments du DOM
      this.scoreElement = document.getElementById('score-value');
      this.timeElement = document.getElementById('time-left');
      this.problemElement = document.getElementById('math-problem');
      this.inputElement = document.getElementById('answer-input');
      this.submitButton = document.getElementById('submit-answer');
      this.feedbackElement = document.getElementById('feedback');
      this.startButton = document.getElementById('start-game');
      this.helpButton = document.getElementById('help-button');
      
      // Ajouter les écouteurs d'événements
      this.startButton.addEventListener('click', () => this.startGame());
      this.submitButton.addEventListener('click', () => this.checkAnswer());
      this.inputElement.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.checkAnswer();
      });
      this.helpButton.addEventListener('click', () => this.showHelp());
    }
    
    startGame() {
      // Réinitialiser les variables
      this.score = 0;
      this.timeLeft = 60;
      this.isPlaying = true;
      
      // Mise à jour de l'interface
      this.scoreElement.textContent = '0';
      this.timeElement.textContent = this.timeLeft;
      this.feedbackElement.textContent = '';
      this.startButton.textContent = 'Recommencer';
      this.inputElement.disabled = false;
      this.inputElement.focus();
      
      // Générer le premier problème
      this.generateProblem();
      
      // Démarrer le timer
      this.timer = setInterval(() => {
        this.timeLeft--;
        this.timeElement.textContent = this.timeLeft;
        
        if (this.timeLeft <= 0) {
          this.endGame();
        }
      }, 1000);
    }
    
    generateProblem() {
      // Types d'opérations
      const operations = ['addition', 'subtraction', 'multiplication'];
      const operationType = operations[Math.floor(Math.random() * operations.length)];
      
      // Générer les nombres et l'opération
      let num1, num2, answer, operator;
      
      switch (operationType) {
        case 'addition':
          num1 = Math.floor(Math.random() * 50) + 1;
          num2 = Math.floor(Math.random() * 50) + 1;
          answer = num1 + num2;
          operator = '+';
          break;
          
        case 'subtraction':
          num1 = Math.floor(Math.random() * 50) + 1;
          num2 = Math.floor(Math.random() * 50) + 1;
          // S'assurer que la réponse est positive
          if (num2 > num1) [num1, num2] = [num2, num1];
          answer = num1 - num2;
          operator = '-';
          break;
          
        case 'multiplication':
          num1 = Math.floor(Math.random() * 12) + 1;
          num2 = Math.floor(Math.random() * 12) + 1;
          answer = num1 * num2;
          operator = '×';
          break;
      }
      
      // Contextes Minecraft
      const contexts = ["blocs", "diamants", "émeraudes", "pommes", "lingots"];
      const context = contexts[Math.floor(Math.random() * contexts.length)];
      
      // Créer le texte du problème
      const problemText = `${num1} ${operator} ${num2} = ?`;
      
      // Mettre à jour l'interface
      this.problemElement.innerHTML = `
        <div class="problem-text">${problemText}</div>
        <div class="problem-context">Tu as ${num1} ${context}...</div>
      `;
      this.inputElement.value = '';
      
      // Sauvegarder le problème actuel
      this.currentProblem = {
        text: problemText,
        answer: answer,
        operationType: operationType
      };
    }
    
    checkAnswer() {
      if (!this.isPlaying) return;
      
      const userAnswer = parseInt(this.inputElement.value);
      
      if (isNaN(userAnswer)) {
        this.feedbackElement.textContent = 'Entre un nombre valide!';
        this.feedbackElement.className = 'game-feedback warning';
        return;
      }
      
      // Vérifier la réponse
      const isCorrect = userAnswer === this.currentProblem.answer;
      
      if (isCorrect) {
        // Points selon l'opération
        let points = 1;
        if (this.currentProblem.operationType === 'subtraction') points = 2;
        if (this.currentProblem.operationType === 'multiplication') points = 3;
        
        // Mise à jour du score
        this.score += points;
        this.scoreElement.textContent = this.score;
        
        // Feedback
        this.feedbackElement.textContent = `Correct! +${points} points`;
        this.feedbackElement.className = 'game-feedback correct';
        
        // Générer un nouveau problème
        this.generateProblem();
      } else {
        // Feedback d'erreur
        this.feedbackElement.textContent = "Incorrect. Essaie encore!";
        this.feedbackElement.className = 'game-feedback incorrect';
        
        // Effet visuel de dégâts
        this.problemElement.classList.add('damage-effect');
        setTimeout(() => {
          this.problemElement.classList.remove('damage-effect');
        }, 500);
      }
    }
    
    endGame() {
      // Arrêt du jeu
      clearInterval(this.timer);
      this.isPlaying = false;
      
      // Mise à jour de l'interface
      this.inputElement.disabled = true;
      this.feedbackElement.textContent = `Fin de l'aventure! Score final: ${this.score}`;
      this.feedbackElement.className = 'game-feedback game-over';
      
      // Sauvegarder le score dans localStorage
      const highScores = JSON.parse(localStorage.getItem('mathcraftScores')) || [];
      highScores.push({
        score: this.score,
        date: new Date().toISOString()
      });
      
      // Trier et limiter à 10 meilleurs scores
      highScores.sort((a, b) => b.score - a.score);
      localStorage.setItem('mathcraftScores', JSON.stringify(highScores.slice(0, 10)));
      
      // Mise à jour du système de progression
      if (typeof markProgress === 'function') {
        markProgress("Mathématiques", "mathcraft");
      }
      
      // Afficher les meilleurs scores
      this.showHighScores();
    }
    
    showHighScores() {
      const highScores = JSON.parse(localStorage.getItem('mathcraftScores')) || [];
      
      let scoresHTML = '<h3>Meilleurs scores</h3>';
      
      if (highScores.length === 0) {
        scoresHTML += '<p>Aucun score enregistré pour le moment.</p>';
      } else {
        scoresHTML += '<ol class="high-scores-list">';
        highScores.slice(0, 5).forEach(entry => {
          const date = new Date(entry.date).toLocaleDateString();
          scoresHTML += `<li>${entry.score} points - ${date}</li>`;
        });
        scoresHTML += '</ol>';
      }
      
      const highScoresElement = document.createElement('div');
      highScoresElement.className = 'high-scores';
      highScoresElement.innerHTML = scoresHTML;
      
      this.feedbackElement.parentNode.insertBefore(highScoresElement, this.feedbackElement.nextSibling);
    }
    
    showHelp() {
      const helpContent = `
        <div class="help-overlay">
          <div class="help-content">
            <h3>Manuel du mineur de nombres</h3>
            <p>Bienvenue dans l'aventure Mathcraft!</p>
            <ul>
              <li>Tu as 60 secondes pour miner le plus de points possible.</li>
              <li>Additions: 1 point (comme le bois)</li>
              <li>Soustractions: 2 points (comme la pierre)</li>
              <li>Multiplications: 3 points (comme le fer)</li>
            </ul>
            <button id="close-help" class="game-button">Fermer le manuel</button>
          </div>
        </div>
      `;
      
      const helpElement = document.createElement('div');
      helpElement.innerHTML = helpContent;
      document.body.appendChild(helpElement);
      
      document.getElementById('close-help').addEventListener('click', () => {
        document.body.removeChild(helpElement);
      });
    }
  }
  
  // Initialisation du jeu quand la page est chargée
  document.addEventListener('DOMContentLoaded', function() {
    const gameContainer = document.getElementById('math-game-container');
    if (gameContainer) {
      const game = new MathCraftGame('math-game-container');
    }
  });