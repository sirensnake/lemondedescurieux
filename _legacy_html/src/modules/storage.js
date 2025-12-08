// Module de gestion du stockage local avec versioning et chiffrement
export class storageManager {
  constructor(prefix = 'lemondedescurieux_') {
    this.prefix = prefix;
    this.version = 'v3';
    this.encryptionEnabled = false; // À activer en production
    
    // Vérifier la compatibilité
    this.checkStorageSupport();
    
    // Migration des anciennes données si nécessaire
    this.migrateOldData();
  }
  
  // Vérifier le support du localStorage
  checkStorageSupport() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.error('LocalStorage non disponible:', e);
      this.useMemoryStorage = true;
      this.memoryStorage = {};
      return false;
    }
  }
  
  // Migration des anciennes versions
  migrateOldData() {
    try {
      // Rechercher les anciennes clés sans préfixe
      const oldKeys = ['userProgress', 'userStats', 'gameSettings'];
      
      oldKeys.forEach(oldKey => {
        const data = localStorage.getItem(oldKey);
        if (data) {
          // Migrer vers la nouvelle structure
          this.set(oldKey, JSON.parse(data));
          // Supprimer l'ancienne clé
          localStorage.removeItem(oldKey);
          console.log(`Migration: ${oldKey} -> ${this.prefix}${oldKey}`);
        }
      });
      
      // Marquer la migration comme effectuée
      this.set('_migrated', { version: this.version, date: new Date().toISOString() });
    } catch (error) {
      console.error('Erreur lors de la migration:', error);
    }
  }
  
  // Obtenir une clé complète avec préfixe
  getKey(key) {
    return `${this.prefix}${this.version}_${key}`;
  }
  
  // Récupérer une valeur
  get(key) {
    try {
      const fullKey = this.getKey(key);
      
      if (this.useMemoryStorage) {
        return this.memoryStorage[fullKey] || null;
      }
      
      const item = localStorage.getItem(fullKey);
      if (!item) return null;
      
      // Déchiffrer si nécessaire
      const decrypted = this.encryptionEnabled ? this.decrypt(item) : item;
      
      // Parser le JSON
      const parsed = JSON.parse(decrypted);
      
      // Vérifier l'expiration
      if (parsed.expires && new Date(parsed.expires) < new Date()) {
        this.remove(key);
        return null;
      }
      
      return parsed.value;
    } catch (error) {
      console.error(`Erreur lors de la récupération de ${key}:`, error);
      return null;
    }
  }
  
  // Stocker une valeur
  set(key, value, options = {}) {
    try {
      const fullKey = this.getKey(key);
      
      const item = {
        value: value,
        timestamp: new Date().toISOString(),
        version: this.version
      };
      
      // Ajouter expiration si spécifiée
      if (options.expires) {
        item.expires = options.expires;
      }
      
      // Convertir en JSON
      const json = JSON.stringify(item);
      
      // Chiffrer si nécessaire
      const encrypted = this.encryptionEnabled ? this.encrypt(json) : json;
      
      if (this.useMemoryStorage) {
        this.memoryStorage[fullKey] = encrypted;
      } else {
        localStorage.setItem(fullKey, encrypted);
      }
      
      // Émettre un événement pour la synchronisation
      this.emitStorageEvent(key, value, 'set');
      
      return true;
    } catch (error) {
      console.error(`Erreur lors du stockage de ${key}:`, error);
      
      // Si quota dépassé, essayer de nettoyer
      if (error.name === 'QuotaExceededError') {
        this.cleanup();
        // Réessayer une fois
        try {
          localStorage.setItem(this.getKey(key), JSON.stringify({ value, timestamp: new Date().toISOString() }));
          return true;
        } catch (retryError) {
          console.error('Impossible de stocker après nettoyage:', retryError);
        }
      }
      
      return false;
    }
  }
  
  // Supprimer une valeur
  remove(key) {
    try {
      const fullKey = this.getKey(key);
      
      if (this.useMemoryStorage) {
        delete this.memoryStorage[fullKey];
      } else {
        localStorage.removeItem(fullKey);
      }
      
      this.emitStorageEvent(key, null, 'remove');
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de ${key}:`, error);
      return false;
    }
  }
  
  // Vérifier l'existence d'une clé
  has(key) {
    const fullKey = this.getKey(key);
    
    if (this.useMemoryStorage) {
      return fullKey in this.memoryStorage;
    }
    
    return localStorage.getItem(fullKey) !== null;
  }
  
  // Obtenir toutes les clés
  getAllKeys() {
    const keys = [];
    const prefix = this.getKey('');
    
    if (this.useMemoryStorage) {
      Object.keys(this.memoryStorage).forEach(key => {
        if (key.startsWith(prefix)) {
          keys.push(key.replace(prefix, ''));
        }
      });
    } else {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keys.push(key.replace(prefix, ''));
        }
      }
    }
    
    return keys;
  }
  
  // Nettoyer les données expirées
  cleanup() {
    const keys = this.getAllKeys();
    let cleaned = 0;
    
    keys.forEach(key => {
      const data = this.get(key);
      if (!data) {
        // Donnée expirée ou corrompue, déjà supprimée par get()
        cleaned++;
      }
    });
    
    console.log(`Nettoyage terminé: ${cleaned} entrées supprimées`);
    return cleaned;
  }
  
  // Obtenir la taille utilisée
  getSize() {
    let size = 0;
    
    if (this.useMemoryStorage) {
      const json = JSON.stringify(this.memoryStorage);
      size = new Blob([json]).size;
    } else {
      const keys = this.getAllKeys();
      keys.forEach(key => {
        const value = localStorage.getItem(this.getKey(key));
        if (value) {
          size += value.length + key.length;
        }
      });
    }
    
    return {
      bytes: size,
      kb: Math.round(size / 1024),
      mb: Math.round(size / 1024 / 1024 * 100) / 100
    };
  }
  
  // Exporter toutes les données
  exportAll() {
    const data = {};
    const keys = this.getAllKeys();
    
    keys.forEach(key => {
      data[key] = this.get(key);
    });
    
    return {
      version: this.version,
      exportDate: new Date().toISOString(),
      data: data
    };
  }
  
  // Importer des données
  importData(exportedData) {
    try {
      if (exportedData.version !== this.version) {
        console.warn(`Version différente: ${exportedData.version} vs ${this.version}`);
      }
      
      Object.entries(exportedData.data).forEach(([key, value]) => {
        this.set(key, value);
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      return false;
    }
  }
  
  // Effacer toutes les données
  clear() {
    const keys = this.getAllKeys();
    
    keys.forEach(key => {
      this.remove(key);
    });
    
    console.log('Toutes les données ont été effacées');
  }
  
  // Émettre un événement de stockage
  emitStorageEvent(key, value, action) {
    // Créer un événement personnalisé
    const event = new CustomEvent('storage-change', {
      detail: {
        key: key,
        value: value,
        action: action,
        timestamp: new Date().toISOString()
      }
    });
    
    window.dispatchEvent(event);
  }
  
  // Méthodes de chiffrement (simplifiées pour la démo)
  encrypt(data) {
    // En production, utiliser une vraie bibliothèque de chiffrement
    return btoa(data);
  }
  
  decrypt(data) {
    // En production, utiliser une vraie bibliothèque de chiffrement
    return atob(data);
  }
  
  // Observer les changements
  onChange(callback) {
    window.addEventListener('storage-change', (event) => {
      callback(event.detail);
    });
  }
}