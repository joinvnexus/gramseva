'use client';

export interface PendingRequest {
  id?: number;
  url?: string;
  endpoint?: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  status?: string;
  timestamp?: number;
}

const QUEUE_KEY = 'gramseva_offline_queue';

export function addToQueue(request: PendingRequest): void {
  if (typeof window === 'undefined') return;
  try {
    const queue = getQueue();
    queue.push({ ...request, id: Date.now() });
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error('Failed to add to queue:', e);
  }
}

export function getQueue(): PendingRequest[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function updateQueueStatus(id: number, status: string): void {
  if (typeof window === 'undefined') return;
  try {
    const queue = getQueue();
    const index = queue.findIndex((_, i) => i === id);
    if (index >= 0) {
      (queue[index] as { status?: string }).status = status;
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    }
  } catch (e) {
    console.error('Failed to update queue:', e);
  }
}

export function removeFromQueue(id: number): void {
  if (typeof window === 'undefined') return;
  try {
    const queue = getQueue();
    queue.splice(id, 1);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error('Failed to remove from queue:', e);
  }
}

export async function processQueue(): Promise<{ success: number; failed: number }> {
  const queue = getQueue();
  let success = 0;
  let failed = 0;

  for (const request of queue) {
    try {
      const url = request.url || request.endpoint;
      if (!url) {
        failed++;
        continue;
      }
      const res = await fetch(url, {
        method: request.method,
        headers: { 'Content-Type': 'application/json' },
        body: request.body ? JSON.stringify(request.body) : undefined,
      });
      if (res.ok) success++;
      else failed++;
    } catch {
      failed++;
    }
  }

  if (success > 0) {
    localStorage.setItem(QUEUE_KEY, JSON.stringify([]));
  }

  return { success, failed };
}

export function registerSync(): void {
  if ('serviceWorker' in navigator && 'sync' in window) {
    navigator.serviceWorker.ready.then((reg) => {
      (reg as unknown as { sync: { register: (name: string) => Promise<void> } })
        .sync.register('offline-sync')
        .catch(() => {});
    });
  }
}