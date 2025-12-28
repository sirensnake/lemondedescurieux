// ========================================
// CORRECTION DASHBOARD - Le Monde des Curieux
// ========================================

class DashboardManager {
    constructor() {
        this.progressData = this.loadAllProgress();
        this.sections = ['francais', 'maths', 'english', 'sciences', 'histoire', 'programmation'];
    }

    loadAllProgress() {
        console.log("🔍 Chargement progression...");
        
        const allProgress = {};
        
        // Tenter plusieurs variantes de clés localStorage
        this.sections.forEach(section => {
            const possibleKeys = [
                `${section}_progress`,
                `${section}Progress`,
                `progress_${section}`,
                section
            ];
            
            let sectionData = null;
            
            for (let key of possibleKeys) {
                const data = localStorage.getItem(key);
                if (data) {
                    try {
                        sectionData = JSON.parse(data);
                        console.log(`✅ ${section}: trouvé sous clé "${key}"`);
                        break;
                    } catch (e) {
                        console.warn(`⚠️ Erreur parsing ${key}:`, e);
                    }
                }
            }
            
            allProgress[section] = sectionData || { completed: [], total: 0 };
        });
        
        // Vérifier aussi clé globale userProgress
        const userProgress = localStorage.getItem('userProgress');
        if (userProgress) {
            try {
                const parsed = JSON.parse(userProgress);
                console.log("✅ userProgress global trouvé:", parsed);
                Object.assign(allProgress, parsed);
            } catch (e) {
                console.warn("⚠️ Erreur parsing userProgress:", e);
            }
        }
        
        return allProgress;
    }

    calculateProgress(section) {
        const data = this.progressData[section];
        
        if (!data) {
            console.log(`❌ Pas de données pour ${section}`);
            return 0;
        }
        
        // Plusieurs formats possibles
        if (data.completed && data.total) {
            const progress = Math.round((data.completed.length / data.total) * 100);
            console.log(`📊 ${section}: ${data.completed.length}/${data.total} = ${progress}%`);
            return progress;
        }
        
        if (data.lessonsCompleted && data.totalLessons) {
            const progress = Math.round((data.lessonsCompleted / data.totalLessons) * 100);
            console.log(`📊 ${section}: ${data.lessonsCompleted}/${data.totalLessons} = ${progress}%`);
            return progress;
        }
        
        // Format activités complétées
        if (Array.isArray(data.completed)) {
            // Estimer 10 activités par section si pas de total
            const estimated = data.total || 10;
            const progress = Math.round((data.completed.length / estimated) * 100);
            console.log(`📊 ${section}: ${data.completed.length}/${estimated} (estimé) = ${progress}%`);
            return Math.min(progress, 100);
        }
        
        console.log(`❓ Format inconnu pour ${section}:`, data);
        return 0;
    }

    updateDashboard() {
        console.log("🔄 Mise à jour dashboard...");
        
        this.sections.forEach(section => {
            const progress = this.calculateProgress(section);
            const elementId = `progress-${section}`;
            const element = document.getElementById(elementId);
            
            if (element) {
                // Mise à jour barre progression
                const progressBar = element.querySelector('.progress-bar');
                const progressText = element.querySelector('.progress-text');
                
                if (progressBar) {
                    progressBar.style.width = `${progress}%`;
                    progressBar.setAttribute('aria-valuenow', progress);
                }
                
                if (progressText) {
                    progressText.textContent = `${progress}%`;
                }
                
                console.log(`✅ ${section} mis à jour: ${progress}%`);
            } else {
                console.warn(`⚠️ Élément ${elementId} introuvable`);
            }
        });
        
        // Statistiques globales
        this.updateGlobalStats();
    }

    updateGlobalStats() {
        const totalSections = this.sections.length;
        let completedSections = 0;
        let totalProgress = 0;
        
        this.sections.forEach(section => {
            const progress = this.calculateProgress(section);
            totalProgress += progress;
            if (progress >= 80) completedSections++;
        });
        
        const avgProgress = Math.round(totalProgress / totalSections);
        
        console.log(`📈 Stats globales: ${avgProgress}% moyen, ${completedSections}/${totalSections} sections ≥80%`);
        
        // Mettre à jour affichage global
        const globalElement = document.getElementById('global-progress');
        if (globalElement) {
            globalElement.textContent = `${avgProgress}%`;
        }
        
        const completedElement = document.getElementById('sections-completed');
        if (completedElement) {
            completedElement.textContent = `${completedSections}/${totalSections}`;
        }
    }

    debugLocalStorage() {
        console.log("🔍 DEBUG COMPLET LOCALSTORAGE");
        console.log("================================");
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            console.log(`${key}:`, value);
        }
        
        console.log("================================");
    }
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Dashboard initialisé");
    
    window.dashboardManager = new DashboardManager();
    window.dashboardManager.debugLocalStorage();
    window.dashboardManager.updateDashboard();
    
    // Bouton rafraîchir manuel
    const refreshBtn = document.getElementById('refresh-dashboard');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            window.dashboardManager.progressData = window.dashboardManager.loadAllProgress();
            window.dashboardManager.updateDashboard();
        });
    }
});

// Export pour debug console
window.debugDashboard = () => {
    if (window.dashboardManager) {
        window.dashboardManager.debugLocalStorage();
        window.dashboardManager.updateDashboard();
    }
};
