import { create } from "zustand";
import { authApi } from "../api/auth.api";

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  fetchProfile: () => Promise<AuthUser | null>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: user => set({ user, isAuthenticated: Boolean(user), isLoading: false }),

  fetchProfile: async () => {
    try {
      const response = await authApi.getProfile();
      const user = (response.data?.user ?? response.data) as AuthUser;
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return null;
    }
  },

  logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),
}));

if (typeof window !== "undefined") {
  window.addEventListener("auth:logout", () => useAuthStore.getState().logout());
}
