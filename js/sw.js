const CACHE_NAME = "songbook-v1";

self.addEventListener("fetch", event => {

    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );

});
