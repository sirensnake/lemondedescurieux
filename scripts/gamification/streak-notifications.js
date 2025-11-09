// scripts/streak-notifications.js
class StreakNotificationManager {
    constructor(streakSystem) {
        this.streakSystem = streakSystem;
        this.notificationQueue = [];
        this.isShowing = false;
    }

    checkMilestones(currentStreak) {
        const milestones = {
            3: { message: "🎉 3 jours de suite ! Tu es sur la bonne voie !", reward: 50 },
            7: { message: "🔥 Une semaine complète ! Incroyable !", reward: 150 },
            14: { message: "⭐ 2 semaines ! Tu es un champion !", reward: 300 },
            30: { message: "🏆 1 mois consécutif ! Exceptionnel !", reward: 1000 }
        };

        if (milestones[currentStreak]) {
            this.showAchievementNotification(milestones[currentStreak]);
        }
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'streak-achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">🏆</div>
                <div class="achievement-text">
                    <h3>${achievement.message}</h3>
                    <p>+${achievement.reward} XP bonus !</p>
                </div>
            </div>
            <button class="achievement-claim" onclick="this.closest('.streak-achievement-notification').remove()">
                Réclamer ! ✓
            </button>
        `;

        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => notification.classList.add('visible'), 10);
        
        // Auto-fermeture après 5 secondes
        setTimeout(() => {
            notification.classList.remove('visible');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Son de réussite (Web Audio API)
        this.playSuccessSound();
    }

    showDailyReminder() {
        // Vérifier si l'utilisateur n'est pas venu aujourd'hui
        const lastActivity = localStorage.getItem('lastActivityDate');
        const today = new Date().toDateString();
        
        if (lastActivity !== today) {
            // Notification douce si la page est ouverte mais pas d'activité
            setTimeout(() => {
                this.showGentleReminder();
            }, 300000); // 5 minutes d'inactivité
        }
    }

    showGentleReminder() {
        const reminder = document.createElement('div');
        reminder.className = 'gentle-reminder';
        reminder.innerHTML = `
            <div class="reminder-content">
                <img src="images/curio-thinking.png" alt="Curio réfléchit" class="reminder-mascot">
                <p>Curio t'attend pour une nouvelle aventure aujourd'hui ! 🌟</p>
                <button onclick="this.closest('.gentle-reminder').remove()">J'arrive ! 🚀</button>
            </div>
        `;
        
        document.body.appendChild(reminder);
    }

    playSuccessSound() {
        // Son de réussite léger compatible mobile
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 523.25; // C5
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
}