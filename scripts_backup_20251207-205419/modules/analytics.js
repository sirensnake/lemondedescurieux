// scripts/modules/analytics.js
export class AnalyticsTracker {
  constructor(storage) {
    this.storage = storage;
    this.sessionId = this.generateSessionId();
    this.events = [];
  }
  
  track(event, data = {}) {
    const eventData = {
      event,
      data,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId
    };
    
    this.events.push(eventData);
    
    // Sauvegarder périodiquement
    if (this.events.length >= 10) {
      this.flush();
    }
  }
  
  flush() {
    const existingEvents = this.storage.get('analytics') || [];
    const allEvents = [...existingEvents, ...this.events];
    
    this.storage.set('analytics', allEvents);
    this.events = [];
  }
  
  generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}