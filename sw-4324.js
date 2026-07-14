// ============================================================
// ZAPCLIN — SERVICE WORKER
// Versão: 4.32.4 | Data: 14/07/2026
// NUCLEAR: nunca servir HTML no lugar de JS. Network-first no shell.
// ============================================================

const ZAPCLIN_SW_VERSION = 'v4.32.4';
const STATIC_CACHE = 'zapclin-static-v4.32.4';
const RUNTIME_CACHE = 'zapclin-runtime-v4.32.4';

const APP_SHELL = [
  './',
  './index.html',
  './reparar.html',
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
  if (file === 'index.html' || file === 'reparar.html' || file === 'sw.js' || file === 'sw-4324.js') return true;
  if (/^zc-.*\.js$/i.test(file)) return true;
  return false;
}

function isProbablyHtml_(response) {
  try {
    const ct = (response && response.headers && response.headers.get('content-type')) || '';
    return /text\/html/i.test(ct);
  } catch (_) {
    return false;
  }
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
        .filter(key => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
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

  // Página de reparo: sempre rede, sem cache.
  if ((url.pathname || '').endsWith('/reparar.html') || (url.pathname || '').endsWith('reparar.html')) {
    event.respondWith(fetch(req, { cache: 'no-store' }));
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

  // Shell crítico: rede primeiro; fallback APENAS do próprio arquivo (nunca HTML para JS).
  if (isShellCritical_(url)) {
    event.respondWith(
      fetch(req, { cache: 'no-store' })
        .then(resp => {
          if (resp && resp.status === 200 && !isProbablyHtml_(resp)) {
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
          caches.match(req).then(cached => {
            if (cached && !isProbablyHtml_(cached)) return cached;
            return caches.match('./' + (url.pathname.split('/').pop() || '')).then(c => {
              if (c && !isProbablyHtml_(c)) return c;
              return Response.error();
            });
          })
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
