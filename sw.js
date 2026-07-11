const CACHE_NAME = 'n1-flashcard-v2';
const ASSETS_TO_CACHE = [
  './N1.html',
  './manifest.json',
  './sw.js'
];

// Cài đặt và đưa các file giao diện cốt lõi vào bộ nhớ đệm
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Kích hoạt và dọn dẹp các cache cũ không liên quan
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Phản hồi tài nguyên siêu tốc từ bộ nhớ đệm local trước, mạng internet sau
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});