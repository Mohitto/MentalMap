const CACHE_NAME = 'mentalmap-cache-v0.9.49';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => caches.delete(key)));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Always fetch from network to avoid caching issues during development
  event.respondWith(fetch(event.request));
});
