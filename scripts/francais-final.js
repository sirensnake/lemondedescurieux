/**
 * MOTEUR FRANÇAIS COMPLET - 15 LEÇONS CM1/CM2
 * Architecture Modulaire - Le Monde des Curieux
 */

const DATA_FRANCAIS = [
    { id: 1, t: "Homonymes a / à", i: "🔊", questions: [{q: "Il ... mangé.", a: "a"}, {q: "À la plage.", a: "à"}, {q: "Elle ... faim.", a: "a"}, {q: "C'est ... toi.", a: "à"}] },
    { id: 2, t: "Homonymes et / est", i: "🔊", questions: [{q: "Il ... grand.", a: "est"}, {q: "Toi ... moi.", a: "et"}, {q: "L'été ... fini.", a: "est"}, {q: "Beau ... chaud.", a: "et"}] },
    { id: 3, t: "L'Adjectif", i: "🎨", questions: [{q: "Une (grand) table.", a: "grande"}, {q: "Des chats (noir).", a: "noirs"}, {q: "Une (beau) fleur.", a: "belle"}, {q: "Des (petit) bois.", a: "petits"}] },
    { id: 4, t: "Présent -ER", i: "⏳", questions: [{q: "Je (manger).", a: "mange"}, {q: "Nous (jouer).", a: "jouons"}, {q: "Ils (chanter).", a: "chantent"}, {q: "Tu (parler).", a: "parles"}] },
    { 
        id: 5, t: "Le Sujet", i: "👤", 
        questions: [
            {q: "Sujet : 'Le loup court.'", a: "le loup"}, 
            {q: "Sujet : 'Les oiseaux volent.'", a: "les oiseaux"},
            {q: "Sujet : 'Demain, nous irons.'", a: "nous"},
            {q: "Sujet : 'Lucie mange.'", a: "lucie"}
        ] 
    },
    { 
        id: 6, t: "Pluriel en -s / -x", i: "📚", 
        questions: [
            {q: "Un chien, des ...", a: "chiens"}, 
            {q: "Un noyau, des ...", a: "noyaux"},
            {q: "Un château, des ...", a: "châteaux"},
            {q: "Un trou, des ...", a: "trous"}
        ] 
    },
    { 
        id: 7, t: "Féminin", i: "👩", 
        questions: [
            {q: "Un lion, une ...", a: "lionne"}, 
            {q: "Un danseur, une ...", a: "danseuse"},
            {q: "Un instituteur, une ...", a: "institutrice"},
            {q: "Un prince, une ...", a: "princesse"}
        ] 
    },
    { 
        id: 8, t: "Le Verbe Être", i: "🌟", 
        questions: [
            {q: "Je ...", a: "suis"}, {q: "Tu ...", a: "es"}, {q: "Nous ...", a: "sommes"}, {q: "Vous ...", a: "êtes"}, {q: "Ils ...", a: "sont"}
        ] 
    },
    { 
        id: 9, t: "Le Verbe Avoir", i: "📦", 
        questions: [
            {q: "J'...", a: "ai"}, {q: "Tu ...", a: "as"}, {q: "Il ...", a: "a"}, {q: "Nous ...", a: "avons"}, {q: "Ils ...", a: "ont"}
        ] 
    },
    { 
        id: 10, t: "Le COD", i: "🎯", 
        questions: [
            {q: "COD : 'Il mange un fruit.'", a: "un fruit"}, 
            {q: "COD : 'Je regarde la télé.'", a: "la télé"},
            {q: "COD : 'Tu écoutes Lucie.'", a: "lucie"}
        ] 
    },
    { 
        id: 11, t: "son / sont", i: "🔊", 
        questions: [
            {q: "Ils ... partis.", a: "sont"}, {q: "C'est ... cartable.", a: "son"}, {q: "Les clés ... ici.", a: "sont"}, {q: "Il aime ... chien.", a: "son"}
        ] 
    },
    { 
        id: 12, t: "Imparfait", i: "🕰️", 
        questions: [
            {q: "Je (chanter).", a: "chantais"}, {q: "Vous (avoir).", a: "aviez"}, {q: "Nous (être).", a: "étions"}, {q: "Ils (finir).", a: "finissaient"}
        ] 
    },
    { 
        id: 13, t: "Futur", i: "🚀", 
        questions: [
            {q: "Je (venir).", a: "viendrai"}, {q: "Tu (avoir).", a: "auras"}, {q: "Nous (être).", a: "serons"}, {q: "Ils (manger).", a: "mangeront"}
        ] 
    },
    { 
        id: 14, t: "Le Genre", i: "🚻", 
        questions: [
            {q: "Genre de 'Soleil' (m/f) ?", a: "m"}, {q: "Genre de 'Lune' ?", a: "f"}, {q: "Genre de 'Cahier' ?", a: "m"}, {q: "Genre de 'Forêt' ?", a: "f"}
        ] 
    },
    { 
        id: 15, t: "Le Verbe Faire", i: "🔨", 
        questions: [
            {q: "Je ... mes devoirs.", a: "fais"}, {q: "Nous ... du sport.", a: "faisons"}, {q: "Vous ... quoi ?", a: "faites"}, {q: "Ils ... la fête.", a: "font"}
        ] 
    }
];

let leçonActuelle = null;
let indexQuestion = 0;
let scoreXP = parseInt(localStorage.getItem('curio_xp') || 0);

function updateXP() {
    const el = document.getElementById('xp-val');
    if (el) el.innerText = `⭐ XP: ${scoreXP}`;
}

function renderGrid() {
    const grid = document.getElementById('view-grid');
    if (!grid) return;
    grid.innerHTML = DATA_FRANCAIS.map(l => `
        <div class="card" onclick="lancerLecon(${l.id})">
            <div class="card-icon" style="font-size:30px">${l.i}</div>
            <span class="card-label" style="font-size:8px; display:block; margin:10px 0;">${l.t}</span>
            <button class="btn-pixel" style="font-size:8px">SÉRIE (${l.questions.length})</button>
        </div>
    `).join('');
}

window.onload = () => {
    updateXP();
    renderGrid();
    setupListeners();
};

window.lancerLecon = function(id) {
    leçonActuelle = DATA_FRANCAIS.find(x => x.id === id);
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
    const reponseEleve = input.value.trim().toLowerCase();
    const reponseCorrecte = leçonActuelle.questions[indexQuestion].a.toLowerCase();
    
    if (reponseEleve === reponseCorrecte) {
        feedback.innerHTML = "<span style='color: #2a9d8f;'>BIEN JOUÉ !</span>";
        setTimeout(() => {
            indexQuestion++;
            if (indexQuestion < leçonActuelle.questions.length) {
                chargerQuestion();
            } else {
                scoreXP += 25;
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
    }
}

function setupListeners() {
    const btnVal = document.getElementById('btn-validate');
    if (btnVal) btnVal.onclick = verifierReponse;
    const inputField = document.getElementById('q-input');
    if (inputField) {
        inputField.onkeypress = (e) => { if (e.key === 'Enter') verifierReponse(); };
    }
}