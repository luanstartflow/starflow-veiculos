import { create } from 'zustand';

interface AuthUser {
  userId: string;
  email: string;
  tenantId: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  tenantSlug: string | null;
  setAuth: (token: string, user: AuthUser, tenantSlug: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const loadFromStorage = () => {
  try {
    const token = localStorage.getItem('gv_token');
    const user = localStorage.getItem('gv_user');
    const tenantSlug = localStorage.getItem('gv_tenant_slug');
    return {
      token,
      user: user ? (JSON.parse(user) as AuthUser) : null,
      tenantSlug,
    };
  } catch {
    return { token: null, user: null, tenantSlug: null };
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  ...loadFromStorage(),

  setAuth: (token, user, tenantSlug) => {
    localStorage.setItem('gv_token', token);
    localStorage.setItem('gv_user', JSON.stringify(user));
    localStorage.setItem('gv_tenant_slug', tenantSlug);
    set({ token, user, tenantSlug });
  },

  logout: () => {
    localStorage.removeItem('gv_token');
    localStorage.removeItem('gv_user');
    localStorage.removeItem('gv_tenant_slug');
    set({ token: null, user: null, tenantSlug: null });
  },

  isAuthenticated: () => !!get().token,
}));
