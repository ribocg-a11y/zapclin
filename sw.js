// ============================================================
// ZAPCLIN â€” SERVICE WORKER
// VersÃ£o: 4.27.4 | Data: 30/05/2026
// [v4.27.4 CACHE]
// Corrige semanas do Dashboard para segunda a domingo.
// [v4.26.0 CACHE]
// Cache PWA versionado para reduzir inconsistÃªncia entre celular/desktop.
// MantÃ©m rede como fonte principal para navegaÃ§Ã£o e usa cache como fallback.
// ============================================================

const ZAPCLIN_SW_VERSION = 'v4.31.1';
const STATIC_CACHE = 'zapclin-static-v4.31.1';
const RUNTIME_CACHE = 'zapclin-runtime-v4.31.1';

// [v4.26.0 CACHE]
// Arquivos locais seguros para cache. NÃ£o inclui Apps Script/API, porque dados operacionais devem vir da planilha/backend.
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

  // [v4.20.0 CACHE]
  // Nunca interceptar chamadas do Google Apps Script/Google APIs. Evita cache indevido de dados reais.
  if (
    url.hostname.includes('script.google.com') ||
    url.hostname.includes('googleusercontent.com') ||
    url.hostname.includes('googleapis.com')
  ) {
    return;
  }

  // [v4.13.1 CACHE]
  // NavegaÃ§Ã£o: rede primeiro para pegar versÃ£o nova; fallback para cache se offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req, { cache: 'no-store' })
        .then(resp => {
          const copy = resp.clone();
          caches.open(STATIC_CACHE).then(cache => cache.put('./index.html', copy));
          return resp;
        })
        .catch(() => caches.match('./index.html').then(cached => cached || caches.match('./')))
    );
    return;
  }

  // [v4.13.1 CACHE]
  // Assets locais: cache primeiro, rede como atualizaÃ§Ã£o silenciosa.
  if (url.origin === self.location.origin) {
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
  }
});




