/**
 * FRENCH STORAGE - Gestionnaire de données localStorage
 * Centralise toutes les opérations de stockage pour la section Français
 */

class FrenchStorage {
    constructor() {
        this.keys = {
            progress: 'french_progress',
            lessons: 'french_lessons_completed',
            streaks: 'french_streaks',
            hearts: 'french_hearts',
            xp: 'french_xp',
            level: 'french_level',
            settings: 'french_settings'
        };
    }

    // === GETTERS ===
    
    getProgress() {
        return this.get(this.keys.progress, {});
    }

    getLessonsCompleted() {
        return this.get(this.keys.lessons, []);
    }

    getStreaks() {
        return this.get(this.keys.streaks, {
            current: 0,
            longest: 0,
            lastActivity: null
        });
    }

    getHearts() {
        return this.get(this.keys.hearts, {
            current: 5,
            max: 5,
            lastLoss: null,
            regenStartTime: null
        });
    }

    getXP() {
        return this.get(this.keys.xp, 0);
    }

    getLevel() {
        return this.get(this.keys.level, 1);
    }

    getSettings() {
        return this.get(this.keys.settings, {
            soundEnabled: true,
            animationsEnabled: true
        });
    }

    // === SETTERS ===
    
    setProgress(progress) {
        this.set(this.keys.progress, progress);
    }

    setLessonsCompleted(lessons) {
        this.set(this.keys.lessons, lessons);
    }

    setStreaks(streaks) {
        this.set(this.keys.streaks, streaks);
    }

    setHearts(hearts) {
        this.set(this.keys.hearts, hearts);
    }

    setXP(xp) {
        this.set(this.keys.xp, xp);
    }

    setLevel(level) {
        this.set(this.keys.level, level);
    }

    setSettings(settings) {
        this.set(this.keys.settings, settings);
    }

    // === UTILITAIRES ===
    
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error reading ${key}:`, error);
            return defaultValue;
        }
    }

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error writing ${key}:`, error);
            return false;
        }
    }

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing ${key}:`, error);
            return false;
        }
    }

    clear() {
        try {
            Object.values(this.keys).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }

    // === EXPORT/IMPORT ===
    
    export() {
        const data = {};
        Object.entries(this.keys).forEach(([name, key]) => {
            data[name] = this.get(key);
        });
        return JSON.stringify(data);
    }

    import(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            Object.entries(this.keys).forEach(([name, key]) => {
                if (data[name] !== undefined) {
                    this.set(key, data[name]);
                }
            });
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
}

// Instance globale
const FrenchStorageInstance = new FrenchStorage();

// Export pour modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FrenchStorage;
}

console.log('✅ FrenchStorage loaded');
