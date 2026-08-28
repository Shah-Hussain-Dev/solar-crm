'use client';

import { useEffect } from 'react';
import { useAlertStore } from '@/shared/stores/alertStore';

export function RegisterPwa() {
  useEffect(() => {
    // Only register service worker in client-side production environments (or local testing with support)
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('PWA Service Worker registered successfully: ', registration.scope);

          // Check for service worker updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker version is waiting
                  useAlertStore.getState().showConfirm(
                    'App Update Available',
                    'A new version of the CRM has been downloaded. Would you like to reload now to apply updates?',
                    () => {
                      newWorker.postMessage({ type: 'SKIP_WAITING' });
                      window.location.reload();
                    }
                  );
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed: ', error);
        });
    }
  }, []);

  return null;
}
