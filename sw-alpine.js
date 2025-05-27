/**
 * ===============================================
 * SERVICE WORKER PWA AVANCÉ - ALPINE.JS PHASE 3
 * Le Monde des Curieux - Interface réactive
 * ===============================================
 */

const CACHE_VERSION = 'alpine-v3.0.0';
const APP_NAME = 'lemondedescurieux-alpine';

// Caches stratégiques
const STATIC_CACHE = `${APP_NAME}-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `${APP_NAME}-dynamic-${CACHE_VERSION}`;
const ALPINE_CACHE = `${APP_NAME}-alpine-${CACHE_VERSION}`;
const ANALYTICS_CACHE = `${APP_NAME}-analytics-${CACHE_VERSION}`;

// Configuration des stratégies de cache
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only'
};

// Routes avec stratégies spécifiques
const ROUTE_CONFIGS = [
  // Alpine.js et CDN - Cache First avec fallback
  {
    pattern: /^https:\/\/unpkg\.com\/alpinejs/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cache: ALPINE_CACHE,
    fallback: '/scripts/alpine-fallback.js'
  },
  
  // Assets statiques - Cache First
  {
    pattern: /\.(js|css|png|jpg|jpeg|svg|gif|ico|woff|woff2|ttf|eot)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cache: STATIC_CACHE
  },
  
  // Pages Alpine.js - Stale While Revalidate
  {
    pattern: /\/(dashboard-alpine\.html|alpine-.*\.html)$/,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cache: DYNAMIC_CACHE,
    fallback: '/offline-alpine.html'
  },
  
  // API et données dynamiques - Network First
  {
    pattern: /^\/api\//,
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cache: DYNAMIC_CACHE
  },
  
  // Analytics - Network Only (pas de cache)
  {
    pattern: /analytics|tracking/,
    strategy: CACHE_STRATEGIES.NETWORK_ONLY
  }
];

// Ressources critiques Alpine.js
const CRITICAL_ALPINE_RESOURCES = [
  // Pages Alpine.js
  '/dashboard-alpine.html',
  
  // Styles Alpine.js
  '/styles/alpine-dashboard.css',
  
  // Scripts Alpine.js
  '/scripts/alpine-components.js',
  'https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js',
  
  // Assets essentiels
  '/manifest.json',
  '/offline-alpine.html',
  
  // Icônes PWA
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-512x512.png'
];

// Configuration analytics offline
const ANALYTICS_CONFIG = {
  maxOfflineEvents: 500,
  syncInterval: 5 * 60 * 1000, // 5 minutes
  batchSize: 50
};

/**
 * ===============================================
 * INSTALLATION DU SERVICE WORKER
 * ===============================================
 */
self.addEventListener('install', event => {
  console.log('🔧 SW Alpine: Installation démarrée');
  
  event.waitUntil(
    Promise.all([
      // Cache des ressources critiques Alpine.js
      caches.open(STATIC_CACHE).then(cache => {
        console.log('📦 SW Alpine: Cache des ressources critiques');
        return cache.addAll(CRITICAL_ALPINE_RESOURCES.filter(url => !url.startsWith('http')));
      }),
      
      // Cache Alpine.js CDN séparément
      caches.open(ALPINE_CACHE).then(cache => {
        console.log('🚀 SW Alpine: Cache Alpine.js CDN');
        const alpineUrls = CRITICAL_ALPINE_RESOURCES.filter(url => url.startsWith('http'));
        return Promise.allSettled(alpineUrls.map(url => 
          cache.add(url).catch(err => console.warn('⚠️ Erreur cache CDN:', url, err))
        ));
      }),
      
      // Initialisation cache analytics
      caches.open(ANALYTICS_CACHE).then(cache => {
        console.log('📊 SW Alpine: Cache analytics initialisé');
        return cache.put('/analytics-offline', new Response('{}'));
      })
    ]).then(() => {
      console.log('✅ SW Alpine: Installation terminée');
      return self.skipWaiting();
    }).catch(err => {
      console.error('❌ SW Alpine: Erreur installation:', err);
    })
  );
});

/**
 * ===============================================
 * ACTIVATION DU SERVICE WORKER
 * ===============================================
 */
self.addEventListener('activate', event => {
  console.log('🚀 SW Alpine: Activation démarrée');
  
  event.waitUntil(
    Promise.all([
      // Nettoyage des anciens caches
      cleanupOldCaches(),
      
      // Prise de contrôle immédiate
      self.clients.claim(),
      
      // Configuration analytics offline
      setupOfflineAnalytics()
    ]).then(() => {
      console.log('✅ SW Alpine: Activation terminée');
      
      // Notification clients de l'activation
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_ACTIVATED',
            version: CACHE_VERSION,
            timestamp: new Date().toISOString()
          });
        });
      });
    })
  );
});

/**
 * Nettoyage des anciens caches
 */
async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const validCaches = [STATIC_CACHE, DYNAMIC_CACHE, ALPINE_CACHE, ANALYTICS_CACHE];
  
  const deletePromises = cacheNames
    .filter(name => name.startsWith(APP_NAME) && !validCaches.includes(name))
    .map(name => {
      console.log('🗑️ SW Alpine: Suppression ancien cache:', name);
      return caches.delete(name);
    });
  
  return Promise.all(deletePromises);
}

/**
 * Configuration analytics offline
 */
async function setupOfflineAnalytics() {
  console.log('📊 SW Alpine: Configuration analytics offline');
  
  // Synchronisation périodique des analytics
  setInterval(async () => {
    try {
      await syncOfflineAnalytics();
    } catch (error) {
      console.error('❌ SW Alpine: Erreur sync analytics:', error);
    }
  }, ANALYTICS_CONFIG.syncInterval);
}

/**
 * ===============================================
 * INTERCEPTION DES REQUÊTES
 * ===============================================
 */
self.addEventListener('fetch', event => {
  // Ignorer les requêtes non-HTTP
  if (!event.request.url.startsWith('http')) {
    return;
  }
  
  // Gestion spéciale pour les analytics
  if (isAnalyticsRequest(event.request)) {
    event.respondWith(handleAnalyticsRequest(event.request));
    return;
  }
  
  // Gestion normale des requêtes
  event.respondWith(handleRequest(event.request));
});

/**
 * Gestionnaire principal des requêtes
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Trouver la configuration de route
  const routeConfig = findRouteConfig(url);
  
  if (!routeConfig) {
    // Stratégie par défaut: Network First pour Alpine.js
    return await networkFirst(request, DYNAMIC_CACHE);
  }
  
  // Appliquer la stratégie configurée
  switch (routeConfig.strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return await cacheFirst(request, routeConfig.cache, routeConfig.fallback);
      
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return await networkFirst(request, routeConfig.cache, routeConfig.fallback);
      
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return await staleWhileRevalidate(request, routeConfig.cache);
      
    case CACHE_STRATEGIES.NETWORK_ONLY:
      return await networkOnly(request);
      
    default:
      return await networkFirst(request, DYNAMIC_CACHE);
  }
}

/**
 * Trouver la configuration de route appropriée
 */
function findRouteConfig(url) {
  return ROUTE_CONFIGS.find(config => {
    if (config.pattern instanceof RegExp) {
      return config.pattern.test(url.href) || config.pattern.test(url.pathname);
    }
    return url.pathname.includes(config.pattern);
  });
}

/**
 * ===============================================
 * STRATÉGIES DE CACHE
 * ===============================================
 */

/**
 * Cache First - Pour les assets statiques
 */
async function cacheFirst(request, cacheName, fallbackUrl = null) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Mise à jour en arrière-plan pour Alpine.js CDN
      if (request.url.includes('unpkg.com/alpinejs')) {
        updateAlpineInBackground(request, cache);
      }
      return cachedResponse;
    }
    
    // Pas en cache - récupérer du réseau
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error('❌ Cache First error:', error);
    
    // Fallback si spécifié
    if (fallbackUrl) {
      const cache = await caches.open(cacheName);
      const fallbackResponse = await cache.match(fallbackUrl);
      if (fallbackResponse) {
        return fallbackResponse;
      }
    }
    
    return createErrorResponse('Ressource indisponible hors ligne');
  }
}

/**
 * Network First - Pour les contenus dynamiques
 */
async function networkFirst(request, cacheName, fallbackUrl = null) {
  try {
    // Essayer le réseau d'abord
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
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
    
    return createErrorResponse('Contenu indisponible hors ligne');
  }
}

/**
 * Stale While Revalidate - Pour les pages Alpine.js
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Mise à jour en arrière-plan
  const networkResponsePromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(err => {
    console.warn('⚠️ Stale while revalidate network error:', err);
  });
  
  // Retourner immédiatement la version cachée si disponible
  return cachedResponse || await networkResponsePromise;
}

/**
 * Network Only - Pour les analytics
 */
async function networkOnly(request) {
  return await fetch(request);
}

/**
 * Mise à jour Alpine.js en arrière-plan
 */
async function updateAlpineInBackground(request, cache) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
      console.log('🔄 Alpine.js mis à jour en arrière-plan');
    }
  } catch (error) {
    console.warn('⚠️ Erreur mise à jour Alpine.js:', error);
  }
}

/**
 * ===============================================
 * GESTION ANALYTICS OFFLINE
 * ===============================================
 */

/**
 * Vérifier si la requête est pour les analytics
 */
function isAnalyticsRequest(request) {
  return request.url.includes('/analytics') || 
         request.url.includes('/track') ||
         request.method === 'POST' && request.url.includes('alpine-components');
}

/**
 * Gestionnaire spécial pour les analytics
 */
async function handleAnalyticsRequest(request) {
  try {
    // Essayer d'envoyer en ligne
    const response = await fetch(request);
    if (response.ok) {
      return response;
    }
    throw new Error('Network failed');
    
  } catch (error) {
    // Stocker offline pour sync ultérieure
    await storeAnalyticsOffline(request);
    return new Response(JSON.stringify({ 
      status: 'stored_offline',
      timestamp: new Date().toISOString()
    }), {
      status: 202,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Stockage analytics offline
 */
async function storeAnalyticsOffline(request) {
  try {
    const cache = await caches.open(ANALYTICS_CACHE);
    const offlineData = await getOfflineAnalytics(cache);
    
    // Extraction des données de la requête
    let eventData = {};
    if (request.method === 'POST') {
      const body = await request.text();
      eventData = JSON.parse(body);
    } else {
      const url = new URL(request.url);
      url.searchParams.forEach((value, key) => {
        eventData[key] = value;
      });
    }
    
    // Ajout à la queue offline
    offlineData.events.push({
      ...eventData,
      offline_timestamp: new Date().toISOString(),
      url: request.url,
      method: request.method
    });
    
    // Limitation de taille
    if (offlineData.events.length > ANALYTICS_CONFIG.maxOfflineEvents) {
      offlineData.events = offlineData.events.slice(-ANALYTICS_CONFIG.maxOfflineEvents);
    }
    
    // Sauvegarde
    await cache.put('/analytics-offline', new Response(JSON.stringify(offlineData)));
    console.log('📊 Analytics stockées offline:', offlineData.events.length, 'événements');
    
  } catch (error) {
    console.error('❌ Erreur stockage analytics offline:', error);
  }
}

/**
 * Récupération des analytics offline
 */
async function getOfflineAnalytics(cache) {
  try {
    const response = await cache.match('/analytics-offline');
    if (response) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.warn('⚠️ Erreur lecture analytics offline:', error);
  }
  
  return { events: [], lastSync: null };
}

/**
 * Synchronisation des analytics offline
 */
async function syncOfflineAnalytics() {
  const cache = await caches.open(ANALYTICS_CACHE);
  const offlineData = await getOfflineAnalytics(cache);
  
  if (offlineData.events.length === 0) {
    return;
  }
  
  console.log('📊 Sync analytics offline:', offlineData.events.length, 'événements');
  
  // Traitement par batch
  const batches = [];
  for (let i = 0; i < offlineData.events.length; i += ANALYTICS_CONFIG.batchSize) {
    batches.push(offlineData.events.slice(i, i + ANALYTICS_CONFIG.batchSize));
  }
  
  let syncedCount = 0;
  const remainingEvents = [];
  
  for (const batch of batches) {
    try {
      const response = await fetch('/api/analytics/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: batch,
          source: 'offline_sync',
          sync_timestamp: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        syncedCount += batch.length;
      } else {
        // Garder les événements non synchronisés
        remainingEvents.push(...batch);
      }
      
    } catch (error) {
      console.warn('⚠️ Erreur sync batch analytics:', error);
      remainingEvents.push(...batch);
    }
  }
  
  // Mise à jour du cache avec les événements restants
  const updatedData = {
    events: remainingEvents,
    lastSync: new Date().toISOString(),
    totalSynced: (offlineData.totalSynced || 0) + syncedCount
  };
  
  await cache.put('/analytics-offline', new Response(JSON.stringify(updatedData)));
  
  if (syncedCount > 0) {
    console.log(`✅ Analytics sync: ${syncedCount} événements synchronisés`);
    
    // Notifier les clients
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'ANALYTICS_SYNCED',
          syncedCount: syncedCount,
          remainingCount: remainingEvents.length
        });
      });
    });
  }
}

/**
 * ===============================================
 * GESTION DES MESSAGES CLIENTS
 * ===============================================
 */
self.addEventListener('message', event => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_STATUS':
      handleCacheStatusRequest(event);
      break;
      
    case 'CLEAR_CACHE':
      handleClearCacheRequest(event, data);
      break;
      
    case 'FORCE_ANALYTICS_SYNC':
      syncOfflineAnalytics().then(() => {
        event.ports[0]?.postMessage({ success: true });
      });
      break;
      
    case 'STORE_ANALYTICS_EVENT':
      storeAnalyticsOffline({
        url: '/analytics/event',
        method: 'POST',
        text: () => Promise.resolve(JSON.stringify(data))
      });
      break;
  }
});

/**
 * Gestion du statut du cache
 */
async function handleCacheStatusRequest(event) {
  try {
    const cacheNames = await caches.keys();
    const cacheStatus = {};
    
    for (const name of cacheNames.filter(n => n.startsWith(APP_NAME))) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      cacheStatus[name] = {
        size: keys.length,
        lastModified: new Date().toISOString()
      };
    }
    
    event.ports[0]?.postMessage({
      version: CACHE_VERSION,
      caches: cacheStatus,
      analytics: await getOfflineAnalytics(await caches.open(ANALYTICS_CACHE))
    });
    
  } catch (error) {
    event.ports[0]?.postMessage({ error: error.message });
  }
}

/**
 * Gestion de la suppression du cache
 */
async function handleClearCacheRequest(event, data) {
  try {
    if (data.cacheNames) {
      // Suppression sélective
      for (const name of data.cacheNames) {
        await caches.delete(name);
      }
    } else {
      // Suppression complète
      const cacheNames = await caches.keys();
      for (const name of cacheNames.filter(n => n.startsWith(APP_NAME))) {
        await caches.delete(name);
      }
    }
    
    event.ports[0]?.postMessage({ success: true });
    
  } catch (error) {
    event.ports[0]?.postMessage({ error: error.message });
  }
}

/**
 * ===============================================
 * UTILITAIRES
 * ===============================================
 */

/**
 * Création d'une réponse d'erreur
 */
function createErrorResponse(message, status = 503) {
  return new Response(JSON.stringify({
    error: message,
    timestamp: new Date().toISOString(),
    serviceWorker: true
  }), {
    status: status,
    statusText: 'Service Unavailable',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
}

/**
 * ===============================================
 * GESTION DES ERREURS GLOBALES
 * ===============================================
 */
self.addEventListener('error', event => {
  console.error('❌ SW Alpine: Erreur globale:', event.error);
  
  // Envoi de l'erreur aux analytics si possible
  storeAnalyticsOffline({
    url: '/analytics/error',
    method: 'POST',
    text: () => Promise.resolve(JSON.stringify({
      type: 'service_worker_error',
      message: event.error?.message || 'Unknown error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      timestamp: new Date().toISOString()
    }))
  }).catch(err => console.error('Erreur stockage erreur SW:', err));
});

self.addEventListener('unhandledrejection', event => {
  console.error('❌ SW Alpine: Promise rejetée:', event.reason);
  
  // Analytics pour les promesses rejetées
  storeAnalyticsOffline({
    url: '/analytics/error',
    method: 'POST',
    text: () => Promise.resolve(JSON.stringify({
      type: 'service_worker_unhandled_rejection',
      reason: event.reason?.toString() || 'Unknown rejection',
      timestamp: new Date().toISOString()
    }))
  }).catch(err => console.error('Erreur stockage rejection SW:', err));
});

/**
 * ===============================================
 * INITIALISATION ET LOGS
 * ===============================================
 */
console.log('🚀 Service Worker Alpine.js Phase 3 - Chargé');
console.log('📦 Version cache:', CACHE_VERSION);
console.log('🎯 Stratégies configurées:', Object.keys(CACHE_STRATEGIES).length);
console.log('📊 Analytics offline: activées');
