const FRENCH_DATA = [
    { id: 1, title: "Passé Simple (3e groupe)", icon: "⏳", q: "Il (vouloir) au passé simple :", a: "voulut" },
    { id: 2, title: "Accord Participe Passé", icon: "✍️", q: "Les pommes que j'ai (manger) :", a: "mangées" },
    { id: 3, title: "Imparfait", icon: "📜", q: "Nous (finir) à l'imparfait :", a: "finissions" },
    { id: 4, title: "Pluriels complexes", icon: "🍎", q: "Un (travail) au pluriel :", a: "travaux" },
    { id: 5, title: "Futur Simple", icon: "🚀", q: "Je (courir) au futur :", a: "courrai" },
    { id: 6, title: "Complément d'objet", icon: "🎯", q: "COD de 'Il mange une pomme' :", a: "pomme" },
    { id: 7, title: "Adjectifs", icon: "🎨", q: "Féminin de 'frais' :", a: "fraîche" },
    { id: 8, title: "Homophones", icon: "👂", q: "a ou à ? Il __ faim.", a: "a" },
    { id: 9, title: "Conjonctions", icon: "🔗", q: "Mais, ou, et, donc, __, ni, car", a: "or" },
    { id: 10, title: "Pronoms", icon: "👤", q: "Pronom de 'Pierre dort' :", a: "il" },
    { id: 11, title: "Subjonctif Présent", icon: "💡", q: "Qu'il (être) :", a: "soit" },
    { id: 12, title: "Ponctuation", icon: "❓", q: "Signe pour une question :", a: "?" },
    { id: 13, title: "Synonymes", icon: "🔄", q: "Synonyme de 'content' :", a: "heureux" },
    { id: 14, title: "Antonymes", icon: "🌗", q: "Contraire de 'grand' :", a: "petit" },
    { id: 15, title: "Passé Composé", icon: "🏆", q: "Ils (partir) :", a: "sont partis" }
];

class CurioApp {
    constructor() {
        this.xp = parseInt(localStorage.getItem('curio_xp') || 0);
        this.currentEx = null;
        this.init();
    }

    init() {
        this.updateUI();
        this.renderLessons();
        console.log("✅ Application Curio initialisée");
    }

    updateUI() {
        const xpEl = document.getElementById('xp-val');
        const lvlEl = document.getElementById('lvl-val');
        if(xpEl) xpEl.textContent = this.xp;
        if(lvlEl) lvlEl.textContent = Math.floor(this.xp / 100) + 1;
    }

    renderLessons() {
        const grid = document.getElementById('lessons-grid');
        if (!grid) return;
        grid.innerHTML = FRENCH_DATA.map(l => `
            <div class="lesson-card" style="border: 4px solid #000; padding: 15px; background: white; text-align: center; box-shadow: 4px 4px 0px #000;">
                <div style="font-size: 30px; margin-bottom: 10px;">${l.icon}</div>
                <div style="font-size: 9px; font-weight: bold; margin-bottom: 15px; height: 25px; overflow: hidden;">${l.title}</div>
                <button class="btn-pixel btn-green" onclick="window.app.startExercise(${l.id})">JOUER</button>
            </div>
        `).join('');
    }

    startExercise(id) {
        console.log("🚀 Lancement de l'exercice ID:", id);
        this.currentEx = FRENCH_DATA.find(l => l.id === id);
        
        document.getElementById('view-lessons').classList.add('hidden');
        document.getElementById('view-exercise').classList.remove('hidden');
        
        document.getElementById('ex-title').textContent = this.currentEx.title;
        document.getElementById('ex-question').textContent = this.currentEx.q;
        
        const inputEl = document.getElementById('ex-input');
        inputEl.value = "";
        inputEl.focus();
    }

    validate() {
        console.log("🖱️ Clic sur VALIDER détecté");
        if (!this.currentEx) {
            console.error("❌ Erreur: Aucun exercice en cours");
            return;
        }

        const inputEl = document.getElementById('ex-input');
        const val = inputEl.value.toLowerCase().trim();
        const fb = document.getElementById('ui-feedback');
        
        console.log("Saisie:", val, "Attendu:", this.currentEx.a);

        if (val === this.currentEx.a.toLowerCase().trim()) {
            this.xp += 20;
            localStorage.setItem('curio_xp', this.xp); // Sauvegarde persistante [cite: 2025-12-28]
            fb.innerHTML = "<span style='color: green; font-weight: bold;'>✨ CORRECT ! +20 XP</span>";
            this.updateUI();
            setTimeout(() => location.reload(), 1500);
        } else {
            fb.innerHTML = "<span style='color: red; font-weight: bold;'>❌ ESSAIE ENCORE !</span>";
            inputEl.style.border = "3px solid red";
            setTimeout(() => inputEl.style.border = "3px solid #000", 500);
        }
    }
}

// Globalisation forcée
window.app = new CurioApp();