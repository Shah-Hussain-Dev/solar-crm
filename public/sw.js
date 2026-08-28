const CACHE_NAME = 'solarflow-crm-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/login',
  '/manifest.json',
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=192&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=512&auto=format&fit=crop&q=80'
];

// Install Event: Precache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Implement cache strategies
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Allow same-origin requests or Unsplash images
  const isSameOrigin = event.request.url.startsWith(self.location.origin);
  const isUnsplashImage = requestUrl.hostname === 'images.unsplash.com';

  if (!isSameOrigin && !isUnsplashImage) {
    return;
  }

  // 1. Images/Media: Cache-First
  if (event.request.destination === 'image' || requestUrl.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        
        return fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // 2. JS / CSS Static Bundles: Stale-While-Revalidate
  if (event.request.destination === 'script' || event.request.destination === 'style' || requestUrl.pathname.includes('/_next/')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 3. Document Page Shell (Navigation Requests): Network-first with cached fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/') || caches.match('/login');
        })
    );
    return;
  }

  // 4. Default: Network First with cached fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => caches.match(event.request))
  );
});

// Listen for update triggers from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
