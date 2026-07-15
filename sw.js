const CACHE_NAME = "hub-v2"; // Mude a versão aqui (ex: v1 para v2) quando alterar o app
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json"
];

// Instalação: Salva os arquivos e força a ativação imediata
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting()) // Força o novo Service Worker a virar o ativo
  );
});

// Ativação: Limpa caches antigos automaticamente
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // Deleta o cache da versão anterior
          }
        })
      );
    }).then(() => self.clients.claim()) // Assume o controle da página imediatamente
  );
});

// Interceptação: Estratégia Cache-First
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request)
      .then(resp => resp || fetch(e.request))
  );
});