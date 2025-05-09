/**
 * Fonctions globales pour les actions du tableau de progression
 */

// Créer des données de test
function createTestData() {
    // Créer des données de test
    const testData = {
        "Mathématiques": {
            completed: 5,
            total: 15,
            activities: {
                "maths_introduction": { completed: true, timestamp: new Date().toISOString() },
                "maths_addition": { completed: true, timestamp: new Date().toISOString() }
            }
        },
        "Français": {
            completed: 3,
            total: 12,
            activities: {
                "francais_introduction": { completed: true, timestamp: new Date().toISOString() }
            }
        }
    };
    
    localStorage.setItem('learningProgress', JSON.stringify(testData));
    alert("Données de test créées. Rechargez la page pour voir les résultats.");
    window.location.reload();
}

// Exporter la progression en PDF
function exportProgressToPDF() {
    try {
        console.log("Tentative d'export PDF...");
        // Vérifier si jsPDF est disponible
        if (typeof window.jspdf === 'undefined') {
            alert("La bibliothèque jsPDF n'est pas chargée. Impossible de générer le PDF.");
            return;
        }
        
        // Créer un nouveau document PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Ajouter un titre
        doc.setFontSize(22);
        doc.setTextColor(42, 157, 143);
        doc.text('Mon parcours d\'apprentissage', 105, 20, { align: 'center' });
        
        // Ajouter la date
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        const today = new Date().toLocaleDateString('fr-FR');
        doc.text(`Généré le ${today}`, 105, 30, { align: 'center' });
        
        // Progression globale
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Progression globale', 20, 50);
        
        // Obtenir les données de progression
        const progressData = JSON.parse(localStorage.getItem('learningProgress')) || {};
        let totalCompleted = 0;
        let totalActivities = 0;
        
        // Calculer la progression globale
        Object.keys(progressData).forEach(section => {
            if (section !== 'badges' && progressData[section] && progressData[section].completed) {
                totalCompleted += progressData[section].completed;
                totalActivities += progressData[section].total;
            }
        });
        
        const globalPercentage = totalActivities > 0 ? Math.round((totalCompleted / totalActivities) * 100) : 0;
        
        // Afficher la progression globale
        doc.text(`Progression totale : ${globalPercentage}% (${totalCompleted}/${totalActivities} activités)`, 20, 60);
        
        // Progression par matière
        doc.setFontSize(16);
        doc.text('Progression par matière', 20, 80);
        
        let yPos = 90;
        Object.keys(progressData).forEach(section => {
            if (section !== 'badges' && progressData[section] && progressData[section].completed) {
                const sectionData = progressData[section];
                const percentage = Math.round((sectionData.completed / sectionData.total) * 100);
                
                doc.setFontSize(14);
                doc.text(`${section}: ${percentage}% (${sectionData.completed}/${sectionData.total})`, 30, yPos);
                yPos += 10;
            }
        });
        
        // Enregistrer le PDF
        doc.save('mon_parcours_lemondedescurieux.pdf');
        console.log("PDF généré avec succès!");
    } catch (error) {
        console.error("Erreur lors de la génération du PDF:", error);
        alert("Une erreur s'est produite lors de la génération du PDF. Veuillez réessayer.");
    }
}

// Afficher la modal de réinitialisation
function showResetModal() {
    document.getElementById('reset-modal').style.display = 'flex';
}

// Masquer la modal de réinitialisation
function hideResetModal() {
    document.getElementById('reset-modal').style.display = 'none';
}

// Réinitialiser la progression
function resetProgress() {
    localStorage.removeItem('learningProgress');
    hideResetModal();
    window.location.reload();
}