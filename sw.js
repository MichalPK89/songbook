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

    }
    catch (err) {

        console.error("DOWNLOAD ERROR:", err);

    }

});
