var cacheName = 'aempwaexample-v1';
var contentCacheName = 'aempwaexample-content';
var cacheNames = [cacheName, contentCacheName];
var offlinePage = '/content/aempwaexample/en/offline-page.html';
var filesToCache = [
  '/etc.clientlibs/aempwaexample/clientlibs/clientlib-base.css',
  '/etc.clientlibs/aempwaexample/clientlibs/clientlib-base.js',
  '/content/aempwaexample/en.html',
  '/content/dam/aempwaexample/asset.jpg',
  offlinePage
];

self.addEventListener('install', function(e) {
  console.debug('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.debug('[ServiceWorker] Caching');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.debug('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (! cacheNames.includes(key)) {
          console.debug('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.debug('[ServiceWorker] Fetch', e.request.url);

  // Responde with the network request first and cache the request.
  // If we cannot connect to the network then use the cached response.
  e.respondWith(
    caches.open(contentCacheName).then(function(cache) {
      return fetch(e.request)
      .then(function(response){
        console.debug('[ServiceWorker] Updating cache', e.request.url);
        cache.put(e.request.url, response.clone());
        return response;
      })
      .catch(function() {
        console.debug('[ServiceWorker] Using response from cache', e.request.url);
        return cache.match(e.request).then(function(cachedResponse) {
          if (cachedResponse) {
            return cachedResponse;
          } else {
            console.debug('[ServiceWorker] Using offline page from cache');
            return caches.open(cacheName).then(function(progCache) {
              return progCache.match(offlinePage);
            });
          }
        });
      });
    })
  );
});
