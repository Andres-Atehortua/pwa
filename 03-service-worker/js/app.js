// Detectar si podemos usar Service Workers
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/sw.js').then((register) => {
    // Ejemplo para el sync
    // setTimeout(() => {
    //   register.sync.register('Posteo-de-información');
    //   console.log('Se ha posteado la información');
    // }, 3000);

    // Ejemplo para enviar una notificacion
    Notification.requestPermission().then((result) => {
      console.log(result);
      register.showNotification('Hola amigo mio');
    });
  });
}

if (window.SyncManager) {
}

// fetch('https://reqres.in/api/users')
//   .then((resp) => resp.text())
//   .then((data) => console.log(data));
