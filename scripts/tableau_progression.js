// Fonctions globales pour être accessibles directement depuis les onclick HTML
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

function exportProgressToPDF() {
    try {
        console.log("Tentative d'export PDF...");
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
        
        // Badges obtenus
        doc.setFontSize(16);
        doc.text('Badges obtenus', 20, yPos + 20);
        
        // Liste des badges
        if (progressData.badges) {
            let badgeYPos = yPos + 30;
            Object.keys(progressData.badges).forEach(badge => {
                doc.setFontSize(12);
                doc.text(`• ${badge}`, 30, badgeYPos);
                badgeYPos += 10;
            });
        } else {
            doc.setFontSize(12);
            doc.text('Aucun badge obtenu pour le moment.', 30, yPos + 30);
        }
        
        // Pied de page
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text('Le Monde des Curieux - Rapport de progression', 105, 280, { align: 'center' });
        
        // Enregistrer le PDF
        doc.save('mon_parcours_lemondedescurieux.pdf');
        console.log("PDF généré avec succès!");
    } catch (error) {
        console.error("Erreur lors de la génération du PDF:", error);
        alert("Une erreur s'est produite lors de la génération du PDF. Veuillez réessayer.");
    }
}

function showResetModal() {
    document.getElementById('reset-modal').style.display = 'flex';
}

function hideResetModal() {
    document.getElementById('reset-modal').style.display = 'none';
}

function resetProgress() {
    localStorage.removeItem('learningProgress');
    hideResetModal();
    window.location.reload();
}

/**
 * Tableau de bord des progrès - Le Monde des Curieux
 * Affiche la progression de l'apprenant dans les différentes matières
 */
