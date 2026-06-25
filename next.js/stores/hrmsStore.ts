'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'Employee' | 'Manager' | 'HR' | 'Admin';

export interface HrmsState {
  activeRole: UserRole;
  copilotOpen: boolean;
  currentView: string;
  isOnboarding: boolean;
  notificationCount: number;
  setRole: (role: UserRole) => void;
  setCopilotOpen: (open: boolean) => void;
  setCurrentView: (view: string) => void;
  setIsOnboarding: (val: boolean) => void;
  toggleCopilot: () => void;
}

export const useHrmsStore = create<HrmsState>()(
  persist(
    (set) => ({
      activeRole: 'Employee',
      copilotOpen: false,
      currentView: 'home',
      isOnboarding: false,
      notificationCount: 3,
      setRole: (role) => set({ activeRole: role }),
      setCopilotOpen: (open) => set({ copilotOpen: open }),
      setCurrentView: (view) => set({ currentView: view }),
      setIsOnboarding: (val) => set({ isOnboarding: val }),
      toggleCopilot: () => set((s) => ({ copilotOpen: !s.copilotOpen })),
    }),
    {
      name: 'hrms-store',
      partialize: (state) => ({ activeRole: state.activeRole, isOnboarding: state.isOnboarding }),
    }
  )
);
