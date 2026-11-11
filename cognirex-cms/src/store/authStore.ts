import { create } from 'zustand';
import { api } from '../utils/api';

export interface CmsUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor';
  avatar: string;
  theme?: 'dark' | 'light';
}

interface AuthState {
  user: CmsUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  theme: 'light' | 'dark';
  loginWithToken: (token: string, user: CmsUser) => void;
  updateUser: (name: string, email: string, avatar: string) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('cognirex_cms_token'),
  isAuthenticated: false,
  isLoading: true,
  theme: (localStorage.getItem('cognirex_cms_theme') as 'light' | 'dark') || 'light',

  loginWithToken: (token, user) => {
    localStorage.setItem('cognirex_cms_token', token);
    const savedTheme = (localStorage.getItem('cognirex_cms_theme') as 'light' | 'dark') || user.theme || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    set({ token, user, isAuthenticated: true, isLoading: false, theme: savedTheme });
  },

  updateUser: (name, email, avatar) => {
    set((state) => ({
      user: state.user ? { ...state.user, name, email, avatar } : null,
    }));
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore network error on sign out
    }
    localStorage.removeItem('cognirex_cms_token');
    set({ token: null, user: null, isAuthenticated: false, isLoading: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('cognirex_cms_token');
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      const response = await api.get('/auth/me');
      if (response.data?.success && response.data?.user) {
        const savedTheme =
          (localStorage.getItem('cognirex_cms_theme') as 'light' | 'dark') ||
          response.data.user.theme ||
          'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        set({
          user: response.data.user,
          token,
          isAuthenticated: true,
          isLoading: false,
          theme: savedTheme,
        });
      } else {
        localStorage.removeItem('cognirex_cms_token');
        set({ token: null, user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      localStorage.removeItem('cognirex_cms_token');
      set({ token: null, user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setTheme: (newTheme) => {
    localStorage.setItem('cognirex_cms_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    set({ theme: newTheme });
  },
}));
