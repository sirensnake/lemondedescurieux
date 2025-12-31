window.onload = function() {
    console.log("🚀 Dashboard : Chargement des données...");

    // 1. On récupère les données
    const xp = localStorage.getItem('curio_xp') || 0;
    const badges = JSON.parse(localStorage.getItem('curio_badges')) || [];
    const avatar = localStorage.getItem('curio_selected_avatar_emoji') || '🦊';
    
    // On analyse le format des missions (Tableau vs Nombre)
    const rawMissions = localStorage.getItem('curio_missions_completed');
    let count = 0;
    try {
        const parsed = JSON.parse(rawMissions);
        count = Array.isArray(parsed) ? parsed.length : (parseInt(rawMissions) || 0);
    } catch(e) {
        count = parseInt(rawMissions) || 0;
    }

    // 2. On affiche tout (On ne laisse pas le HTML le faire)
    const set = (id, val) => { if(document.getElementById(id)) document.getElementById(id).innerText = val; };
    set('global-xp', xp);
    set('global-badges-count', badges.length);
    set('total-exercises', count);
    set('success-rate', count > 0 ? "100%" : "0%");
    set('current-avatar-display', avatar);

    const grid = document.getElementById('badges-grid');
    if (grid && badges.length > 0) {
        grid.innerHTML = badges.map(b => `<div style="font-size:25px; padding:10px; border:2px solid #f1c40f;">${b}</div>`).join('');
    }

    // 3. LOGIQUE DE FÊTE
    if (count > 0 && count % 5 === 0) {
        const last = localStorage.getItem('curio_last_celebration');
        if (parseInt(last) !== count) {
            lancerFete();
            afficherPop(count);
            localStorage.setItem('curio_last_celebration', count);
        }
    }
};

function lancerFete() {
    const end = Date.now() + 3000;
    (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0, y: 0.8 }, colors: ['#f1c40f', '#2ecc71'] });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, colors: ['#f1c40f', '#3498db'] });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}

function afficherPop(n) {
    const d = document.createElement('div');
    d.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; display:flex; align-items:center; justify-content:center;";
    d.innerHTML = `<div style="background:#2c3e50; border:4px solid #f1c40f; padding:20px; text-align:center; color:white; font-family:'Press Start 2P';">
        <h2 style="color:#f1c40f;">BRAVO !</h2>
        <p>Tu as fait ${n} missions !</p>
        <button onclick="this.parentElement.parentElement.remove()" style="margin-top:15px; background:#2ecc71; border:none; padding:10px; cursor:pointer; color:white;">OK</button>
    </div>`;
    document.body.appendChild(d);
}