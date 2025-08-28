// public/sw.js
const CACHE_NAME = "simpro-cache-v1";
const PRECACHE_URLS = [
  "/",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
  // thêm đường dẫn tĩnh khác nếu cần (css, logo, ...)
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // xóa caches cũ nếu muốn
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  // chỉ cache GET
  if (event.request.method !== "GET") return;

  // đơn giản: cache-first cho các tài nguyên đã precache, mạng cho phần còn lại
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((resp) => {
        // tùy chọn: cache lại một số response
        return resp;
      }).catch(() => {
        // nếu request thất bại và có fallback, trả về fallback nếu có
        return caches.match("/");
      });
    })
  );
});
