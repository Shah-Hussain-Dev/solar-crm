'use client';

import { create } from 'zustand';
import { useCRMStore } from './mockDbStore';

interface OfflineState {
  isOffline: boolean;
  setOffline: (offline: boolean) => void;
  syncPending: boolean;
  triggerSync: () => Promise<void>;
}

export const useOfflineStore = create<OfflineState>((set, get) => ({
  isOffline: false,
  syncPending: false,
  setOffline: (offline) => {
    set({ isOffline: offline });
    if (!offline) {
      get().triggerSync();
    }
  },
  triggerSync: async () => {
    const queue = useCRMStore.getState().offlineQueue;
    if (queue.length === 0) return;

    set({ syncPending: true });
    
    // Simulate sync network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    useCRMStore.getState().processOfflineQueue();
    set({ syncPending: false });
  }
}));

// Listen to browser network changes if client-side
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useOfflineStore.getState().setOffline(false);
  });
  window.addEventListener('offline', () => {
    useOfflineStore.getState().setOffline(true);
  });
}
