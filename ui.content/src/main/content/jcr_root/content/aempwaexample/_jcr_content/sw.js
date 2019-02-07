var cacheName = 'aempwaexample-v1';
var filesToCache = [
  '/etc.clientlibs/aempwaexample/clientlibs/clientlib-base.css',
  '/etc.clientlibs/aempwaexample/clientlibs/clientlib-base.js',
  '/content/aempwaexample/en.html'
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
