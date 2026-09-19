const CACHE = 'dunya-al-dawrat-v17';
const CORE = [
  './','./index.html','./explore.html','./platform.html','./course.html','./offline.html','./data.json',
  './css/style.css','./css/branding.css','./css/landing.css','./css/developer-story.css','./css/profile.css','./css/categories-only.css','./css/learning-paths.css','./css/design-runtime.css','./css/platform-card-theme.css',
  './js/content-api.js','./js/i18n.js','./js/seo-routes.js','./js/site-runtime.js','./js/data-loader.js','./js/design-runtime.js','./js/platform-core.js','./js/platform-directory.js','./js/path-approvals.js','./js/app.js','./js/learning-paths-section.js','./js/accessibility.js','./js/explore-nav.js',
  './js/landing.js','./js/union-president-message.js','./js/platform-detail.js','./js/platform-back-nav.js','./js/inline-editor-loader.js',
  './manifest.webmanifest','./assets/dunya-logo-192.png','./assets/dunya-logo.svg','./assets/dunya-logo-hero-v3.webp','./assets/union-president.webp','./icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

async function networkFirst(request, fallback = null) {
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const clone = response.clone();
      caches.open(CACHE).then(cache => cache.put(request, clone));
    }
    return response;
  } catch (_) {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;
    if (fallback) return (await caches.match(fallback)) || Response.error();
    return Response.error();
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request, { ignoreSearch: true });
  const update = fetch(request).then(response => {
    if (response && response.ok) {
      const clone = response.clone();
      caches.open(CACHE).then(cache => cache.put(request, clone));
    }
    return response;
  }).catch(() => null);
  if (cached) {
    void update;
    return cached;
  }
  return (await update) || Response.error();
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const isDataRequest = url.pathname.endsWith('/data.json');
  const isAdminConfigRequest = url.pathname.endsWith('/admin/config.yml');

  if (isDataRequest || isAdminConfigRequest) {
    event.respondWith(networkFirst(event.request, null));
    return;
  }

  if (['script', 'style'].includes(event.request.destination)) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirst(event.request, './offline.html'));
    return;
  }

  event.respondWith(caches.match(event.request, { ignoreSearch: true }).then(cached => cached || fetch(event.request).then(response => {
    if (response && response.ok) {
      const clone = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, clone));
    }
    return response;
  })));
});
