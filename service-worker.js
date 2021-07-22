const cacheName = "js13kPWA-v1";
const contentToCache = [
  "/",
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll(contentToCache);
  })());
});

self.addEventListener("fetch", (event) => {
  event.respondWith((async () => {
    // Check if we have cache matching the request
    const request = await caches.match(event.request);
    if (request) {
      return request;
    }

    // Fetch from the server
    const response = await fetch(event.request);
    // Cache the new response
    const cache = await caches.open(cacheName);
    cache.put(event.request, response.clone());

    return response;
  })());
});
