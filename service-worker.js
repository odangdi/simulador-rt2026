const cacheName = 'simulador-rt2026-v1';
const filesToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.png'
];

// Evento de instalação: faz o cache dos arquivos principais
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(filesToCache))
      .then(() => self.skipWaiting()) // força ativação imediata
  );
});

// Evento de ativação: remove caches antigos, se houver
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(
        cacheNames.map(name => {
          if (name !== cacheName) {
            return caches.delete(name);
          }
        })
      )
    ).then(() => self.clients.claim()) // assume controle imediato das páginas
  );
});

// Evento de fetch: responde com cache ou faz requisição
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
      .catch(() => {
        // Se offline e o arquivo não estiver no cache
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
  );
});
