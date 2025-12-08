// performance-analytics.js - Engine d'analytics et insights automatiques

// ===== CONFIGURATION ANALYTICS =====
const ANALYTICS_CONFIG = {
  storage: {
    sessions: 'lemondedescurieux_sessions_data',
    insights: 'lemondedescurieux_insights_cache',
    preferences: 'lemondedescurieux_analytics_prefs'
  },
  
  insights: {
    updateInterval: 24 * 60 * 60 * 1000, // 24h
    confidenceThreshold: 70, // Seuil de confiance pour afficher insights
    minDataPoints: 5, // Minimum de sessions pour analyses
    trendPeriods: [7, 14, 30] // Périodes d'analyse des tendances
  },
  
  performance: {
    excellentThreshold: 90,
    goodThreshold: 70,
    improvementThreshold: 60,
    warningThreshold: 40
  },
  
  recommendations: {
    maxActive: 5, // Maximum de recommandations actives
    priorities: ['critical', 'high', 'medium', 'low'],
    autoApply: false // Auto-application des recommandations
  }
};

// ===== CLASSE PRINCIPALE ANALYTICS =====
class PerformanceAnalytics {
  constructor() {
    this.data = this.loadAllData();
    this.insights = this.loadInsights();
    this.recommendations = this.loadRecommendations();
    this.charts = {};
    
    // Initialize insights engine
    this.insightsEngine = new InsightsEngine(this);
    this.chartGenerator = new ChartGenerator(this);
  }
  
  // ===== CHARGEMENT DES DONNÉES =====
  
  loadAllData() {
    const sessions = this.loadSessions();
    const streaks = this.loadStreakData();
    const hearts = this.loadHeartsData();
    const xp = this.loadXPData();
    const english = this.loadEnglishData();
    
    return {
      sessions,
      streaks,
      hearts,
      xp,
      english,
      lastUpdate: Date.now()
    };
  }
  
  loadSessions() {
    try {
      const stored = localStorage.getItem(ANALYTICS_CONFIG.storage.sessions);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erreur chargement sessions:', error);
      return [];
    }
  }
  
  loadStreakData() {
    try {
      const stored = localStorage.getItem('lemondedescurieux_english_streaks');
      return stored ? JSON.parse(stored) : { current: 0, longest: 0, total: 0 };
    } catch (error) {
      return { current: 0, longest: 0, total: 0 };
    }
  }
  
  loadHeartsData() {
    try {
      const stored = localStorage.getItem('lemondedescurieux_english_hearts');
      return stored ? JSON.parse(stored) : { 
        totalHeartsLost: 0, 
        totalHeartsRegened: 0,
        totalHeartsPurchased: 0 
      };
    } catch (error) {
      return { totalHeartsLost: 0, totalHeartsRegened: 0, totalHeartsPurchased: 0 };
    }
  }
  
  loadXPData() {
    try {
      const stored = localStorage.getItem('lemondedescurieux_english_xp');
      return stored ? JSON.parse(stored) : { current: 0, totalEarned: 0 };
    } catch (error) {
      return { current: 0, totalEarned: 0 };
    }
  }
  
  loadEnglishData() {
    try {
      // Charger données spécifiques section anglais
      const testSessions = localStorage.getItem('child_testing_sessions');
      return testSessions ? JSON.parse(testSessions) : [];
    } catch (error) {
      return [];
    }
  }
  
  loadInsights() {
    try {
      const stored = localStorage.getItem(ANALYTICS_CONFIG.storage.insights);
      if (stored) {
        const insights = JSON.parse(stored);
        // Vérifier si cache valide
        if (Date.now() - insights.timestamp < ANALYTICS_CONFIG.insights.updateInterval) {
          return insights.data;
        }
      }
    } catch (error) {
      console.error('Erreur chargement insights:', error);
    }
    return [];
  }
  
