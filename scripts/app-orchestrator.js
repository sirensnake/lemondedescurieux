// scripts/app-orchestrator.js
/**
 * ORCHESTRATEUR CENTRAL - Le Monde des Curieux
 * Intégration des 4 composants Jour 6 :
 * - StreakNotificationManager
 * - PersistentMenu
 * - MindmapTouchEnhanced
 * - AccessibilityController
 */

class AppOrchestrator {
    constructor() {
        this.components = {};
        this.config = this.loadConfig();
        this.initializationOrder = [
            'accessibility',
            'persistentMenu',
            'streakSystem',
            'touchEnhanced'
        ];
    }
    
    // ========================================
    // INITIALISATION PRINCIPALE
    // ========================================
    
    async init() {
        console.log('🚀 Initialisation App Orchestrator...');
        
        try {
            // Vérifier dépendances
            this.checkDependencies();
            
            // Charger composants dans l'ordre
            for (const componentName of this.initializationOrder) {
                await this.initializeComponent(componentName);
            }
            
            // Synchroniser états
            this.synchronizeStates();
            
            // Configurer listeners globaux
            this.setupGlobalListeners();
            
            console.log('✅ App Orchestrator initialisé avec succès');
            this.logStatus();
            
        } catch (error) {
            console.error('❌ Erreur initialisation:', error);
            this.handleInitializationError(error);
        }
    }
    
    // ========================================
    // INITIALISATION COMPOSANTS
    // ========================================
    
    async initializeComponent(name) {
        console.log(`⏳ Initialisation ${name}...`);
        
        switch(name) {
            case 'accessibility':
                if (typeof AccessibilityController !== 'undefined') {
                    this.components.accessibility = new AccessibilityController();
                    console.log('✅ AccessibilityController chargé');
                }
                break;
                
            case 'persistentMenu':
                if (typeof PersistentMenu !== 'undefined') {
                    this.components.persistentMenu = new PersistentMenu();
                    console.log('✅ PersistentMenu chargé');
                }
                break;
                
            case 'streakSystem':
                // Vérifier si StreakSystem existe déjà (sections Français/Anglais)
                if (typeof StreakSystem !== 'undefined' && window.streakSystem) {
                    // Ajouter notifications au système existant
                    if (typeof StreakNotificationManager !== 'undefined') {
                        this.components.streakNotifications = new StreakNotificationManager(window.streakSystem);
                        
                        // Hook dans l'événement d'activité
                        const originalRecordActivity = window.streakSystem.recordActivity;
                        window.streakSystem.recordActivity = () => {
                            const result = originalRecordActivity.call(window.streakSystem);
                            this.components.streakNotifications.checkMilestones(
                                window.streakSystem.streakData.currentStreak
                            );
                            return result;
                        };
                        
                        console.log('✅ StreakNotificationManager intégré');
                    }
                }
                break;
                
            case 'touchEnhanced':
                // Uniquement sur pages avec mindmap
                if (document.querySelector('.mindmap')) {
                    if (typeof MindmapTouchEnhanced !== 'undefined') {
                        this.components.mindmapTouch = new MindmapTouchEnhanced();
                        console.log('✅ MindmapTouchEnhanced chargé');
                    }
                }
                break;
        }
    }
    
    // ========================================
    // SYNCHRONISATION ÉTATS
    // ========================================
    
    synchronizeStates() {
        console.log('🔄 Synchronisation états...');
        
        // Synchroniser menu avec gamification
        if (this.components.persistentMenu) {
            this.components.persistentMenu.syncWithGamificationSystems();
        }
        
        // Appliquer préférences accessibilité
        if (this.components.accessibility) {
            this.components.accessibility.applyPreferences();
        }
        
        // Mettre à jour affichages
        this.updateAllDisplays();
    }
    
    updateAllDisplays() {
        // XP
        if (window.xpManager) {
            const xpData = window.xpManager.getXP();
            this.broadcastEvent('xp-update', xpData);
        }
        
        // Hearts
        if (window.heartSystem) {
            const heartData = window.heartSystem.loadHearts();
            this.broadcastEvent('hearts-update', heartData);
        }
        
        // Streaks
        if (window.streakSystem) {
            const streakData = window.streakSystem.loadStreaks();
            this.broadcastEvent('streak-update', streakData);
        }
    }
    
    // ========================================
    // ÉVÉNEMENTS GLOBAUX
    // ========================================
    
