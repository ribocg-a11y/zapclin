// ============================================================
// ZAPCLIN — SERVICE WORKER
// Versão: 4.32.2 | Data: 14/07/2026
// [v4.32.2 CACHE]
// HOTFIX: nunca servir index.html como fallback de zc-*.js (quebrava o PWA).
// [v4.32.1 CACHE]
// Rede primeiro para index.html e zc-*.js.
// ============================================================

const ZAPCLIN_SW_VERSION = 'v4.32.2';
const STATIC_CACHE = 'zapclin-static-v4.32.2';
const RUNTIME_CACHE = 'zapclin-runtime-v4.32.2';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './favicon.ico',
  './favicon-16.png',
  './favicon-32.png',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './maskable-icon-512.png',
  './zc-version.js',
  './zc-globals.js',
  './zc-api.js',
  './zc-core.js',
  './zc-sync.js',
  './zc-whatsapp.js',
  './zc-admin.js',
  './zc-historico-custos.js'
];

function isShellCritical_(url) {
  const path = url.pathname || '';
  const file = path.split('/').pop() || '';
  if (file === 'index.html' || file === 'sw.js') return true;
  if (/^zc-.*\.js$/i.test(file)) return true;
  return false;
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(APP_SHELL.map(url => new Request(url, { cache: 'reload' }))).catch(() => null))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys
        .filter(key => key.startsWith('zapclin-') && key !== STATIC_CACHE && key !== RUNTIME_CACHE)
        .map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== 'GET') return;

  if (
    url.hostname.includes('script.google.com') ||
    url.hostname.includes('googleusercontent.com') ||
    url.hostname.includes('googleapis.com')
  ) {
    return;
  }

  // Navegação: rede primeiro; fallback só index.html.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req, { cache: 'no-store' })
        .then(resp => {
          if (resp && resp.status === 200) {
            const copy = resp.clone();
            caches.open(STATIC_CACHE).then(cache => cache.put('./index.html', copy));
          }
          return resp;
        })
        .catch(() => caches.match('./index.html').then(cached => cached || caches.match('./')))
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Shell crítico (index/zc-*.js/sw.js): rede primeiro; fallback APENAS do próprio arquivo em cache.
  if (isShellCritical_(url)) {
    event.respondWith(
      fetch(req, { cache: 'no-store' })
        .then(resp => {
          if (resp && resp.status === 200) {
            const copy1 = resp.clone();
            const copy2 = resp.clone();
            caches.open(STATIC_CACHE).then(cache => {
              cache.put(req, copy1);
              const clean = url.pathname.split('/').pop();
              if (clean) cache.put('./' + clean, copy2);
            });
          }
          return resp;
        })
        .catch(() =>
          caches.match(req).then(cached =>
            cached || caches.match('./' + (url.pathname.split('/').pop() || ''))
          )
        )
    );
    return;
  }

  // Demais assets: cache primeiro.
  event.respondWith(
    caches.match(req).then(cached => {
      const network = fetch(req).then(resp => {
        if (resp && resp.status === 200) {
          const copy = resp.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(req, copy));
        }
        return resp;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
