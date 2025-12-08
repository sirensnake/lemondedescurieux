// Import Alpine.js et plugins
import Alpine from 'alpinejs';
import Chart from 'chart.js/auto';
import { jsPDF } from 'jspdf';

// Import des composants personnalisés
import { dashboardApp } from './components/dashboard.js';
import { heartSystem } from './components/heart-system.js';
import { streakManager } from './components/streak-manager.js';
import { analyticsTracker } from './modules/analytics.js';
import { storageManager } from './modules/storage.js';

// Configuration globale
window.LeMondeCurieux = {
  version: '3.0.0',
  config: {
    debug: import.meta.env.DEV,
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    storage: {
      prefix: 'lemondedescurieux_',
      version: 'v3'
    },
    features: {
      hearts: {
        max: 5,
        recoveryMinutes: 30
      },
      streak: {
        bonusMultiplier: 1.5,
        notificationHours: [8, 18]
      }
    }
  },
  
  // Instances globales
  storage: null,
  analytics: null,
  charts: new Map()
};

// Initialisation du storage
LeMondeCurieux.storage = new storageManager(LeMondeCurieux.config.storage.prefix);

// Initialisation des analytics
LeMondeCurieux.analytics = new analyticsTracker(LeMondeCurieux.storage);

// Enregistrement des composants Alpine
Alpine.data('dashboardApp', dashboardApp);
Alpine.data('heartSystem', heartSystem);
Alpine.data('streakManager', streakManager);

// Composants utilitaires globaux
Alpine.data('modal', () => ({
  open: false,
  title: '',
  content: '',
  
  showModal(title, content) {
    this.title = title;
    this.content = content;
    this.open = true;
  },
  
  closeModal() {
    this.open = false;
    this.title = '';
    this.content = '';
  }
}));

// Système de notifications
Alpine.data('notifications', () => ({
  notifications: [],
  
  add(message, type = 'info', duration = 3000) {
    const id = Date.now();
    const notification = { id, message, type };
    
    this.notifications.push(notification);
    
    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  },
  
  remove(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
  },
  
  success(message) {
    this.add(message, 'success');
  },
  
  error(message) {
    this.add(message, 'error', 5000);
  },
  
  warning(message) {
    this.add(message, 'warning', 4000);
  }
}));

// Magic properties Alpine
Alpine.magic('charts', () => LeMondeCurieux.charts);
Alpine.magic('storage', () => LeMondeCurieux.storage);
Alpine.magic('analytics', () => LeMondeCurieux.analytics);
Alpine.magic('pdf', () => jsPDF);

// Directives personnalisées
Alpine.directive('chart', (el, { expression }, { evaluate }) => {
  const config = evaluate(expression);
  
  if (LeMondeCurieux.charts.has(el)) {
    LeMondeCurieux.charts.get(el).destroy();
  }
  
  const chart = new Chart(el, config);
  LeMondeCurieux.charts.set(el, chart);
  
  // Cleanup
  el._x_chart_cleanup = () => {
    if (LeMondeCurieux.charts.has(el)) {
      LeMondeCurieux.charts.get(el).destroy();
      LeMondeCurieux.charts.delete(el);
    }
  };
});

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Le Monde des Curieux v3.0.0 - Phase 3');
  
  // Vérifier la compatibilité du navigateur
  checkBrowserCompatibility();
  
  // Initialiser le service worker pour PWA
  if ('serviceWorker' in navigator && !import.meta.env.DEV) {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('✅ Service Worker enregistré'))
      .catch(err => console.error('❌ Erreur Service Worker:', err));
  }
  
  // Tracking de la session
  LeMondeCurieux.analytics.startSession();
  
  // Gestion du mode hors ligne
  window.addEventListener('online', () => {
    document.body.classList.remove('offline');
    Alpine.store('app').online = true;
  });
  
  window.addEventListener('offline', () => {
    document.body.classList.add('offline');
    Alpine.store('app').online = false;
  });
});

// Vérification compatibilité navigateur
function checkBrowserCompatibility() {
  const features = {
    'Service Worker': 'serviceWorker' in navigator,
    'Local Storage': 'localStorage' in window,
    'IndexedDB': 'indexedDB' in window,
    'Web Audio': 'AudioContext' in window || 'webkitAudioContext' in window,
    'Intersection Observer': 'IntersectionObserver' in window
  };
  
  const unsupported = Object.entries(features)
    .filter(([, supported]) => !supported)
    .map(([feature]) => feature);
  
  if (unsupported.length > 0) {
    console.warn('⚠️ Fonctionnalités non supportées:', unsupported);
  }
}

// Store global Alpine
Alpine.store('app', {
  online: navigator.onLine,
  theme: LeMondeCurieux.storage.get('theme') || 'light',
  soundEnabled: LeMondeCurieux.storage.get('soundEnabled') ?? true,
  
  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = this.theme;
    LeMondeCurieux.storage.set('theme', this.theme);
  },
  
  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    LeMondeCurieux.storage.set('soundEnabled', this.soundEnabled);
  }
});

// Démarrer Alpine
Alpine.start();

// Export pour utilisation dans d'autres modules
export { Alpine, Chart, jsPDF };