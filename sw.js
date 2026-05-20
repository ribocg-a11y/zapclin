// =====================================================
// ZAPCLIN SERVICE WORKER
// Versão: v4.7
// Controle profissional de cache PWA
// =====================================================

const CACHE_NAME = 'zapclin-cache-v4.7';

const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// -----------------------------------------------------
// INSTALL
// -----------------------------------------------------

self.addEventListener('install', event => {

  console.log('[SW] Instalando v4.7');

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))

  );

  self.skipWaiting();

});

// -----------------------------------------------------
// ACTIVATE
// -----------------------------------------------------

self.addEventListener('activate', event => {

  console.log('[SW] Ativando v4.7');

  event.waitUntil(

    caches.keys().then(cacheNames => {

      return Promise.all(

        cacheNames.map(cache => {

          if (cache !== CACHE_NAME) {

            console.log('[SW] Removendo cache antigo:', cache);

            return caches.delete(cache);

          }

        })

      );

    })

  );

  self.clients.claim();

});

// -----------------------------------------------------
// FETCH
// -----------------------------------------------------

self.addEventListener('fetch', event => {

  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(

    fetch(event.request)

      .then(networkResponse => {

        const responseClone = networkResponse.clone();

        caches.open(CACHE_NAME)
          .then(cache => {

            cache.put(event.request, responseClone);

          });

        return networkResponse;

      })

      .catch(() => {

        return caches.match(event.request);

      })

  );

});
