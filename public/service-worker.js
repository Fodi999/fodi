const CACHE_NAME = 'cms-cache-v1';
const urlsToCache = [
  '/',
  '/styles.css',
  '/manifest.json',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
  '/icons/safari-pinned-tab.svg'
];

// Install a service worker
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache.map(url => {
          return new Request(url, { cache: 'reload' });
        }));
      })
      .catch(error => {
        console.error('Failed to cache resources during install:', error);
        urlsToCache.forEach(url => {
          fetch(url).then(response => {
            if (!response.ok) {
              console.error(`Failed to fetch resource: ${url} - Status: ${response.status}`);
            }
          }).catch(fetchError => {
            console.error(`Failed to fetch resource: ${url} - Error: ${fetchError}`);
          });
        });
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Update a service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});




