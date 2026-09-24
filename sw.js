const CACHE_NAME = 'nadi-alwafaa-cache-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './scholarship.html',
  './resources.html',
  './books.html',
  './faculty.html',
  './guidance.html',
  './archive.html',
  './logo.png',
  './manifest.json'
];

// 1. تثبيت وتخزين الصفحات الأساسية
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).catch(() => {})
  );
  self.skipWaiting();
});

// 2. تفعيل وحذف أي كاش قديم تلقائياً
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// 3. جلب البيانات باستراتيجية الشبكة أولاً لضمان حداثة البيانات السحابية
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = event.request.url;

  // استثناء روابط جوجل شيت والذكاء الاصطناعي من الكاش لتبقى حية ولحظية
  if (url.includes('script.google.com') || url.includes('generativelanguage.googleapis.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
