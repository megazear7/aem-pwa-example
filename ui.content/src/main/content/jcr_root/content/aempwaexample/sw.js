var cacheName = 'aempwaexample-v3';
var filesToCache = [
  '/etc.clientlibs/aempwaexample/clientlibs/clientlib-base.css',
  '/etc.clientlibs/aempwaexample/clientlibs/clientlib-base.js',
  '/content/aempwaexample/en.html',
  '/content/dam/aempwaexample/asset.jpg'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  // Respond with the network request first and fall back to the cache if it exists.
  e.respondWith(
    fetch(e.request).catch(function() {
      return caches.match(e.request);
    })
  );
});
