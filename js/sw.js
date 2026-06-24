const CACHE_NAME = "songbook-v2";

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request, {
            ignoreSearch: true
        })
        .then(response => response || fetch(event.request))

    );

});


/*self.addEventListener("fetch", event => {

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

}); */
