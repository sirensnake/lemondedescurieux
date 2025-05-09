/**
 * Système de progression pour Le Monde des Curieux
 * Permet de suivre les activités terminées par l'enfant
 */
class ProgressionSystem {
    constructor() {
        this.progressData = this.loadProgress() || {};
        this.badges = this.defineBadges();
    }
    
    /**
     * Charge les données de progression depuis le localStorage
     */
    loadProgress() {
        return JSON.parse(localStorage.getItem('learningProgress')) || {};
    }
    
    /**
     * Sauvegarde les données de progression
     */
    saveProgress() {
        localStorage.setItem('learningProgress', JSON.stringify(this.progressData));
    }
    
    /**
     * Marque une activité comme complétée
     * @param {string} section - Nom de la section
     * @param {string} activity - Identifiant de l'activité
     * @returns {object} - Les informations de progression mises à jour
     */
    markActivity(section, activity) {
        // Initialiser la section si elle n'existe pas
        if (!this.progressData[section]) {
            this.progressData[section] = {
                completed: 0,
                total: this.getActivityCount(section),
                activities: {}
            };
        }
        
        // Marquer l'activité si elle n'est pas déjà complétée
        if (!this.progressData[section].activities[activity]) {
            this.progressData[section].activities[activity] = {
                completed: true,
                timestamp: new Date().toISOString()
            };
            this.progressData[section].completed += 1;
            
            // Vérifier si de nouveaux badges sont débloqués
            const newBadges = this.checkNewBadges(section);
            
            // Sauvegarder la progression
            this.saveProgress();
            
            return {
                section: section,
                activity: activity,
                sectionProgress: this.getSectionProgress(section),
                totalProgress: this.getTotalProgress(),
                newBadges: newBadges
            };
        }
        
        return null; // Aucune mise à jour si déjà complété
    }
    
    /**
     * Obtient le nombre total d'activités pour une section
     * @param {string} section - Nom de la section
     * @returns {number} - Nombre total d'activités
     */
    getActivityCount(section) {
        const activityCounts = {
            'IA': 5,
            'Mathématiques': 15,
            'Français': 12,
            'Sciences': 10,
            'Histoire-Géo': 10,
            'Programmation': 8,
            'Philosophie': 5,
            'Infos': 5,
            'Ressources': 3
        };
        
        return activityCounts[section] || 5;
    }
    
    /**
     * Calcule le pourcentage de progression pour une section
     * @param {string} section - Nom de la section
     * @returns {number} - Pourcentage de complétion (0-100)
     */
    getSectionProgress(section) {
        if (!this.progressData[section]) return 0;
        
        const completed = this.progressData[section].completed;
        const total = this.progressData[section].total;
        
        return Math.round((completed / total) * 100);
    }
    
    /**
     * Calcule le pourcentage de progression total
     * @returns {number} - Pourcentage de complétion global (0-100)
     */
    getTotalProgress() {
        let totalCompleted = 0;
        let totalActivities = 0;
        
        Object.keys(this.progressData).forEach(section => {
            totalCompleted += this.progressData[section].completed;
            totalActivities += this.progressData[section].total;
        });
        
        return totalActivities > 0 ? Math.round((totalCompleted / totalActivities) * 100) : 0;
    }
    
    /**
     * Définit les badges disponibles
     * @returns {object} - Liste des badges par section
     */
    defineBadges() {
        return {
            'IA': [
                { id: 'ia_debutant', name: 'Apprenti IA', requiredProgress: 20, icon: '🤖' },
                { id: 'ia_intermediaire', name: 'Explorateur IA', requiredProgress: 60, icon: '🧠' },
                { id: 'ia_expert', name: 'Expert IA', requiredProgress: 100, icon: '🔬' }
            ],
            'Programmation': [
                { id: 'prog_debutant', name: 'Codeur en herbe', requiredProgress: 20, icon: '💻' },
                { id: 'prog_intermediaire', name: 'Développeur junior', requiredProgress: 60, icon: '👨‍💻' },
                { id: 'prog_expert', name: 'Maître du code', requiredProgress: 100, icon: '🏆' }
            ],
            // Ajouter d'autres sections...
            'global': [
                { id: 'explorer', name: 'Explorateur curieux', description: 'A visité toutes les sections', icon: '🔍' },
                { id: 'champion', name: 'Champion du savoir', description: 'A complété au moins 3 quiz', icon: '🏅' },
                { id: 'master', name: 'Maître des connaissances', description: 'A obtenu au moins 75% de progression totale', icon: '👑' }
            ]
        };
    }
    
