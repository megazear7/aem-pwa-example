window.addEventListener('offline', showOfflineComponent);

window.addEventListener('online', hideOfflineComponent);

caches.open("aempwaexample-content-v1").then(cache => {
  cache.keys().then(keys => {
    document.querySelector('.offline-container .saved-links').innerHTML = '';
    keys.forEach(key => {
      cache.match(key).then(response => {
        if (response.ok && response.headers.get('Content-Type').indexOf('text/html') === 0) {
          console.log(response);
          var liElment = document.createElement('li');
          var aElement = document.createElement('a');
          aElement.href = response.url;

          // TODO how do we show a page title instead of a url?
          aElement.innerText = response.url;
          liElment.appendChild(aElement);
          document.querySelector('.offline-container .saved-links').appendChild(liElment);
          showOfflineComponent();
        }
      });
    })
  })
});

function showOfflineComponent() {
  // We only want to display the offline container if we found at least one saved link.
  if (! navigator.onLine && document.querySelectorAll('.offline-container .saved-links a').length > 0) {
    document.querySelector('.offline-container').style.display = 'block';
  }
}

function hideOfflineComponent() {
  document.querySelector('.offline-container').style.display = 'none';
}
