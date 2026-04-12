const CACHE_NAME = 'gramseva-v1';
const DB_NAME = 'gramseva-offline';
const DB_VERSION = 1;
const STORE_NAME = 'pending-requests';

const urlsToCache = [
  '/',
  '/services',
  '/reports',
  '/market',
  '/offline.html'
];

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

async function getAllFromQueue() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function deleteFromQueue(id: number) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

async function updateQueueItem(id: number, status: string) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const getRequest = store.get(id);
    getRequest.onsuccess = () => {
      const data = getRequest.result;
      if (data) {
        data.status = status;
        data.updatedAt = new Date().toISOString();
        const putRequest = store.put(data);
        putRequest.onsuccess = () => resolve(true);
        putRequest.onerror = () => reject(putRequest.error);
      }
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
}

async function processQueue() {
  const items = await getAllFromQueue() as Array<{
    id: number;
    url: string;
    method: string;
    headers: Record<string, string>;
    body: FormData | string | null;
    status: string;
  }>;

  for (const item of items) {
    if (item.status !== 'pending') continue;
    
    await updateQueueItem(item.id, 'syncing');
    
    try {
      const options: RequestInit = {
        method: item.method,
        headers: item.headers,
      };
      
      if (item.body && item.method !== 'GET') {
        options.body = item.body as BodyInit;
      }
      
      const response = await fetch(item.url, options);
      
      if (response.ok) {
        await deleteFromQueue(item.id);
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'SYNC_COMPLETE',
              id: item.id,
              success: true
            });
          });
        });
      } else {
        await updateQueueItem(item.id, 'failed');
      }
    } catch (error) {
      console.error('Sync error for item:', item.id, error);
      await updateQueueItem(item.id, 'failed');
    }
  }
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

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
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method === 'POST' && event.request.url.includes('/api/reports')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          return response;
        })
        .catch(async () => {
          const formData = await event.request.clone().formData();
          const headers: Record<string, string> = {};
          event.request.headers.forEach((value, key) => {
            headers[key] = value;
          });
          
          const db = await openDB();
          const transaction = db.transaction(STORE_NAME, 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          
          const requestData = {
            url: event.request.url,
            method: event.request.method,
            headers: headers,
            body: formData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          store.add(requestData);
          
          return new Response(JSON.stringify({
            success: false,
            offline: true,
            message: 'রিপোর্ট অফলাইনে সংরক্ষিত হয়েছে'
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
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
            return caches.match('/offline.html');
          });
      })
  );
});

self.addEventListener('sync', event => {
  if (event.tag === 'sync-report') {
    event.waitUntil(processQueue());
  }
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'TRIGGER_SYNC') {
    event.waitUntil(processQueue());
  }
});