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

