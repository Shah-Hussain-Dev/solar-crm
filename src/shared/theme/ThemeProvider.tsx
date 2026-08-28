'use client';

import React, { useEffect } from 'react';
import { useCRMStore } from '../stores/mockDbStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const branding = useCRMStore((state) => state.branding);

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply primary color
    root.style.setProperty('--primary', branding.primaryColor);
    
    // Apply secondary color
    root.style.setProperty('--secondary', branding.secondaryColor);
    
    // Apply accent color
    root.style.setProperty('--accent', branding.accentColor);
    
    // Apply border radius
    root.style.setProperty('--radius', branding.borderRadius);
  }, [branding]);

  return <>{children}</>;
}
