document.addEventListener('DOMContentLoaded',()=>{
    const img=document.querySelector('.mindmap');
    const halo=document.getElementById('hover-indicator');
    halo.style.transform='translate(-50%,-50%)';
    const areas=document.querySelectorAll('map[name="matieresmap"] area');
  
    function place(a){
      const [x,y,r]=a.coords.split(',').map(Number);
      const s=img.clientWidth/img.naturalWidth;
      const cx=x*s, cy=y*s, rad=r*s;
      halo.style.width=`${rad*2}px`;
      halo.style.height=`${rad*2}px`;
      halo.style.left=`${cx}px`;
      halo.style.top=`${cy}px`;
      halo.style.opacity='1';
    }
    areas.forEach(a=>{
      a.addEventListener('mouseenter',()=>place(a));
      a.addEventListener('mouseleave',()=>halo.style.opacity=0);
    });
    window.addEventListener('resize',()=>halo.style.opacity=0);
  });
  
  // Masquer le loader quand tout est chargé
  window.addEventListener('load',()=>{
    const l=document.getElementById('loader');
    if(l)l.style.display='none';
  });

      // Fonction existante à modifier
    function markProgress(section, activity) {
      // Appeler la fonction existante si disponible
      if (typeof window.ProgressionSystem !== 'undefined') {
          window.ProgressionSystem.markComplete(section, activity);
      }
      
      // Ajouter l'appel à la nouvelle fonction
      saveLocalProgress(section, activity);
    }
      /**
     * Sauvegarde la progression de l'utilisateur localement
     * @param {string} section - La section (matière) complétée
     * @param {string} activity - L'activité spécifique complétée
     */
    function saveLocalProgress(section, activity) {
      // Récupérer les données existantes ou créer un objet vide
      let userProgress = JSON.parse(localStorage.getItem('userProgress')) || {};
      
      // S'assurer que la section existe
      if (!userProgress[section]) {
          userProgress[section] = {};
      }
      
      // Enregistrer l'activité comme complétée avec un timestamp
      userProgress[section][activity] = {
          completed: true,
          timestamp: new Date().toISOString()
      };
      
      // Sauvegarder dans le localStorage
      localStorage.setItem('userProgress', JSON.stringify(userProgress));
      
      console.log(`Progression sauvegardée: ${section} - ${activity}`);
    }

    /**
    * Récupère la progression de l'utilisateur depuis le stockage local
    * @return {Object} Les données de progression
    */
    function getLocalProgress() {
      return JSON.parse(localStorage.getItem('userProgress')) || {};
    }