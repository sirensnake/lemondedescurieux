/**
 * ==========================================
 * DASHBOARD CHARTS - PARTIE 1
 * Le Monde des Curieux - Analytics
 * ==========================================
 */

// ========================================
// VARIABLES GLOBALES
// ========================================

const sections = ['maths', 'english', 'francais', 'histoire', 'sciences'];
const sectionNames = {
    maths: 'Mathématiques',
    english: 'English',
    francais: 'Français',
    histoire: 'Histoire',
    sciences: 'Sciences'
};

const sectionColors = {
    maths: '#9c27b0',
    english: '#2196f3',
    francais: '#10b981',
    histoire: '#d97706',
    sciences: '#06b6d4'
};

let radarChart = null;
let barChart = null;

// ========================================
// INITIALISATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    loadSummaryStats();
    createRadarChart();
    createBarChart();
    createActivityCalendar();
    loadDetailedStats();
    loadObjectives();
});

// ========================================
// STATISTIQUES RÉSUMÉ
// ========================================

function loadSummaryStats() {
    let totalXP = 0;
    let maxStreak = 0;
    let totalLessons = 0;
    let totalCorrect = 0;
    let totalQuestions = 0;

    sections.forEach(section => {
        // XP
        const xpData = JSON.parse(localStorage.getItem(`${section}_xp`)) || { total: 0 };
        totalXP += xpData.total || 0;

        // Streak
        const streakData = JSON.parse(localStorage.getItem(`${section}_streak`)) || { currentStreak: 0, longestStreak: 0 };
        maxStreak = Math.max(maxStreak, streakData.longestStreak || streakData.currentStreak || 0);

        // Leçons complétées
        const completed = JSON.parse(localStorage.getItem(`${section}_completed`)) || [];
        totalLessons += completed.length;

        // Précision (si données disponibles)
        const stats = JSON.parse(localStorage.getItem(`${section}_stats`)) || {};
        if (stats.correct && stats.total) {
            totalCorrect += stats.correct;
            totalQuestions += stats.total;
        }
    });

    // Niveau global (1 niveau = 200 XP)
    const globalLevel = Math.floor(totalXP / 200) + 1;

    // Précision moyenne
    const avgScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // Affichage
    document.getElementById('total-xp').innerText = totalXP;
    document.getElementById('max-streak').innerText = maxStreak;
    document.getElementById('total-lessons').innerText = totalLessons + '/75';
    document.getElementById('global-level').innerText = globalLevel;
    document.getElementById('avg-score').innerText = avgScore + '%';
}

// ========================================
// GRAPHIQUE RADAR (PROGRESSION)
// ========================================

function createRadarChart() {
    const ctx = document.getElementById('radarChart');
    if (!ctx) return;

    // Données progression par section
    const progressions = sections.map(section => {
        const completed = JSON.parse(localStorage.getItem(`${section}_completed`)) || [];
        return Math.round((completed.length / 15) * 100); // % complété
    });

    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: sections.map(s => sectionNames[s]),
            datasets: [{
                label: 'Progression (%)',
                data: progressions,
                backgroundColor: 'rgba(42, 157, 143, 0.2)',
                borderColor: 'rgba(42, 157, 143, 1)',
                borderWidth: 3,
                pointBackgroundColor: sections.map(s => sectionColors[s]),
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        font: {
                            family: "'Press Start 2P', cursive",
                            size: 8
                        }
                    },
                    pointLabels: {
                        font: {
                            family: "'Press Start 2P', cursive",
                            size: 10
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.r + '% complété';
                        }
                    },
                    titleFont: {
                        family: "'Press Start 2P', cursive",
                        size: 10
                    },
                    bodyFont: {
                        family: "'Press Start 2P', cursive",
                        size: 9
                    }
                }
            }
        }
    });
}

// ========================================
// GRAPHIQUE BARRES (XP)
// ========================================

function createBarChart() {
    const ctx = document.getElementById('barChart');
    if (!ctx) return;

    // Données XP par section
    const xpValues = sections.map(section => {
        const xpData = JSON.parse(localStorage.getItem(`${section}_xp`)) || { total: 0 };
        return xpData.total || 0;
    });

    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sections.map(s => sectionNames[s]),
            datasets: [{
                label: 'XP Gagnés',
                data: xpValues,
                backgroundColor: sections.map(s => sectionColors[s]),
                borderColor: sections.map(s => sectionColors[s]),
                borderWidth: 3,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            family: "'Press Start 2P', cursive",
                            size: 9
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            family: "'Press Start 2P', cursive",
                            size: 9
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + ' XP';
                        }
                    },
                    titleFont: {
                        family: "'Press Start 2P', cursive",
                        size: 10
                    },
                    bodyFont: {
                        family: "'Press Start 2P', cursive",
                        size: 9
                    }
                }
            }
        }
    });
}

