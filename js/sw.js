const CACHE_NAME = "songbook-v3";

self.addEventListener("fetch", event => {

    const url = new URL(event.request.url);

    if (url.pathname.endsWith("songs.html")) {

        console.log("Song page:", event.request.url);

        event.respondWith(

            caches.match(event.request.url.split("?")[0])
                .then(response => {

                    console.log("Found:", response);

                    return response || fetch(event.request);

                })

        );

        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );

});

/*
self.addEventListener("fetch", event => {

    const url = new URL(event.request.url);

    // všetky songs.html?id=...
    if (url.pathname.endsWith("songs.html")) {

        event.respondWith(
            caches.match("songs.html")
                .then(response => response || fetch("songs.html"))
        );

        return;
    }

    // ostatné súbory
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );

});    */