document.addEventListener('DOMContentLoaded', function() {
    // Références aux éléments DOM
    const globalPercentage = document.getElementById('global-percentage');
    const globalCompleted = document.getElementById('global-completed');
    const globalTotal = document.getElementById('global-total');
    const badgesGrid = document.getElementById('badges-grid');
    const noBadgesMessage = document.getElementById('no-badges-message');
    const subjectsGrid = document.getElementById('subjects-grid');
    const noProgressMessage = document.getElementById('no-progress-message');
    const suggestionsContainer = document.getElementById('suggestions-container');
    
    // Icônes pour les matières
    const subjectIcons = {
        'Mathématiques': '🔢',
        'Français': '📝',
        'Sciences': '🔬',
        'Histoire-Géo': '🌍',
        'IA': '🤖',
        'Anglais': '🇬🇧',
        'Programmation': '💻',
        'Philosophie': '🧠',
        'Échecs': '♟️'
    };
    
    // Descriptions des niveaux de badges
    const badgeLevels = {
        'débutant': 'Tu as commencé à explorer cette matière!',
        'explorateur': 'Tu progresses bien dans cette matière!',
        'expert': 'Tu maîtrises bien cette matière!',
        'maître': 'Tu as complété toutes les activités!'
    };
    
    // Initialiser l'affichage
    initializeProgressDashboard();
    
    /**
     * Initialise le tableau de bord avec les données de progression
     */
    function initializeProgressDashboard() {
        // Débuguer les données de progression
        console.log("Données de progression:", localStorage.getItem('learningProgress'));
        
        // Récupérer les données de progression
        const progressData = getProgressData();
        console.log("Données traitées:", progressData);
        
        // Si aucune donnée n'est disponible, afficher un message
        if (!progressData || Object.keys(progressData).length === 0 || 
            (Object.keys(progressData).length === 1 && progressData.badges)) {
            // Afficher des messages pour l'état vide
            globalPercentage.textContent = '0%';
            globalCompleted.textContent = '0';
            globalTotal.textContent = '0';
            noBadgesMessage.style.display = 'block';
            noProgressMessage.style.display = 'block';
            populateWithSampleSuggestions();
            return;
        }
        
        // Calculer les statistiques globales
        const report = generateProgressReport(progressData);
        
        // Mettre à jour les statistiques globales
        updateGlobalStats(report);
        
        // Afficher les badges
        displayBadges(report.badges);
        
        // Afficher la progression par matière
        displaySubjectsProgress(report.sections);
        
        // Afficher les suggestions personnalisées
        generateSuggestions(report);
    }
    
    /**
     * Récupère les données de progression du stockage local
     */
    function getProgressData() {
        try {
            // Essayer d'utiliser le système de progression amélioré s'il existe
            if (typeof window.ProgressionSystem !== 'undefined') {
                return window.ProgressionSystem.getProgressData();
            }
            
            // Sinon, utiliser le stockage local directement
            const data = localStorage.getItem('learningProgress');
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error("Erreur lors de la récupération des données de progression:", error);
            return {};
        }
    }
    
    /**
     * Génère un rapport de progression complet à partir des données brutes
     */
    function generateProgressReport(progressData) {
        // Filtrer les sections (exclure les badges qui ne sont pas une section)
        const sections = Object.keys(progressData).filter(key => key !== 'badges');
        
        // Calculer les totaux
        let totalCompleted = 0;
        let totalAvailable = 0;
        
        // Traiter chaque section
        const sectionsData = sections.map(section => {
            const sectionData = progressData[section];
            if (sectionData && typeof sectionData.completed === 'number') {
                totalCompleted += sectionData.completed;
                totalAvailable += sectionData.total;
                
                // Calculer le pourcentage pour cette section
                const percentage = Math.round((sectionData.completed / sectionData.total) * 100);
                
                // Déterminer le niveau d'accomplissement
                let achievement = null;
                if (percentage >= 100) {
                    achievement = 'maître';
                } else if (percentage >= 75) {
                    achievement = 'expert';
                } else if (percentage >= 50) {
                    achievement = 'explorateur';
                } else if (percentage >= 25) {
                    achievement = 'débutant';
                }
                
                return {
                    name: section,
                    completed: sectionData.completed,
                    total: sectionData.total,
                    percentage,
                    achievement,
                    lastActivity: sectionData.lastActivity || null
                };
            }
            return null;
        }).filter(section => section !== null);
        
        // Calculer le pourcentage global
        const globalPercentage = totalAvailable > 0 
            ? Math.round((totalCompleted / totalAvailable) * 100) 
            : 0;
        
        // Récupérer les badges
        const badges = progressData.badges || [];
        
        return {
            totalCompleted,
            totalAvailable,
            globalPercentage,
            sections: sectionsData,
            badges
        };
    }
    
    /**
     * Met à jour les statistiques globales dans l'interface
     */
    function updateGlobalStats(report) {
        // Mettre à jour les textes
        globalPercentage.textContent = `${report.globalPercentage}%`;
        globalCompleted.textContent = report.totalCompleted;
        globalTotal.textContent = report.totalAvailable;
        
        // Animation du cercle de progression
        const progressCircle = document.querySelector('.progress-circle');
        progressCircle.style.background = `conic-gradient(
            #4CAF50 0% ${report.globalPercentage}%, 
            #f0f0f0 ${report.globalPercentage}% 100%
        )`;
    }
    
    /**
     * Affiche les badges obtenus
     */
    function displayBadges(badges) {
        if (!badges || badges.length === 0) {
            noBadgesMessage.style.display = 'block';
            return;
        }
        
        // Masquer le message "pas de badges"
        noBadgesMessage.style.display = 'none';
        
        // Vider le conteneur de badges
        badgesGrid.innerHTML = '';
        
        // Ajouter chaque badge
        badges.forEach(badge => {
            const badgeDate = new Date(badge.date);
            const formattedDate = badgeDate.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
            
            const badgeElement = document.createElement('div');
            badgeElement.className = 'badge';
            badgeElement.innerHTML = `
                <div class="badge-icon ${badge.level}" title="${badgeLevels[badge.level]}">
                    ${subjectIcons[badge.section] || '🏆'}
                </div>
                <div class="badge-name">${badge.section}</div>
                <div class="badge-date">${formattedDate}</div>
            `;
            
            badgesGrid.appendChild(badgeElement);
        });
    }
    
    /**
     * Affiche la progression par matière
     */
    function displaySubjectsProgress(sections) {
        if (!sections || sections.length === 0) {
            noProgressMessage.style.display = 'block';
            return;
        }
        
        // Masquer le message "pas de progression"
        noProgressMessage.style.display = 'none';
        
        // Vider le conteneur de matières
        subjectsGrid.innerHTML = '';
        
        // Trier les sections par pourcentage décroissant
        sections.sort((a, b) => b.percentage - a.percentage);
        
        // Ajouter chaque matière
        sections.forEach(section => {
            const subjectCard = document.createElement('div');
            subjectCard.className = 'subject-card';
            
            // Ajouter le badge d'accomplissement si présent
            let achievementBadge = '';
            if (section.achievement) {
                achievementBadge = `
                    <span class="achievement-badge ${section.achievement}">
                        ${section.achievement.charAt(0).toUpperCase() + section.achievement.slice(1)}
                    </span>
                `;
            }
            
            subjectCard.innerHTML = `
                <div class="subject-header">
                    <span class="subject-icon">${subjectIcons[section.name] || '📚'}</span>
                    <span class="subject-name">${section.name}</span>
                </div>
                <div class="progress-bar" role="progressbar" aria-valuenow="${section.percentage}" aria-valuemin="0" aria-valuemax="100">
                    <div class="progress-fill" style="width: ${section.percentage}%"></div>
                    <div class="progress-text">${section.percentage}%</div>
                </div>
                <div class="subject-footer">
                    <span>${section.completed}/${section.total} activités</span>
                    ${achievementBadge}
                </div>
            `;
            
            subjectsGrid.appendChild(subjectCard);
        });
    }
    
    /**
     * Génère des suggestions personnalisées basées sur la progression
     */
    function generateSuggestions(report) {
        suggestionsContainer.innerHTML = '';
        
        // Obtenir la matière la moins avancée (pour encourager la diversité)
        const leastAdvancedSubjects = [...report.sections]
            .filter(section => section.percentage < 75)
            .sort((a, b) => a.percentage - b.percentage)
            .slice(0, 3);
        
        // Si toutes les matières sont avancées à plus de 75%, suggérer des activités avancées
        if (leastAdvancedSubjects.length === 0) {
            addAdvancedSuggestions();
            return;
        }
        
        // Ajouter une suggestion pour chaque matière peu avancée
        leastAdvancedSubjects.forEach(section => {
            const suggestion = document.createElement('div');
            suggestion.className = 'suggestion-card';
            suggestion.innerHTML = `
                <div class="suggestion-icon">${subjectIcons[section.name] || '📚'}</div>
                <div class="suggestion-content">
                    <div class="suggestion-title">Découvre la section ${section.name}</div>
                    <div class="suggestion-description">
                        Tu as complété ${section.percentage}% des activités. Continue pour gagner un badge !
                    </div>
                </div>
                <a href="${section.name.toLowerCase()}_section.html" class="suggestion-link">Explorer</a>
            `;
            suggestionsContainer.appendChild(suggestion);
        });
        
        // Ajouter une suggestion de challenge
        if (report.globalPercentage >= 30) {
            const challengeSuggestion = document.createElement('div');
            challengeSuggestion.className = 'suggestion-card';
            challengeSuggestion.innerHTML = `
                <div class="suggestion-icon">🎯</div>
                <div class="suggestion-content">
                    <div class="suggestion-title">Relève un défi !</div>
                    <div class="suggestion-description">
                        Essaie de compléter 3 activités aujourd'hui pour progresser !
                    </div>
                </div>
                <a href="index.html" class="suggestion-link">Commencer</a>
            `;
            suggestionsContainer.appendChild(challengeSuggestion);
        }
    }
    
    /**
     * Ajoute des suggestions pour utilisateurs avancés
     */
    function addAdvancedSuggestions() {
        const advancedSuggestions = [
            {
                icon: '🏆',
                title: 'Félicitations, Champion !',
                description: 'Tu as bien progressé dans toutes les matières. Essaie maintenant de réviser tes connaissances !',
                link: 'index.html',
                linkText: 'Continuer'
            },
            {
                icon: '🧩',
                title: 'Défis avancés',
                description: 'Prêt pour des activités plus difficiles ? Essaie nos quiz avancés !',
                link: 'quiz_avances.html',
                linkText: 'Voir les défis'
            },
            {
                icon: '👨‍🏫',
                title: 'Deviens mentor',
                description: 'Tu peux maintenant aider d'autres explorateurs dans leur parcours !',
                link: 'mentor.html',
                linkText: 'Découvrir'
            }
        ];
        
        advancedSuggestions.forEach(suggestion => {
            const suggestionElement = document.createElement('div');
            suggestionElement.className = 'suggestion-card';
            suggestionElement.innerHTML = `
                <div class="suggestion-icon">${suggestion.icon}</div>
                <div class="suggestion-content">
                    <div class="suggestion-title">${suggestion.title}</div>
                    <div class="suggestion-description">${suggestion.description}</div>
                </div>
                <a href="${suggestion.link}" class="suggestion-link">${suggestion.linkText}</a>
            `;
            suggestionsContainer.appendChild(suggestionElement);
        });
    }
    
    /**
     * Ajoute des suggestions pour les utilisateurs sans progression
     */
    function populateWithSampleSuggestions() {
        const startingSuggestions = [
            {
                icon: '🔢',
                title: 'Commence par les Mathématiques',
                description: 'Découvre des activités amusantes pour apprendre les nombres et la géométrie.',
                link: 'maths_section.html',
                linkText: 'Explorer'
            },
            {
                icon: '📝',
                title: 'Améliore ton Français',
                description: 'Des exercices de lecture et d\'écriture pour progresser à ton rythme.',
                link: 'francais_section.html',
                linkText: 'Explorer'
            },
            {
                icon: '🤖',
                title: 'Découvre l\'Intelligence Artificielle',
                description: 'Apprends ce qu\'est l\'IA et comment elle fonctionne.',
                link: 'ia_section.html',
                linkText: 'Explorer'
            }
        ];
        
        suggestionsContainer.innerHTML = '';
        
        startingSuggestions.forEach(suggestion => {
            const suggestionElement = document.createElement('div');
            suggestionElement.className = 'suggestion-card';
            suggestionElement.innerHTML = `
                <div class="suggestion-icon">${suggestion.icon}</div>
                <div class="suggestion-content">
                    <div class="suggestion-title">${suggestion.title}</div>
                    <div class="suggestion-description">${suggestion.description}</div>
                </div>
                <a href="${suggestion.link}" class="suggestion-link">${suggestion.linkText}</a>
            `;
            suggestionsContainer.appendChild(suggestionElement);
        });
    }
});