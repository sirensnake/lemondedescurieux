/**
 * ===============================================
 * SERVICE WORKER INTELLIGENT - PHASE 3 ALPINE.JS
 * Le Monde des Curieux - PWA avancée
 * ===============================================
 */

const CACHE_VERSION = 'alpine-v3.0.0';
const STATIC_CACHE = `lemondedescurieux-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `lemondedescurieux-dynamic-${CACHE_VERSION}`;
const ANALYTICS_CACHE = `lemondedescurieux-analytics-${CACHE_VERSION}`;

// Configuration des stratégies de cache
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first', 
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only'
};

// Ressources critiques à précharger
const CRITICAL_RESOURCES = [
  '/',
  '/dashboard-alpine.html',
  '/styles/alpine-dashboard.css',
  '/scripts/alpine-components.js',
  '/manifest.json',
  'https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js'
];

// Configuration des routes avec stratégies
const ROUTE_CONFIGS = [
  // Assets statiques - Cache First (performance max)
  {
    pattern: /\.(js|css|png|jpg|jpeg|svg|gif|ico|woff|woff2)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cache: STATIC_CACHE,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
  },
  
  // Pages HTML - Stale While Revalidate (fraîcheur + performance)
  {
    pattern: /\.html$/,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cache: DYNAMIC_CACHE,
    fallback: '/offline.html'
  },
  
  // Alpine.js CDN - Cache First avec fallback
  {
    pattern: /unpkg\.com.*alpinejs/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cache: STATIC_CACHE,
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 jours
  },
  
  // APIs futures - Network First
  {
    pattern: /^\/api\//,
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cache: DYNAMIC_CACHE,
    timeout: 5000
  },
  
  // Analytics locales - Cache spécialisé
  {
    pattern: /analytics|tracking/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cache: ANALYTICS_CACHE
  }
];

// État du service worker
let swState = {
  version: CACHE_VERSION,
  installTime: null,
  updateTime: null,
  cacheStats: {
    hits: 0,
    misses: 0,
    networkRequests: 0
  },
  analytics: {
    offlineEvents: 0,
    backgroundSync: 0,
    notificationsSent: 0
  }
};

/**
 * ===============================================
 * INSTALLATION DU SERVICE WORKER
 * ===============================================
 */
self.addEventListener('install', event => {
  console.log(`🔧 SW Phase 3: Installation ${CACHE_VERSION}`);
  swState.installTime = new Date().toISOString();
  
  event.waitUntil(
    Promise.all([
      // Cache des ressources critiques
      caches.open(STATIC_CACHE).then(cache => {
        console.log('📦 Mise en cache ressources critiques');
        return cache.addAll(CRITICAL_RESOURCES.map(url => 
          new Request(url, { cache: 'reload' })
        ));
      }),
      
      // Préparation cache dynamique
      caches.open(DYNAMIC_CACHE),
      
      // Préparation cache analytics
      caches.open(ANALYTICS_CACHE),
      
      // Configuration background sync
      self.registration.sync && self.registration.sync.register('background-analytics')
      
    ]).then(() => {
      console.log('✅ SW Installation complète');
      // Force activation immédiate
      return self.skipWaiting();
    }).catch(error => {
      console.error('❌ Erreur installation SW:', error);
    })
  );
});

/**
 * ===============================================
 * ACTIVATION DU SERVICE WORKER
 * ===============================================
 */
self.addEventListener('activate', event => {
  console.log(`🚀 SW Phase 3: Activation ${CACHE_VERSION}`);
  swState.updateTime = new Date().toISOString();
  
  event.waitUntil(
    Promise.all([
      // Nettoyage des anciens caches
      cleanupOldCaches(),
      
      // Configuration des notifications
      setupNotifications(),
      
      // Initialisation de l'état
      initializeSwState(),
      
      // Prise de contrôle immédiate
      self.clients.claim()
      
    ]).then(() => {
      console.log('✅ SW Activation complète');
      
      // Notification aux clients
      broadcastMessage({
        type: 'SW_ACTIVATED',
        version: CACHE_VERSION,
        features: ['offline', 'background-sync', 'notifications']
      });
    })
  );
});

/**
 * ===============================================
 * INTERCEPTION DES REQUÊTES
 * ===============================================
 */
self.addEventListener('fetch', event => {
  // Ignorer requêtes non-HTTP
  if (!event.request.url.startsWith('http')) return;
  
  // Ignorer requêtes Chrome extensions
  if (event.request.url.startsWith('chrome-extension://')) return;
  
  // Stats
  swState.cacheStats.networkRequests++;
  
  event.respondWith(handleRequest(event.request));
});

/**
 * Gestionnaire intelligent des requêtes
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Trouver la configuration de route appropriée
    const routeConfig = findRouteConfig(url.pathname + url.search);
    
    if (!routeConfig) {
      // Stratégie par défaut: Stale While Revalidate
      return await staleWhileRevalidate(request, DYNAMIC_CACHE);
    }
    
    // Appliquer la stratégie configurée
    switch (routeConfig.strategy) {
      case CACHE_STRATEGIES.CACHE_FIRST:
        return await cacheFirst(request, routeConfig);
        
      case CACHE_STRATEGIES.NETWORK_FIRST:
        return await networkFirst(request, routeConfig);
        
      case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
        return await staleWhileRevalidate(request, routeConfig.cache);
        
      case CACHE_STRATEGIES.NETWORK_ONLY:
        return await fetch(request);
        
      default:
        return await staleWhileRevalidate(request, DYNAMIC_CACHE);
    }
    
  } catch (error) {
    console.error('❌ Erreur handling request:', error);
    return await handleRequestError(request, error);
  }
}

/**
 * Trouve la configuration de route pour une URL
 */
function findRouteConfig(urlPath) {
  return ROUTE_CONFIGS.find(config => {
    if (config.pattern instanceof RegExp) {
      return config.pattern.test(urlPath);
    }
    return urlPath.includes(config.pattern);
  });
}

/**
 * ===============================================
 * STRATÉGIES DE CACHE AVANCÉES
 * ===============================================
 */

/**
 * Cache First - Performance maximale
 */
async function cacheFirst(request, config) {
  try {
    const cache = await caches.open(config.cache);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      swState.cacheStats.hits++;
      
      // Vérifier âge du cache si maxAge défini
      if (config.maxAge && isCacheExpired(cachedResponse, config.maxAge)) {
        // Cache expiré, mise à jour en arrière-plan
        updateCacheInBackground(request, cache);
      }
      
      return cachedResponse;
    }
    
    // Pas en cache, récupérer du réseau
    swState.cacheStats.misses++;
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cloner pour le cache
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error('Cache First failed:', error);
    return await handleCacheError(request, config);
  }
}

/**
 * Network First - Fraîcheur prioritaire
 */
async function networkFirst(request, config) {
  try {
    // Timeout pour éviter les blocages
    const timeoutPromise = config.timeout ? 
      new Promise((_, reject) => setTimeout(() => reject(new Error('Network timeout')), config.timeout)) :
      null;
    
    const networkPromise = fetch(request);
    const networkResponse = timeoutPromise ? 
      await Promise.race([networkPromise, timeoutPromise]) :
      await networkPromise;
    
    if (networkResponse.ok) {
      // Mettre à jour le cache
      const cache = await caches.open(config.cache);
      await cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
    
  } catch (error) {
    // Fallback vers le cache
    const cache = await caches.open(config.cache);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      swState.cacheStats.hits++;
      return cachedResponse;
    }
    
    // Fallback ultime
    if (config.fallback) {
      const fallbackResponse = await cache.match(config.fallback);
      if (fallbackResponse) return fallbackResponse;
    }
    
    return new Response('Contenu non disponible hors ligne', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

/**
 * Stale While Revalidate - Équilibre optimal
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Récupération réseau en arrière-plan
  const networkPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);
  
  // Retourner immédiatement la version cachée si disponible
  if (cachedResponse) {
    swState.cacheStats.hits++;
    // Mise à jour en arrière-plan
    networkPromise.catch(() => {}); // Ignore les erreurs réseau
    return cachedResponse;
  }
  
  // Pas de cache, attendre le réseau
  swState.cacheStats.misses++;
  return await networkPromise || new Response('Contenu non disponible', { status: 503 });
}

/**
 * ===============================================
 * FONCTIONNALITÉS AVANCÉES PWA
 * ===============================================
 */

/**
 * Background Sync pour analytics
 */
self.addEventListener('sync', event => {
  console.log('🔄 Background Sync:', event.tag);
  
  if (event.tag === 'background-analytics') {
    event.waitUntil(syncAnalytics());
    swState.analytics.backgroundSync++;
  }
});

/**
 * Synchronisation des analytics en arrière-plan
 */
async function syncAnalytics() {
  try {
    // Récupérer analytics en attente depuis IndexedDB ou cache
    const pendingAnalytics = await getPendingAnalytics();
    
    if (pendingAnalytics.length > 0) {
      console.log(`📊 Sync ${pendingAnalytics.length} événements analytics`);
      
      // En Phase 3, on consolide juste dans le cache local
      const cache = await caches.open(ANALYTICS_CACHE);
      const consolidatedData = {
        events: pendingAnalytics,
        syncTime: new Date().toISOString(),
        version: CACHE_VERSION
      };
      
      await cache.put(
        new Request('/analytics-consolidated'),
        new Response(JSON.stringify(consolidatedData))
      );
      
      console.log('✅ Analytics consolidées avec succès');
    }
    
  } catch (error) {
    console.error('❌ Erreur sync analytics:', error);
  }
}

/**
 * Gestion des notifications push
 */
self.addEventListener('push', event => {
  console.log('📳 Push notification reçue');
  
  const options = {
    body: 'Nouvelle activité disponible !',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'curieux-notification',
    requireInteraction: false,
    actions: [
      {
        action: 'open-app',
        title: 'Ouvrir',
        icon: '/icons/open-action.png'
      },
      {
        action: 'dismiss',
        title: 'Plus tard',
        icon: '/icons/dismiss-action.png'
      }
    ],
    data: {
      url: '/dashboard-alpine.html',
      timestamp: Date.now()
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('Le Monde des Curieux', options)
  );
  
  swState.analytics.notificationsSent++;
});

/**
 * Gestion des clics sur notifications
 */
self.addEventListener('notificationclick', event => {
  console.log('👆 Notification cliquée:', event.action);
  
  event.notification.close();
  
  if (event.action === 'open-app' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/dashboard-alpine.html')
    );
  }
});

/**
 * ===============================================
 * FONCTIONS UTILITAIRES
 * ===============================================
 */

/**
 * Nettoyage des anciens caches
 */
async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const validCaches = [STATIC_CACHE, DYNAMIC_CACHE, ANALYTICS_CACHE];
  
  const deletionPromises = cacheNames
    .filter(cacheName => !validCaches.includes(cacheName))
    .map(cacheName => {
      console.log(`🗑️ Suppression ancien cache: ${cacheName}`);
      return caches.delete(cacheName);
    });
  
  return Promise.all(deletionPromises);
}

/**
 * Configuration des notifications
 */
async function setupNotifications() {
  // Vérifier support des notifications
  if ('Notification' in self && 'serviceWorker' in navigator) {
    console.log('🔔 Support notifications activé');
  }
}

/**
 * Initialisation de l'état du SW
 */
async function initializeSwState() {
  // Charger état persistant si disponible
  const cache = await caches.open(ANALYTICS_CACHE);
  const stateResponse = await cache.match('/sw-state');
  
  if (stateResponse) {
    const persistedState = await stateResponse.json();
    swState = { ...swState, ...persistedState };
  }
  
  // Sauvegarder état actuel
  await cache.put(
    new Request('/sw-state'),
    new Response(JSON.stringify(swState))
  );
}

/**
 * Vérification expiration cache
 */
function isCacheExpired(response, maxAge) {
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return false;
  
  const responseTime = new Date(dateHeader).getTime();
  const now = Date.now();
  
  return (now - responseTime) > maxAge;
}

/**
 * Mise à jour cache en arrière-plan
 */
async function updateCacheInBackground(request, cache) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response);
    }
  } catch (error) {
    console.warn('⚠️ Mise à jour cache arrière-plan échouée:', error);
  }
}

/**
 * Gestion erreurs de cache
 */
async function handleCacheError(request, config) {
  if (config.fallback) {
    const cache = await caches.open(config.cache);
    const fallbackResponse = await cache.match(config.fallback);
    if (fallbackResponse) return fallbackResponse;
  }
  
  return new Response('Service temporairement indisponible', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

/**
 * Gestion erreurs de requête
 */
async function handleRequestError(request, error) {
  console.error('Erreur requête:', error);
  
  // Tentative de récupération depuis le cache
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Page offline générique
  return new Response(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Hors ligne - Le Monde des Curieux</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .offline { color: #666; }
        .retry { margin-top: 20px; }
        button { padding: 10px 20px; font-size: 16px; }
      </style>
    </head>
    <body>
      <h1>🦊 Le Monde des Curieux</h1>
      <p class="offline">Vous êtes actuellement hors ligne</p>
      <p>Cette page n'est pas disponible en mode hors ligne.</p>
      <div class="retry">
        <button onclick="window.location.reload()">Réessayer</button>
        <button onclick="window.location.href='/dashboard-alpine.html'">Accueil</button>
      </div>
    </body>
    </html>
  `, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

/**
 * Récupération analytics en attente
 */
async function getPendingAnalytics() {
  try {
    // Simuler récupération depuis IndexedDB ou localStorage
    // En Phase 3, on peut utiliser le cache
    const cache = await caches.open(ANALYTICS_CACHE);
    const response = await cache.match('/pending-analytics');
    
    if (response) {
      const data = await response.json();
      return data.events || [];
    }
    
    return [];
  } catch (error) {
    console.error('Erreur récupération analytics:', error);
    return [];
  }
}

/**
 * Communication avec les clients
 */
function broadcastMessage(message) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage(message);
    });
  });
}

/**
 * Gestion des messages depuis les clients
 */
self.addEventListener('message', event => {
  console.log('📨 Message reçu:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'GET_SW_STATE') {
    event.ports[0].postMessage(swState);
  }
  
  if (event.data.type === 'CACHE_ANALYTICS') {
    const cache = caches.open(ANALYTICS_CACHE);
    cache.then(c => c.put(
      new Request('/pending-analytics'),
      new Response(JSON.stringify({ events: event.data.analytics }))
    ));
  }
});

// Log de démarrage
console.log(`🚀 Service Worker Phase 3 Alpine.js ${CACHE_VERSION} initialisé`);
