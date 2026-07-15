// Terminal Lab — Service Worker
// SUBE ESTE NÚMERO cada vez que cambies index.html, manifest.json o los iconos.
// (Los archivos de content/*.json se actualizan solos, no hace falta tocar esto por lecciones nuevas)
const SHELL_VERSION = 'v1';
const SHELL_CACHE = 'terminal-lab-shell-' + SHELL_VERSION;
const CONTENT_CACHE = 'terminal-lab-content';

const SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

const CONTENT_FILES = [
  './content/modules.json',
  './content/reference.json',
  './content/version.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(SHELL_CACHE).then(cache => cache.addAll(SHELL_FILES)),
      caches.open(CONTENT_CACHE).then(cache => cache.addAll(CONTENT_FILES).catch(()=>{}))
    ])
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names.map(name => {
          if (name !== SHELL_CACHE && name !== CONTENT_CACHE) {
            return caches.delete(name);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

function isContentRequest(url){
  return url.pathname.includes('/content/');
}

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;

  if (isContentRequest(url)) {
    // Contenido de lecciones/comandos: red primero (para recibir novedades), caché como respaldo offline.
    event.respondWith(
      fetch(event.request).then(res => {
        const copy = res.clone();
        caches.open(CONTENT_CACHE).then(cache => cache.put(event.request, copy));
        return res;
      }).catch(() => caches.match(event.request))
    );
    return;
  }

  // App shell: caché primero (rápido y offline), red como respaldo/actualización silenciosa.
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request).then(res => {
        const copy = res.clone();
        caches.open(SHELL_CACHE).then(cache => cache.put(event.request, copy));
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
