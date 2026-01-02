const FRENCH_DATA = [
    { id: 1, title: "Passé Simple (3e groupe)", icon: "⏳", info: "3 ex. • Expert", q: "Il (vouloir) au passé simple :", a: "voulut" },
    { id: 2, title: "Accord Participe Passé", icon: "✍️", info: "2 ex. • Difficile", q: "Les pommes que j'ai (manger) :", a: "mangées" }
];

class CurioApp {
    constructor() {
        this.xp = parseInt(localStorage.getItem('curio_xp') || 230);
        this.currentEx = null;
        this.init();
    }

    init() {
        this.updateUI();
        this.renderLessons();
    }

    updateUI() {
        document.getElementById('xp-val').textContent = this.xp;
        document.getElementById('lvl-val').textContent = Math.floor(this.xp / 100);
    }

    renderLessons() {
        const grid = document.getElementById('lessons-grid');
        if (!grid) return;
        grid.innerHTML = FRENCH_DATA.map(l => `
            <div class="lesson-card">
                <span style="font-size:40px;">${l.icon}</span>
                <div style="font-size:10px; margin:15px 0;">${l.title}</div>
                <button class="btn-pixel" onclick="app.startExercise(${l.id})">COMMENCER</button>
            </div>
        `).join('');
    }

    startExercise(id) {
        this.currentEx = FRENCH_DATA.find(l => l.id === id);
        document.getElementById('lessons-container').classList.add('hidden');
        document.getElementById('exercise-container').classList.remove('hidden');
        document.getElementById('ex-title').textContent = this.currentEx.title;
        document.getElementById('ex-question').textContent = this.currentEx.q;
    }

    validateAnswer() {
        const input = document.getElementById('ex-input').value.toLowerCase().trim();
        if (input === this.currentEx.a) {
            this.xp += 20;
            localStorage.setItem('curio_xp', this.xp);
            alert("✨ CORRECT ! +20 XP");
            location.reload();
        } else {
            alert("❌ RÉESSAIE !");
        }
    }

    closeExercise() {
        document.getElementById('exercise-container').classList.add('hidden');
        document.getElementById('lessons-container').classList.remove('hidden');
    }

    openShop() {
        document.getElementById('lessons-container').classList.add('hidden');
        document.getElementById('shop-container').classList.remove('hidden');
    }

    closeShop() {
        document.getElementById('shop-container').classList.add('hidden');
        document.getElementById('lessons-container').classList.remove('hidden');
    }

    toggleMenu() { /* Logique pour agrandir la barre si besoin */ }
}

const app = new CurioApp();