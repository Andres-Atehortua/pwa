// FORMA NATIVA DE EMPEZAR A TRABAJAR CON INDEXDB - DEJO COMO DOCUMENTACIÓN

// indexedDB: Reforzamiento

let request = window.indexedDB.open('my-database', 1);

// Se actualiza cuando se crea o se sube la versión de la base de datos

request.onupgradeneeded = (event) => {
  console.log('Actualización de BBDD');
  // Referencia a la base de datos
  let db = event.target.result;
  db.createObjectStore('heroes', {
    keyPath: 'id',
  });
};

// Manejo de errores

request.onerror = (event) => {
  console.log('DB: Error', event.target.error);
};

// Insertar datos
request.onsuccess = (event) => {
  let db = event.target.result;
  let heroesData = [
    { id: 1, name: 'Iron Man', mensaje: 'Hola amigo mio' },
    { id: 2, name: 'Hulk', mensaje: 'Adios amigo nuestro' },
  ];

  let heroesTransaction = db.transaction('heroes', 'readwrite');
  heroesTransaction.onerror = (event) => {
    console.log('Error al guardar', event.target.error);
  };

  // Informa sobre el éxito de la transacción
  heroesTransaction.oncomplete = (event) => {
    console.log('Transacción hecha', event);
  };

  let heroesStore = heroesTransaction.objectStore('heroes');

  heroesData.forEach((heroe) => heroesStore.add(heroe));

  heroesStore.onsuccess = (event) => {
    console.log('Nuevo item añadido a la base de datos', event);
  };
};
