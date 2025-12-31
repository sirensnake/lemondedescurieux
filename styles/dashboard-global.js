window.onload = function() {
    console.log("🛠️ Script Dashboard chargé !");

    const xp = localStorage.getItem('curio_xp') || 0;
    const missionsRaw = localStorage.getItem('curio_missions_completed') || 0;
    const badges = JSON.parse(localStorage.getItem('curio_badges')) || [];
    const avatar = localStorage.getItem('curio_selected_avatar_emoji') || '🦊';

    // Affichage des stats
    if(document.getElementById('global-xp')) document.getElementById('global-xp').textContent = xp;
    if(document.getElementById('total-exercises')) document.getElementById('total-exercises').textContent = missionsRaw;
    if(document.getElementById('current-avatar-display')) document.getElementById('current-avatar-display').innerText = avatar;

    // Logique de fête auto si on arrive sur le dashboard avec un multiple de 5
    let count = parseInt(missionsRaw);
    if (count > 0 && count % 5 === 0) {
        const lastCel = localStorage.getItem('curio_last_celebration');
        if (parseInt(lastCel) !== count) {
            lancerDoubleFeuArtifice();
            localStorage.setItem('curio_last_celebration', count);
        }
    }
};

function lancerDoubleFeuArtifice() {
    const duration = 4000;
    const end = Date.now() + duration;
    (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0, y: 0.8 }, colors: ['#f1c40f', '#ffffff'] });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, colors: ['#f1c40f', '#ffffff'] });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}