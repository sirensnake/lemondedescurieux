// hover_indicator.js — centrage par translation
document.addEventListener('DOMContentLoaded', () => {
    const img   = document.querySelector('.mindmap');           // image
    const halo  = document.getElementById('hover-indicator');   // cercle animé
    const areas = document.querySelectorAll('map[name="matieresmap"] area');
  
    // halo centré par transform
    halo.style.transform = 'translate(-50%, -50%)';
  
    function place(area) {
      const [x, y, r] = area.coords.split(',').map(Number);
      const s   = img.clientWidth / img.naturalWidth;   // échelle
      const cx  = x * s;
      const cy  = y * s;
      const rad = r * s;
  
      halo.style.width  = `${rad * 2}px`;
      halo.style.height = `${rad * 2}px`;
      halo.style.left   = `${cx}px`;   // centre X
      halo.style.top    = `${cy}px`;   // centre Y
      halo.style.opacity = '1';
    }
  
    areas.forEach(area => {
      area.addEventListener('mouseenter', () => place(area));
      area.addEventListener('mouseleave', () => halo.style.opacity = '0');
    });
  
    window.addEventListener('resize', () => halo.style.opacity = '0');
  });
  // ... fin du script existant
  window.addEventListener('load', () => {
    const l = document.getElementById('loader');
    if (l) l.style.display = 'none';
  });
  
  
  