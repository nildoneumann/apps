const CACHE = "hub-pwa";

// Instala imediatamente
self.addEventListener("install", () => {
    self.skipWaiting();
});

// Assume o controle imediatamente
self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});

// Network First
self.addEventListener("fetch", (event) => {

    // Apenas GET
    if (event.request.method !== "GET") return;

    // Ignora extensões do navegador
    if (!event.request.url.startsWith("http")) return;

    event.respondWith(

        fetch(event.request)

            .then((response) => {

                // Só salva respostas válidas
                if (response.ok) {

                    const copia = response.clone();

                    caches.open(CACHE).then((cache) => {
                        cache.put(event.request, copia);
                    });

                }

                return response;

            })

            .catch(async () => {

                const cache = await caches.match(event.request);

                return cache || Response.error();

            })

    );

});
