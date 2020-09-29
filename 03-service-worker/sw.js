// Ciclo de vida del SW

self.addEventListener('install', (event) => {
  // Descargar assets
  // Crear un caché
  console.log('SW: Instalando service worker');

  // Con esto hacemos que el SW tome el control de la app inmediatamente después de modificarlo.
  // sin necesidad de recargar la página o cerrarla y volverla a abrir
  // es mejor no tenerlo de esta forma por posibles pérdidas de información.
  //   self.skipWaiting();

  const instalacion = new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('SW2: Instalaciones terminadas');
      self.skipWaiting();
      resolve();
    }, 1);
  });

  // waitUntil() nos sirve para que espere hasta que una promesa sea resuelta para que continúe con el
  // siguiente paso, que sería la activación
  event.waitUntil(instalacion);
});

// Cuando el SW toma el control de la aplicación

self.addEventListener('activate', (event) => {
  // Borrar caché antiguo
  console.log('SW: Activo y listo para controlar la app');
});

// Fetch, manejo de peticiones HTTPS

self.addEventListener('fetch', (event) => {
  // Aplicar estrategias del caché
  //   console.log('SW: ', event.request.url);
  //   if (event.request.url.includes('/api/users')) {
  //     const resp = new Response(`{ok: false, message: 'Error fatal'}`);
  //     event.respondWith(resp);
  //   }
});

//SYNC, cuando recuperamos la conexión a internet
self.addEventListener('sync', (event) => {
  console.log('SW: Tenemos conexión');
  console.log(event);
  console.log(event.tag);
});

//Push, maneja las push notification

self.addEventListener('push', (event) => {
  console.log('SW: Notificación recibida');
});
