// EJEMPLO DE SW TO CHULO Y FUNCIONAL PARA TRABAJAR OFFLINE CON CACHE WITH NETWORK FALLBACK

const CACHE_STATIC_NAME = 'static-v1';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
const CACHE_INMUTABLE_NAME = 'inmutable-v1';

const CACHE_DYNAMIC_LIMIT = 50;

const APP_SHELL = [
  '/',
  '/index.html',
  '/js/app.js',
  '/css/style.css',
  '/img/main.jpg',
  '/img/no-img.jpg',
  '/pages/offline.html', // Cacheamos la página offline para que funcione en offline
];

const clearCache = (cacheName, numberItemsToSave) => {
  caches.open(cacheName).then((cache) =>
    cache.keys().then((keys) => {
      if (keys.length > numberItemsToSave) {
        cache.delete(keys[0]).then(clearCache(cacheName, numberItemsToSave));
      }
    })
  );
};

self.addEventListener('install', (e) => {
  const staticCache = caches
    .open(CACHE_STATIC_NAME)
    .then((cache) => cache.addAll(APP_SHELL));

  const inmutableCache = caches
    .open(CACHE_INMUTABLE_NAME)
    .then((cache) =>
      cache.add(
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'
      )
    );
  e.waitUntil(Promise.all([staticCache, inmutableCache]));
});

// Sólo se va a disparar cuando la instalación termina
self.addEventListener('activate', (e) => {
  // Borrar cachés que ya no me sirven
  const deleteOldCache = caches.keys().then((keys) => {
    keys.forEach(
      (key) =>
        key !== CACHE_STATIC_NAME &&
        key.includes('static') &&
        caches.delete(key)
    );
  });

  e.waitUntil(deleteOldCache);
});

self.addEventListener('fetch', (e) => {
  // Vamos a utilizar la estrategia cache with network fallback

  const cacheResponse = caches.match(e.request).then((res) =>
    res
      ? res
      : fetch(e.request)
          .then((newRes) => {
            caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
              cache.put(e.request, newRes);
              clearCache(CACHE_DYNAMIC_NAME, CACHE_DYNAMIC_LIMIT);
            });
            return newRes.clone();
          })
          .catch(() => {
            // Controlamos que la petición que falla sea de un html
            if (e.request.headers.get('accept').includes('text/html')) {
              return caches.match('/pages/offline.html');
            }
          })
  );
  e.respondWith(cacheResponse);
});
