// monitoring/performance.js
export class PerformanceMonitor {
  constructor() {
    this.metrics = [];
    this.thresholds = {
      FCP: 1800,  // First Contentful Paint
      LCP: 2500,  // Largest Contentful Paint
      FID: 100,   // First Input Delay
      CLS: 0.1,   // Cumulative Layout Shift
      TTI: 3800   // Time to Interactive
    };
  }
  
  startMonitoring() {
    // Observer pour Core Web Vitals
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordMetric({
          name: entry.name,
          value: entry.startTime,
          rating: this.getRating(entry.name, entry.startTime)
        });
      }
    }).observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
    
    // First Input Delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordMetric({
          name: 'FID',
          value: entry.processingStart - entry.startTime,
          rating: this.getRating('FID', entry.processingStart - entry.startTime)
        });
      }
    }).observe({ entryTypes: ['first-input'] });
  }
  
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      summary: {
        averageLCP: this.getAverage('LCP'),
        averageFID: this.getAverage('FID'),
        performanceScore: this.calculateScore()
      },
      recommendations: this.getRecommendations()
    };
    
    return report;
  }
}