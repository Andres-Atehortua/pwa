if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/sw.js');
}

//PARA EL CONTINUAMIENTO DEL CURSO LO COMENTO. LO DEJO COMO DOCUMENTACIÓN

// if (window.caches) {
//   // Abre la caché con este nombre y si no existe la crea
//   caches.open('prueba-1');
//   caches.open('prueba-2');

//   // Comprobar si una caché existe
//   //   caches.has('prueba-3').then(console.log);

//   // Borrar una chaché
//   //   caches.delete('prueba-1').then(console.log);

//   caches.open('cache-v1.1').then((cache) => {
//     //Añadir un archivo a la caché creada
//     // cache.add('/index.html');
//     //Añadir múltiples archivos a la caché
//     const filesArr = [
//       '/index.html',
//       '/css/style.css',
//       '/img/main.jpg',
//       '/img/main-patas-arriba.jpg',
//       '/js/app.js',
//     ];
//     cache.addAll(filesArr).then(() => {
//       // Para borrar un archivo guardado en la cache
//       //El borrado se hace dentro de la promesa de addAll para que surta efecto
//       // cache.delete('/css/style.css');
//       // Para reemplazar cualquier cosa que se encuentre en el caché
//       // cache.put('/index.html', new Response('Hola mundo'));
//     });

//     // Buscar un archivo en el caché
//     // cache
//     //   .match('/index.html')
//     //   .then((resp) => resp.text())
//     //   .then(console.log);
//   });

//   // Para saber todos los cachés que hay creados usamos lo siguiente
//   caches.keys().then(console.log);
// }
