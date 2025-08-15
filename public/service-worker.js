const CACHE_NAME = 'herucrm-cache-v2';
const OFFLINE_URL = '/offline.html';
const urlsToCache = [
  '/',
  '/manifest.json',
  OFFLINE_URL,
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// On install, cache static assets and offline page
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// On activate, clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Runtime caching for navigation and API GET requests
self.addEventListener('fetch', event => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Handle navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache the page for offline use
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
          return response;
        })
        .catch(() => {
          // Try to serve from cache, or fallback to offline page
          return caches.match(request).then(res => res || caches.match(OFFLINE_URL));
        })
    );
    return;
  }

  // Cache-first for static assets (CSS, JS, images)
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.url.endsWith('.js') ||
    request.url.endsWith('.css') ||
    request.url.endsWith('.png') ||
    request.url.endsWith('.svg') ||
    request.url.endsWith('.jpg') ||
    request.url.endsWith('.jpeg')
  ) {
    event.respondWith(
      caches.match(request).then(cached => {
        return (
          cached || fetch(request).then(response => {
            // Cache new asset
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
            return response;
          })
        );
      })
    );
    return;
  }

  // Network-first for API GET requests, fallback to cache
  if (request.url.includes('/api/') && request.method === 'GET') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Default: try cache, then network
  event.respondWith(
    caches.match(request).then(cached => {
      return cached || fetch(request);
    })
  );
});
