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

self.addEventListener("fetch", event => {

    event.respondWith((async () => {

        const cached = await caches.match(event.request, {
            ignoreSearch: true
        });

        if (cached) {
            console.log("CACHE:", event.request.url);
            return cached;
        }

        console.log("NETWORK:", event.request.url);

        return fetch(event.request);

    })());

});

/* 3. FETCH (tvoja logika, zachovaná) 
self.addEventListener("fetch", event => {

   
    const url = new URL(event.request.url);

    event.respondWith(

        caches.match(event.request, {
            ignoreSearch: true
        })

        .then(response => {

           
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
}); */

self.addEventListener("message", async event => {

    if (!event.data || event.data.type !== "DOWNLOAD_OFFLINE")
        return;

    const book = event.data.book;

    try {

        console.log("Downloading:", book);

        const response = await fetch(`${book}/json/list.json`);
        const songs = await response.json();

        let files = [
            `${book}/index.html`,
            `${book}/songs.html`,
            `${book}/json/list.json`,
            "css/style.css",
            "js/index_test.js",
            "js/songbook_test.js"
        ];

        for (const song in songs) {
            files.push(`${book}/songs/${song}.txt`);
        }

        console.log(files);

        const cache = await caches.open(`songbook-${book}-v1`);

        await cache.addAll(files);

        console.log("Offline cache saved.");

        const clientsList = await self.clients.matchAll();

        for (const client of clientsList) {
        client.postMessage({
            type: "DOWNLOAD_FINISHED",
            book: book
        });
}

    }
    catch (err) {

        console.error("DOWNLOAD ERROR:", err);

    }

});
