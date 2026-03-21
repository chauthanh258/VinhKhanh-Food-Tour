import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'OWNER' | 'USER';
}

interface UserState {
  user: User | null;
  token: string | null;
  language: string;
  location: { lat: number; lng: number } | null;
  isOnboarded: boolean;
  
  // Actions
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setLanguage: (lang: string) => void;
  setLocation: (lat: number, lng: number) => void;
  setOnboarded: (status: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: Cookies.get('auth-token') || null,
      language: 'vi',
      location: null,
      isOnboarded: false,

      setAuth: (user, token) => {
        Cookies.set('auth-token', token, { expires: 7 }); // 7 days
        Cookies.set('user-role', user.role, { expires: 7 });
        set({ user, token });
      },
      logout: () => {
        Cookies.remove('auth-token');
        Cookies.remove('user-role');
        set({ user: null, token: null });
      },
      setLanguage: (language) => set({ language }),
      setLocation: (lat, lng) => set({ location: { lat, lng } }),
      setOnboarded: (isOnboarded) => set({ isOnboarded }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
