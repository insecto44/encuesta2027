const CACHE_NAME = "encuesta2027-v1";

const FILES_TO_CACHE = [
  "/login.html",
  "/index.html",
  "/css/login.css",
  "/css/style.css",
  "/js/login.js",
  "/js/app.js",
  "/img/logo.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
