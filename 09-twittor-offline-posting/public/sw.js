// imports
importScripts('https://cdn.jsdelivr.net/npm/pouchdb@7.2.1/dist/pouchdb.min.js');
importScripts('js/sw-db.js');
importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
  '/',
  'index.html',
  'css/style.css',
  'img/favicon.ico',
  'img/avatars/hulk.jpg',
  'img/avatars/ironman.jpg',
  'img/avatars/spiderman.jpg',
  'img/avatars/thor.jpg',
  'img/avatars/wolverine.jpg',
  'js/app.js',
  'js/sw-utils.js',
];

const APP_SHELL_INMUTABLE = [
  'https://fonts.googleapis.com/css?family=Quicksand:300,400',
  'https://fonts.googleapis.com/css?family=Lato:400,300',
  'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
  'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.css',
  'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js',
  'https://cdn.jsdelivr.net/npm/pouchdb@7.2.1/dist/pouchdb.min.js',
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
  let cacheResponse;

  console.log(e.request.url.includes('/api'));
  e.request.url.includes('/api')
    ? (cacheResponse = handleApiMessages(DYNAMIC_CACHE, e.request))
    : (cacheResponse = caches.match(e.request).then((res) => {
        if (res) {
          updateStaticCache(STATIC_CACHE, e.request, APP_SHELL_INMUTABLE);
          return res;
        } else {
          return fetch(e.request).then((newResp) =>
            saveDynamicCache(DYNAMIC_CACHE, e.request, newResp)
          );
        }
      }));

  e.respondWith(cacheResponse);
});

// Async tasks

self.addEventListener('sync', (e) => {
  if (e.tag === 'new-message') {
    // Post to db when connection
    const postResponse = postMessagesFromDBLocal();
    e.waitUntil(postResponse);
  }
});
