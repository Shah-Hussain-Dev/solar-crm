'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from './mockDbStore';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchUser: (userId: string, users: User[]) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login: async (email) => {
        // Mock authentication delay
        await new Promise((resolve) => setTimeout(resolve, 600));
        
        // Simple mock matching by email
        // Standard emails seeded: amit@solarflow.com, vikram@solarflow.com, rajesh@solarflow.com, sanjay@solarflow.com
        const resolvedEmail = email.toLowerCase().trim();
        let matchedUser: Partial<User> | null = null;
        
        if (resolvedEmail.includes('amit')) {
          matchedUser = { id: 'usr-1', name: 'Amit Sharma', email: 'amit@solarflow.com', role: 'admin', active: true, avatar: 'AS' };
        } else if (resolvedEmail.includes('vikram')) {
          matchedUser = { id: 'usr-2', name: 'Vikram Singh', email: 'vikram@solarflow.com', role: 'manager', active: true, avatar: 'VS' };
        } else if (resolvedEmail.includes('rajesh')) {
          matchedUser = { id: 'usr-3', name: 'Rajesh Kumar', email: 'rajesh@solarflow.com', role: 'sales', active: true, avatar: 'RK' };
        } else if (resolvedEmail.includes('sanjay')) {
          matchedUser = { id: 'usr-4', name: 'Sanjay Dutt', email: 'sanjay@solarflow.com', role: 'technician', active: true, avatar: 'SD' };
        } else if (resolvedEmail.includes('priya')) {
          matchedUser = { id: 'usr-5', name: 'Priya Patel', email: 'priya@solarflow.com', role: 'sales', active: true, avatar: 'PP' };
        } else {
          // Default to admin for easier testing
          matchedUser = { id: 'usr-1', name: 'Amit Sharma (Admin Demo)', email: email, role: 'admin', active: true, avatar: 'AD' };
        }

        set({
          user: matchedUser as User,
          token: 'mock-jwt-token-xyz',
        });
        return { success: true };
      },
      logout: () => {
        set({ user: null, token: null });
      },
      switchUser: (userId, users) => {
        const found = users.find((u) => u.id === userId);
        if (found) {
          set({ user: found });
        }
      },
    }),
    {
      name: 'solar-crm-auth',
    }
  )
);
