// security/privacy-manager.js
export class PrivacyManager {
  constructor() {
    this.encryption = new Encryption();
    this.consent = this.loadConsent();
  }
  
  async encryptSensitiveData(data) {
    // Chiffrement AES-256 pour données sensibles
    const key = await this.getOrCreateKey();
    return this.encryption.encrypt(data, key);
  }
  
  validateDataMinimization(data) {
    // Vérifier que seules les données nécessaires sont collectées
    const allowedFields = [
      'progress', 'scores', 'preferences', 
      'achievements', 'streak', 'level'
    ];
    
    return Object.keys(data).every(key => allowedFields.includes(key));
  }
  
  async exportUserData() {
    // Export RGPD complet
    const allData = await this.collectAllUserData();
    const encrypted = await this.encryptSensitiveData(allData);
    
    return {
      data: encrypted,
      exported: new Date().toISOString(),
      format: 'encrypted-json',
      version: '3.0.0'
    };
  }
  
  async deleteAllUserData() {
    // Suppression complète RGPD
    const stores = [
      'localStorage',
      'sessionStorage',
      'IndexedDB',
      'WebSQL',
      'cookies'
    ];
    
    for (const store of stores) {
      await this.clearStore(store);
    }
    
    // Log de suppression
    console.log('All user data deleted at', new Date().toISOString());
  }
}