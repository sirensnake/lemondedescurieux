// Mindmap Interactive - Le Monde des Curieux

function loadStats() {
    const progress = JSON.parse(localStorage.getItem('mondeDeCurieuxProgress') || '{}');
    
    document.getElementById('streak').textContent = `${progress.currentStreak || 0}j`;
    document.getElementById('xp').textContent = progress.totalXP || 0;
    document.getElementById('hearts').textContent = `${progress.currentHearts || 5}/5`;
    document.getElementById('badges').textContent = progress.badgesCount || 0;
}

function trackNavigation(section) {
    const analytics = JSON.parse(localStorage.getItem('analytics') || '{}');
    analytics[section] = (analytics[section] || 0) + 1;
    analytics.lastSection = section;
    analytics.lastVisit = new Date().toISOString();
    localStorage.setItem('analytics', JSON.stringify(analytics));
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Le Monde des Curieux');
    
    // Event listeners sur tous les liens
    document.querySelectorAll('.bubble-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const section = link.getAttribute('title');
            console.log('🎯 Navigation:', section);
            trackNavigation(section);
        });
    });
    
    loadStats();
    console.log('✅ 10 zones cliquables actives');
});