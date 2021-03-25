// Function to save cache dinamically
const saveDynamicCache = (dynamicCache, req, res) => {
  return res.ok
    ? caches.open(dynamicCache).then((cache) => {
        cache.put(req, res.clone());
        return res.clone();
      })
    : res;
};

// Function to update static cache

const updateStaticCache = (staticCache, req, APP_SHELL_INMUTABLE) =>
  !APP_SHELL_INMUTABLE.includes(req.url) &&
  fetch(req).then((res) => saveDynamicCache(staticCache, req, res));

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

// Network with cache fallback / update

const handleApiMessages = (cacheName, req) => {
 
  if (req.clone().method === 'POST') {
    if (self.registration.sync) {
      return req
        .clone()
        .text()
        .then((body) => {
          // console.log(body);
          const bodyObj = JSON.parse(body);
          // Aqui deberia guardarse el mensaje en indexdb
          return saveMessage(bodyObj);
        });
    } else {
      return fetch(req);
    }
  } else {
    return fetch(req)
      .then((resp) => {
        if (resp.ok) {
          saveDynamicCache(cacheName, req, resp.clone());
          return resp.clone();
        } else {
          return caches.match(req);
        }
      })
      .catch(() => {
        return caches.match(req);
      });
  }
};
