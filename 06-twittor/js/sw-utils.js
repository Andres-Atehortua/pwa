// Function to save cache dinamically
const saveDinamicCache = (dynamicCache, req, res) => {
  return res.ok
    ? caches.open(dynamicCache).then((cache) => {
        cache.put(req, res.clone());
        return res.clone();
      })
    : res;
};

// Function to update static cache

const updateStaticCache = (staticCache, req, APP_SHELL_INMUTABLE) =>
  APP_SHELL_INMUTABLE.includes(req.url)
    ? // No hace falta actualizar el inmutable
      console.log('existe en inmutable', req.url)
    : // console.log('actualizando', req.url );
      fetch(req).then((res) => actualizaCacheDinamico(staticCache, req, res));

// Function to clear cache
const clearCache = (cacheName, numberItemsToSave) => {
  caches.open(cacheName).then((cache) =>
    cache.keys().then((keys) => {
      if (keys.length > numberItemsToSave) {
        cache.delete(keys[0]).then(clearCache(cacheName, numberItemsToSave));
      }
    })
  );
};