// ========================================
// CALENDRIER ACTIVITÉ (GITHUB-STYLE)
// ========================================

function createActivityCalendar() {
    const container = document.getElementById('activity-calendar');
    if (!container) return;

    // Récupérer historique activités (30 derniers jours)
    const activityHistory = JSON.parse(localStorage.getItem('activity_history')) || {};
    
    const today = new Date();
    const days = [];

    // Générer les 30 derniers jours
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        // Compter activités ce jour
        const dayActivity = activityHistory[dateString] || 0;
        
        // Niveau : 0 = aucune, 1 = 1-2, 2 = 3-4, 3 = 5+
        let level = 0;
        if (dayActivity >= 5) level = 3;
        else if (dayActivity >= 3) level = 2;
        else if (dayActivity >= 1) level = 1;
        
        days.push({ date: dateString, level, count: dayActivity });
    }

    // Créer les boxes
    container.innerHTML = days.map(day => 
        `<div class="activity-box level-${day.level}" 
              title="${day.date}: ${day.count} leçon(s)"
              data-date="${day.date}"></div>`
    ).join('');
}

// Fonction pour enregistrer activité (à appeler depuis lesson-engine.js)
function recordActivity() {
    const today = new Date().toISOString().split('T')[0];
    const activityHistory = JSON.parse(localStorage.getItem('activity_history')) || {};
    activityHistory[today] = (activityHistory[today] || 0) + 1;
    localStorage.setItem('activity_history', JSON.stringify(activityHistory));
}

// ========================================
// STATISTIQUES DÉTAILLÉES
// ========================================

function loadDetailedStats() {
    sections.forEach(section => {
        // Leçons
        const completed = JSON.parse(localStorage.getItem(`${section}_completed`)) || [];
        document.getElementById(`${section}-lessons`).innerText = `${completed.length}/15`;

        // XP
        const xpData = JSON.parse(localStorage.getItem(`${section}_xp`)) || { total: 0 };
        document.getElementById(`${section}-xp`).innerText = xpData.total || 0;

        // Précision
        const stats = JSON.parse(localStorage.getItem(`${section}_stats`)) || {};
        const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
        document.getElementById(`${section}-accuracy`).innerText = accuracy + '%';

        // Streak
        const streakData = JSON.parse(localStorage.getItem(`${section}_streak`)) || { currentStreak: 0 };
        document.getElementById(`${section}-streak`).innerText = (streakData.currentStreak || 0) + ' jours';
    });
}

// ========================================
// OBJECTIFS / ACHIEVEMENTS
// ========================================

function loadObjectives() {
    // OBJECTIF 1 : Explorateur (visiter 5 sections)
    let sectionsVisited = 0;
    sections.forEach(section => {
        const completed = JSON.parse(localStorage.getItem(`${section}_completed`)) || [];
        if (completed.length > 0) sectionsVisited++;
    });
    
    const explorerProgress = (sectionsVisited / 5) * 100;
    document.getElementById('progress-explorer').style.width = explorerProgress + '%';
    document.getElementById('status-explorer').innerText = `${sectionsVisited}/5`;
    
    if (sectionsVisited >= 5) {
        document.getElementById('obj-explorer').classList.add('completed');
    }

    // OBJECTIF 2 : Marathonien (7 jours streak)
    let maxStreak = 0;
    sections.forEach(section => {
        const streakData = JSON.parse(localStorage.getItem(`${section}_streak`)) || { currentStreak: 0 };
        maxStreak = Math.max(maxStreak, streakData.currentStreak || 0);
    });
    
    const marathonienProgress = Math.min((maxStreak / 7) * 100, 100);
    document.getElementById('progress-marathonien').style.width = marathonienProgress + '%';
    document.getElementById('status-marathonien').innerText = `${maxStreak}/7`;
    
    if (maxStreak >= 7) {
        document.getElementById('obj-marathonien').classList.add('completed');
    }

    // OBJECTIF 3 : Champion (compléter section)
    let maxCompleted = 0;
    sections.forEach(section => {
        const completed = JSON.parse(localStorage.getItem(`${section}_completed`)) || [];
        maxCompleted = Math.max(maxCompleted, completed.length);
    });
    
    const championProgress = (maxCompleted / 15) * 100;
    document.getElementById('progress-champion').style.width = championProgress + '%';
    document.getElementById('status-champion').innerText = `${maxCompleted}/15`;
    
    if (maxCompleted >= 15) {
        document.getElementById('obj-champion').classList.add('completed');
    }

    // OBJECTIF 4 : Diamant (niveau 10)
    let totalXP = 0;
    sections.forEach(section => {
        const xpData = JSON.parse(localStorage.getItem(`${section}_xp`)) || { total: 0 };
        totalXP += xpData.total || 0;
    });
    
    const currentLevel = Math.floor(totalXP / 200) + 1;
    const niveau10Progress = Math.min((currentLevel / 10) * 100, 100);
    document.getElementById('progress-niveau10').style.width = niveau10Progress + '%';
    document.getElementById('status-niveau10').innerText = `Niveau ${currentLevel}/10`;
    
    if (currentLevel >= 10) {
        document.getElementById('obj-niveau10').classList.add('completed');
    }
}

