const CACHE_NAME = "sci-protocol-cache-v1";

const APP_ASSETS = [

  "./",
  "./index.html",
  "./app.html",

  "./css/main.css",
  "./css/layout.css",
  "./css/tree.css",

  "./js/protocol-data.js",
  "./js/protocol-engine.js",
  "./js/tree-engine.js",
  "./js/canvas-controls.js",
  "./js/minimap.js",
  "./js/ui-controller.js",

  "./manifest.json",

  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"

];



self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(APP_ASSETS);
      })

  );

});



self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(cacheNames => {

      return Promise.all(

        cacheNames.map(name => {

          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }

        })

      );

    })

  );

});



self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request)
      .then(response => {

        if (response) {
          return response;
        }

        return fetch(event.request)
          .then(networkResponse => {

            return caches.open(CACHE_NAME)
              .then(cache => {

                cache.put(event.request, networkResponse.clone());

                return networkResponse;

              });

          });

      })

  );

});