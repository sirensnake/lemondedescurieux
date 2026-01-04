/**
 * MOTEUR MATHÉMATIQUES COMPLET - 15 LEÇONS (SÉRIES LONGUES)
 * Architecture Modulaire - Sauvegarde localStorage [cite: 2025-12-28]
 */

const DATA_MATHS = [
    { 
        id: 1, t: "Multiplications", i: "✖️", 
        questions: [
            {q: "3 × 8 =", a: "24"}, {q: "6 × 7 =", a: "42"}, {q: "9 × 9 =", a: "81"}, {q: "5 × 12 =", a: "60"}, {q: "8 × 4 =", a: "32"}
        ] 
    },
    { 
        id: 2, t: "Additions", i: "➕", 
        questions: [
            {q: "125 + 48 =", a: "173"}, {q: "99 + 11 =", a: "110"}, {q: "250 + 750 =", a: "1000"}, {q: "45 + 55 =", a: "100"}, {q: "1200 + 300 =", a: "1500"}
        ] 
    },
    { 
        id: 3, t: "Soustractions", i: "➖", 
        questions: [
            {q: "100 - 37 =", a: "63"}, {q: "50 - 12 =", a: "38"}, {q: "1000 - 1 =", a: "999"}, {q: "85 - 25 =", a: "60"}, {q: "200 - 45 =", a: "155"}
        ] 
    },
    { 
        id: 4, t: "Les Fractions", i: "🍕", 
        questions: [
            {q: "1/2 de 50 =", a: "25"}, {q: "1/4 de 100 =", a: "25"}, {q: "1/2 de 1000 =", a: "500"}, {q: "3/4 de 100 =", a: "75"}, {q: "1/10 de 100 =", a: "10"}
        ] 
    },
    { 
        id: 5, t: "Divisions", i: "➗", 
        questions: [
            {q: "45 ÷ 5 =", a: "9"}, {q: "24 ÷ 3 =", a: "8"}, {q: "81 ÷ 9 =", a: "9"}, {q: "100 ÷ 4 =", a: "25"}, {q: "36 ÷ 6 =", a: "6"}
        ] 
    },
    { 
        id: 6, t: "Décimaux", i: "🎯", 
        questions: [
            {q: "0,5 + 0,7 =", a: "1,2"}, {q: "1,5 + 1,5 =", a: "3"}, {q: "10 - 0,5 =", a: "9,5"}, {q: "2,2 + 3,8 =", a: "6"}, {q: "0,25 + 0,25 =", a: "0,5"}
        ] 
    },
    { 
        id: 7, t: "Le Nombre 1000", i: "💎", 
        questions: [
            {q: "1000 - 1 =", a: "999"}, {q: "500 + 500 =", a: "1000"}, {q: "250 × 4 =", a: "1000"}, {q: "1000 ÷ 10 =", a: "100"}, {q: "950 + 50 =", a: "1000"}
        ] 
    },
    { 
        id: 8, t: "Périmètres", i: "📏", 
        questions: [
            {q: "Carré côté 4. P = ?", a: "16"}, {q: "Carré côté 10. P = ?", a: "40"}, {q: "Rect. L=5, l=2. P = ?", a: "14"}, {q: "Triangle équi. côté 5. P = ?", a: "15"}, {q: "Carré côté 2,5. P = ?", a: "10"}
        ] 
    },
    { 
        id: 9, t: "Mesures", i: "⚖️", 
        questions: [
            {q: "2kg = ? g", a: "2000"}, {q: "1,5kg = ? g", a: "1500"}, {q: "500g = ? kg", a: "0,5"}, {q: "3000g = ? kg", a: "3"}, {q: "1kg - 200g = ? g", a: "800"}
        ] 
    },
    { 
        id: 10, t: "Calcul Mental", i: "⚡", 
        questions: [
            {q: "Double de 15 ?", a: "30"}, {q: "Moitié de 50 ?", a: "25"}, {q: "Triple de 10 ?", a: "30"}, {q: "Quart de 20 ?", a: "5"}, {q: "Double de 45 ?", a: "90"}
        ] 
    },
    { 
        id: 11, t: "Géométrie", i: "📐", 
        questions: [
            {q: "Sommets d'un triangle ?", a: "3"}, {q: "Côtés d'un carré ?", a: "4"}, {q: "Sommets d'un cube ?", a: "8"}, {q: "Faces d'un cube ?", a: "6"}
        ] 
    },
    { 
        id: 12, t: "Durées", i: "⏰", 
        questions: [
            {q: "1h = ? minutes", a: "60"}, {q: "2h = ? minutes", a: "120"}, {q: "1 minute = ? sec", a: "60"}, {q: "1h 30 = ? min", a: "90"}
        ] 
    },
    { 
        id: 13, t: "Grands Nombres", i: "🌌", 
        questions: [
            {q: "100 × 10 =", a: "1000"}, {q: "1000 × 10 =", a: "10000"}, {q: "10 000 × 10 =", a: "100000"}, {q: "1000 ÷ 100 =", a: "10"}
        ] 
    },
    { 
        id: 14, t: "Proportionnel", i: "⚖️", 
        questions: [
            {q: "2 œufs=4€. 4 œufs=?", a: "8"}, {q: "1kg=10€. 3kg=?", a: "30"}, {q: "10L coûte 20€. 5L=?", a: "10"}
        ] 
    },
    { 
        id: 15, t: "Examen Final", i: "🏆", 
        questions: [
            {q: "12 × 12 =", a: "144"}, {q: "1000 ÷ 8 =", a: "125"}, {q: "0,75 + 0,25 =", a: "1"}, {q: "1/4 de 200 =", a: "50"}
        ] 
    }
];

