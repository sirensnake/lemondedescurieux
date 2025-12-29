/**
 * MOTEUR DE MISSION - GÉNÉRATEUR D'INTERFACE (Version avec Badge Secret)
 */

function launchMission(missionData) {
    const overlay = document.createElement('div');
    overlay.id = "mission-overlay";
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); display:flex; justify-content:center; align-items:center; z-index:9999; font-family:sans-serif; color: #333;";

    let currentStep = 0;

    const renderStep = () => {
        const step = missionData.steps[currentStep];
        const progress = Math.round((currentStep / missionData.steps.length) * 100);

        overlay.innerHTML = `
            <div id="mission-card" style="background:white; padding:30px; border-radius:15px; max-width:500px; width:90%; text-align:center; border:5px solid #3498db; position:relative; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <h2 style="margin-top:0; color:#2c3e50;">${missionData.title}</h2>
                <div style="width:100%; background:#eee; height:10px; border-radius:5px; margin-bottom:20px;">
                    <div style="width:${progress}%; background:#3498db; height:100%; border-radius:5px; transition:0.3s;"></div>
                </div>
                <div style="background:#e1f5fe; color:#0288d1; padding:5px 15px; border-radius:20px; display:inline-block; margin-bottom:15px; font-weight:bold; font-size:0.9em;">
                    ${step.subject}
                </div>
                <p style="font-size:1.2em; line-height:1.5; margin-bottom:25px; font-weight:500;">${step.question}</p>
                <div style="display:grid; gap:10px;">
                    ${step.options.map((opt, i) => `
                        <button onclick="handleAnswer(${i})" style="padding:15px; border:2px solid #ddd; border-radius:10px; background:white; cursor:pointer; font-size:1.1em; transition:0.2s;" 
                        onmouseover="this.style.borderColor='#3498db';this.style.background='#f0f7ff'" 
                        onmouseout="this.style.borderColor='#ddd';this.style.background='white'">${opt}</button>
                    `).join('')}
                </div>
                <button onclick="closeMission()" style="margin-top:20px; background:none; border:none; color:#95a5a6; text-decoration:underline; cursor:pointer;">Quitter</button>
            </div>
        `;
    };

    window.handleAnswer = (index) => {
        const step = missionData.steps[currentStep];
        if (index === step.correct) {
            currentStep++;
            if (currentStep < missionData.steps.length) {
                renderStep();
            } else {
                terminerMission();
            }
        } else {
            const card = document.getElementById('mission-card');
            card.style.borderColor = "#e74c3c";
            setTimeout(() => card.style.borderColor = "#3498db", 500);
        }
    };

    const terminerMission = () => {
        // --- EFFET CONFETTIS ---
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f1c40f', '#2ecc71', '#3498db', '#e74c3c']
        });
        const gain = 50;
        const badge = missionData.badge || "🏅";
        
        // 1. Sauvegarde XP et Mission
        if (typeof window.ajouterXP === "function") window.ajouterXP(gain);
        if (typeof window.enregistrerMissionReussie === "function") window.enregistrerMissionReussie(missionData.id);
        
        // 2. Récupération des badges actuels
        let badgesLog = JSON.parse(localStorage.getItem('curio_badges')) || [];
        
        // Ajouter le badge de la mission s'il n'existe pas
        if (!badgesLog.includes(badge)) {
            badgesLog.push(badge);
        }

        // 3. --- LOGIQUE DU BADGE SECRET DIAMANT ---
        const toutesLesMissions = ["histoire_01", "sciences_eau_01", "robots_01", "francais_01", "english_01"];
        const missionsFinies = JSON.parse(localStorage.getItem('curio_missions_completed')) || [];
        
        const toutEstFini = toutesLesMissions.every(id => missionsFinies.includes(id));
        
        let messageSecret = "";
        if (toutEstFini && !badgesLog.includes("💎")) {
            badgesLog.push("💎");
            messageSecret = `<div style="margin-top:10px; color:#9b59b6; font-weight:bold; font-size:1.1em;">
                                ✨ INCROYABLE ! Tu as débloqué le Badge Secret de Diamant ! 💎
                             </div>`;
                             // === PLACEZ LE CODE DU FINAL BLAST ICI ===
            var duration = 4 * 1000; // 4 secondes de fête
            var end = Date.now() + duration;

            (function frame() {
                confetti({
                    particleCount: 10,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0, y: 0.7 },
                    colors: ['#9b59b6', '#f1c40f', '#ffffff']
                });
                confetti({
                    particleCount: 10,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1, y: 0.7 },
                    colors: ['#9b59b6', '#f1c40f', '#ffffff']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
            // === FIN DU CODE FINAL BLAST ===
        }
        

        // 4. Sauvegarde finale des badges
        localStorage.setItem('curio_badges', JSON.stringify(badgesLog));

        overlay.innerHTML = `
            <div style="background:white; padding:40px; border-radius:20px; text-align:center; border:8px solid #f1c40f; animation: pop 0.4s ease-out; max-width:450px;">
                <div style="font-size:60px; margin-bottom:10px;">${badge}</div>
                <h2 style="color:#2c3e50; margin:0;">Mission Réussie !</h2>
                ${messageSecret}
                <div style="background:#f1c40f; color:white; padding:15px; border-radius:15px; font-size:2em; font-weight:bold; margin: 20px 0;">
                    + ${gain} XP
                </div>
                <button onclick="closeMission()" style="background:#2ecc71; color:white; border:none; padding:15px 40px; border-radius:50px; font-size:1.2em; font-weight:bold; cursor:pointer; box-shadow: 0 4px 0 #27ae60;">Génial !</button>
            </div>
            <style>@keyframes pop { from { transform:scale(0.8); opacity:0; } to { transform:scale(1); opacity:1; } }</style>
        `;
    };

    window.closeMission = () => {
        document.body.removeChild(overlay);
        // On force la mise à jour visuelle des XP sur l'accueil
        if (typeof window.mettreAJourAffichage === "function") window.mettreAJourAffichage();
    };

    document.body.appendChild(overlay);
    renderStep();
}