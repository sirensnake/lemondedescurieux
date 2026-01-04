// ==========================================
// MATHS-FINAL.JS - L'Académie des Curieux
// ==========================================

class MathsAcademy {
    constructor() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        // Sécurisation des éléments DOM [cite: 2025-12-28]
        this.dom = {
            grid: document.getElementById('lessons-grid'),
            viewGrid: document.getElementById('view-grid'),
            viewExercise: document.getElementById('view-exercise'),
            title: document.getElementById('exercise-title'),
            question: document.getElementById('exercise-question'),
            input: document.getElementById('answer-input'),
            feedback: document.getElementById('feedback-zone'),
            xp: document.getElementById('xp-counter'),
            progress: document.getElementById('progress-fill')
        };

        this.xp = parseInt(localStorage.getItem('curio_xp') || 0);
        this.updateXP();
        this.setupDatabase();
        this.render();
    }

    setupDatabase() {
        this.database = [
            { id: 1, title: "Multiplications", icon: "✖️", exercises: [
                { q: "3 × 4 =", a: "12" }, { q: "7 × 3 =", a: "21" }, { q: "9 × 5 =", a: "45" }
            ]},
            { id: 2, title: "Additions", icon: "➕", exercises: [
                { q: "125 + 48 =", a: "173" }, { q: "89 + 76 =", a: "165" }
            ]},
            { id: 3, title: "Soustractions", icon: "➖", exercises: [
                { q: "85 - 23 =", a: "62" }, { q: "142 - 67 =", a: "75" }
            ]},
            { id: 4, title: "Les Fractions", icon: "🍕", exercises: [
                { q: "1/2 de 10 =", a: "5" }, { q: "3/4 de 12 =", a: "9" }
            ]},
            { id: 5, title: "Division Simple", icon: "➗", exercises: [
                { q: "20 ÷ 4 =", a: "5" }, { q: "81 ÷ 9 =", a: "9" }
            ]},
            { id: 6, title: "Décimaux", icon: "🎯", exercises: [
                { q: "0,5 + 0,5 =", a: "1" }, { q: "1,2 + 0,8 =", a: "2" }
            ]},
            { id: 7, title: "Le Nombre 1000", icon: "💎", exercises: [
                { q: "950 + ?", a: "50" }, { q: "1000 - 250 =", a: "750" }
            ]},
            { id: 8, title: "Périmètres", icon: "📏", exercises: [
                { q: "Carré côté 5cm. P = ?", a: "20" }, { q: "Rect. 4x3. P = ?", a: "14" }
            ]},
            { id: 9, title: "Unités de Mesure", icon: "⚖️", exercises: [
                { q: "1kg = ? g", a: "1000" }, { q: "500cm = ? m", a: "5" }
            ]},
            { id: 10, title: "Calcul Mental", icon: "⚡", exercises: [
                { q: "Double de 25 ?", a: "50" }, { q: "Moitié de 30 ?", a: "15" }
            ]},
            { id: 11, title: "Géométrie", icon: "📐", exercises: [
                { q: "Nb de sommets d'un cube ?", a: "8" }, { q: "Côtés d'un triangle ?", a: "3" }
            ]},
            { id: 12, title: "Heures & Durées", icon: "⏰", exercises: [
                { q: "1h30 = ? min", a: "90" }, { q: "3 min = ? sec", a: "180" }
            ]},
            { id: 13, title: "Grands Nombres", icon: "🌌", exercises: [
                { q: "100 x 100 =", a: "10000" }
            ]},
            { id: 14, title: "Proportionnel", icon: "⚖️", exercises: [
                { q: "1 œuf=2€. 5 œufs=?", a: "10" }
            ]},
            { id: 15, title: "L'Examen Final", icon: "🏆", exercises: [
                { q: "150 + 150 =", a: "300" }, { q: "12 x 2 =", a: "24" }
            ]}
        ];
    }

    render() {
        if (!this.dom.grid) return;
        this.dom.grid.innerHTML = this.database.map(l => `
            <div class="lesson-card" onclick="app.start(${l.id})">
                <div class="lesson-icon">${l.icon}</div>
                <div style="font-size:9px; margin: 10px 0;">${l.title}</div>
                <button class="btn-validate" style="font-size:8px; width:100%">DÉFI</button>
            </div>
        `).join('');
    }

    start(id) {
        this.current = this.database.find(l => l.id === id);
        this.idx = 0;
        this.dom.viewGrid.classList.add('hidden');
        this.dom.viewExercise.classList.remove('hidden');
        this.load();
    }

    load() {
        const q = this.current.exercises[this.idx];
        this.dom.title.innerText = this.current.title;
        this.dom.question.innerText = q.q;
        this.dom.input.value = "";
        this.dom.input.focus();
        this.dom.feedback.classList.add('hidden');
        this.dom.progress.style.width = `${(this.idx / this.current.exercises.length) * 100}%`;
    }

    validate() {
        const val = this.dom.input.value.trim();
        if (val === this.current.exercises[this.idx].a) {
            this.xp += 20;
            localStorage.setItem('curio_xp', this.xp); [cite: 2025-12-28]
            this.updateXP();
            this.dom.feedback.innerText = "✨ BRAVO ! +20 XP";
            this.dom.feedback.style.color = "#58cc02";
            this.dom.feedback.classList.remove('hidden');
            
            setTimeout(() => {
                this.idx++;
                if (this.idx < this.current.exercises.length) this.load();
                else { alert("Section Terminée !"); location.reload(); }
            }, 1000);
        } else {
            this.dom.feedback.innerText = "❌ RÉESSAIE !";
            this.dom.feedback.style.color = "#ff4b4b";
            this.dom.feedback.classList.remove('hidden');
        }
    }

    updateXP() {
        if (this.dom.xp) this.dom.xp.innerText = `⭐ XP: ${this.xp}`;
    }
}

window.app = new MathsAcademy();

// Liaison événementielle
document.addEventListener('click', e => {
    if (e.target.id === 'validate-btn') window.app.validate();
});
document.addEventListener('keypress', e => {
    if (e.key === 'Enter' && !app.dom.viewExercise.classList.contains('hidden')) app.validate();
});