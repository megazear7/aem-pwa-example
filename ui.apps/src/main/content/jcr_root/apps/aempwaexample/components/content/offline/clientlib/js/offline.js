window.addEventListener('offline', showOfflineComponent);
window.addEventListener('online', hideOfflineComponent);

caches.open('aempwaexample-content').then(cache => {
  cache.keys().then(keys => {
    document.querySelector('.offline-container .saved-links').innerHTML = '';
    keys.forEach(key => {
      cache.match(key).then(response => {
        response.text().then(text => {
          var matches = text.match(/<h1.+?>(.+?)<\/h1>/);
          if (matches && matches.length > 1 && response.ok && response.headers.get('Content-Type').indexOf('text/html') === 0) {
            var liElment = document.createElement('li');
            var aElement = document.createElement('a');
            aElement.href = response.url;
            aElement.innerText = matches[1];
            liElment.appendChild(aElement);
            document.querySelector('.offline-container .saved-links').appendChild(liElment);
            showOfflineComponent();
          }
        });
      });
    })
  })
});

function showOfflineComponent() {
  // We only want to display the offline container if we found at least one saved link.
  if (! navigator.onLine && document.querySelectorAll('.offline-container .saved-links a').length > 0) {
    document.querySelector('.offline-container').style.display = 'block';
    document.querySelector('.online-container').style.display = 'none';
  }
}

function hideOfflineComponent() {
  document.querySelector('.offline-container').style.display = 'none';
  document.querySelector('.online-container').style.display = 'block';
}
