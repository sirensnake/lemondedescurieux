// sw.js
const CACHE_NAME = 'lemondedescurieux-v1';

// Fichiers à mettre en cache lors de l'installation
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/styles/style.css',
  '/styles/layout_style.css',
  '/styles/menu_lateral.css',
  '/scripts/menu-loader.js',
  '/scripts/progression.js',
  '/images/MineCraftMindmap_1000px.png'
  // Ajoutez d'autres ressources essentielles
];

// Installation du Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_CACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Stratégie de cache : Cache-First avec fallback réseau
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request)
          .then(response => {
            // Mettre en cache les nouvelles ressources
            if (response.ok && event.request.method === 'GET') {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseToCache));
            }
            return response;
          });
      })
  );
});