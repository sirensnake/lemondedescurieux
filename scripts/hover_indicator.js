document.addEventListener('DOMContentLoaded', () => {
  const img = document.querySelector('.mindmap');
  const halo = document.getElementById('hover-indicator');
  const areas = document.querySelectorAll('map[name="matieresmap"] area');
  
  // Fonction pour recalculer l'échelle et les positions pour l'image redimensionnée
  function updateMapCoordinates() {
      // Masquer le halo pendant le recalcul
      halo.style.opacity = '0';
      
      if (!img || !areas.length) return;
      
      // Calculer l'échelle actuelle de l'image
      const scale = img.clientWidth / img.naturalWidth;
      
      // Appliquer l'échelle à chaque zone
      areas.forEach(area => {
          // Sauvegarder les coordonnées originales si ce n'est pas déjà fait
          if (!area.dataset.originalCoords) {
              area.dataset.originalCoords = area.coords;
          }
          
          // Recalculer les coordonnées avec l'échelle actuelle
          const originalCoords = area.dataset.originalCoords.split(',');
          const scaledCoords = originalCoords.map(coord => Math.round(parseInt(coord) * scale));
          area.coords = scaledCoords.join(',');
      });
  }
  
  // Gestion du halo de survol
  function placeHalo(area) {
      if (!area || !halo) return;
      
      const [x, y, r] = area.coords.split(',').map(Number);
      
      halo.style.width = `${r * 2}px`;
      halo.style.height = `${r * 2}px`;
      halo.style.left = `${x}px`;
      halo.style.top = `${y}px`;
      halo.style.opacity = '1';
  }
  
  // Attacher les événements
  if (areas && halo) {
      areas.forEach(area => {
          area.addEventListener('mouseenter', () => placeHalo(area));
          area.addEventListener('mouseleave', () => halo.style.opacity = '0');
          
          // Support tactile pour mobile
          area.addEventListener('touchstart', (e) => {
              e.preventDefault(); // Empêcher le zoom sur les appareils tactiles
              placeHalo(area);
          });
      });
  }
  
  // Mettre à jour les coordonnées lors du chargement initial et du redimensionnement
  window.addEventListener('load', updateMapCoordinates);
  window.addEventListener('resize', () => {
      updateMapCoordinates();
      halo.style.opacity = '0';
  });
  
  // Masquer le loader quand tout est chargé
  window.addEventListener('load', () => {
      const loader = document.getElementById('loader');
      if (loader) loader.style.display = 'none';
  });
  
  // Initialiser tout de suite si l'image est déjà chargée
  if (img.complete) {
      updateMapCoordinates();
  }
});