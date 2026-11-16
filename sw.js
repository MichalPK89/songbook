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

    console.log("FETCH:", event.request.url);

    console.log(
    "MODE:",
    event.request.mode,
    "URL:",
    event.request.url
    );
    
    const url = new URL(event.request.url);
/*
 // INDEX.HTML - network first, cache fallback
    if (url.pathname.endsWith("/index.html")) {

        event.respondWith(
            fetch(event.request)
                .then(async response => {

                    if (response.ok) {

                        console.log("INDEX FROM NETWORK");

                        // Update the cached index.html
                        const book = url.pathname.includes("/moderne/")
                            ? "moderne"
                            : "krestanske";

                        const cache = await caches.open(`songbook-${book}-v1`);

                        await cache.put(event.request, response.clone());
                    }

                    return response;

                })
                .catch(async error => {

                    console.log("INDEX NETWORK FAILED - USING CACHE");

                    const response = await caches.match(event.request);

                    if (response) {
                        return response;
                    }

                    throw error;

                })
        );

        return;
    }

*/

    
    // navigácia na songs.html?id=...
    if (url.pathname.endsWith("/songs.html")) {

        event.respondWith(
            caches.match(event.request.url.split("?")[0])
                .then(response => {

                    if (response) {
                        console.log("SONGS FROM CACHE");
                        return response;
                    }

                    console.log("SONGS FROM NETWORK");
                    return fetch(event.request);

                })
        );

        return;
    }


    // ostatné súbory
    event.respondWith(

        caches.match(event.request)

        .then(response => {

            if (response) {
                return response;
            }

            return fetch(event.request);

        })

    );

});

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
            "css/index.css",
            "js/index.js",
            "js/songbook.js"
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
