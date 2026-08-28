'use client';

import React from 'react';
import { 
  CheckCircle2, AlertCircle, Info, AlertTriangle, X 
} from 'lucide-react';
import { useAlertStore } from '@/shared/stores/alertStore';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './dialog';
import { Button } from './button';
import { cn } from '@/shared/utils/cn';

export function AlertOverlay() {
  const { toasts, removeToast, confirm, closeConfirm } = useAlertStore();

  return (
    <>
      {/* Toast Notification Stack - Fixed Bottom Right for PWA feels */}
      <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none md:bottom-6">
        {toasts.map((toast) => {
          return (
            <div
              key={toast.id}
              className={cn(
                "pointer-events-auto flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg transition-all animate-in slide-in-from-bottom-5 duration-200 bg-card border-border text-foreground"
              )}
            >
              {/* Icon map */}
              {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />}
              {toast.type === 'info' && <Info className="h-5 w-5 text-blue-500 shrink-0" />}
              {toast.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />}

              <div className="flex-1 space-y-0.5">
                {toast.title && <div className="text-xs font-bold">{toast.title}</div>}
                <p className="text-xs font-semibold opacity-90 leading-normal">{toast.message}</p>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="opacity-60 hover:opacity-100 shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Global Confirmation Dialog Modal */}
      <Dialog 
        open={!!confirm} 
        onOpenChange={(open) => {
          if (!open) closeConfirm();
        }}
      >
        {confirm && (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-left font-bold">{confirm.title}</DialogTitle>
              <DialogDescription className="text-left mt-2">
                {confirm.message}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={closeConfirm}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  confirm.onConfirm();
                  closeConfirm();
                }}
              >
                Confirm Action
              </Button>
            </DialogFooter>
          </div>
        )}
      </Dialog>
    </>
  );
}
