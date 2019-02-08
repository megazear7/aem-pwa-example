// This cache will contain our site content. You could have other caches for
// other purposes such as application assets and images.
var contentCacheName = 'aempwaexample-content';

// Put all of your caches into an array so we can add other types of caches later.
var cacheNames = [contentCacheName];

// We will give the web page this offline page if we are off the network and
// the page it asks for is not available in the cache.
var offlinePage = '/content/aempwaexample/en/offline-page.html';

// This will be the pages that get cached when the service worker is installed.
var filesToCache = [
  '/content/aempwaexample/en.html',
  offlinePage
];

// During installation precache the files that we know we want cached.
self.addEventListener('install', function(e) {
  console.debug('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(contentCacheName).then(function(cache) {
      console.debug('[ServiceWorker] Caching');
      return cache.addAll(filesToCache);
    })
  );
});

// When the page fetches new content intercept the request.
self.addEventListener('fetch', function(e) {
  console.debug('[ServiceWorker] Fetch', e.request.url);

  e.respondWith(
    caches.open(contentCacheName).then(function(cache) {
      return fetch(e.request)
      .then(function(response){
        // If the fetch to the network is successful cache the response and return
        // it to the page.
        console.debug('[ServiceWorker] Updating cache', e.request.url);
        cache.put(e.request.url, response.clone());
        return response;
      })
      .catch(function() {
        // If the fetch to the network fails either give the user the cached cached
        // response if it is available or fallback to the offline page.
        console.debug('[ServiceWorker] Using response from cache', e.request.url);
        return cache.match(e.request).then(function(cachedResponse) {
          if (cachedResponse) {
            return cachedResponse;
          } else {
            console.debug('[ServiceWorker] Using offline page from cache');
            return cache.match(offlinePage);
          }
        });
      });
    })
  );
});
