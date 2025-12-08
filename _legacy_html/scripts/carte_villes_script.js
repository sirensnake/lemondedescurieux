document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".carte-container");

  // 1. Charger les villes dynamiquement depuis villes.json
  fetch("data/villes.json")
    .then(response => response.json())
    .then(villes => {
      villes.forEach(ville => {
        const div = document.createElement("div");
        div.className = "ville";
        div.style.top = ville.top;
        div.style.left = ville.left;
        div.dataset.ville = ville.nom;
        div.dataset.description = ville.description;
        div.textContent = ville.nom;

        // Affiche une légende au clic
        div.addEventListener("click", function () {
          // Convertit le nom de la ville en nom de fichier (ex : Paris → paris.html)
          const nomFichier = `villes/${ville.nom.toLowerCase().replace(/é/g, "e").replace(/è/g, "e")}.html`;
          window.location.href = nomFichier;
        });
        

        // (facultatif) rendre la ville déplaçable
        rendreDeplacable(div);

        // Ajoute la ville à la carte
        container.appendChild(div);
      });
    })
    .catch(error => {
      console.error("❌ Erreur lors du chargement du fichier JSON :", error);
    });

  // 2. Rendre les villes déplaçables (optionnel)
  function rendreDeplacable(element) {
    let offsetX, offsetY, isDragging = false;

    element.addEventListener("mousedown", function (e) {
      isDragging = true;
      offsetX = e.clientX - element.getBoundingClientRect().left;
      offsetY = e.clientY - element.getBoundingClientRect().top;
      element.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", function (e) {
      if (!isDragging) return;
      const containerRect = container.getBoundingClientRect();
      let x = e.clientX - containerRect.left - offsetX;
      let y = e.clientY - containerRect.top - offsetY;

      const percentLeft = (x / container.offsetWidth) * 100;
      const percentTop = (y / container.offsetHeight) * 100;

      element.style.left = `${percentLeft}%`;
      element.style.top = `${percentTop}%`;
    });

    document.addEventListener("mouseup", function () {
      isDragging = false;
      element.style.cursor = "grab";
    });
  }
});
