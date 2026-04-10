// IndexedDB হেল্পার ইউটিলিটি

const DB_NAME = 'gramseva';
const DB_VERSION = 1;
const STORES = {
  REPORTS: 'reports',
  NOTIFICATIONS: 'notifications',
  SERVICES: 'services',
};

interface OfflineReport {
  id: string;
  problemType: string;
  description: string;
  lat?: number;
  lng?: number;
  imageUrl?: string;
}

let db: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      
      if (!database.objectStoreNames.contains(STORES.REPORTS)) {
        database.createObjectStore(STORES.REPORTS, { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains(STORES.NOTIFICATIONS)) {
        database.createObjectStore(STORES.NOTIFICATIONS, { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains(STORES.SERVICES)) {
        database.createObjectStore(STORES.SERVICES, { keyPath: 'id' });
      }
    };
  });
}

export async function saveOffline<T>(storeName: string, data: T & { id: string }): Promise<void> {
  const database = await openDB();
  const transaction = database.transaction(storeName, 'readwrite');
  const store = transaction.objectStore(storeName);
  store.put(data);
}

export async function getOffline<T>(storeName: string, id: string): Promise<T | null> {
  const database = await openDB();
  const transaction = database.transaction(storeName, 'readonly');
  const store = transaction.objectStore(storeName);
  
  return new Promise((resolve, reject) => {
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllOffline<T>(storeName: string): Promise<T[]> {
  const database = await openDB();
  const transaction = database.transaction(storeName, 'readonly');
  const store = transaction.objectStore(storeName);
  
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteOffline(storeName: string, id: string): Promise<void> {
  const database = await openDB();
  const transaction = database.transaction(storeName, 'readwrite');
  const store = transaction.objectStore(storeName);
  store.delete(id);
}

export async function clearOffline(storeName: string): Promise<void> {
  const database = await openDB();
  const transaction = database.transaction(storeName, 'readwrite');
  const store = transaction.objectStore(storeName);
  store.clear();
}

export async function syncOfflineData(): Promise<void> {
  const offlineReports = await getAllOffline<OfflineReport>(STORES.REPORTS);
  
  for (const report of offlineReports) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(report),
      });
      
      if (response.ok) {
        await deleteOffline(STORES.REPORTS, report.id);
      }
    } catch (error) {
      console.error('Sync failed for report:', report.id, error);
    }
  }
}