  loadRecommendations() {
    try {
      const stored = localStorage.getItem('lemondedescurieux_recommendations');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  }
  
  // ===== CALCUL DES MÉTRIQUES =====
  
  calculateMetrics(period = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - period);
    
    const recentSessions = this.data.sessions.filter(s => 
      new Date(s.timestamp) >= cutoffDate
    );
    
    const englishEvents = this.data.english.filter(e => 
      new Date(e.timestamp) >= cutoffDate
    );
    
    return {
      // Engagement
      totalSessionTime: this.calculateTotalTime(recentSessions),
      averageSessionTime: this.calculateAverageTime(recentSessions),
      totalSessions: recentSessions.length,
      engagementTrend: this.calculateEngagementTrend(period),
      
      // Streaks
      currentStreak: this.data.streaks.current,
      longestStreak: this.data.streaks.longest,
      streakConsistency: this.calculateStreakConsistency(),
      
      // Performance
      totalQuestions: this.calculateTotalQuestions(englishEvents),
      totalCorrect: this.calculateTotalCorrect(englishEvents),
      successRate: this.calculateSuccessRate(englishEvents),
      
      // XP et progression
      totalXP: this.data.xp.current,
      xpTrend: this.calculateXPTrend(period),
      currentLevel: Math.floor(this.data.xp.current / 100),
      
      // Efficacité
      avgTimePerQuestion: this.calculateAvgTimePerQuestion(englishEvents),
      learningEfficiency: this.calculateLearningEfficiency(englishEvents),
      
      // Cœurs
      heartsRetention: this.calculateHeartsRetention(),
      totalHeartsLost: this.data.hearts.totalHeartsLost,
      heartsEfficiency: this.calculateHeartsEfficiency()
    };
  }
  
  calculateTotalTime(sessions) {
    return sessions.reduce((total, session) => {
      return total + (session.duration || 0);
    }, 0);
  }
  
  calculateAverageTime(sessions) {
    if (sessions.length === 0) return 0;
    return Math.round(this.calculateTotalTime(sessions) / sessions.length);
  }
  
  calculateEngagementTrend(period) {
    const currentPeriod = this.calculateTotalTime(
      this.getSessionsForPeriod(period)
    );
    
    const previousPeriod = this.calculateTotalTime(
      this.getSessionsForPeriod(period, period)
    );
    
    if (previousPeriod === 0) return 0;
    
    return Math.round(((currentPeriod - previousPeriod) / previousPeriod) * 100);
  }
  
