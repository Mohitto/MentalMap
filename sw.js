// Keep this in sync with APP_VERSION in app.js and the ?v= query strings in index.html.
const VERSION = '0.9.75';
const CACHE_NAME = `mentalmap-cache-v${VERSION}`;
const ASSETS = [
  './',
  './index.html',
  `./style.css?v=${VERSION}`,
  `./app.js?v=${VERSION}`,
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Only ever touch our own assets. Without this the worker also caches and
  // replays cross-origin traffic — Google Fonts, and later the Firebase SDK,
  // auth endpoints and Firestore's long-polling channel. Serving a stale
  // response to a live RPC desyncs the client, and caching a post-redirect
  // navigation would write auth parameters into the cache.
  if (url.origin !== self.location.origin) return;

  // Navigations can carry auth parameters after an OAuth redirect; never store those.
  const isNavigation = event.request.mode === 'navigate';
  const hasQuery = url.search.length > 0;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (!(isNavigation && hasQuery)) {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        }
        return response;
      })
      .catch(() => {
        // Offline. ignoreSearch matters because index.html requests app.js?v=NNN:
        // without it a version bump makes the cached asset unreachable and the
        // app boots blank.
        return caches.match(event.request, { ignoreSearch: true })
          .then(hit => hit || (isNavigation ? caches.match('./index.html', { ignoreSearch: true }) : undefined));
      })
  );
});