    /**
     * Vérifie si de nouveaux badges sont débloqués
     * @param {string} section - Section mise à jour
     * @returns {array} - Liste des nouveaux badges débloqués
     */
    checkNewBadges(section) {
        const unlockedBadges = [];
        const sectionProgress = this.getSectionProgress(section);
        const totalProgress = this.getTotalProgress();
        
        // Vérifier les badges de section
        if (this.badges[section]) {
            this.badges[section].forEach(badge => {
                if (sectionProgress >= badge.requiredProgress) {
                    if (!this.isBadgeUnlocked(badge.id)) {
                        this.unlockBadge(badge.id);
                        unlockedBadges.push(badge);
                    }
                }
            });
        }
        
        // Vérifier les badges globaux
        if (totalProgress >= 75) {
            const masterBadge = this.badges.global.find(b => b.id === 'master');
            if (!this.isBadgeUnlocked('master')) {
                this.unlockBadge('master');
                unlockedBadges.push(masterBadge);
            }
        }
        
        // Vérifier si l'utilisateur a visité toutes les sections
        const visitedSections = Object.keys(this.progressData);
        const allSections = Object.keys(this.getActivityCount);
        
        if (visitedSections.length === allSections.length) {
            const explorerBadge = this.badges.global.find(b => b.id === 'explorer');
            if (!this.isBadgeUnlocked('explorer')) {
                this.unlockBadge('explorer');
                unlockedBadges.push(explorerBadge);
            }
        }
        
        return unlockedBadges;
    }
    
    /**
     * Vérifie si un badge est déjà débloqué
     * @param {string} badgeId - Identifiant du badge
     * @returns {boolean} - True si le badge est déjà débloqué
     */
    isBadgeUnlocked(badgeId) {
        if (!this.progressData.badges) {
            this.progressData.badges = {};
        }
        return !!this.progressData.badges[badgeId];
    }
    
    /**
     * Débloque un badge
     * @param {string} badgeId - Identifiant du badge
     */
    unlockBadge(badgeId) {
        if (!this.progressData.badges) {
            this.progressData.badges = {};
        }
        this.progressData.badges[badgeId] = {
            unlocked: true,
            timestamp: new Date().toISOString()
        };
        this.saveProgress();
    }
    
    /**
     * Obtient la liste des badges débloqués
     * @returns {array} - Liste des badges débloqués
     */
    getUnlockedBadges() {
        if (!this.progressData.badges) return [];
        
        const unlockedBadges = [];
        
        Object.keys(this.progressData.badges).forEach(badgeId => {
            // Chercher le badge dans toutes les sections
            let badge = null;
            
            // Chercher dans les badges globaux
            badge = this.badges.global.find(b => b.id === badgeId);
            
            // Si pas trouvé, chercher dans les badges de section
            if (!badge) {
                Object.keys(this.badges).forEach(section => {
                    if (section !== 'global') {
                        const foundBadge = this.badges[section].find(b => b.id === badgeId);
                        if (foundBadge) badge = foundBadge;
                    }
                });
            }
            
            if (badge) {
                unlockedBadges.push({
                    ...badge,
                    unlockedAt: this.progressData.badges[badgeId].timestamp
                });
            }
        });
        
        return unlockedBadges;
    }
    
    /**
     * Génère un rapport de progression au format PDF
     * Version simple avec juste un message
     */
    generateProgressReport() {
        alert("Fonctionnalité à venir : le rapport de progression sera disponible bientôt !");
        // Dans une version future, cette méthode pourrait générer un PDF
        // en utilisant une bibliothèque comme jsPDF
    }
}

// Fonction globale pour marquer la progression
function markProgress(section, activity) {
    const progressSystem = new ProgressionSystem();
    const progress = progressSystem.markActivity(section, activity);
    
    if (progress) {
        // Afficher un message de félicitation
        showProgressNotification(progress);
    }
}

// Affiche une notification de progression
function showProgressNotification(progress) {
    // Créer un élément de notification
    const notification = document.createElement('div');
    notification.className = 'progress-notification';
    
    // Contenu de la notification
    let content = `<div class="progress-icon">✅</div>
                 <div class="progress-message">
                    <strong>Bravo !</strong>
                    <p>Tu as progressé dans la section ${progress.section}</p>
                    <div class="progress-bar-small">
                        <div class="progress-fill" style="width: ${progress.sectionProgress}%"></div>
                    </div>
                    <span>${progress.sectionProgress}% complété</span>
                 </div>`;
    
    // Ajouter les badges si nécessaire
    if (progress.newBadges && progress.newBadges.length > 0) {
        content += `<div class="new-badges">
                     <p>Nouveau badge débloqué !</p>
                     <div class="badge">
                        <span class="badge-icon">${progress.newBadges[0].icon}</span>
                        <span class="badge-name">${progress.newBadges[0].name}</span>
                     </div>
                   </div>`;
    }
    
    notification.innerHTML = content;
    
    // Ajouter au document
    document.body.appendChild(notification);
    
    // Ajouter la classe pour l'animation
    setTimeout(() => {
        notification.classList.add('visible');
    }, 10);
    
    // Supprimer après quelques secondes
    setTimeout(() => {
        notification.classList.remove('visible');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 4000);
}

// Initialiser le système de progression global
const globalProgressSystem = new ProgressionSystem();