// ===============================================
// PHASE 3 - IMPLÉMENTATION PRIORITAIRE
// Architecture moderne + PWA avancée
// ===============================================

// 1. MIGRATION ALPINE.JS - Dashboard progression réactif
// Fichier: scripts/components/progress-dashboard.js
class ProgressDashboard {
  static initAlpineComponent() {
    return {
      // État réactif Alpine
      progressData: Alpine.observable({
        totalActivities: 0,
        completedActivities: 0,
        currentStreak: 0,
        badges: [],
        subjects: {}
      }),
      
      // Méthodes Alpine
      init() {
        this.loadProgressData();
        this.setupStreakTracking();
        this.initNotifications();
      },
      
      loadProgressData() {
        const stored = JSON.parse(localStorage.getItem('userProgress') || '{}');
        Object.assign(this.progressData, stored);
        this.calculateStats();
      },
      
      calculateStats() {
        // Calculs réactifs avec Alpine
        const subjects = Object.keys(this.progressData.subjects || {});
        this.progressData.totalActivities = subjects.reduce((total, subject) => {
          return total + Object.keys(this.progressData.subjects[subject] || {}).length;
        }, 0);
        
        this.progressData.completedActivities = subjects.reduce((total, subject) => {
          const subjectData = this.progressData.subjects[subject] || {};
          return total + Object.values(subjectData).filter(activity => activity.completed).length;
        }, 0);
      },
      
      // Getters réactifs Alpine
      get completionPercentage() {
        return this.progressData.totalActivities > 0 
          ? Math.round((this.progressData.completedActivities / this.progressData.totalActivities) * 100)
          : 0;
      },
      
      get streakStatus() {
        return this.progressData.currentStreak > 0 
          ? `🔥 ${this.progressData.currentStreak} jours consécutifs !`
          : '💪 Commencer une série !';
      },
      
      setupStreakTracking() {
        // Vérification quotidienne du streak
        const lastActivity = localStorage.getItem('lastActivityDate');
        const today = new Date().toDateString();
        
        if (lastActivity !== today) {
          this.checkStreakContinuity();
        }
      },
      
      checkStreakContinuity() {
        const lastActivity = new Date(localStorage.getItem('lastActivityDate') || '');
        const today = new Date();
        const diffTime = Math.abs(today - lastActivity);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 1) {
          // Streak cassé
          this.progressData.currentStreak = 0;
          this.showStreakLostNotification();
        }
      },
      
      markActivityComplete(subject, activity) {
        // Mise à jour réactive
        if (!this.progressData.subjects[subject]) {
          this.progressData.subjects[subject] = {};
        }
        
        this.progressData.subjects[subject][activity] = {
          completed: true,
          completedAt: new Date().toISOString()
        };
        
        // Mise à jour streak
        this.updateStreak();
        
        // Sauvegarde
        this.saveProgress();
        
        // Recalcul stats
        this.calculateStats();
      },
      
      updateStreak() {
        const today = new Date().toDateString();
        const lastActivity = localStorage.getItem('lastActivityDate');
        
        if (lastActivity !== today) {
          this.progressData.currentStreak++;
          localStorage.setItem('lastActivityDate', today);
          
          // Notification streak
          if (this.progressData.currentStreak % 7 === 0) {
            this.showStreakMilestoneNotification();
          }
        }
      },
      
      saveProgress() {
        localStorage.setItem('userProgress', JSON.stringify(this.progressData));
      },
      
      // Notifications PWA
      initNotifications() {
        if ('Notification' in window && 'serviceWorker' in navigator) {
          this.requestNotificationPermission();
        }
      },
      
      async requestNotificationPermission() {
        if (Notification.permission === 'default') {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            this.scheduleReminderNotifications();
          }
        }
      },
      
      scheduleReminderNotifications() {
        // Rappel quotidien si pas d'activité
        setInterval(() => {
          const lastActivity = localStorage.getItem('lastActivityDate');
          const today = new Date().toDateString();
          
          if (lastActivity !== today) {
            this.showReminderNotification();
          }
        }, 1000 * 60 * 60 * 2); // Vérification toutes les 2h
      },
      
      showReminderNotification() {
        if (Notification.permission === 'granted') {
          new Notification('Le Monde des Curieux 🦊', {
            body: 'Curio t\'attend pour une nouvelle aventure !',
            icon: '/icons/curio-notification.png',
            badge: '/icons/badge-72x72.png',
            tag: 'daily-reminder'
          });
        }
      },
      
      showStreakMilestoneNotification() {
        if (Notification.permission === 'granted') {
          new Notification('Incroyable ! 🎉', {
            body: `Tu as maintenu ton streak pendant ${this.progressData.currentStreak} jours !`,
            icon: '/icons/streak-milestone.png',
            badge: '/icons/badge-72x72.png',
            tag: 'streak-milestone'
          });
        }
      },
      
