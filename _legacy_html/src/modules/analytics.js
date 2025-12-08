// Module de tracking analytics local
export class analyticsTracker {
  constructor(storage) {
    this.storage = storage;
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
    this.events = [];
    this.maxEvents = 1000;
    this.batchSize = 50;
    
    // Charger les événements précédents
    this.loadEvents();
    
    // Configuration des événements automatiques
    this.setupAutoTracking();
  }
  
  // Générer un ID de session unique
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Charger les événements depuis le storage
  loadEvents() {
    const stored = this.storage.get('analytics_events') || [];
    this.events = stored.slice(-this.maxEvents); // Garder seulement les derniers
  }
  
  // Sauvegarder les événements
  saveEvents() {
    this.storage.set('analytics_events', this.events);
  }
  
  // Démarrer une nouvelle session
  startSession() {
    this.track('session_start', {
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      language: navigator.language,
      platform: navigator.platform,
      referrer: document.referrer || 'direct'
    });
    
    // Tracking de fin de session
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });
  }
  
  // Terminer la session
  endSession() {
    const duration = Math.round((Date.now() - this.sessionStartTime) / 1000);
    
    this.track('session_end', {
      duration: duration,
      pageViews: this.getSessionPageViews(),
      events: this.getSessionEventCount()
    });
    
    this.saveEvents();
  }
  
  // Tracker un événement
  track(eventName, data = {}) {
    const event = {
      id: this.generateEventId(),
      name: eventName,
      data: data,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    // Ajouter l'événement
    this.events.push(event);
    
    // Limiter le nombre d'événements
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
    
    // Sauvegarder périodiquement
    if (this.events.length % this.batchSize === 0) {
      this.saveEvents();
    }
    
    // Log en mode debug
    if (window.LeMondeCurieux?.config?.debug) {
      console.log('📊 Analytics:', eventName, data);
    }
    
    return event;
  }
  
  // Générer un ID d'événement
  generateEventId() {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Configuration du tracking automatique
  setupAutoTracking() {
    // Page views
    this.track('page_view', {
      title: document.title,
      path: window.location.pathname
    });
    
    // Changements de page (pour SPA)
    let lastPath = window.location.pathname;
    setInterval(() => {
      if (window.location.pathname !== lastPath) {
        lastPath = window.location.pathname;
        this.track('page_view', {
          title: document.title,
          path: lastPath
        });
      }
    }, 1000);
    
    // Clics sur éléments trackables
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-track]');
      if (target) {
        const trackData = target.getAttribute('data-track');
        const trackAction = target.getAttribute('data-track-action') || 'click';
        
        this.track(`${trackAction}_${trackData}`, {
          element: target.tagName.toLowerCase(),
          text: target.textContent.trim().substring(0, 50),
          classes: target.className
        });
      }
    });
    
    // Erreurs JavaScript
    window.addEventListener('error', (e) => {
      this.track('js_error', {
        message: e.message,
        source: e.filename,
        line: e.lineno,
        column: e.colno,
        stack: e.error?.stack
      });
    });
    
    // Performance
    if ('PerformanceObserver' in window) {
      // Core Web Vitals
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              this.track('performance_lcp', {
                value: Math.round(entry.startTime),
                size: entry.size
              });
            }
          }
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // PerformanceObserver non supporté pour ce type
      }
    }
  }
  
  // Obtenir le nombre de pages vues dans la session
  getSessionPageViews() {
    return this.events.filter(e => 
      e.sessionId === this.sessionId && 
      e.name === 'page_view'
    ).length;
  }
  
  // Obtenir le nombre d'événements dans la session
  getSessionEventCount() {
    return this.events.filter(e => e.sessionId === this.sessionId).length;
  }
  
  // Obtenir les événements par type
  getEventsByType(eventName, limit = 100) {
    return this.events
      .filter(e => e.name === eventName)
      .slice(-limit);
  }
  
  // Obtenir un rapport d'analytics
  getReport(days = 7) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    const recentEvents = this.events.filter(e => 
      new Date(e.timestamp) >= cutoff
    );
    
    // Statistiques par type d'événement
    const eventCounts = {};
    recentEvents.forEach(event => {
      eventCounts[event.name] = (eventCounts[event.name] || 0) + 1;
    });
    
    // Sessions uniques
    const uniqueSessions = [...new Set(recentEvents.map(e => e.sessionId))];
    
    // Pages les plus vues
    const pageViews = recentEvents
      .filter(e => e.name === 'page_view')
      .reduce((acc, event) => {
        const path = event.data.path;
        acc[path] = (acc[path] || 0) + 1;
        return acc;
      }, {});
    
    // Temps moyen de session
    const sessionDurations = recentEvents
      .filter(e => e.name === 'session_end')
      .map(e => e.data.duration);
    
    const avgSessionDuration = sessionDurations.length > 0
      ? Math.round(sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length)
      : 0;
    
    // Erreurs
    const errors = recentEvents
      .filter(e => e.name === 'js_error')
      .map(e => ({
        message: e.data.message,
        source: e.data.source,
        count: 1
      }));
    
    // Grouper les erreurs similaires
    const errorGroups = errors.reduce((acc, error) => {
      const key = `${error.message}_${error.source}`;
      if (!acc[key]) {
        acc[key] = { ...error, count: 0 };
      }
      acc[key].count++;
      return acc;
    }, {});
    
    return {
      period: {
        start: cutoff.toISOString(),
        end: new Date().toISOString(),
        days: days
      },
      summary: {
        totalEvents: recentEvents.length,
        uniqueSessions: uniqueSessions.length,
        avgSessionDuration: avgSessionDuration,
        totalPageViews: eventCounts.page_view || 0
      },
      eventsByType: eventCounts,
      topPages: Object.entries(pageViews)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([path, views]) => ({ path, views })),
      errors: Object.values(errorGroups)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      timeline: this.getEventTimeline(recentEvents)
    };
  }
  
  // Obtenir une timeline des événements
  getEventTimeline(events) {
    const timeline = {};
    
    events.forEach(event => {
      const date = new Date(event.timestamp).toLocaleDateString();
      if (!timeline[date]) {
        timeline[date] = {
          events: 0,
          sessions: new Set(),
          types: {}
        };
      }
      
      timeline[date].events++;
      timeline[date].sessions.add(event.sessionId);
      timeline[date].types[event.name] = (timeline[date].types[event.name] || 0) + 1;
    });
    
    // Convertir les Sets en nombres
    Object.keys(timeline).forEach(date => {
      timeline[date].sessions = timeline[date].sessions.size;
    });
    
    return timeline;
  }
  
  // Nettoyer les anciennes données
  cleanup(daysToKeep = 30) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysToKeep);
    
    const beforeCount = this.events.length;
    this.events = this.events.filter(e => 
      new Date(e.timestamp) >= cutoff
    );
    const afterCount = this.events.length;
    
    this.saveEvents();
    
    console.log(`Analytics cleanup: ${beforeCount - afterCount} événements supprimés`);
    return beforeCount - afterCount;
  }
  
  // Exporter les données analytics
  exportData() {
    return {
      version: '1.0',
      exportDate: new Date().toISOString(),
      events: this.events,
      summary: this.getReport(30)
    };
  }
}