const CACHE_NAME = 'gramseva-v1';
const urlsToCache = [
  '/',
  '/services',
  '/reports',
  '/market',
  '/offline.html'
];

// ইনস্টল ইভেন্ট
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// ফেচ ইভেন্ট - অফলাইন ফার্স্ট স্ট্র্যাটেজি
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // ক্যাশে পেলে রিটার্ন
        if (response) {
          return response;
        }
        // না হলে নেটওয়ার্ক থেকে ফেচ
        return fetch(event.request)
          .then(response => {
            // ভ্যালিড রেসপন্স ক্যাশে করুন
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          })
          .catch(() => {
            // অফলাইন পেজ দেখান
            return caches.match('/offline.html');
          });
      })
  );
});

// অ্যাক্টিভেট ইভেন্ট - পুরনো ক্যাশ ক্লিয়ার
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});