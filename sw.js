const CACHE = "hub-v1";

self.addEventListener("install", e=>{

e.waitUntil(
caches.open(CACHE)
.then(cache=>cache.addAll([
"./",
"./index.html",
"./manifest.json"
]))
);

});

self.addEventListener("fetch", e=>{

e.respondWith(

caches.match(e.request)
.then(resp=>resp || fetch(e.request))

);

});