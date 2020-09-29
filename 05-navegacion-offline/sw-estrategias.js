//Cache para archivos estaticos como APP_SHELL
const CACHE_STATIC_NAME = 'static-v2';

//Cache para archivos dinamicos
const CACHE_DYNAMIC_NAME = 'dynamic-v1';

//Cache para archivos inmutables
const CACHE_INMUTABLE_NAME = 'inmutable-v1';

// Límite del caché dinámico
const CACHE_DYNAMIC_LIMIT = 50;

// El APP_SHELL es todo lo necesario para que la página web funcione
const APP_SHELL = [
  '/', // Es necesario cachear el / para que pueda ir a localhost
  '/index.html',
  '/js/app.js',
  '/css/style.css',
  '/img/main.jpg',
  '/img/no-img.jpg',
];

// Función para limpiar la caché que queramos (normalmente la dinámica)
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
  // En la instalación del service worker, creamos la cache y en ella guardamos la APP SHELL
  // es decir los archivos importantes para que la app funcione
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
  // Le decimos al sw que espere a que la promesa del caché termine para poder continuar
  // En este caso esperamos la resolucion de ambas promesas con promise all
  e.waitUntil(Promise.all([staticCache, inmutableCache]));
});

self.addEventListener('fetch', (e) => {
  // // 1-ESTRATEGIA CACHÉ ONLY
  // // Usada cuando queremos que toda la app sea servida desde la caché
  // // El problema de esta estrategia es que si queremos actualizar un archivo, tenemos que actualizar el SW
  //
  // e.respondWith(caches.match(e.request));
  //
  //
  //
  // // 2-ESTRATEGIA CACHE WITH NETWORK FALLBACK (then chache it)
  // // Esta estrategia busca primero los archivos en la caché y si no funciona intenta con la red
  // // Algún problema de esta estrategia es que se mezclan archivos de la APP_SHELL con recursos dinamicos
  //
  //   const cacheResponse = caches.match(e.request).then((res) => {
  //     if (res) return res;
  //     // Aquí trabajamos si no existe los archivos en la caché por lo que hay que ir a la web
  //     return fetch(e.request).then((newRes) => {
  //       // Aquí ha logrado encontrar los archivos con la red
  //       // Guardamos entonces los archivos conseguidos por la red en la caché
  //       caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
  //         cache.put(e.request, newRes);
  //         // Con esta función controlamos el límite de archivos guardados en la caché
  //         clearCache(CACHE_DYNAMIC_NAME, CACHE_DYNAMIC_LIMIT);
  //       });
  //       // Hacemos un clon de la respuesta ya que no se puede usar dos veces
  //       return newRes.clone();
  //     });
  //   });
  //   e.respondWith(cacheResponse);
  //
  //
  //
  // // 3-ESTRATEGIA NETWORK WITH CACHE FALLBACK
  // // Esta estrategia primero intenta obtener el recurso por internet, de no conseguirlo lo busca en la caché
  // // Algún problema de esta estrategia es que siempre se va a intentar traer la información mas actualizada
  // // es decir siempre hay un consumo de datos y también es más lenta que la de caché first
  // //
  // const networkResponse = fetch(e.request)
  //   .then((res) => {
  //     // Si no hay respuesta que lo busque en la caché
  //     if (!res) return caches.match(e.request);
  //     // Hacemos una comprobación para no guardar los archivos de static en dynamic
  //     caches.match(e.request).then((res2) => {
  //       if (!res2) {
  //         caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
  //           cache.put(e.request, res);
  //           clearCache(CACHE_DYNAMIC_NAME, CACHE_DYNAMIC_LIMIT);
  //         });
  //       }
  //     });
  //     return res.clone();
  //   })
  //   //Si hay un error que tire de la caché
  //   .catch(() => caches.match(e.request));
  // e.respondWith(networkResponse);
  //
  //
  //
  // // 4-ESTRATEGIA CACHE WITH NETWORK UPDDATE
  // // Esta estrategia se usa cuando el rendimiento es crítico y queremos que la aplicación cargue lo antes posible
  // // Nuestras actualizaciones siempre estarán una versión atrás (Si hubiera un cambio en el index.html, no se veria reflejado)
  // // Hacemos una validación para manejar el boostrap que viene servido por el caché dinámico
  // if (e.request.url.includes('bootstrap')) {
  //   return e.respondWith(caches.match(e.request));
  // }
  // // Suponemos que vamos a trabajar con lo imprescindible de la app
  // const cacheResp = caches.open(CACHE_STATIC_NAME).then((cache) => {
  //   // Hacemos el fetch para obtener la ultima versión que se encuentre en la página
  //   fetch(e.request).then((newResponse) => cache.put(e.request, newResponse));
  //   // Retornamos las peticiones que encontremos en la caché
  //   return cache.match(e.request);
  // });
  // e.respondWith(cacheResp);
  //
  //
  //
  // 5-ESTRATEGIA CACHE & NETWORK RACE
  // Esta estrategia se utiliza para obtener la respuesta más rápida, ya sea de la caché o del network

  const promiseResp = new Promise((resolve, reject) => {
    let rejected = false;
    const failedOneTime = () => {
      if (rejected) {
        if (/\.(png|jpg)$/i.test(e.request.url)) {
          resolve(caches.match('/img/no-img.jpg'));
        } else {
          reject('Response not found');
        }
      } else {
        rejected = true;
      }
    };

    fetch(e.request)
      .then((resp) => (resp.ok ? resolve(resp) : failedOneTime()))
      .catch(failedOneTime);

    caches
      .match(e.request)
      .then((resp) => (resp ? resolve(resp) : failedOneTime()))
      .catch(failedOneTime);
  });
  e.respondWith(promiseResp);
});
