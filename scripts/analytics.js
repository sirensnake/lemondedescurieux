// Tracker d'événements simple
class SimpleAnalytics {
    track(event, data) {
        const analytics = JSON.parse(localStorage.getItem('analytics')) || [];
        analytics.push({
            event,
            data,
            timestamp: new Date().toISOString(),
            sessionId: this.getSessionId()
        });
        
        // Garder seulement les 1000 derniers événements
        if (analytics.length > 1000) {
            analytics.splice(0, analytics.length - 1000);
        }
        
        localStorage.setItem('analytics', JSON.stringify(analytics));
    }
    
    getSessionId() {
        let sessionId = sessionStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = Date.now().toString(36) + Math.random().toString(36);
            sessionStorage.setItem('sessionId', sessionId);
        }
        return sessionId;
    }
    
    getMetrics() {
        const analytics = JSON.parse(localStorage.getItem('analytics')) || [];
        const today = new Date().toDateString();
        
        return {
            sessionsToday: new Set(analytics
                .filter(a => new Date(a.timestamp).toDateString() === today)
                .map(a => a.sessionId)
            ).size,
            
            totalEvents: analytics.length,
            
            popularFeatures: this.getPopularFeatures(analytics),
            
            averageSessionTime: this.getAverageSessionTime(analytics)
        };
    }
    
    getPopularFeatures(analytics) {
        const features = {};
        analytics.forEach(a => {
            features[a.event] = (features[a.event] || 0) + 1;
        });
        return Object.entries(features)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
    }
    
    getAverageSessionTime(analytics) {
        // Implémenter le calcul du temps moyen de session
        return '15 minutes'; // Placeholder
    }
}

// Utilisation
const analytics = new SimpleAnalytics();
analytics.track('page_view', { page: 'english_section' });
analytics.track('lesson_completed', { lesson: 'animals', score: 5 });