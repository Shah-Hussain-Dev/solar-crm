'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/shared/theme/ThemeProvider';
import { AlertOverlay } from '@/shared/components/ui/AlertOverlay';
import { RegisterPwa } from '@/shared/pwa/RegisterPwa';
import { PwaInstallPrompt } from '@/shared/pwa/PwaInstallPrompt';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000, // 5 minutes cache
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
        <AlertOverlay />
        <RegisterPwa />
        <PwaInstallPrompt />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
