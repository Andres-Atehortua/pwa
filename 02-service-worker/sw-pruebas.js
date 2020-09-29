self.addEventListener('fetch', (event) => {
  //ENVIAR UNA RESPUESTA DESDE SERVICE WORKER
  //   event.respondWith(fetch(event.request));
  //ENVIAR UNA RESPUESTA CREADA
  //   if (event.request.url.includes('style.css')) {
  //     let resp = new Response(
  //       `
  //     body{
  //         background-color: blue;
  //         color: red;
  //     }
  //     `,
  //       {
  //         headers: {
  //           'Content-Type': 'text/css',
  //         },
  //       }
  //     );
  //     event.respondWith(resp);
  //   }

  if (event.request.url.includes('jpg')) {
    let resp = fetch('img/main-patas-arriba.jpg');
    event.respondWith(resp);
  }
});