let leçonActuelle = null;
let indexQuestion = 0;
let scoreXP = parseInt(localStorage.getItem('curio_xp') || 0);

document.addEventListener('DOMContentLoaded', () => {
    updateXP();
    renderGrid();
    setupListeners();
});

function updateXP() {
    const el = document.getElementById('xp-val');
    if (el) el.innerText = `⭐ XP: ${scoreXP}`;
}

function renderGrid() {
    const grid = document.getElementById('view-grid');
    if (!grid) return;
    grid.innerHTML = DATA_MATHS.map(l => `
        <div class="card" onclick="lancerLecon(${l.id})">
            <div class="card-icon" style="font-size:30px">${l.i}</div>
            <span class="card-label" style="font-size:8px; display:block; margin:10px 0;">${l.t}</span>
            <button class="btn-pixel" style="font-size:8px">DÉFI (${l.questions.length})</button>
        </div>
    `).join('');
}

window.lancerLecon = function(id) {
    leçonActuelle = DATA_MATHS.find(x => x.id === id);
    indexQuestion = 0;
    document.getElementById('view-grid').classList.add('hidden');
    document.getElementById('view-quiz').classList.remove('hidden');
    chargerQuestion();
};

function chargerQuestion() {
    const q = leçonActuelle.questions[indexQuestion];
    const total = leçonActuelle.questions.length;
    document.getElementById('q-title').innerText = `${leçonActuelle.t} (${indexQuestion + 1}/${total})`;
    document.getElementById('q-text').innerText = q.q;
    const input = document.getElementById('q-input');
    input.value = "";
    input.focus();
    document.getElementById('feedback').innerHTML = "";
}

function verifierReponse() {
    const input = document.getElementById('q-input');
    const feedback = document.getElementById('feedback');
    const reponseEleve = input.value.trim().replace(',', '.');
    const reponseCorrecte = leçonActuelle.questions[indexQuestion].a.replace(',', '.');
    
    if (reponseEleve === reponseCorrecte) {
        feedback.innerHTML = "<span style='color: #2a9d8f;'>BIEN JOUÉ !</span>";
        setTimeout(() => {
            indexQuestion++;
            if (indexQuestion < leçonActuelle.questions.length) {
                chargerQuestion();
            } else {
                scoreXP += 20;
                localStorage.setItem('curio_xp', scoreXP);
                updateXP();
                feedback.innerHTML = "<span style='color: #2a9d8f;'>SÉRIE TERMINÉE !</span>";
                setTimeout(() => {
                    document.getElementById('view-grid').classList.remove('hidden');
                    document.getElementById('view-quiz').classList.add('hidden');
                }, 1000);
            }
        }, 600);
    } else {
        feedback.innerHTML = "<span style='color: #e63946;'>RÉESSAIE !</span>";
        input.value = "";
        input.focus();
    }
}

function setupListeners() {
    document.getElementById('btn-validate').addEventListener('click', verifierReponse);
    document.getElementById('q-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') verifierReponse();
    });
}