      showStreakLostNotification() {
        if (Notification.permission === 'granted') {
          new Notification('Streak perdu 😔', {
            body: 'Pas de souci ! Tu peux recommencer une nouvelle série dès maintenant !',
            icon: '/icons/curio-encouragement.png',
            badge: '/icons/badge-72x72.png',
            tag: 'streak-lost'
          });
        }
      }
    };
  }
}

// 2. SERVICE WORKER AVANCÉ - Stratégies de cache multiples
// Fichier: sw-advanced.js
const CACHE_VERSION = 'v3.0';
const STATIC_CACHE = `lemondedescurieux-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `lemondedescurieux-dynamic-${CACHE_VERSION}`;
const OFFLINE_CACHE = `lemondedescurieux-offline-${CACHE_VERSION}`;

// Stratégies de cache
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Configuration des routes
const ROUTE_CONFIGS = [
  // Assets statiques - Cache First
  { 
    pattern: /\.(?:js|css|png|jpg|jpeg|svg|gif|ico|woff|woff2)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cache: STATIC_CACHE
  },
  // Pages HTML - Network First avec fallback
  { 
    pattern: /\.html$/,
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cache: DYNAMIC_CACHE,
    fallback: '/offline.html'
  },
  // API futures - Network First
  { 
    pattern: /^\/api\//,
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cache: DYNAMIC_CACHE
  },
  // Contenu éducatif - Stale While Revalidate
  { 
    pattern: /\/(sections|content)\//,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cache: DYNAMIC_CACHE
  }
];

// Resources critiques à précharger
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/scripts/app.js',
  '/offline.html',
  '/manifest.json'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Install Event');
  
  event.waitUntil(
    Promise.all([
      // Cache des ressources critiques
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Service Worker: Caching critical resources');
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      
      // Cache offline
      caches.open(OFFLINE_CACHE).then(cache => {
        return cache.add('/offline.html');
      })
    ]).then(() => {
      console.log('Service Worker: Installation complete');
      // Force activation immédiate
      return self.skipWaiting();
    })
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activate Event');
  
  event.waitUntil(
    Promise.all([
      // Nettoyage des anciens caches
      caches.keys().then(cacheNames => {
        const validCaches = [STATIC_CACHE, DYNAMIC_CACHE, OFFLINE_CACHE];
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!validCaches.includes(cacheName)) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Prise de contrôle immédiate
      self.clients.claim()
    ]).then(() => {
      console.log('Service Worker: Activation complete');
    })
  );
});

// Intercption des requêtes
self.addEventListener('fetch', event => {
  // Ignorer les requêtes non-HTTP
  if (!event.request.url.startsWith('http')) {
    return;
  }
  
  event.respondWith(handleRequest(event.request));
});

// Gestionnaire de requêtes avec stratégies
async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Trouver la configuration de route appropriée
  const routeConfig = ROUTE_CONFIGS.find(config => 
    config.pattern.test(url.pathname + url.search)
  );
  
  if (!routeConfig) {
    // Stratégie par défaut: Network First
    return networkFirst(request, DYNAMIC_CACHE);
  }
  
  // Appliquer la stratégie configurée
  switch (routeConfig.strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return cacheFirst(request, routeConfig.cache);
      
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return networkFirst(request, routeConfig.cache, routeConfig.fallback);
      
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(request, routeConfig.cache);
      
    default:
      return networkFirst(request, DYNAMIC_CACHE);
  }
}

// Stratégie Cache First
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Si pas en cache, récupérer du réseau et mettre en cache
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache First failed:', error);
    return new Response('Resource not available', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Stratégie Network First
async function networkFirst(request, cacheName, fallbackUrl = null) {
  try {
    // Essayer le réseau d'abord
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Mettre à jour le cache
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    // Fallback vers le cache
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback ultime
    if (fallbackUrl) {
      const fallbackResponse = await cache.match(fallbackUrl);
      if (fallbackResponse) {
        return fallbackResponse;
      }
    }
    
    return new Response('Content not available offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Stratégie Stale While Revalidate
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Récupération en arrière-plan pour mise à jour
  const networkResponsePromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });
  
  // Retourner immédiatement la version cachée si disponible
  return cachedResponse || networkResponsePromise;
}

// 3. SYSTÈME DE CŒURS/VIES AVANCÉ - Composant Alpine
// Fichier: scripts/components/heart-system.js
class HeartSystem {
  static initAlpineComponent() {
    return {
      // État réactif
      hearts: 5,
      maxHearts: 5,
      recoveryTime: 30, // minutes
      lastRecovery: null,
      bonusHeartsAvailable: 0,
      
      init() {
        this.loadHeartState();
        this.startRecoveryTimer();
        this.setupHeartAnimations();
      },
      
      loadHeartState() {
        const saved = JSON.parse(localStorage.getItem('heartSystem') || '{}');
        this.hearts = saved.hearts || this.maxHearts;
        this.lastRecovery = saved.lastRecovery ? new Date(saved.lastRecovery) : null;
        this.bonusHeartsAvailable = saved.bonusHeartsAvailable || 0;
        
        // Calculer récupération depuis dernière session
        if (this.lastRecovery) {
          this.calculatePassiveRecovery();
        }
      },
      
      calculatePassiveRecovery() {
        const now = new Date();
        const timeDiff = now - this.lastRecovery;
        const minutesPassed = Math.floor(timeDiff / (1000 * 60));
        const heartsToRecover = Math.floor(minutesPassed / this.recoveryTime);
        
        if (heartsToRecover > 0 && this.hearts < this.maxHearts) {
          const heartsRecovered = Math.min(heartsToRecover, this.maxHearts - this.hearts);
          this.hearts += heartsRecovered;
          this.lastRecovery = new Date(this.lastRecovery.getTime() + heartsRecovered * this.recoveryTime * 60000);
          this.saveHeartState();
          
          // Notification de récupération
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('❤️ Cœurs récupérés !', {
              body: `Tu as récupéré ${heartsRecovered} cœur(s) !`,
              icon: '/icons/heart-recovery.png'
            });
          }
        }
      },
      
      loseHeart() {
        if (this.hearts > 0) {
          this.hearts--;
          this.lastRecovery = new Date();
          this.saveHeartState();
          
          // Animation de perte
          this.animateHeartLoss();
          
          // Si plus de cœurs
          if (this.hearts === 0) {
            this.handleNoHeartsLeft();
          }
          
          return true;
        }
        return false;
      },
      
      gainHeart() {
        if (this.hearts < this.maxHearts) {
          this.hearts++;
          this.saveHeartState();
          this.animateHeartGain();
          return true;
        }
        return false;
      },
      
      useBonusHeart() {
        if (this.bonusHeartsAvailable > 0 && this.hearts < this.maxHearts) {
          this.bonusHeartsAvailable--;
          this.hearts++;
          this.saveHeartState();
          this.animateHeartGain();
          return true;
        }
        return false;
      },
      
      earnBonusHeart() {
        this.bonusHeartsAvailable++;
        this.saveHeartState();
        
        // Notification bonus
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('🌟 Cœur bonus !', {
            body: 'Tu as gagné un cœur bonus pour ta performance !',
            icon: '/icons/bonus-heart.png'
          });
        }
      },
      
      handleNoHeartsLeft() {
        // Proposer options de récupération
        this.showRecoveryOptions();
      },
      
      showRecoveryOptions() {
        // Interface pour récupération
        const modal = document.createElement('div');
        modal.className = 'heart-recovery-modal';
        modal.innerHTML = `
          <div class="modal-content">
            <h3>Plus de cœurs ! 💔</h3>
            <p>Tu peux :</p>
            <div class="recovery-options">
              <button @click="waitForRecovery" class="btn btn-primary">
                Attendre ${this.recoveryTime} min
              </button>
              <button @click="useBonusHeart" class="btn btn-secondary" 
                      ${this.bonusHeartsAvailable === 0 ? 'disabled' : ''}>
                Utiliser cœur bonus (${this.bonusHeartsAvailable})
              </button>
              <button @click="watchAd" class="btn btn-accent">
                Regarder une vidéo éducative
              </button>
            </div>
          </div>
        `;
        
        document.body.appendChild(modal);
      },
      
      startRecoveryTimer() {
        setInterval(() => {
          if (this.hearts < this.maxHearts && this.lastRecovery) {
            const now = new Date();
            const timeDiff = now - this.lastRecovery;
            const minutesPassed = Math.floor(timeDiff / (1000 * 60));
            
            if (minutesPassed >= this.recoveryTime) {
              this.hearts++;
              this.lastRecovery = new Date();
              this.saveHeartState();
              this.animateHeartGain();
            }
          }
        }, 60000); // Vérification chaque minute
      },
      
      animateHeartLoss() {
        // Animation CSS avec Alpine transition
        this.$nextTick(() => {
          const heartElements = document.querySelectorAll('.heart-icon');
          if (heartElements[this.hearts]) {
            heartElements[this.hearts].classList.add('heart-lost-animation');
          }
        });
      },
      
      animateHeartGain() {
        // Animation CSS avec Alpine transition
        this.$nextTick(() => {
          const heartElements = document.querySelectorAll('.heart-icon');
          if (heartElements[this.hearts - 1]) {
            heartElements[this.hearts - 1].classList.add('heart-gained-animation');
          }
        });
      },
      
      setupHeartAnimations() {
        // Ajouter styles CSS pour animations
        if (!document.getElementById('heart-animations')) {
          const style = document.createElement('style');
          style.id = 'heart-animations';
          style.textContent = `
            .heart-lost-animation {
              animation: heartLoss 0.5s ease-in-out;
            }
            
            .heart-gained-animation {
              animation: heartGain 0.5s ease-in-out;
            }
            
            @keyframes heartLoss {
              0% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.2); opacity: 0.5; }
              100% { transform: scale(0.8); opacity: 0.3; }
            }
            
            @keyframes heartGain {
              0% { transform: scale(0.5); opacity: 0.5; }
              50% { transform: scale(1.3); opacity: 0.8; }
              100% { transform: scale(1); opacity: 1; }
            }
          `;
          document.head.appendChild(style);
        }
      },
      
      saveHeartState() {
        const state = {
          hearts: this.hearts,
          lastRecovery: this.lastRecovery ? this.lastRecovery.toISOString() : null,
          bonusHeartsAvailable: this.bonusHeartsAvailable
        };
        localStorage.setItem('heartSystem', JSON.stringify(state));
      },
      
      // Getters réactifs
      get nextRecoveryTime() {
        if (!this.lastRecovery || this.hearts >= this.maxHearts) return null;
        
        const nextRecovery = new Date(this.lastRecovery.getTime() + this.recoveryTime * 60000);
        const now = new Date();
        const timeLeft = nextRecovery - now;
        
        if (timeLeft <= 0) return 0;
        
        const minutes = Math.floor(timeLeft / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      },
      
      get canPlay() {
        return this.hearts > 0;
      }
    };
  }
}

// 4. MODULARISATION ES6 - Architecture cible
// Fichier: scripts/modules/storage-manager.js
export class StorageManager {
  constructor() {
    this.prefix = 'lemondedescurieux_';
    this.version = '3.0';
    this.migrationCompleted = this.checkMigration();
  }
  
  // API unifiée de stockage
  set(key, value, options = {}) {
    const storageKey = this.prefix + key;
    const data = {
      value,
      timestamp: new Date().toISOString(),
      version: this.version,
      ...options
    };
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Storage failed:', error);
      return false;
    }
  }
  
  get(key, defaultValue = null) {
    const storageKey = this.prefix + key;
    
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return defaultValue;
      
      const data = JSON.parse(stored);
      
      // Vérification de version
      if (data.version !== this.version) {
        return this.migrateData(key, data) || defaultValue;
      }
      
      return data.value;
    } catch (error) {
      console.error('Storage retrieval failed:', error);
      return defaultValue;
    }
  }
  
  remove(key) {
    const storageKey = this.prefix + key;
    try {
      localStorage.removeItem(storageKey);
      return true;
    } catch (error) {
      console.error('Storage removal failed:', error);
      return false;
    }
  }
  
  // Migration des données entre versions
  migrateData(key, oldData) {
    console.log(`Migrating data for key: ${key}`);
    
    // Logique de migration selon la version
    const migrated = this.performMigration(oldData);
    
    if (migrated) {
      this.set(key, migrated.value);
      return migrated.value;
    }
    
    return null;
  }
  
  performMigration(oldData) {
    // Migration spécifique selon les versions
    if (oldData.version === '2.0') {
      return this.migrateFromV2(oldData);
    }
    
    return null;
  }
  
  migrateFromV2(oldData) {
    // Exemple de migration v2 -> v3
    return {
      value: {
        ...oldData.value,
        migratedAt: new Date().toISOString()
      }
    };
  }
  
  checkMigration() {
    const migrationKey = this.prefix + 'migration_status';
    const status = localStorage.getItem(migrationKey);
    
    if (status !== this.version) {
      this.runMigration();
      localStorage.setItem(migrationKey, this.version);
      return true;
    }
    
    return false;
  }
  
  runMigration() {
    console.log('Running storage migration...');
    // Logique de migration globale
  }
}

// 5. INTÉGRATION VITE.JS - Configuration
// Fichier: vite.config.js
export default {
  root: '.',
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        mathematiques: 'mathematiques.html',
        sciences: 'sciences.html',
        // Autres pages...
      },
      output: {
        manualChunks: {
          vendor: ['alpinejs'],
          components: [
            './scripts/components/progress-dashboard.js',
            './scripts/components/heart-system.js'
          ]
        }
      }
    },
    // Optimisations production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  // Plugin PWA pour Vite
  plugins: [
    {
      name: 'pwa-manifest',
      generateBundle() {
        // Génération automatique du manifest
        const manifest = {
          name: 'Le Monde des Curieux',
          short_name: 'Curieux',
          description: 'Plateforme éducative interactive pour enfants',
          start_url: '/',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#2a9d8f',
          icons: [
            {
              src: 'icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        };
        
        this.emitFile({
          type: 'asset',
          fileName: 'manifest.json',
          source: JSON.stringify(manifest, null, 2)
        });
      }
    }
  ]
};