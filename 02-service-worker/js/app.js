// Comprobamos que podamos usar el service worker en nuestro navegador

// 'serviceWorker' in navigator && console.log('Se puede!');

// Tambien de esta forma

navigator.serviceWorker && navigator.serviceWorker.register('/sw.js');
