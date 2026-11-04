/* Assistant service worker.
   - Keeps the app shell, engine files and fonts available offline.
   - Adds the cross-origin isolation headers that let the AI engine use several CPU cores.
   Model files are NOT cached here: the engine stores them in the browser's private file storage. */
const VERSION = 'assistant-ai-v1.1.0';
const RUNTIME = 'assistant-ai-runtime';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];
const RUNTIME_HOSTS = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('assistant-ai-v') && k !== VERSION).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

function isolate(response) {
  if (!response || response.status === 0 || response.type === 'opaque' || response.type === 'opaqueredirect') return response;
  const headers = new Headers(response.headers);
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

async function navigate(request) {
  const cache = await caches.open(VERSION);
  try {
    const fresh = await fetch(request);
    if (fresh.ok) cache.put(new URL('./index.html', self.registration.scope).href, fresh.clone());
    return isolate(fresh);
  } catch (err) {
    const cached = (await cache.match(new URL('./index.html', self.registration.scope).href)) || (await cache.match(new URL('./', self.registration.scope).href));
    if (cached) return isolate(cached);
    return new Response('<h1>Assistant is offline</h1><p>Open Assistant once with internet so it can save itself for offline use.</p>', {
      status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request, { ignoreVary: true });
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok && (res.type === 'basic' || res.type === 'cors')) {
    try { await cache.put(request, res.clone()); } catch (e) { /* storage full */ }
  }
  return res;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(VERSION);
  const hit = await cache.match(request);
  const update = fetch(request).then((res) => {
    if (res.ok) cache.put(request, res.clone());
    return res;
  }).catch(() => hit);
  return hit || update;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (req.mode === 'navigate') {
    event.respondWith(navigate(req));
    return;
  }
  // Model downloads go straight to the network; the engine saves them itself.
  if (/(^|\.)huggingface\.co$|(^|\.)hf\.co$|xethub|cdn-lfs/.test(url.hostname)) return;

  if (RUNTIME_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(req, RUNTIME));
    return;
  }
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(req));
  }
});
