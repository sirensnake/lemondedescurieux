const fs = require("fs");
const path = require("path");

// Chemins corrigés depuis le dossier "scripts/"
const villesFile = path.join(__dirname, "../data/villes.json");
const outputDir = path.join(__dirname, "../villes");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.readFile(villesFile, "utf8", (err, data) => {
  if (err) throw err;

  const villes = JSON.parse(data);

  villes.forEach((ville) => {
    const fileName = `${ville.nom
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ /g, "-")}.html`;

    const atouts = ville.contenu?.map(item => `<li>${item}</li>`).join("\n") || "";
    const sites = ville.sites?.map(site => `<li>${site}</li>`).join("\n") || "";
    const funfact = ville.funfact ? `<p><strong>Fun fact :</strong> ${ville.funfact}</p>` : "";

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
    <a href="../carte_france.html" class="back-button">← Retour à la carte</a>
  </div>
</body>
</html>`;

    const outputPath = path.join(outputDir, fileName);
    fs.writeFileSync(outputPath, content, "utf8");
    console.log(`✅ Page générée : ${fileName}`);
  });
});
