/**
 * Système de suivi de progression pour Le Monde des Curieux
 * Module centralisé pour le suivi des activités et la gestion des accomplissements
 */

// Namespace pour éviter les conflits avec d'autres scripts
const ProgressionSystem = (function() {
    // Constantes
    const STORAGE_KEY = 'learningProgress';
    const MESSAGE_DURATION = 3000; // 3 secondes
    
    // Nombre total d'activités par section
    const ACTIVITY_COUNTS = {
        'Mathématiques': 15,
        'Français': 12,
        'Sciences': 10,
        'Histoire-Géo': 10,
        'IA': 5,
        'Anglais': 8,
        'Programmation': 6,
        'Philosophie': 4,
        'Échecs': 6
    };
    
    // Couleurs des badges par niveau
    const BADGE_COLORS = {
        'débutant': '#C0C0C0',
        'explorateur': '#CD7F32',
        'expert': '#FFD700',
        'maître': '#4CAF50'
    };
    
    /**
     * Marque une activité comme complétée dans une section donnée
     * @param {string} section - Nom de la section (ex: "Mathématiques")
     * @param {string} activity - Identifiant unique de l'activité
     * @param {boolean} showMessage - Afficher un message de félicitation (par défaut: true)
     * @return {object} - État mis à jour de la progression
     */
    function markProgress(section, activity, showMessage = true) {
        // Vérifier les paramètres
        if (!section || !activity) {
            console.error("Section et activité doivent être spécifiées");
            return null;
        }
        
        try {
            // Récupérer les données existantes ou créer un nouvel objet
            let progress = getProgressData();
            
            // Initialiser la section si elle n'existe pas
            if (!progress[section]) {
                progress[section] = {
                    completed: 0,
                    total: getActivityCount(section),
                    activities: {},
                    lastActivity: null
                };
            }
            
            // Marquer l'activité comme complétée si elle ne l'est pas déjà
            if (!progress[section].activities[activity]) {
                progress[section].activities[activity] = {
                    completed: true,
                    timestamp: new Date().toISOString()
                };
                progress[section].completed += 1;
                progress[section].lastActivity = activity;
                
                // Vérifier les accomplissements (nouveaux badges, etc.)
                checkAchievements(progress, section);
                
                // Afficher un message de félicitation
                if (showMessage) {
                    showCompletionMessage(section, activity);
                }
            }
            
            // Sauvegarder les progrès mis à jour
            saveProgressData(progress);
            
            // Déclencher un événement personnalisé
            dispatchProgressEvent(section, activity, progress[section].completed);
            
            return progress;
        } catch (error) {
            console.error("Erreur lors de l'enregistrement de la progression:", error);
            return null;
        }
    }
    
    /**
     * Récupère le nombre total d'activités pour une section
     * @param {string} section - Nom de la section
     * @return {number} - Nombre total d'activités
     */
    function getActivityCount(section) {
        return ACTIVITY_COUNTS[section] || 5; // Valeur par défaut: 5
    }
    
    /**
     * Affiche un message de félicitation temporaire
     * @param {string} section - Nom de la section
     * @param {string} activity - Identifiant de l'activité
     */
    function showCompletionMessage(section, activity) {
        // Créer ou réutiliser l'élément de message
        let messageElement = document.getElementById('completion-message');
        
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.id = 'completion-message';
            messageElement.setAttribute('role', 'status');
            messageElement.setAttribute('aria-live', 'polite');
            
            // Styles du message
            Object.assign(messageElement.style, {
                position: 'fixed',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                zIndex: '1000',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                fontSize: '16px',
                maxWidth: '90%',
                textAlign: 'center',
                animation: 'fadeInUp 0.5s'
            });
            
            // Ajouter des styles d'animation
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translate(-50%, 20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(styleElement);
            
            document.body.appendChild(messageElement);
        }
        
        // Définir le contenu du message
        messageElement.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:center;">
                <span style="font-size:24px; margin-right:10px;">✨</span>
                <div>
                    <strong>Bravo !</strong>
                    <div>Tu as progressé dans la section ${section}</div>
                </div>
            </div>
        `;
        
        // Animation d'entrée
        messageElement.style.display = 'block';
        messageElement.style.opacity = '1';
        
        // Supprimer le message après un délai
        clearTimeout(window.messageTimeout);
        window.messageTimeout = setTimeout(() => {
            messageElement.style.animation = 'fadeOut 0.5s';
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 500);
        }, MESSAGE_DURATION);
    }
    
    /**
     * Vérifie si de nouveaux accomplissements ont été atteints
     * @param {object} progress - Données de progression
     * @param {string} section - Section actuelle
     */
    function checkAchievements(progress, section) {
        const sectionProgress = progress[section];
        
        // Calculer le pourcentage de complétion
        const percentage = Math.round((sectionProgress.completed / sectionProgress.total) * 100);
        
        // Déterminer le niveau d'accomplissement
        let achievementLevel = null;
        
        if (percentage >= 100) {
            achievementLevel = 'maître';
        } else if (percentage >= 75) {
            achievementLevel = 'expert';
        } else if (percentage >= 50) {
            achievementLevel = 'explorateur';
        } else if (percentage >= 25) {
            achievementLevel = 'débutant';
        }
        
        // Enregistrer l'accomplissement si un niveau a été atteint
        if (achievementLevel && (!sectionProgress.achievement || sectionProgress.achievement !== achievementLevel)) {
            sectionProgress.achievement = achievementLevel;
            sectionProgress.achievementDate = new Date().toISOString();
            
            // Ajouter au tableau global des badges
            if (!progress.badges) progress.badges = [];
            
            progress.badges.push({
                section: section,
                level: achievementLevel,
                date: sectionProgress.achievementDate
            });
        }
    }
    
    /**
     * Récupère les données de progression du stockage local
     * @return {object} - Données de progression
     */
    function getProgressData() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error("Erreur lors de la récupération des données de progression:", error);
            return {};
        }
    }
    
    /**
     * Sauvegarde les données de progression dans le stockage local
     * @param {object} data - Données de progression à sauvegarder
     */
    function saveProgressData(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error("Erreur lors de la sauvegarde des données de progression:", error);
            // Afficher un message d'erreur à l'utilisateur
            alert("Ton navigateur ne permet pas de sauvegarder ta progression. Vérifie que tu n'es pas en navigation privée.");
        }
    }
    
    /**
     * Déclenche un événement personnalisé pour la progression
     * @param {string} section - Section concernée
     * @param {string} activity - Activité complétée
     * @param {number} completedCount - Nombre d'activités complétées
     */
    function dispatchProgressEvent(section, activity, completedCount) {
        const event = new CustomEvent('progressUpdate', {
            detail: {
                section: section,
                activity: activity,
                completedCount: completedCount,
                timestamp: new Date().toISOString()
            }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Génère un rapport de progression détaillé
     * @return {object} - Données de rapport
     */
    function generateProgressReport() {
        const progress = getProgressData();
        const sections = Object.keys(progress).filter(key => key !== 'badges');
        
        // Nombre total d'activités complétées
        let totalCompleted = 0;
        let totalAvailable = 0;
        
        sections.forEach(section => {
            if (progress[section] && typeof progress[section].completed === 'number') {
                totalCompleted += progress[section].completed;
                totalAvailable += progress[section].total;
            }
        });
        
        // Calculer le pourcentage global
        const globalPercentage = totalAvailable > 0 
            ? Math.round((totalCompleted / totalAvailable) * 100) 
            : 0;
        
        // Récupérer les badges obtenus
        const badges = progress.badges || [];
        
        return {
            totalCompleted,
            totalAvailable,
            globalPercentage,
            sections: sections.map(section => ({
                name: section,
                completed: progress[section].completed,
                total: progress[section].total,
                percentage: Math.round((progress[section].completed / progress[section].total) * 100),
                achievement: progress[section].achievement
            })),
            badges,
            lastUpdated: new Date().toISOString()
        };
    }
    
    // Interface publique du module
    return {
        markProgress,
        getProgressData,
        generateProgressReport,
        BADGE_COLORS
    };
})();

// Pour la compatibilité avec le code existant
function markProgress(section, activity) {
    return ProgressionSystem.markProgress(section, activity);
}

function getActivityCount(section) {
    return ProgressionSystem.getActivityCount(section);
}

// Exposer le module pour une utilisation dans d'autres scripts
window.ProgressionSystem = ProgressionSystem;