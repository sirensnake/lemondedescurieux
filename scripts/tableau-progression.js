/**
 * Affichage du tableau de progression pour Le Monde des Curieux
 */
document.addEventListener('DOMContentLoaded', function() {
    // Récupérer les données de progression
    const userProgress = getLocalProgress();
    
    // Afficher les statistiques générales
    displayProgressStats(userProgress);
    
    // Afficher les détails par matière
    displayProgressBySubject(userProgress);
  });
  
  /**
   * Affiche les statistiques générales de progression
   * @param {Object} progress - Les données de progression
   */
  function displayProgressStats(progress) {
    const statsContainer = document.getElementById('progression-stats');
    
    // Calculer les statistiques
    const totalSubjects = Object.keys(progress).length;
    const totalActivities = Object.values(progress).reduce((total, subject) => {
      return total + Object.keys(subject).length;
    }, 0);
    
    // Créer l'affichage HTML
    statsContainer.innerHTML = `
      <div class="stat-card">
        <div class="stat-value">${totalSubjects}</div>
        <div class="stat-label">Matières explorées</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${totalActivities}</div>
        <div class="stat-label">Activités complétées</div>
      </div>
    `;
  }
  
  /**
   * Affiche les détails de progression par matière
   * @param {Object} progress - Les données de progression
   */
  function displayProgressBySubject(progress) {
    const subjectContainer = document.getElementById('progression-by-subject');
    subjectContainer.innerHTML = '';
    
    // Si aucune progression, afficher un message
    if (Object.keys(progress).length === 0) {
      subjectContainer.innerHTML = '<p>Tu n\'as pas encore complété d\'activités. Explore le site pour commencer ton aventure !</p>';
      return;
    }
    
    // Créer une section pour chaque matière
    for (const [subject, activities] of Object.entries(progress)) {
      const subjectCard = document.createElement('div');
      subjectCard.className = 'subject-card';
      
      // Entête de la matière
      const subjectHeader = document.createElement('div');
      subjectHeader.className = 'subject-header';
      subjectHeader.textContent = subject;
      
      // Liste des activités
      const activityList = document.createElement('ul');
      activityList.className = 'activity-list';
      
      for (const [activity, details] of Object.entries(activities)) {
        const activityItem = document.createElement('li');
        
        // Formater la date
        const date = new Date(details.timestamp);
        const formattedDate = date.toLocaleDateString('fr-FR');
        
        activityItem.innerHTML = `
          <span class="activity-name">${activity}</span>
          <span class="activity-date">${formattedDate}</span>
        `;
        
        activityList.appendChild(activityItem);
      }
      
      // Assembler la carte
      subjectCard.appendChild(subjectHeader);
      subjectCard.appendChild(activityList);
      subjectContainer.appendChild(subjectCard);
    }
  }