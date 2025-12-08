// sw-advanced.js
const CACHE_VERSION = 'v3.0.0';
const CACHE_NAME = `lemondedescurieux-${CACHE_VERSION}`;

// Stratégies de cache
const cacheStrategies = {
  cacheFirst: async (request) => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  },
  
  networkFirst: async (request) => {
    try {
      const response = await fetch(request);
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
      return response;
    } catch (error) {
      const cached = await caches.match(request);
      return cached || new Response('Offline', { status: 503 });
    }
  },
  
  staleWhileRevalidate: async (request) => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    
    const fetchPromise = fetch(request).then(response => {
      cache.put(request, response.clone());
      return response;
    });
    
    return cached || fetchPromise;
  }
};