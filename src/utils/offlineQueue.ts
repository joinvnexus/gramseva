const DB_NAME = 'gramseva-offline';
const DB_VERSION = 1;
const STORE_NAME = 'pending-requests';

export interface PendingRequest {
  id?: number;
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: FormData | string | null;
  status: 'pending' | 'syncing' | 'failed';
  createdAt: string;
  updatedAt: string;
}

function openDB(): Promise<IDBDatabase> {
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

export async function addToQueue(request: Omit<PendingRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<number> {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const requestData: PendingRequest = {
      ...request,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const addRequest = store.add(requestData);
    addRequest.onsuccess = () => resolve(addRequest.result as number);
    addRequest.onerror = () => reject(addRequest.error);
  });
}

export async function getQueue(): Promise<PendingRequest[]> {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getQueueItem(id: number): Promise<PendingRequest | undefined> {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function updateQueueStatus(id: number, status: 'pending' | 'syncing' | 'failed'): Promise<void> {
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
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      } else {
        resolve();
      }
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
}

export async function clearQueue(): Promise<void> {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function removeFromQueue(id: number): Promise<void> {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function processQueue(): Promise<{ success: number; failed: number }> {
  const items = await getQueue();
  let success = 0;
  let failed = 0;
  
  for (const item of items) {
    if (item.status !== 'pending' || !item.id) continue;
    
    await updateQueueStatus(item.id, 'syncing');
    
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
        await removeFromQueue(item.id);
        success++;
      } else {
        await updateQueueStatus(item.id, 'failed');
        failed++;
      }
    } catch (error) {
      console.error('Failed to sync item:', item.id, error);
      await updateQueueStatus(item.id, 'failed');
      failed++;
    }
  }
  
  return { success, failed };
}

export function registerSync(): void {
  if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
    navigator.serviceWorker.ready.then(registration => {
      (registration as any).sync.register('sync-report').catch((err: Error) => {
        console.error('Background Sync registration failed:', err);
      });
    });
  }
}

export function triggerManualSync(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      (registration as any).sync.register('sync-report').catch((err: Error) => {
        console.error('Manual sync failed:', err);
      });
    });
  }
}