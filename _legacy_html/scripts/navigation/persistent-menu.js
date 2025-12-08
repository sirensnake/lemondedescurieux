// scripts/persistent-menu.js - NOUVEAU FICHIER
class PersistentMenu {
    constructor() {
        this.currentSection = this.detectCurrentSection();
        this.initializeMenu();
    }

    detectCurrentSection() {
        const path = window.location.pathname;
        if (path.includes('francais')) return 'francais';
        if (path.includes('english')) return 'english';
        if (path.includes('maths')) return 'maths';
        return 'home';
    }

    initializeMenu() {
        const menuHTML = `
            <aside class="menu-lateral-persistent" role="navigation" aria-label="Menu principal">
                <div class="menu-header">
                    <img src="images/curio-head.png" alt="Curio" class="menu-mascot">
                    <h3>Explore !</h3>
                </div>
                <nav>
                    <ul>
                        <li class="${this.currentSection === 'francais' ? 'active' : ''}">
                            <a href="francais_duolingo_section.html">
                                🇫🇷 Français
                                ${this.getProgressBadge('francais')}
                            </a>
                        </li>
                        <li class="${this.currentSection === 'english' ? 'active' : ''}">
                            <a href="english_duolingo_section.html">
                                🇬🇧 English
                                ${this.getProgressBadge('english')}
                            </a>
                        </li>
                        <li class="${this.currentSection === 'maths' ? 'active' : ''}">
                            <a href="maths_section.html">
                                🔢 Mathématiques
                                ${this.getProgressBadge('maths')}
                            </a>
                        </li>
                    </ul>
                </nav>
                
                <!-- Zone gamification intégrée -->
                <div class="menu-gamification">
                    <div id="menu-streak">🔥 <span>0</span></div>
                    <div id="menu-hearts">❤️ <span>5</span></div>
                    <div id="menu-xp">⭐ <span>0</span> XP</div>
                </div>
            </aside>
        `;
        
        // Injection au début du body
        document.body.insertAdjacentHTML('afterbegin', menuHTML);
        this.syncWithGamificationSystems();
    }

    getProgressBadge(section) {
        const progress = JSON.parse(localStorage.getItem(`${section}_progress`)) || {};
        const completion = this.calculateCompletion(progress);
        
        if (completion >= 100) return '<span class="badge-complete">✓</span>';
        if (completion >= 50) return '<span class="badge-progress">⚡</span>';
        if (completion > 0) return '<span class="badge-started">•</span>';
        return '';
    }

    syncWithGamificationSystems() {
        // Synchronisation avec streaks/hearts existants
        if (window.StreakSystem) {
            const streakData = window.StreakSystem.prototype.loadStreaks();
            document.querySelector('#menu-streak span').textContent = streakData.currentStreak || 0;
        }
        
        if (window.HeartSystem) {
            const heartData = window.HeartSystem.prototype.loadHearts();
            document.querySelector('#menu-hearts span').textContent = heartData.currentHearts || 5;
        }
    }
}

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
    new PersistentMenu();
});