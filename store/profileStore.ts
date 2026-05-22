'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProfileData } from '@/types';

interface ProfileState extends ProfileData {
  setProfile: (data: Partial<Omit<ProfileData, 'avatarInitials'>>) => void;
  clearProfile: () => void;
}

function getInitials(name: string): string {
  if (!name.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      name: '',
      phone: '',
      address: '',
      avatarInitials: '?',

      setProfile: (data) => {
        set((state) => {
          const newName = data.name !== undefined ? data.name : state.name;
          return {
            ...data,
            avatarInitials: getInitials(newName),
          };
        });
      },

      clearProfile: () => {
        set({
          name: '',
          phone: '',
          address: '',
          avatarInitials: '?',
        });
      },
    }),
    {
      name: 'profile-storage',
    }
  )
);
