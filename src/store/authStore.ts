import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/auth.types';
import { supabase } from '../lib/supabaseClient';

export type UserMode = 'client' | 'provider';

interface AuthStore {
  user: (User & { mode: UserMode }) | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User & { mode: UserMode }, token: string) => void;
  updateUser: (updates: Partial<User & { mode: UserMode }>) => void;
  toggleMode: () => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },
      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null
        }));
      },
      toggleMode: () => {
        set((state) => ({
          user: state.user
            ? { ...state.user, mode: state.user.mode === 'client' ? 'provider' : 'client' }
            : null
        }));
      },
      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, token: null, isAuthenticated: false });
      },
      initialize: async () => {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          // Retry profile fetch up to 3 times to handle post-signup race conditions
          // (signUp fires SIGNED_IN event before our profile upsert completes)
          let profile: any = null;
          for (let attempt = 0; attempt < 3; attempt++) {
            const { data } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (data) { profile = data; break; }
            if (attempt < 2) await new Promise(r => setTimeout(r, 600));
          }

          // Fallback: upsert a profile so the user is never stuck
          if (!profile) {
            const fallbackRole = (session.user.user_metadata?.role as string) || 'client';
            const { data: upserted } = await supabase
              .from('profiles')
              .upsert({
                id: session.user.id,
                email: session.user.email,
                full_name: session.user.user_metadata?.full_name || 'User',
                role: fallbackRole,
              }, { onConflict: 'id' })
              .select()
              .single();
            profile = upserted;
          }

          const role = profile?.role || 'client';
          const user: User & { mode: UserMode } = {
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.full_name || 'User',
            role,
            avatar: profile?.avatar_url || '',
            mode: (role === 'business' || role === 'admin' ? 'provider' : 'client') as UserMode
          };

          set({ user, token: session.access_token, isAuthenticated: true });
        }

        // Auth state listener
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_OUT') {
            set({ user: null, token: null, isAuthenticated: false });
            return;
          }

          // SIGNED_IN: only hydrate store if it's empty (page refresh / direct link).
          // When a user actively logs in, the login/signup page calls setAuth() FIRST
          // with the correct role+mode, so we must NOT override it here.
          if (event === 'SIGNED_IN' && session && !get().isAuthenticated) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            const role = profile?.role || 'client';
            const user: User & { mode: UserMode } = {
              id: session.user.id,
              email: session.user.email || '',
              name: profile?.full_name || 'User',
              role,
              avatar: profile?.avatar_url || '',
              mode: (role === 'business' || role === 'admin' ? 'provider' : 'client') as UserMode
            };

            set({ user, token: session.access_token, isAuthenticated: true });
          }

          // Silently refresh token without touching user/role data
          if (event === 'TOKEN_REFRESHED' && session && get().isAuthenticated) {
            set({ token: session.access_token });
          }
        });
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);
