const CACHE_NAME = "songbook-v3";

/* 1. INSTALL */
self.addEventListener("install", event => {

    console.log("SW: install");

    self.skipWaiting(); // okamžitá aktivácia

});

/* 2. ACTIVATE */
self.addEventListener("activate", event => {

    console.log("SW: activate");

    event.waitUntil(
        clients.claim() // okamžite preberie kontrolu nad stránkami
    );

});

/* 3. FETCH (tvoja logika, zachovaná) */
self.addEventListener("fetch", event => {

    console.log("========== FETCH ==========");
    console.log("Request URL:", event.request.url);

    const url = new URL(event.request.url);

    event.respondWith(

        caches.match(event.request, {
            ignoreSearch: true
        })

        .then(response => {

            console.log("Cache hit:", !!response);

            if (response) {
                return response;
            }

            return fetch(event.request);

        })

        .catch(err => {
            console.error("SW ERROR:", err);
            throw err;
        })

    );
});