console.log('✅ Dashboard Charts initialized');

/**
 * ==========================================
 * DASHBOARD CHARTS - PARTIE 2
 * Export PDF avec jsPDF
 * ==========================================
 */

// ========================================
// EXPORT PDF
// ========================================

function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configuration
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let currentY = margin;

    // ========================================
    // PAGE 1 : EN-TÊTE & RÉSUMÉ
    // ========================================
    
    // Titre
    doc.setFontSize(20);
    doc.setTextColor(29, 53, 87); // #1d3557
    doc.text('Le Monde des Curieux', pageWidth / 2, currentY, { align: 'center' });
    
    currentY += 10;
    doc.setFontSize(14);
    doc.text('Rapport de Progression', pageWidth / 2, currentY, { align: 'center' });
    
    currentY += 5;
    doc.setFontSize(10);
    doc.setTextColor(108, 117, 125); // #6c757d
    const today = new Date().toLocaleDateString('fr-FR');
    doc.text(`Généré le ${today}`, pageWidth / 2, currentY, { align: 'center' });
    
    currentY += 15;

    // Ligne séparatrice
    doc.setDrawColor(44, 62, 80); // #2c3e50
    doc.setLineWidth(0.5);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 10;

    // Récupération données
    let totalXP = 0;
    let maxStreak = 0;
    let totalLessons = 0;

    sections.forEach(section => {
        const xpData = JSON.parse(localStorage.getItem(`${section}_xp`)) || { total: 0 };
        totalXP += xpData.total || 0;

        const streakData = JSON.parse(localStorage.getItem(`${section}_streak`)) || { currentStreak: 0 };
        maxStreak = Math.max(maxStreak, streakData.currentStreak || streakData.longestStreak || 0);

        const completed = JSON.parse(localStorage.getItem(`${section}_completed`)) || [];
        totalLessons += completed.length;
    });

    const globalLevel = Math.floor(totalXP / 200) + 1;

    // RÉSUMÉ GLOBAL
    doc.setFontSize(14);
    doc.setTextColor(29, 53, 87);
    doc.text('Résumé Global', margin, currentY);
    currentY += 10;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    const summaryData = [
        { icon: '⭐', label: 'XP Total', value: totalXP },
        { icon: '🔥', label: 'Plus Long Streak', value: maxStreak + ' jours' },
        { icon: '🏆', label: 'Leçons Complétées', value: totalLessons + '/75' },
        { icon: '📊', label: 'Niveau Global', value: globalLevel }
    ];

    summaryData.forEach(item => {
        doc.text(`${item.icon} ${item.label}: ${item.value}`, margin + 5, currentY);
        currentY += 8;
    });

    currentY += 10;

    // ========================================
    // PROGRESSION PAR MATIÈRE
    // ========================================
    
    doc.setFontSize(14);
    doc.setTextColor(29, 53, 87);
    doc.text('Progression par Matière', margin, currentY);
    currentY += 10;

    sections.forEach(section => {
        const completed = JSON.parse(localStorage.getItem(`${section}_completed`)) || [];
        const xpData = JSON.parse(localStorage.getItem(`${section}_xp`)) || { total: 0 };
        const streakData = JSON.parse(localStorage.getItem(`${section}_streak`)) || { currentStreak: 0 };
        
        const percentage = Math.round((completed.length / 15) * 100);

        doc.setFontSize(12);
        doc.setTextColor(42, 157, 143); // #2a9d8f
        doc.text(sectionNames[section], margin + 5, currentY);
        currentY += 6;

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`  • Leçons: ${completed.length}/15 (${percentage}%)`, margin + 5, currentY);
        currentY += 5;
        doc.text(`  • XP: ${xpData.total || 0}`, margin + 5, currentY);
        currentY += 5;
        doc.text(`  • Streak: ${streakData.currentStreak || 0} jours`, margin + 5, currentY);
        currentY += 8;

        // Vérifier si nouvelle page nécessaire
        if (currentY > pageHeight - 40) {
            doc.addPage();
            currentY = margin;
        }
    });

    currentY += 5;

    // ========================================
    // OBJECTIFS & CONSEILS
    // ========================================
    
    if (currentY > pageHeight - 80) {
        doc.addPage();
        currentY = margin;
    }

    doc.setFontSize(14);
    doc.setTextColor(29, 53, 87);
    doc.text('Objectifs en Cours', margin, currentY);
    currentY += 10;

    // Calculer objectifs
    let sectionsVisited = 0;
    sections.forEach(section => {
        const completed = JSON.parse(localStorage.getItem(`${section}_completed`)) || [];
        if (completed.length > 0) sectionsVisited++;
    });

    const objectives = [
        { 
            name: 'Explorateur', 
            progress: sectionsVisited, 
            target: 5, 
            completed: sectionsVisited >= 5 
        },
        { 
            name: 'Marathonien', 
            progress: maxStreak, 
            target: 7, 
            completed: maxStreak >= 7 
        },
        { 
            name: 'Diamant', 
            progress: globalLevel, 
            target: 10, 
            completed: globalLevel >= 10 
        }
    ];

    doc.setFontSize(11);
    objectives.forEach(obj => {
        const status = obj.completed ? '✓ COMPLÉTÉ' : `${obj.progress}/${obj.target}`;
        doc.setTextColor(obj.completed ? 40 : 0, obj.completed ? 167 : 0, obj.completed ? 69 : 0);
        doc.text(`${obj.name}: ${status}`, margin + 5, currentY);
        currentY += 7;
    });

    currentY += 10;

    // CONSEILS PERSONNALISÉS
    if (currentY > pageHeight - 60) {
        doc.addPage();
        currentY = margin;
    }

    doc.setFontSize(14);
    doc.setTextColor(29, 53, 87);
    doc.text('Conseils Personnalisés', margin, currentY);
    currentY += 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    const advice = generateAdvice(totalLessons, maxStreak, globalLevel);
    
    advice.forEach(tip => {
        const lines = doc.splitTextToSize(`• ${tip}`, pageWidth - 2 * margin - 10);
        lines.forEach(line => {
            doc.text(line, margin + 5, currentY);
            currentY += 5;
        });
        currentY += 3;
    });

    // ========================================
    // FOOTER
    // ========================================
    
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(108, 117, 125);
        doc.text(
            `Le Monde des Curieux - Page ${i}/${pageCount}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
        );
    }

    // SAUVEGARDE
    doc.save(`progression-${today.replace(/\//g, '-')}.pdf`);
    
    // Notification
    showNotification('✅ PDF exporté avec succès !');
}

// ========================================
// GÉNÉRATION CONSEILS
// ========================================

function generateAdvice(totalLessons, maxStreak, globalLevel) {
    const advice = [];

    // Conseils basés sur progression
    if (totalLessons < 15) {
        advice.push('Continue à explorer les différentes matières pour découvrir celle que tu préfères !');
    } else if (totalLessons < 40) {
        advice.push('Tu progresses bien ! Essaie de compléter au moins une leçon par jour.');
    } else {
        advice.push('Excellent travail ! Tu es très assidu dans ton apprentissage.');
    }

    // Conseils basés sur streak
    if (maxStreak < 3) {
        advice.push('Crée une routine : essaie de faire une activité chaque jour pour maintenir ton streak !');
    } else if (maxStreak < 7) {
        advice.push('Ton streak est en bonne voie ! Continue comme ça pour débloquer le badge Marathonien.');
    } else {
        advice.push('Bravo pour ton streak impressionnant ! Tu as une excellente régularité.');
    }

    // Conseils basés sur niveau
    if (globalLevel < 5) {
        advice.push('Varie les matières pour gagner plus d\'XP et monter de niveau rapidement.');
    } else if (globalLevel < 10) {
        advice.push('Tu es sur la bonne voie vers le niveau 10 ! Continue tes efforts.');
    } else {
        advice.push('Niveau 10+ atteint ! Tu maîtrises vraiment bien ton apprentissage.');
    }

    // Conseil matière faible
    let minProgress = 100;
    let weakestSection = '';
    sections.forEach(section => {
        const completed = JSON.parse(localStorage.getItem(`${section}_completed`)) || [];
        const progress = (completed.length / 15) * 100;
        if (progress < minProgress) {
            minProgress = progress;
            weakestSection = sectionNames[section];
        }
    });

    if (minProgress < 50) {
        advice.push(`Pense à travailler davantage ${weakestSection} pour équilibrer ta progression.`);
    }

    return advice;
}

// ========================================
// NOTIFICATION
// ========================================

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #2a9d8f 0%, #1d7a6f 100%);
        color: white;
        padding: 20px 30px;
        border: 4px solid #2c3e50;
        border-radius: 12px;
        font-family: 'Press Start 2P', cursive;
        font-size: 11px;
        box-shadow: 6px 6px 0 rgba(44, 62, 80, 0.4);
        z-index: 10000;
        animation: slideInRight 0.5s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-out';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Ajouter styles animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('✅ Export PDF ready');