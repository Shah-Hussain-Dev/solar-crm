'use client';

import React from 'react';
import { AppShell } from '../shell/AppShell';

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
