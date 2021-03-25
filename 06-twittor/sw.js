// imports
importScripts('js/sw-utils.js');
// NAMES
const STATIC_CACHE = 'static-v3';
const DYNAMIC_CACHE = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
  // '/', // En desarrollo
  '/pwa-prueba/',
  '/pwa-prueba/css/style.css',
  '/pwa-prueba/img/favicon.ico',
  '/pwa-prueba/img/avatars/spiderman.jpg',
  '/pwa-prueba/img/avatars/hulk.jpg',
  '/pwa-prueba/img/avatars/wolverine.jpg',
  '/pwa-prueba/img/avatars/thor.jpg',
  '/pwa-prueba/img/avatars/ironman.jpg',
  '/pwa-prueba/js/app.js',
  '/pwa-prueba/js/sw-utils.js',
];

const APP_SHELL_INMUTABLE = [
  '/pwa-prueba/js/libs/jquery.js',
  '/pwa-prueba/css/animate.css',
  'https://fonts.googleapis.com/css?family=Quicksand:300,400',
  'https://fonts.googleapis.com/css?family=Lato:400,300',
  'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
];

self.addEventListener('install', (e) => {
  const staticCache = caches
    .open(STATIC_CACHE)
    .then((cache) => cache.addAll(APP_SHELL));
  const inmutableCache = caches
    .open(INMUTABLE_CACHE)
    .then((cache) => cache.addAll(APP_SHELL_INMUTABLE));
  e.waitUntil(Promise.all([staticCache, inmutableCache]));
});

self.addEventListener('activate', (e) => {
  const deleteOldCache = caches.keys().then((keys) => {
    keys.forEach((key) => {
      key !== STATIC_CACHE && key.includes('static') && caches.delete(key);
      key !== DYNAMIC_CACHE && key.includes('dynamic') && caches.delete(key);
    });
  });
  e.waitUntil(deleteOldCache);
});

self.addEventListener('fetch', (e) => {
  const cacheResponse = caches
    .match(e.request)
    .then((res) =>
      res
        ? res
        : fetch(e.request).then((newResp) =>
            saveDynamicCache(DYNAMIC_CACHE, e.request, newResp)
          )
    );

  e.respondWith(cacheResponse);
});
