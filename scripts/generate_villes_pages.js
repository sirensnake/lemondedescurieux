// ✅ Script Node.js pour générer les pages HTML des villes avec quiz verrouillé
const fs = require("fs");
const path = require("path");

const villesFile = path.join(__dirname, "../data/villes.json");
const outputDir = path.join(__dirname, "../villes");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.readFile(villesFile, "utf8", (err, data) => {
  if (err) throw err;

  const villes = JSON.parse(data);

  villes.forEach((ville) => {
    if (!ville || !ville.nom) return;

    const fileName = `${(ville.fichier || ville.nom)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9- ]/g, "")
      .replace(/ /g, "-")}.html`;

    const atouts = ville.contenu?.map(item => `<li>${item}</li>`).join("\n") || "";
    const sites = ville.sites?.map(site => `<li>${site}</li>`).join("\n") || "";
    const funfact = ville.funfact ? `<p><strong>Fun fact :</strong> ${ville.funfact}</p>` : "";

    let quizHTML = "";
    if (ville.quiz) {
      console.log("🧪 Quiz détecté pour :", ville.nom);
      quizHTML = `
        <div class="quiz">
          <h3>🧠 Quiz : ${ville.quiz.question}</h3>
          <ul>
            ${ville.quiz.reponses.map((r, i) => `
              <li><button class="quiz-button" data-index="${i}">${r}</button></li>
            `).join("\n")}
          </ul>
          <p class="result"></p>
        </div>
        <script>
          document.querySelectorAll('.quiz-button').forEach(btn => {
            btn.addEventListener('click', function () {
              const index = parseInt(this.dataset.index);
              const bonne = ${JSON.stringify(ville.quiz.bonneReponse)};
              const result = document.querySelector('.quiz .result');

              if (index === bonne) {
                result.innerHTML = '🎉 <strong>Bravo !</strong>';
                result.style.color = 'green';
              } else {
                result.innerHTML = '❌ <strong>Essaie encore !</strong>';
                result.style.color = 'red';
              }

              // 🔒 Verrouiller tous les boutons après réponse
              document.querySelectorAll('.quiz-button').forEach(b => b.disabled = true);
            });
          });
        </script>
      `;
    } else {
      console.warn("❌ Aucun quiz détecté pour :", ville.nom);
    }

    const content = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${ville.nom} - Découverte</title>
  <link rel="stylesheet" href="../styles/section_style.css">
</head>
<body>
  <h1>Bienvenue à ${ville.nom}</h1>
  <div class="content">
    <img src="../../${ville.image}" alt="${ville.nom}" class="illustration">
    <p><strong>${ville.description}</strong></p>
    ${atouts ? `<h3>Cette ville est connue pour :</h3><ul>${atouts}</ul>` : ""}
    ${sites ? `<h3>À ne pas manquer :</h3><ul>${sites}</ul>` : ""}
    ${funfact}
    ${quizHTML}
    <a href="../carte_france.html" class="back-button">← Retour à la carte</a>
  </div>
</body>
</html>`;

    const outputPath = path.join(outputDir, fileName);
    fs.writeFileSync(outputPath, content, "utf8");
    console.log(`✅ Page générée : ${fileName}`);
  });
});
