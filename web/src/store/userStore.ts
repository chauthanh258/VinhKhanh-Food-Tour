import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  role: 'ADMIN' | 'OWNER' | 'USER';
  language: string;
  isOnboarded: boolean;
}

interface UserState {
  user: User | null;
  token: string | null;
  language: string;
  isOnboarded: boolean;
  
  // Actions
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setLanguage: (lang: string) => void;
  setOnboarded: (status: boolean) => void;
  updateUser: (user: Partial<User>) => void;
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
        Cookies.set('auth-token', token, { expires: 7 });
        Cookies.set('user-role', user.role, { expires: 7 });
        set({ user, token, language: user.language, isOnboarded: user.isOnboarded });
      },
      logout: () => {
        Cookies.remove('auth-token');
        Cookies.remove('user-role');
        set({ user: null, token: null, isOnboarded: false });
      },
      setLanguage: (language) => set({ language }),
      setOnboarded: (isOnboarded) => set({ isOnboarded }),
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null,
        language: userData.language || state.language,
        isOnboarded: userData.isOnboarded !== undefined ? userData.isOnboarded : state.isOnboarded
      })),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
