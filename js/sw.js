const CACHE_NAME = "songbook-v3";

self.addEventListener("fetch", event => {

    if (!event || !event.request) return;

    const url = new URL(event.request.url);
    const cleanPath = url.pathname.split("?")[0];

    console.log("FETCH:", event.request.url);

    // songs page fix
    if (cleanPath.endsWith("/songs.html")) {

        event.respondWith(
            caches.match(cleanPath)
                .then(res => res || fetch(event.request))
        );

        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(res => res || fetch(event.request))
    );
});
