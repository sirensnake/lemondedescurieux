// scripts/modules/storage.js
export class StorageManager {
  constructor(prefix = 'lemondedescurieux_') {
    this.prefix = prefix;
  }
  
  get(key) {
    return JSON.parse(localStorage.getItem(this.prefix + key));
  }
  
  set(key, value) {
    localStorage.setItem(this.prefix + key, JSON.stringify(value));
  }
}

// scripts/modules/analytics.js
export class AnalyticsTracker {
  constructor(storage) {
    this.storage = storage;
    this.sessionId = this.generateSessionId();
  }
  
  track(event, data) {
    const analytics = this.storage.get('analytics') || [];
    analytics.push({
      event,
      data,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId
    });
    this.storage.set('analytics', analytics);
  }
}