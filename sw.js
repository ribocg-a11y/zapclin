// ============================================================
// ZAPCLIN — SERVICE WORKER
// Versão: 4.36.6 | Data: 31/08/2026
// [v4.36.6 CACHE]
// Troca de loja: stats filtrados na hora; listar ADM em cache da rede; ignora fetch atrasado.
// [v4.36.5 CACHE]
// Painel organizado; Equipe em pagina propria.
// [v4.36.4 CACHE]
// Primeiro acesso: troca obrigatória do PIN inicial 123456.
// [v4.36.3 CACHE]
// L1 Rede: Equipe na Home + Painel soma rotulada.
// [v4.36.2 CACHE]
// Menu do balcão + cockpit Rede; SW auto-update (poll + skipWaiting).
// [v4.36.1 CACHE]
// Login: timeout 30s (GAS ~15s na 1a entrada).
// [v4.36.0 CACHE]
// Login de turno (zc-auth.js): operador / supervisor / ADM.
// [v4.35.0 CACHE]
// Pacote Z.9: inclui zc-app.css (nunca HTML no lugar de CSS).
// [v4.34.1 CACHE]
// Página pública aceite.html (não cachear como index.html).
// [v4.34.0 CACHE]
// Pacote Z.7: inclui zc-operacao.js + zc-crm.js.
// [v4.33.9 CACHE]
// Isola vitrine /site/ do SW (não intercepta marketing público).
// [v4.33.8 CACHE]
// Lightbox foto do capacete no Relacionamento.
// [v4.33.7 CACHE]
// Corrige Projeção de Fechamento no Dashboard.
// [v4.33.6 CACHE]
// Hotfix Relacionamento (fotos/Nova OS) + Z.6 registrar/clientes.
// [v4.33.4 CACHE]
// Inclui zc-nav.js + zc-home.js (Pacote Z.5).
// [v4.33.3 CACHE]
// Restaura SW padrão ZapClin + fallback seguro (nunca HTML no lugar de JS).
// [v4.32.1 CACHE]
// Rede primeiro para index.html e zc-*.js.
// ============================================================

const ZAPCLIN_SW_VERSION = 'v4.36.6';
const STATIC_CACHE = 'zapclin-static-v4.36.6';
const RUNTIME_CACHE = 'zapclin-runtime-v4.36.6';

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
  './zc-nav.js',
  './zc-home.js',
  './zc-sync.js',
  './zc-whatsapp.js',
  './zc-admin.js',
  './zc-auth.js',
  './zc-historico-custos.js',
  './zc-registrar.js',
  './zc-clientes.js',
  './zc-operacao.js',
  './zc-crm.js',
  './zc-app.css'
];

function isShellCritical_(url) {
  const path = url.pathname || '';
  const file = path.split('/').pop() || '';
  if (file === 'index.html' || file === 'sw.js') return true;
  if (/^zc-.*\.(js|css)$/i.test(file)) return true;
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

  // Vitrine pública /site/ — fora do app: nunca interceptar (evita cache/HTML do PWA).
  if (url.pathname.includes('/site/') || /\/site\/?$/.test(url.pathname)) return;

  if (
    url.hostname.includes('script.google.com') ||
    url.hostname.includes('googleusercontent.com') ||
    url.hostname.includes('googleapis.com')
  ) {
    return;
  }

  // Navegação: rede primeiro. Só o index do PWA vai para o cache de index.html
  // (nunca gravar aceite.html/sobre.html por cima — incidente 14/07).
  if (req.mode === 'navigate') {
    const navFile = (url.pathname.split('/').pop() || '').toLowerCase();
    const isAppIndex = !navFile || navFile === 'index.html' || navFile === 'zapclin';
    event.respondWith(
      fetch(req, { cache: 'no-store' })
        .then(resp => {
          if (resp && resp.status === 200 && isAppIndex) {
            const copy = resp.clone();
            caches.open(STATIC_CACHE).then(cache => cache.put('./index.html', copy));
          }
          return resp;
        })
        .catch(() => {
          if (navFile === 'aceite.html') {
            return new Response(
              '<!doctype html><meta charset="utf-8"><title>ZapClin</title><body style="font-family:sans-serif;background:#07080d;color:#fff;padding:24px">Precisa de internet para confirmar o aceite.</body>',
              { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
            );
          }
          return caches.match('./index.html').then(cached => cached || caches.match('./'));
        })
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Shell crítico (index/zc-*.js/zc-*.css/sw.js): rede primeiro; fallback APENAS do próprio arquivo em cache.
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
