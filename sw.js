// ZapClin — stub do sw.js antigo (v4.32.4)
// Clientes presos no SW anterior devem desinstalar caches e ceder controle.
self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    for (const client of clients) {
      try { client.navigate(client.url); } catch (_) {}
    }
  })());
});

self.addEventListener('fetch', event => {
  // Sempre rede: não reutilizar cache corrompido do SW antigo.
  event.respondWith(fetch(event.request, { cache: 'no-store' }).catch(() => Response.error()));
});
