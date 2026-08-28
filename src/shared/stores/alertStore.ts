'use client';

import { create } from 'zustand';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

interface ConfirmConfig {
  title: string;
  message: string;
  onConfirm: () => void;
}

interface AlertState {
  toasts: ToastMessage[];
  confirm: ConfirmConfig | null;
  
  // Actions
  showAlert: (message: string, type?: ToastMessage['type'], title?: string) => void;
  removeToast: (id: string) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
  closeConfirm: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  toasts: [],
  confirm: null,

  showAlert: (message, type = 'success', title) => {
    const id = `toast-${Date.now()}`;
    set((state) => ({
      toasts: [...state.toasts, { id, type, title, message }],
    }));

    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  showConfirm: (title, message, onConfirm) => {
    set({
      confirm: { title, message, onConfirm },
    });
  },

  closeConfirm: () => set({ confirm: null }),
}));
