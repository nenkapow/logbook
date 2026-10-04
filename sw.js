const APP_SHELL_CACHE = 'agen-gas-pro-v6-shell';
const RUNTIME_CACHE = 'agen-gas-pro-v6-runtime';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];
const APP_SHELL_PATHS = APP_SHELL.map(path => new URL(path, self.registration.scope).pathname);
const APP_SHELL_FALLBACK = new URL('./index.html', self.registration.scope).href;
const CDN_HOSTS = new Set(['cdn.tailwindcss.com', 'unpkg.com']);

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then(cache => cache.addAll(APP_SHELL).catch(() => null))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(k => k.startsWith('agen-gas-pro-') && k !== APP_SHELL_CACHE && k !== RUNTIME_CACHE)
        .map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const isAppShell = url.origin === self.location.origin &&
    (event.request.mode === 'navigate' || APP_SHELL_PATHS.includes(url.pathname));
  const isFirebaseLibrary = url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/');
  const isCdnLibrary = CDN_HOSTS.has(url.hostname) || isFirebaseLibrary;

  if (!isAppShell && !isCdnLibrary) return;

  const cacheName = isAppShell ? APP_SHELL_CACHE : RUNTIME_CACHE;
  const updateFromNetwork = () => fetch(event.request).then(response => {
    if (response && (response.ok || response.type === 'opaque')) {
      caches.open(cacheName).then(cache => cache.put(event.request, response.clone())).catch(() => null);
    }
    return response;
  });
  const networkResponse = updateFromNetwork();
  event.waitUntil(networkResponse.catch(() => null));

  event.respondWith(
    caches.match(event.request, { ignoreSearch: isAppShell }).then(cached => {
      if (cached) return cached;
      return networkResponse.catch(() => {
        if (event.request.mode === 'navigate') return caches.match(APP_SHELL_FALLBACK);
        return Response.error();
      });
    })
  );
});
