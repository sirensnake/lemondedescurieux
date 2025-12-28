/**
 * User Controller - Le Monde des Curieux
 * Gestion du profil utilisateur et des interactions
 */

const userController = {
    /**
     * État interne
     */
    currentUser: null,
    
    /**
     * Initialisation au chargement de la page
     */
    init() {
        // Charger le profil utilisateur depuis localStorage
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            this.currentUser = JSON.parse(savedProfile);
            this.showConnectedState();
        } else {
            this.showGuestState();
        }
    },
    
    /**
     * Afficher l'interface pour créer un profil
     */
    showProfileSetup() {
        const nickname = prompt('Choisis ton pseudo :');
        if (nickname && nickname.trim()) {
            this.currentUser = {
                nickname: nickname.trim(),
                avatar: 'images/avatars/curio-default.png',
                createdAt: new Date().toISOString(),
                xp: 0,
                level: 1,
                streak: 0,
                badges: 0
            };
            
            localStorage.setItem('userProfile', JSON.stringify(this.currentUser));
            this.showConnectedState();
            alert(`Bienvenue ${nickname} ! Ton profil est créé 🎉`);
        }
    },
    
    /**
     * Afficher l'état "invité" (non connecté)
     */
    showGuestState() {
        const guestDiv = document.getElementById('user-guest');
        const connectedDiv = document.getElementById('user-connected');
        
        if (guestDiv) guestDiv.style.display = 'block';
        if (connectedDiv) connectedDiv.style.display = 'none';
    },
    
    /**
     * Afficher l'état "connecté"
     */
    showConnectedState() {
        const guestDiv = document.getElementById('user-guest');
        const connectedDiv = document.getElementById('user-connected');
        
        if (guestDiv) guestDiv.style.display = 'none';
        if (connectedDiv) {
            connectedDiv.style.display = 'block';
            this.updateUserDisplay();
        }
    },
    
    /**
     * Mettre à jour l'affichage des informations utilisateur
     */
    updateUserDisplay() {
        if (!this.currentUser) return;
        
        // Mise à jour du nom
        const nicknameElements = [
            document.getElementById('user-nickname'),
            document.getElementById('menu-nickname')
        ];
        nicknameElements.forEach(el => {
            if (el) el.textContent = this.currentUser.nickname;
        });
        
        // Mise à jour des stats
        document.getElementById('menu-level')?.textContent(this.currentUser.level || 1);
        document.getElementById('menu-streak')?.textContent(this.currentUser.streak || 0);
        document.getElementById('menu-xp')?.textContent(this.currentUser.xp || 0);
        document.getElementById('menu-badges')?.textContent(this.currentUser.badges || 0);
        
        // Mise à jour de l'avatar
        const avatarImg = document.getElementById('user-avatar-img');
        if (avatarImg) avatarImg.src = this.currentUser.avatar || 'images/avatars/curio-default.png';
    },
    
    /**
     * Basculer l'affichage du menu utilisateur
     */
    toggleMenu() {
        const menu = document.getElementById('user-menu');
        if (menu) {
            const isVisible = menu.style.display === 'block';
            menu.style.display = isVisible ? 'none' : 'block';
        }
    },
    
    /**
     * Modifier le profil utilisateur
     */
    editProfile() {
        const newNickname = prompt('Nouveau pseudo :', this.currentUser?.nickname || '');
        if (newNickname && newNickname.trim()) {
            this.currentUser.nickname = newNickname.trim();
            localStorage.setItem('userProfile', JSON.stringify(this.currentUser));
            this.updateUserDisplay();
            alert('Profil mis à jour ! ✅');
        }
    },
    
    /**
     * Exporter les données utilisateur
     */
    exportData() {
        const allData = {
            profile: JSON.parse(localStorage.getItem('userProfile') || '{}'),
            progress: JSON.parse(localStorage.getItem('userProgress') || '{}'),
            badges: JSON.parse(localStorage.getItem('userBadges') || '{}'),
            xp: JSON.parse(localStorage.getItem('xpData') || '{}'),
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(allData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `lemondedescurieux_export_${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        alert('Données exportées ! 💾');
    },
    
    /**
     * Afficher les paramètres
     */
    showSettings() {
        alert('⚙️ Paramètres en cours de développement\n\nProchainement :\n- Thèmes visuels\n- Notifications\n- Accessibilité');
    },
    
    /**
     * Réinitialiser le profil
     */
    resetProfile() {
        if (confirm('⚠️ Réinitialiser ton profil supprimera toutes tes données (progression, badges, XP).\n\nÊtes-tu vraiment sûr ?')) {
            if (confirm('Dernière confirmation : toutes les données seront perdues !')) {
                // Supprimer toutes les données localStorage
                localStorage.removeItem('userProfile');
                localStorage.removeItem('userProgress');
                localStorage.removeItem('userBadges');
                localStorage.removeItem('xpData');
                localStorage.removeItem('englishStreaks');
                localStorage.removeItem('englishHearts');
                localStorage.removeItem('frenchStreaks');
                
                this.currentUser = null;
                this.showGuestState();
                
                alert('✅ Profil réinitialisé. La page va se recharger.');
                setTimeout(() => location.reload(), 1000);
            }
        }
    }
};

// Initialisation automatique au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    userController.init();
    
    // Fermer le menu en cliquant ailleurs
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('user-menu');
        const avatar = document.querySelector('.user-avatar');
        
        if (menu && menu.style.display === 'block') {
            if (!menu.contains(e.target) && e.target !== avatar && !avatar?.contains(e.target)) {
                menu.style.display = 'none';
            }
        }
    });
});

// Export pour utilisation dans d'autres scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = userController;
}
