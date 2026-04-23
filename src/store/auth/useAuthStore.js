import { create } from 'zustand';
import { STORAGE_KEYS } from '@/lib/constants';

function readSession() {
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const userValue = localStorage.getItem(STORAGE_KEYS.USER);

  if (!accessToken || !userValue) {
    return {
      user: null,
      accessToken: null,
    };
  }

  try {
    return {
      user: JSON.parse(userValue),
      accessToken,
    };
  } catch {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);

    return {
      user: null,
      accessToken: null,
    };
  }
}

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isHydrated: false,
  setSession: ({ user, accessToken }) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    set({ user, accessToken, isHydrated: true });
  },
  clearSession: () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    set({ user: null, accessToken: null, isHydrated: true });
  },
  hydrate: () => {
    set({
      ...readSession(),
      isHydrated: true,
    });
  },
}));
