// === Thème CurioCraft avec meilleure lisibilité ===

// 🎨 Gestion du changement de thème visuel
window.addEventListener("DOMContentLoaded", () => {
    const themeSauvegarde = localStorage.getItem("themeSelectionne");
    if (themeSauvegarde) {
      changerTheme(themeSauvegarde);
      const select = document.getElementById("theme-selector");
      if (select) select.value = themeSauvegarde;
    }
  });
  
  function changerTheme(theme) {
    let fond = "";
    switch (theme) {
      case "herbe":
        fond = "url('images/grass_tile.png')";
        break;
      case "pierre":
        fond = "url('images/stone_tile.png')";
        break;
      case "sable":
        fond = "url('images/sand_tile.png')";
        break;
      default:
        fond = "url('images/grass_tile.png')";
    }
    document.body.style.backgroundImage = fond;
    document.body.style.backgroundSize = "64px 64px";
    document.body.style.backgroundRepeat = "repeat";
    localStorage.setItem("themeSelectionne", theme);
  }
  
  // ✅ Sons globaux
  const successSound = new Audio("sounds/success.mp3");
  successSound.preload = "auto";
  
  // === Projet 1 : Réaction rapide ===
  let startTime;
  let bestTime = null;
  
  function startGame() {
    startTime = Date.now();
    document.getElementById("game-button").style.display = "block";
    document.getElementById("reaction-feedback").innerText = "";
  }
  
  function endGame() {
    successSound.currentTime = 0;
    successSound.play().catch(err => console.warn("Erreur son:", err));
  
    let reactionTime = (Date.now() - startTime) / 1000;
    document.getElementById("reaction-feedback").innerText = `⏱️ Temps de réaction : ${reactionTime.toFixed(3)} secondes!`;
    document.getElementById("game-button").style.display = "none";
  
    if (bestTime === null || reactionTime < bestTime) {
      bestTime = reactionTime;
      document.getElementById("reaction-score").innerText = `🏆 Nouveau meilleur temps : ${bestTime.toFixed(3)} sec !`;
    } else {
      document.getElementById("reaction-score").innerText = `Ton meilleur temps reste : ${bestTime.toFixed(3)} sec.`;
    }
  
    const feedback = document.getElementById("reaction-feedback");
    feedback.style.color = "#2a9d8f";
    feedback.style.transition = "transform 0.3s ease";
    feedback.style.transform = "scale(1.2)";
    setTimeout(() => feedback.style.transform = "scale(1)", 300);
  }
  
  // === Projet 2 : Quiz interactif ===
  let quizData = [
    { question: "Quelle est la capitale de la France ?", options: ["Paris", "Lyon", "Marseille"], answer: "Paris" },
    { question: "Combien font 3 x 4 ?", options: ["7", "12", "9"], answer: "12" },
    { question: "Quel est l’animal qui miaule ?", options: ["Chien", "Chat", "Lapin"], answer: "Chat" }
  ];
  
  let currentQuestion = 0;
  
  function showQuiz() {
    currentQuestion = 0;
    document.getElementById("quiz").style.display = "flex";
    loadQuestion();
  }
  
  function loadQuestion() {
    const data = quizData[currentQuestion];
    const questionEl = document.getElementById("quiz-question");
    const optionsEl = document.getElementById("quiz-options");
    questionEl.textContent = data.question;
    optionsEl.innerHTML = "";
    data.options.forEach(option => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.className = "quiz-option";
      btn.onclick = () => checkAnswer(option);
      optionsEl.appendChild(btn);
    });
  }
  
  function checkAnswer(reponse) {
    const bonneReponse = quizData[currentQuestion].answer;
    if (reponse === bonneReponse) {
      alert("✅ Bravo, c'est correct !");
      successSound.currentTime = 0;
      successSound.play();
    } else {
      alert(`❌ Mauvaise réponse ! La bonne réponse était : ${bonneReponse}`);
    }
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      loadQuestion();
    } else {
      alert("🎉 Tu as terminé le quiz !");
      document.getElementById("quiz").style.display = "none";
    }
  }
  
  function appliquerModificationsQuiz() {
    const code = document.getElementById("quiz-code-zone").value;
    try {
      eval(code);
      alert("🎉 Modifications appliquées ! Clique sur 'Lancer le quiz' pour tester.");
    } catch (e) {
      alert("❌ Erreur dans ton code :\n" + e.message);
    }
  }
  
  // === Projet 3 : Curio saute ===
  let position = 0;
  let saut = false;
  let animationEnCours = false;
  let animationId = null;
  
  function runAnimationCode() {
    animationEnCours = true;
    position = 0;
    document.getElementById("sprite").style.left = "0px";
    bouger();
  }
  
  function bouger() {
    let sprite = document.getElementById("sprite");
    let obstacles = document.querySelectorAll(".obstacle");
    position += 5;
    sprite.style.left = position + "px";
  
    let spriteRect = sprite.getBoundingClientRect();
    for (let obstacle of obstacles) {
      let obsRect = obstacle.getBoundingClientRect();
      if (!saut && spriteRect.right > obsRect.left && spriteRect.left < obsRect.right && spriteRect.bottom > obsRect.top && spriteRect.top < obsRect.bottom) {
        alert("💥 Collision ! Essaie de sauter.");
        cancelAnimationFrame(animationId);
        return;
      }
    }
  
    if (position >= window.innerWidth - 50) {
      successSound.currentTime = 0;
      successSound.play();
      alert("🎉 Bravo, Curio a évité tous les obstacles !");
      return;
    }
    animationId = requestAnimationFrame(bouger);
  }
  
  function sauter() {
    let sprite = document.getElementById("sprite");
    if (!saut && animationEnCours) {
      saut = true;
      new Audio("sounds/jump.wav").play();
      sprite.style.transition = "top 0.3s ease-out";
      sprite.style.top = "50px";
      setTimeout(() => {
        sprite.style.top = "100px";
        saut = false;
      }, 500);
    }
  }
  
  function resetAnimation() {
    let sprite = document.getElementById("sprite");
    position = 0;
    saut = false;
    animationEnCours = false;
    cancelAnimationFrame(animationId);
    sprite.style.left = "0px";
    sprite.style.top = "100px";
    sprite.style.transition = "none";
    const obstacles = document.querySelectorAll(".obstacle");
    let startX = 300;
    obstacles.forEach((obstacle, index) => {
      obstacle.style.left = (startX + index * 300) + "px";
    });
  }
  