  getSessionsForPeriod(days, offset = 0) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - offset);
    
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days);
    
    return this.data.sessions.filter(s => {
      const sessionDate = new Date(s.timestamp);
      return sessionDate >= startDate && sessionDate <= endDate;
    });
  }
  
  calculateStreakConsistency() {
    // Calculer régularité des streaks
    const streakHistory = this.data.streaks.history || [];
    if (streakHistory.length === 0) return 0;
    
    const totalDays = streakHistory.reduce((sum, streak) => sum + streak.duration, 0);
    const averageStreak = totalDays / streakHistory.length;
    
    // Score de consistance basé sur la moyenne
    return Math.min(100, Math.round((averageStreak / 7) * 100));
  }
  
  calculateTotalQuestions(events) {
    return events.filter(e => e.event === 'question_attempt').length;
  }
  
  calculateTotalCorrect(events) {
    return events.filter(e => 
      e.event === 'question_attempt' && e.success
    ).length;
  }
  
  calculateSuccessRate(events) {
    const total = this.calculateTotalQuestions(events);
    if (total === 0) return 0;
    
    const correct = this.calculateTotalCorrect(events);
    return Math.round((correct / total) * 100);
  }
  
  calculateXPTrend(period) {
    // Calculer tendance XP sur la période
    const sessions = this.getSessionsForPeriod(period);
    if (sessions.length < 2) return 0;
    
    const xpGains = sessions.map(s => s.xpGained || 0);
    const firstHalf = xpGains.slice(0, Math.floor(xpGains.length / 2));
    const secondHalf = xpGains.slice(Math.floor(xpGains.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    if (firstAvg === 0) return 0;
    return Math.round(((secondAvg - firstAvg) / firstAvg) * 100);
  }
  
  calculateAvgTimePerQuestion(events) {
    const questionEvents = events.filter(e => e.event === 'question_attempt');
    if (questionEvents.length === 0) return 0;
    
    const totalTime = questionEvents.reduce((sum, event) => {
      return sum + (event.timeSpent || 0);
    }, 0);
    
    return Math.round(totalTime / questionEvents.length / 1000); // En secondes
  }
  
  calculateLearningEfficiency(events) {
    const successRate = this.calculateSuccessRate(events);
    const avgTime = this.calculateAvgTimePerQuestion(events);
    
    // Formule d'efficacité: (taux de réussite * 100) / (temps moyen + 1)
    // Plus on répond vite et bien, plus l'efficacité est élevée
    const timeNormalized = Math.min(avgTime / 30, 10); // Normaliser le temps
    const efficiency = (successRate * 10) / (timeNormalized + 1);
    
    return Math.min(100, Math.round(efficiency));
  }
  
  calculateHeartsRetention() {
    const lost = this.data.hearts.totalHeartsLost;
    const regened = this.data.hearts.totalHeartsRegened;
    const purchased = this.data.hearts.totalHeartsPurchased;
    
    const totalHearts = lost + regened + purchased;
    if (totalHearts === 0) return 100;
    
    const retained = regened + purchased;
    return Math.round((retained / totalHearts) * 100);
  }
  
  calculateHeartsEfficiency() {
    const lost = this.data.hearts.totalHeartsLost;
    const purchased = this.data.hearts.totalHeartsPurchased;
    
    if (lost === 0) return 100;
    
    // Efficacité = moins on achète de cœurs, plus on est efficace
    const purchaseRatio = purchased / lost;
    return Math.max(0, Math.round(100 - (purchaseRatio * 50)));
  }
  
  // ===== GÉNÉRATION DES INSIGHTS =====
  
  generateInsights() {
    const insights = [];
    const metrics = this.calculateMetrics();
    
    // Insight engagement
    if (metrics.engagementTrend > 20) {
      insights.push({
        id: 'engagement_up',
        type: 'positive',
        icon: '📈',
        title: 'Engagement en hausse !',
        description: `Le temps d'étude a augmenté de ${metrics.engagementTrend}% récemment.`,
        confidence: 85,
        priority: 'medium',
        actionable: false
      });
    } else if (metrics.engagementTrend < -20) {
      insights.push({
        id: 'engagement_down',
        type: 'warning',
        icon: '📉',
        title: 'Baisse d\'engagement',
        description: `Le temps d'étude a diminué de ${Math.abs(metrics.engagementTrend)}%.`,
        confidence: 80,
        priority: 'high',
        actionable: true
      });
    }
    
    // Insight performance
    if (metrics.successRate >= ANALYTICS_CONFIG.performance.excellentThreshold) {
      insights.push({
        id: 'excellent_performance',
        type: 'positive',
        icon: '🌟',
        title: 'Performance excellente !',
        description: `Taux de réussite de ${metrics.successRate}%. C'est fantastique !`,
        confidence: 95,
        priority: 'low',
        actionable: false
      });
    } else if (metrics.successRate < ANALYTICS_CONFIG.performance.warningThreshold) {
      insights.push({
        id: 'low_performance',
        type: 'critical',
        icon: '⚠️',
        title: 'Performance à améliorer',
        description: `Taux de réussite de ${metrics.successRate}%. Peut-être réduire la difficulté ?`,
        confidence: 90,
        priority: 'critical',
        actionable: true
      });
    }
    
    // Insight streaks
    if (metrics.currentStreak >= 7) {
      insights.push({
        id: 'great_streak',
        type: 'positive',
        icon: '🔥',
        title: 'Streak impressionnant !',
        description: `${metrics.currentStreak} jours consécutifs ! Continuez comme ça.`,
        confidence: 100,
        priority: 'low',
        actionable: false
      });
    } else if (metrics.currentStreak === 0 && metrics.longestStreak > 3) {
      insights.push({
        id: 'streak_broken',
        type: 'info',
        icon: '💔',
        title: 'Streak cassé',
        description: `Précédent record: ${metrics.longestStreak} jours. Il est temps de recommencer !`,
        confidence: 100,
        priority: 'medium',
        actionable: true
      });
    }
    
    // Insight efficacité
    if (metrics.learningEfficiency >= 80) {
      insights.push({
        id: 'high_efficiency',
        type: 'positive',
        icon: '⚡',
        title: 'Apprentissage très efficace',
        description: `Score d'efficacité de ${metrics.learningEfficiency}%. Excellent équilibre vitesse/précision.`,
        confidence: 85,
        priority: 'low',
        actionable: false
      });
    } else if (metrics.learningEfficiency < 40) {
      insights.push({
        id: 'low_efficiency',
        type: 'warning',
        icon: '🐌',
        title: 'Efficacité à améliorer',
        description: `Temps par question élevé ou taux d'erreur important. Peut-être réviser les bases ?`,
        confidence: 75,
        priority: 'medium',
        actionable: true
      });
    }
    
    // Insight gestion cœurs
    if (metrics.heartsRetention < 60) {
      insights.push({
        id: 'hearts_management',
        type: 'info',
        icon: '💡',
        title: 'Gestion des cœurs',
        description: `${metrics.totalHeartsLost} cœurs perdus récemment. Prendre son temps peut aider.`,
        confidence: 70,
        priority: 'medium',
        actionable: true
      });
    }
    
    // Cache des insights
    this.saveInsights(insights);
    
    return insights.filter(i => i.confidence >= ANALYTICS_CONFIG.insights.confidenceThreshold);
  }
  
  // ===== GÉNÉRATION DES RECOMMANDATIONS =====
  
  generateRecommendations() {
    const recommendations = [];
    const metrics = this.calculateMetrics();
    const insights = this.generateInsights();
    
    // Recommandations basées sur la performance
    if (metrics.successRate < 50) {
      recommendations.push({
        id: 'reduce_difficulty',
        priority: 'critical',
        title: 'Réduire la difficulté',
        description: 'Le taux de réussite est faible. Essayez des exercices plus simples.',
        action: 'adjust_difficulty',
        parameters: { targetLevel: 'beginner' },
        estimatedImpact: 'high',
        confidence: 90
      });
    } else if (metrics.successRate > 90 && metrics.avgTimePerQuestion < 10) {
      recommendations.push({
        id: 'increase_difficulty',
        priority: 'medium',
        title: 'Augmenter la difficulté',
        description: 'Excellent niveau ! Vous pouvez passer aux exercices plus difficiles.',
        action: 'adjust_difficulty',
        parameters: { targetLevel: 'intermediate' },
        estimatedImpact: 'medium',
        confidence: 85
      });
    }
    
    // Recommandations d'engagement
    if (metrics.averageSessionTime < 10) {
      recommendations.push({
        id: 'increase_session_length',
        priority: 'medium',
        title: 'Prolonger les sessions',
        description: 'Sessions courtes détectées. Essayez 15-20 minutes pour un meilleur apprentissage.',
        action: 'adjust_session_length',
        parameters: { targetMinutes: 15 },
        estimatedImpact: 'medium',
        confidence: 75
      });
    }
    
    // Recommandations de régularité
    if (metrics.currentStreak === 0 && metrics.longestStreak > 0) {
      recommendations.push({
        id: 'restart_habit',
        priority: 'high',
        title: 'Reprendre l\'habitude',
        description: 'Votre streak s\'est arrêté. Planifiez 10 minutes par jour pour recommencer.',
        action: 'schedule_reminder',
        parameters: { frequency: 'daily', time: '18:00' },
        estimatedImpact: 'high',
        confidence: 80
      });
    }
    
    // Recommandations de variété
    const activityTypes = this.analyzeActivityTypes();
    if (activityTypes.dominantType && activityTypes.dominantRatio > 80) {
      recommendations.push({
        id: 'diversify_activities',
        priority: 'low',
        title: 'Diversifier les activités',
        description: `Vous faites beaucoup de ${activityTypes.dominantType}. Essayez d'autres types d'exercices.`,
        action: 'suggest_activity_types',
        parameters: { exclude: activityTypes.dominantType },
        estimatedImpact: 'low',
        confidence: 70
      });
    }
    
    // Recommandations de motivation
    if (metrics.xpTrend < -30) {
      recommendations.push({
        id: 'motivation_boost',
        priority: 'medium',
        title: 'Boost de motivation',
        description: 'Les gains XP diminuent. Essayez de nouveaux défis ou récompenses.',
        action: 'unlock_content',
        parameters: { type: 'special_activities' },
        estimatedImpact: 'medium',
        confidence: 65
      });
    }
    
    this.saveRecommendations(recommendations);
    return recommendations;
  }
  
  analyzeActivityTypes() {
    const events = this.data.english.filter(e => e.event === 'question_attempt');
    const typeCounts = {};
    
    events.forEach(event => {
      const type = event.type || 'unknown';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    
    const total = events.length;
    if (total === 0) return { dominantType: null, dominantRatio: 0 };
    
    const sortedTypes = Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a);
    
    const [dominantType, dominantCount] = sortedTypes[0] || [null, 0];
    const dominantRatio = Math.round((dominantCount / total) * 100);
    
    return { dominantType, dominantRatio, distribution: typeCounts };
  }
  
  // ===== SAUVEGARDE =====
  
  saveInsights(insights) {
    const cacheData = {
      data: insights,
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem(ANALYTICS_CONFIG.storage.insights, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Erreur sauvegarde insights:', error);
    }
  }
  
  saveRecommendations(recommendations) {
    try {
      localStorage.setItem('lemondedescurieux_recommendations', JSON.stringify(recommendations));
    } catch (error) {
      console.error('Erreur sauvegarde recommandations:', error);
    }
  }
  
  // ===== EXPORT DES DONNÉES =====
  
  exportCSV() {
    const sessions = this.data.sessions;
    if (sessions.length === 0) {
      alert('Aucune donnée à exporter');
      return;
    }
    
    const headers = ['Date', 'Durée (min)', 'Section', 'Questions', 'Réussite (%)', 'XP gagné', 'Streak'];
    const csvContent = [
      headers.join(','),
      ...sessions.map(session => [
        new Date(session.timestamp).toLocaleDateString(),
        Math.round((session.duration || 0) / 60),
        session.section || 'Anglais',
        session.questionsCount || 0,
        session.successRate || 0,
        session.xpGained || 0,
        session.streakAtTime || 0
      ].join(','))
    ].join('\n');
    
    this.downloadFile(csvContent, 'lemondedescurieux-analytics.csv', 'text/csv');
  }
  
  exportJSON() {
    const exportData = {
      version: '1.0',
      exported: new Date().toISOString(),
      metrics: this.calculateMetrics(),
      insights: this.generateInsights(),
      recommendations: this.generateRecommendations(),
      rawData: {
        sessions: this.data.sessions,
        streaks: this.data.streaks,
        hearts: this.data.hearts,
        xp: this.data.xp
      }
    };
    
    const jsonContent = JSON.stringify(exportData, null, 2);
    this.downloadFile(jsonContent, 'lemondedescurieux-full-export.json', 'application/json');
  }
  
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }
  
  // ===== ALERTS SYSTÈME =====
  
  generateAlerts() {
    const alerts = [];
    const metrics = this.calculateMetrics();
    
    // Alert performance critique
    if (metrics.successRate < 30) {
      alerts.push({
        id: 'critical_performance',
        severity: 'critical',
        icon: '🚨',
        title: 'Performance critique',
        message: 'Taux de réussite très faible. Intervention recommandée.',
        timestamp: Date.now(),
        actionRequired: true
      });
    }
    
    // Alert engagement faible
    if (metrics.totalSessions === 0) {
      alerts.push({
        id: 'no_activity',
        severity: 'warning',
        icon: '😴',
        title: 'Aucune activité récente',
        message: 'Pas de session enregistrée récemment.',
        timestamp: Date.now(),
        actionRequired: false
      });
    }
    
    // Alert problème technique
    const errorRate = this.calculateErrorRate();
    if (errorRate > 10) {
      alerts.push({
        id: 'technical_issues',
        severity: 'warning',
        icon: '⚙️',
        title: 'Problèmes techniques détectés',
        message: `${errorRate}% d'erreurs JavaScript récentes.`,
        timestamp: Date.now(),
        actionRequired: true
      });
    }
    
    return alerts;
  }
  
  calculateErrorRate() {
    // Placeholder pour calcul taux d'erreur
    // En réalité, il faudrait tracker les erreurs JS
    return 0;
  }
  
  // ===== PRÉDICTIONS =====
  
  predictFuturePerformance() {
    const sessions = this.data.sessions.slice(-10); // 10 dernières sessions
    if (sessions.length < 3) {
      return { prediction: null, confidence: 0 };
    }
    
    const successRates = sessions.map(s => s.successRate || 0);
    const trend = this.calculateLinearTrend(successRates);
    
    const nextSessionPrediction = Math.max(0, Math.min(100, 
      successRates[successRates.length - 1] + trend
    ));
    
    const confidence = Math.max(0, Math.min(100, 100 - Math.abs(trend) * 5));
    
    return {
      prediction: Math.round(nextSessionPrediction),
      confidence: Math.round(confidence),
      trend: trend > 0 ? 'improving' : trend < 0 ? 'declining' : 'stable'
    };
  }
  
  calculateLinearTrend(values) {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const x = Array.from({length: n}, (_, i) => i);
    const y = values;
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    
    return slope;
  }
}

// ===== ENGINE D'INSIGHTS =====
class InsightsEngine {
  constructor(analytics) {
    this.analytics = analytics;
    this.patterns = new PatternRecognition();
  }
  
  analyzePatterns() {
    const sessions = this.analytics.data.sessions;
    
    return {
      timePatterns: this.patterns.analyzeTimePatterns(sessions),
      performancePatterns: this.patterns.analyzePerformancePatterns(sessions),
      engagementPatterns: this.patterns.analyzeEngagementPatterns(sessions),
      learningCurve: this.patterns.analyzeLearningCurve(sessions)
    };
  }
  
  generatePersonalizedInsights() {
    const patterns = this.analyzePatterns();
    const insights = [];
    
    // Insight sur les heures optimales
    if (patterns.timePatterns.optimalHour) {
      insights.push({
        type: 'time_optimization',
        message: `Vous êtes plus performant vers ${patterns.timePatterns.optimalHour}h`,
        confidence: patterns.timePatterns.confidence
      });
    }
    
    // Insight sur la courbe d'apprentissage
    if (patterns.learningCurve.velocity > 0) {
      insights.push({
        type: 'learning_acceleration',
        message: `Votre vitesse d'apprentissage s'accélère de ${patterns.learningCurve.velocity}%`,
        confidence: patterns.learningCurve.confidence
      });
    }
    
    return insights;
  }
}

// ===== RECONNAISSANCE DE PATTERNS =====
class PatternRecognition {
  analyzeTimePatterns(sessions) {
    const hourPerformance = {};
    
    sessions.forEach(session => {
      const hour = new Date(session.timestamp).getHours();
      if (!hourPerformance[hour]) {
        hourPerformance[hour] = { total: 0, count: 0 };
      }
      hourPerformance[hour].total += session.successRate || 0;
      hourPerformance[hour].count++;
    });
    
    // Trouver l'heure optimale
    let bestHour = null;
    let bestAverage = 0;
    
    Object.entries(hourPerformance).forEach(([hour, data]) => {
      const average = data.total / data.count;
      if (average > bestAverage && data.count >= 2) {
        bestAverage = average;
        bestHour = parseInt(hour);
      }
    });
    
    return {
      optimalHour: bestHour,
      optimalPerformance: Math.round(bestAverage),
      confidence: bestHour ? Math.min(90, hourPerformance[bestHour].count * 20) : 0
    };
  }
  
  analyzePerformancePatterns(sessions) {
    if (sessions.length < 5) return { pattern: 'insufficient_data' };
    
    const recentSessions = sessions.slice(-10);
    const performances = recentSessions.map(s => s.successRate || 0);
    
    const trend = this.calculateTrend(performances);
    const volatility = this.calculateVolatility(performances);
    
    let pattern = 'stable';
    if (trend > 5 && volatility < 20) pattern = 'improving';
    else if (trend < -5 && volatility < 20) pattern = 'declining';
    else if (volatility > 30) pattern = 'volatile';
    
    return {
      pattern,
      trend: Math.round(trend),
      volatility: Math.round(volatility),
      confidence: Math.max(0, 100 - volatility)
    };
  }
  
  analyzeEngagementPatterns(sessions) {
    const durations = sessions.map(s => s.duration || 0);
    const averageDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    
    const recentAverage = durations.slice(-5).reduce((a, b) => a + b, 0) / Math.min(5, durations.length);
    
    const engagementTrend = ((recentAverage - averageDuration) / averageDuration) * 100;
    
    return {
      averageDuration: Math.round(averageDuration / 60), // En minutes
      recentAverage: Math.round(recentAverage / 60),
      trend: Math.round(engagementTrend),
      pattern: engagementTrend > 10 ? 'increasing' : engagementTrend < -10 ? 'decreasing' : 'stable'
    };
  }
  
  analyzeLearningCurve(sessions) {
    if (sessions.length < 5) return { velocity: 0, confidence: 0 };
    
    const performances = sessions.map(s => s.successRate || 0);
    const timePoints = sessions.map((s, i) => i);
    
    const velocity = this.calculateLearningVelocity(timePoints, performances);
    const acceleration = this.calculateLearningAcceleration(performances);
    
    return {
      velocity: Math.round(velocity),
      acceleration: Math.round(acceleration),
      confidence: Math.min(90, sessions.length * 10)
    };
  }
  
  calculateTrend(values) {
    if (values.length < 2) return 0;
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    return ((secondAvg - firstAvg) / firstAvg) * 100;
  }
  
  calculateVolatility(values) {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);
    
    return (standardDeviation / mean) * 100;
  }
  
  calculateLearningVelocity(timePoints, performances) {
    // Régression linéaire simple pour calculer la pente
    const n = timePoints.length;
    const sumX = timePoints.reduce((a, b) => a + b, 0);
    const sumY = performances.reduce((a, b) => a + b, 0);
    const sumXY = timePoints.reduce((sum, x, i) => sum + x * performances[i], 0);
    const sumXX = timePoints.reduce((sum, x) => sum + x * x, 0);
    
    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  }
  
  calculateLearningAcceleration(performances) {
    if (performances.length < 3) return 0;
    
    const velocities = [];
    for (let i = 1; i < performances.length; i++) {
      velocities.push(performances[i] - performances[i-1]);
    }
    
    return this.calculateTrend(velocities);
  }
}

// ===== COMPONENT ALPINE.JS DASHBOARD =====
function performanceDashboard() {
  return {
    // État
    isLoading: false,
    selectedPeriod: 30,
    chartType: 'xp',
    showRawData: false,
    lastUpdate: Date.now(),
    
    // Données
    metrics: {},
    insights: [],
    recommendations: [],
    alerts: [],
    recentSessions: [],
    activityPerformance: [],
    
    // Notification
    showNotification: false,
    notification: { icon: '', message: '' },
    
    // Analytics engine
    analytics: null,
    
    // ===== INITIALISATION =====
    
    async loadDashboard() {
      this.isLoading = true;
      
      try {
        // Initialiser analytics engine
        this.analytics = new PerformanceAnalytics();
        
        // Charger toutes les données
        await this.refreshData();
        
        // Initialiser les graphiques
        this.initializeCharts();
        
        console.log('📊 Dashboard chargé avec succès');
        
      } catch (error) {
        console.error('Erreur chargement dashboard:', error);
        this.showError('Erreur de chargement des données');
      } finally {
        this.isLoading = false;
      }
    },
    
    async refreshData() {
      // Calculer métriques
      this.metrics = this.analytics.calculateMetrics(this.selectedPeriod);
      
      // Générer insights
      this.insights = this.analytics.generateInsights();
      
      // Générer recommandations
      this.recommendations = this.analytics.generateRecommendations();
      
      // Générer alertes
      this.alerts = this.analytics.generateAlerts();
      
      // Charger données pour tables
      this.loadTableData();
      
      this.lastUpdate = Date.now();
    },
    
    loadTableData() {
      // Sessions récentes
      this.recentSessions = this.analytics.data.sessions
        .slice(-20)
        .reverse()
        .map(session => ({
          ...session,
          id: session.timestamp
        }));
      
      // Performance par activité
      const activityStats = this.analytics.analyzeActivityTypes();
      this.activityPerformance = Object.entries(activityStats.distribution || {})
        .map(([type, count]) => ({
          type,
          name: this.getActivityName(type),
          attempts: count,
          successRate: this.calculateActivitySuccessRate(type),
          avgTime: this.calculateActivityAvgTime(type),
          trend: this.calculateActivityTrend(type)
        }));
    },
    
    // ===== GRAPHIQUES =====
    
    initializeCharts() {
      this.$nextTick(() => {
        this.createProgressChart();
        this.createActivitiesChart();
        this.createSectionsChart();
      });
    },
    
    createProgressChart() {
      const ctx = document.getElementById('progressChart');
      if (!ctx) return;
      
      const sessions = this.analytics.data.sessions.slice(-30);
      const labels = sessions.map(s => new Date(s.timestamp).toLocaleDateString());
      
      let data;
      switch (this.chartType) {
        case 'xp':
          data = sessions.map(s => s.xpGained || 0);
          break;
        case 'success':
          data = sessions.map(s => s.successRate || 0);
          break;
        case 'time':
          data = sessions.map(s => (s.duration || 0) / 60); // En minutes
          break;
        default:
          data = sessions.map(s => s.xpGained || 0);
      }
      
      if (this.charts.progress) {
        this.charts.progress.destroy();
      }
      
      this.charts.progress = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: this.getChartLabel(),
            data,
            borderColor: '#2a9d8f',
            backgroundColor: 'rgba(42, 157, 143, 0.1)',
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    },
    
    createActivitiesChart() {
      const ctx = document.getElementById('activitiesChart');
      if (!ctx) return;
      
      const activities = this.activityPerformance;
      const labels = activities.map(a => a.name);
      const data = activities.map(a => a.attempts);
      
      if (this.charts.activities) {
        this.charts.activities.destroy();
      }
      
      this.charts.activities = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: [
              '#2a9d8f',
              '#e9c46a',
              '#e76f51',
              '#1d3557',
              '#f4a261'
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    },
    
    createSectionsChart() {
      const ctx = document.getElementById('sectionsChart');
      if (!ctx) return;
      
      // Pour l'instant, seulement section anglais
      const data = {
        labels: ['Anglais'],
        datasets: [{
          label: 'Taux de réussite',
          data: [this.metrics.successRate],
          backgroundColor: '#2a9d8f'
        }]
      };
      
      if (this.charts.sections) {
        this.charts.sections.destroy();
      }
      
      this.charts.sections = new Chart(ctx, {
        type: 'bar',
        data,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      });
    },
    
    // ===== ACTIONS UTILISATEUR =====
    
    updatePeriod() {
      this.refreshData();
      this.createProgressChart();
    },
    
    switchChartType(type) {
      this.chartType = type;
      this.createProgressChart();
    },
    
    exportData() {
      this.analytics.exportCSV();
      this.showSuccess('Données exportées en CSV');
    },
    
    async applyRecommendation(rec) {
      try {
        // Simuler application de recommandation
        await this.sleep(1000);
        
        // Retirer de la liste
        this.recommendations = this.recommendations.filter(r => r.id !== rec.id);
        
        this.showSuccess(`Recommandation "${rec.title}" appliquée`);
        
      } catch (error) {
        this.showError('Erreur lors de l\'application');
      }
    },
    
    dismissRecommendation(rec) {
      this.recommendations = this.recommendations.filter(r => r.id !== rec.id);
    },
    
    dismissAlert(alert) {
      this.alerts = this.alerts.filter(a => a.id !== alert.id);
    },
    
    generateReport() {
      // Placeholder pour génération PDF
      this.showInfo('Génération de rapport en cours...');
    },
    
    scheduleReport() {
      this.showInfo('Programmation de rapport activée');
    },
    
    resetAllData() {
      if (confirm('Vraiment effacer toutes les données ? Cette action est irréversible.')) {
        localStorage.clear();
        window.location.reload();
      }
    },
    
    // ===== UTILITAIRES =====
    
    getChartLabel() {
      switch (this.chartType) {
        case 'xp': return 'XP gagnés';
        case 'success': return 'Taux de réussite (%)';
        case 'time': return 'Temps de session (min)';
        default: return 'Valeur';
      }
    },
    
    getActivityName(type) {
      const names = {
        vocabulary: 'Vocabulaire',
        listening: 'Écoute',
        grammar: 'Grammaire',
        speaking: 'Expression orale'
      };
      return names[type] || type;
    },
    
    calculateActivitySuccessRate(type) {
      const events = this.analytics.data.english.filter(e => 
        e.event === 'question_attempt' && e.type === type
      );
      
      if (events.length === 0) return 0;
      
      const correct = events.filter(e => e.success).length;
      return Math.round((correct / events.length) * 100);
    },
    
    calculateActivityAvgTime(type) {
      const events = this.analytics.data.english.filter(e => 
        e.event === 'question_attempt' && e.type === type
      );
      
      if (events.length === 0) return 0;
      
      const totalTime = events.reduce((sum, e) => sum + (e.timeSpent || 0), 0);
      return Math.round(totalTime / events.length / 1000); // En secondes
    },
    
    calculateActivityTrend(type) {
      // Placeholder pour calcul de tendance par activité
      return Math.round((Math.random() - 0.5) * 20);
    },
    
    getTrendClass(trend) {
      if (trend > 0) return 'positive';
      if (trend < 0) return 'negative';
      return 'neutral';
    },
    
    getProgressClass(trend) {
      if (trend > 0) return 'improving';
      if (trend < 0) return 'declining';
      return 'stable';
    },
    
    generateHeatmap() {
      // Générer heatmap des 30 derniers jours
      const days = [];
      const today = new Date();
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const dayActivity = this.analytics.data.sessions.filter(s => {
          const sessionDate = new Date(s.timestamp);
          return sessionDate.toDateString() === date.toDateString();
        }).length;
        
        const intensity = Math.min(4, dayActivity);
        
        days.push(`
          <div class="heatmap-day intensity-${intensity}" 
               title="${date.toLocaleDateString()}: ${dayActivity} session(s)">
          </div>
        `);
      }
      
      return days.join('');
    },
    
    formatDate(timestamp) {
      return new Date(timestamp).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    
    formatDuration(milliseconds) {
      const minutes = Math.round(milliseconds / 60000);
      return `${minutes} min`;
    },
    
    // ===== NOTIFICATIONS =====
    
    showSuccess(message) {
      this.notification = { icon: '✅', message };
      this.showNotification = true;
      setTimeout(() => this.showNotification = false, 3000);
    },
    
    showError(message) {
      this.notification = { icon: '❌', message };
      this.showNotification = true;
      setTimeout(() => this.showNotification = false, 5000);
    },
    
    showInfo(message) {
      this.notification = { icon: 'ℹ️', message };
      this.showNotification = true;
      setTimeout(() => this.showNotification = false, 3000);
    },
    
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  };
}

// ===== EXPORT GLOBAL =====
window.PerformanceAnalytics = PerformanceAnalytics;
window.performanceDashboard = performanceDashboard;

console.log('📊 Performance Analytics engine loaded successfully');