    setupGlobalListeners() {
        // Écouter changements gamification
        window.addEventListener('gamification-change', (e) => {
            this.handleGamificationChange(e.detail);
        });
        
        // Écouter changements accessibilité
        window.addEventListener('accessibility-change', (e) => {
            this.handleAccessibilityChange(e.detail);
        });
        
        // Visibilité page (pour streaks)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.components.streakNotifications) {
                this.components.streakNotifications.showDailyReminder();
            }
        });
        
        // Keyboard shortcuts globaux
        document.addEventListener('keydown', (e) => {
            this.handleGlobalShortcuts(e);
        });
    }
    
    handleGamificationChange(data) {
        console.log('🎮 Changement gamification:', data);
        
        // Propager aux composants concernés
        if (this.components.persistentMenu) {
            this.components.persistentMenu.syncWithGamificationSystems();
        }
        
        // Sauvegarder
        this.saveState();
    }
    
    handleAccessibilityChange(data) {
        console.log('♿ Changement accessibilité:', data);
        
        // Appliquer aux composants
        if (this.components.mindmapTouch && data.reducedMotion) {
            // Désactiver animations tactiles
            this.components.mindmapTouch.touchMetrics.animationsEnabled = false;
        }
    }
    
    handleGlobalShortcuts(e) {
        // Ctrl+M : Toggle menu
        if (e.ctrlKey && e.key === 'm') {
            e.preventDefault();
            if (this.components.persistentMenu) {
                document.querySelector('.menu-lateral-persistent')?.classList.toggle('open');
            }
        }
        
        // Ctrl+A : Toggle accessibilité
        if (e.ctrlKey && e.key === 'a') {
            e.preventDefault();
            if (this.components.accessibility) {
                this.components.accessibility.togglePanel();
            }
        }
    }
    
    // ========================================
    // BROADCAST SYSTÈME
    // ========================================
    
    broadcastEvent(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        window.dispatchEvent(event);
        
        // Mettre à jour affichages DOM
        this.updateDOMDisplays(eventName, data);
    }
    
    updateDOMDisplays(eventName, data) {
        switch(eventName) {
            case 'xp-update':
                const xpElements = document.querySelectorAll('[data-display="xp"]');
                xpElements.forEach(el => {
                    el.textContent = `${data.currentXP} XP`;
                });
                break;
                
            case 'hearts-update':
                const heartElements = document.querySelectorAll('[data-display="hearts"]');
                heartElements.forEach(el => {
                    el.textContent = '❤️'.repeat(data.currentHearts);
                });
                break;
                
            case 'streak-update':
                const streakElements = document.querySelectorAll('[data-display="streak"]');
                streakElements.forEach(el => {
                    el.textContent = `🔥 ${data.currentStreak}`;
                });
                break;
        }
    }
    
    // ========================================
    // VÉRIFICATIONS & DIAGNOSTICS
    // ========================================
    
    checkDependencies() {
        const required = {
            'StreakSystem': typeof StreakSystem !== 'undefined',
            'HeartSystem': typeof HeartSystem !== 'undefined'
        };
        
        const optional = {
            'StreakNotificationManager': typeof StreakNotificationManager !== 'undefined',
            'PersistentMenu': typeof PersistentMenu !== 'undefined',
            'MindmapTouchEnhanced': typeof MindmapTouchEnhanced !== 'undefined',
            'AccessibilityController': typeof AccessibilityController !== 'undefined'
        };
        
        console.log('📦 Dépendances requises:', required);
        console.log('📦 Dépendances optionnelles:', optional);
        
        // Avertir si dépendances manquantes
        Object.entries(required).forEach(([name, loaded]) => {
            if (!loaded) {
                console.warn(`⚠️ Dépendance requise manquante: ${name}`);
            }
        });
    }
    
    logStatus() {
        console.log('📊 STATUS COMPOSANTS:');
        console.table({
            'Accessibilité': !!this.components.accessibility,
            'Menu Persistant': !!this.components.persistentMenu,
            'Notifications Streak': !!this.components.streakNotifications,
            'Touch Enhanced': !!this.components.mindmapTouch
        });
    }
    
    // ========================================
    // API PUBLIQUE
    // ========================================
    
    getComponent(name) {
        return this.components[name];
    }
    
    getAllComponents() {
        return this.components;
    }
    
    exportMetrics() {
        const metrics = {
            timestamp: new Date().toISOString(),
            components: {},
            gamification: {}
        };
        
        // Métriques touch
        if (this.components.mindmapTouch) {
            metrics.components.touchMetrics = this.components.mindmapTouch.exportMetricsReport();
        }
        
        // Métriques gamification
        if (window.xpManager) {
            metrics.gamification.xp = window.xpManager.getXP();
        }
        if (window.streakSystem) {
            metrics.gamification.streak = window.streakSystem.loadStreaks();
        }
        if (window.heartSystem) {
            metrics.gamification.hearts = window.heartSystem.loadHearts();
        }
        
        console.log('📊 Export métriques complètes:', metrics);
        return metrics;
    }
    
    // ========================================
    // CONFIGURATION & ÉTAT
    // ========================================
    
    loadConfig() {
        return JSON.parse(localStorage.getItem('app_config')) || {
            version: '1.0.0',
            environment: 'production',
            features: {
                notifications: true,
                touchTracking: true,
                accessibility: true,
                persistentMenu: true
            }
        };
    }
    
    saveState() {
        const state = {
            timestamp: Date.now(),
            components: Object.keys(this.components),
            config: this.config
        };
        
        localStorage.setItem('app_state', JSON.stringify(state));
    }
    
    handleInitializationError(error) {
        console.error('❌ ERREUR CRITIQUE:', error);
        
        // Afficher message utilisateur
        const errorBanner = document.createElement('div');
        errorBanner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #dc2f02;
            color: #fff;
            padding: 1rem;
            text-align: center;
            z-index: 99999;
            font-family: 'Press Start 2P', cursive;
            font-size: 0.7rem;
        `;
        errorBanner.textContent = '⚠️ Erreur de chargement. Rechargez la page.';
        
        document.body.insertBefore(errorBanner, document.body.firstChild);
    }
}

// ========================================
// INITIALISATION AUTOMATIQUE
// ========================================

let appOrchestrator;

// Attendre que DOM + scripts soient chargés
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeApp();
    });
} else {
    initializeApp();
}

function initializeApp() {
    // Délai pour s'assurer que tous les scripts sont chargés
    setTimeout(() => {
        appOrchestrator = new AppOrchestrator();
        appOrchestrator.init();
        
        // Exposer globalement pour debug
        window.appOrchestrator = appOrchestrator;
    }, 500);
}

// ========================================
// API GLOBALE DEBUG
// ========================================

window.DEBUG_APP = {
    getStatus: () => appOrchestrator?.logStatus(),
    getComponent: (name) => appOrchestrator?.getComponent(name),
    exportMetrics: () => appOrchestrator?.exportMetrics(),
    resetAll: () => {
        if (confirm('⚠️ Réinitialiser toutes les données ?')) {
            localStorage.clear();
            location.reload();
        }
    }
};
