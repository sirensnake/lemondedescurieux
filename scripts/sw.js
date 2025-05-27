// Amélioration sw.js
const CACHE_STRATEGIES = {
  EDUCATIONAL_CONTENT: 'educational-cache-v1',
  GAME_ASSETS: 'games-cache-v1',
  USER_PROGRESS: 'progress-cache-v1'
};

// Stratégie de cache éducatif
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  if (url.pathname.includes('_section.html')) {
    event.respondWith(
      caches.open(CACHE_STRATEGIES.EDUCATIONAL_CONTENT)
        .then(cache => cache.match(event.request)
          .then(response => response || fetch(event.request)
            .then(fetchResponse => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            })
          )
        )
    );
  }
});