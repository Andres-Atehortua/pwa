self.addEventListener('fetch', (event) => {
  // Respuesta simple
  // const offlineResp = new Response(`
  //       Bienvenido.
  //       Es necesaria conexión a internet para navegar.
  //   `);
  // Respuesta HTML directamente escrita
  //   const offlineResp = new Response(
  //     `
  //   <!DOCTYPE html>
  // <html lang="en">
  //   <head>
  //     <meta charset="UTF-8" />
  //     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  //     <meta http-equiv="X-UA-Compatible" content="ie=edge" />
  //     <title>Mi PWA</title>
  //   </head>
  //   <body class="container p-3">
  //     <h1>Offline Mode</h1>
  //   </body>
  //   </html>
  //   `,
  //     {
  //       headers: {
  //         'Content-Type': 'text/html',
  //       },
  //     }
  //   );
  const offlineResp = fetch('/pages/offline.html');
  const resp = fetch(event.request).catch(() => offlineResp);
  event.respondWith(resp);
});
