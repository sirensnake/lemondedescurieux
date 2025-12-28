// scripts/app-orchestrator.js
/**
 * ORCHESTRATEUR CENTRAL - Le Monde des Curieux
 * Intégration des composants Jour 6 + XP System
 */

class AppOrchestrator {
    constructor() {
        this.components = {};
        this.config = this.loadConfig();
        this.initializationOrder = [
            'accessibility',
            'persistentMenu',
            'streakSystem',
            'xpSystem',
            'touchEnhanced'
        ];
    }
    
    // ========================================
    // INITIALISATION PRINCIPALE
    // ========================================
    
    async init() {
        console.log('🚀 Initialisation App Orchestrator...');
        
        try {
            this.checkDependencies();
            
            for (const componentName of this.initializationOrder) {
                await this.initializeComponent(componentName);
            }
            
            this.synchronizeStates();
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
                if (typeof StreakSystem !== 'undefined' && window.streakSystem) {
                    if (typeof StreakNotificationManager !== 'undefined') {
                        this.components.streakNotifications = new StreakNotificationManager(window.streakSystem);
                        
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
                
            case 'xpSystem':
                if (typeof XPProgressionSystem !== 'undefined') {
                    this.components.xpSystem = new XPProgressionSystem();
                    window.xpSystem = this.components.xpSystem;
                    console.log('✅ XPProgressionSystem chargé');
                    this.integrateXPWithGameSystems();
                }
                break;
                
            case 'touchEnhanced':
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
    // INTÉGRATION XP
    // ========================================
    
    integrateXPWithGameSystems() {
        console.log('🔗 Intégration XP avec Streaks + Hearts...');
        
        window.addEventListener('activity-completed', (e) => {
            const { baseXP, score, activityType } = e.detail;
            
            const context = {
                hasActiveStreak: window.streakSystem?.streakData.currentStreak > 0,
                perfectScore: score === 100,
                comboCount: this.getComboCount()
            };
            
            this.components.xpSystem.awardXP(baseXP || 10, context);
        });
        
        window.addEventListener('streak-update', (e) => {
            const { currentStreak, isNewMilestone } = e.detail;
            
            if (isNewMilestone) {
                const milestoneBonus = currentStreak * 10;
                this.components.xpSystem.awardXP(milestoneBonus, {
                    hasActiveStreak: true,
                    milestoneBonus: true
                });
                console.log(`🎉 Milestone bonus: ${milestoneBonus} XP`);
            }
        });
    }
    
    getComboCount() {
        const recentActivities = JSON.parse(localStorage.getItem('recent_activities') || '[]');
        const now = Date.now();
        const recentCount = recentActivities.filter(a => now - a.timestamp < 5 * 60 * 1000).length;
        return recentCount;
    }
    
    // ========================================
    // SYNCHRONISATION ÉTATS
    // ========================================
    
    synchronizeStates() {
        console.log('🔄 Synchronisation états...');
        
        if (this.components.persistentMenu) {
            this.components.persistentMenu.syncWithGamificationSystems();
        }
        
        if (this.components.accessibility) {
            this.components.accessibility.applyPreferences();
        }
        
        this.updateAllDisplays();
    }
    
    updateAllDisplays() {
        if (window.xpManager) {
            const xpData = window.xpManager.getXP();
            this.broadcastEvent('xp-update', xpData);
        }
        
        if (window.heartSystem) {
            const heartData = window.heartSystem.loadHearts();
            this.broadcastEvent('hearts-update', heartData);
        }
        
        if (window.streakSystem) {
            const streakData = window.streakSystem.loadStreaks();
            this.broadcastEvent('streak-update', streakData);
        }
    }
    
    // ========================================
    // ÉVÉNEMENTS GLOBAUX
    // ========================================
    
    setupGlobalListeners() {
        window.addEventListener('gamification-change', (e) => {
            this.handleGamificationChange(e.detail);
        });
        
        window.addEventListener('accessibility-change', (e) => {
            this.handleAccessibilityChange(e.detail);
        });
        
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.components.streakNotifications) {
                this.components.streakNotifications.showDailyReminder();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            this.handleGlobalShortcuts(e);
        });
    }
    
    handleGamificationChange(data) {
        console.log('🎮 Changement gamification:', data);
        
        if (this.components.persistentMenu) {
            this.components.persistentMenu.syncWithGamificationSystems();
        }
        
        this.saveState();
    }
    
    handleAccessibilityChange(data) {
        console.log('♿ Changement accessibilité:', data);
        
        if (this.components.mindmapTouch && data.reducedMotion) {
            this.components.mindmapTouch.touchMetrics.animationsEnabled = false;
        }
    }
    
    handleGlobalShortcuts(e) {
        if (e.ctrlKey && e.key === 'm') {
            e.preventDefault();
            if (this.components.persistentMenu) {
                document.querySelector('.menu-lateral-persistent')?.classList.toggle('open');
            }
        }
        
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
            'XPProgressionSystem': typeof XPProgressionSystem !== 'undefined',
            'StreakNotificationManager': typeof StreakNotificationManager !== 'undefined',
            'PersistentMenu': typeof PersistentMenu !== 'undefined',
            'MindmapTouchEnhanced': typeof MindmapTouchEnhanced !== 'undefined',
            'AccessibilityController': typeof AccessibilityController !== 'undefined'
        };
        
        console.log('📦 Dépendances requises:', required);
        console.log('📦 Dépendances optionnelles:', optional);
        
        Object.entries(required).forEach(([name, loaded]) => {
            if (!loaded) {
                console.warn(`⚠️ Dépendance requise manquante: ${name}`);
            }
        });
    }
    
    logStatus() {
        console.log('📊 STATUS COMPOSANTS:');
        console.table({
            'XP System': !!this.components.xpSystem,
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
        
        if (this.components.mindmapTouch) {
            metrics.components.touchMetrics = this.components.mindmapTouch.exportMetricsReport();
        }
        
        if (window.xpSystem) {
            metrics.gamification.xp = {
                level: window.xpSystem.data.currentLevel,
                currentXP: window.xpSystem.data.currentXP,
                totalXPEarned: window.xpSystem.data.totalXPEarned
            };
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
                xpSystem: true,
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeApp();
    });
} else {
    initializeApp();
}

function initializeApp() {
    setTimeout(() => {
        appOrchestrator = new AppOrchestrator();
        appOrchestrator.init();
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