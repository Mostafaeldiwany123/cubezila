const CACHE_NAME = 'cubezila-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/timer/timer.html',
  '/css/index.css',
  '/css/roots.css',
  '/timer/timer.css',
  '/timer/timer.js',
  '/bg/theme.js',
  '/auth/auth.js',
  '/js/labels.js',
  '/language/language.js',
  '/timer/scramble/scramble.js',
  '/timer/tools/metronome/metronome.js',
  '/timer/tools/alert/audio.js',
  '/auth/timer-pro.js',
  '/timer/tools/alert/audio.css',
  '/timer/tools/metronome/metronome.css',
  '/timer/css/focus-mode.css',
  '/css/roots.css',
  '/offline.html',
  // CDN resources
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdn.cubing.net/v0/js/cubing/twisty',
  'https://cdn.cubing.net/v0/js/cubing',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js',
  // Favicons
  '/favicon_io/apple-touch-icon.png',
  '/favicon_io/favicon-32x32.png',
  '/favicon_io/favicon-16x16.png',
  '/favicon_io/site.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Remove beforeinstallprompt handler (was broken)

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(fetchResponse => {
          if (fetchResponse && fetchResponse.status === 200) {
            const responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return fetchResponse;
        });
      })
      .catch(() => {
        return caches.match('/offline.html');
      })
  );
});