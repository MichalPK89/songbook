const CACHE_NAME = "songbook-moderne-v1";

self.addEventListener("fetch", event => {

    console.log("========== FETCH ==========");
    console.log("Request URL:", event.request.url);

    const url = new URL(event.request.url);

    event.respondWith(

        caches.match(event.request, {
            ignoreSearch: true
        })

        .then(response => {

            console.log(
                "Cache hit:",
                response ? "YES" : "NO"
            );

            if (response) {

                console.log("Serving from cache");

                return response;
            }

            console.log("Fetching from network");

            return fetch(event.request);

        })

        .catch(error => {

            console.error("SW ERROR:", error);

            throw error;

        })

    );

});

/*
self.addEventListener("fetch", event => {

    if (!event || !event.request) return;

    console.log("REQUEST:", event.request.url);

    const url = new URL(event.request.url);
    const cleanPath = url.pathname.split("?")[0];



    // songs page fix
    if (cleanPath.endsWith("/songs.html")) {

        event.respondWith(
            caches.match(cleanPath)
                .then(res => res || fetch(event.request))
        );

        return;
    }

    event.respondWith(
        caches.match(event.request.url.split("?")[0])
            .then(res => res || fetch(event.request))
    );
});*/

