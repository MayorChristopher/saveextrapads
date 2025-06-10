import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { saveCartToSupabase } from '@/lib/cartHelpers';
import { useCart } from './cart';
import { useUI } from './ui';

export const useAuth = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      init: async () => {
        const { data } = await supabase.auth.getSession();
        const user = data?.session?.user ?? null;
        set({ user, isAuthenticated: !!user });

        supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            set({ user: session.user, isAuthenticated: true });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        });
      },

      signUp: async (email, password, name, toast) => {
        set({ isLoading: true });

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: `${window.location.origin}/account`, // or another post-verification path
          },
        });


        set({ isLoading: false });

        if (error) {
          toast({
            title: 'Signup Failed',
            description: error.message,
            variant: 'destructive',
          });
          throw error;
        }

        toast({
          title: 'Account Created',
          description: 'Check your email and confirm your address to activate your account.',
        });

        set({ user: data.user ?? null, isAuthenticated: false });
      },

      signIn: async (email, password, toast) => {
        const { openSignUpModal } = useUI.getState();
        set({ isLoading: true });

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        set({ isLoading: false });

        if (error?.message === 'Invalid login credentials') {
          openSignUpModal();
          toast({
            title: 'Invalid Credentials',
            description: 'Please double-check your email and password.',
            variant: 'destructive',
          });
          throw error;
        }

        if (!data.user?.email_confirmed_at) {
          toast({
            title: 'Email Not Verified',
            description: 'Please verify your email before logging in.',
            variant: 'destructive',
          });
          throw new Error('Email not verified.');
        }

        set({ user: data.user, isAuthenticated: true });
        return data.user;
      },

      signOut: async () => {
        const { user } = get();
        const cartItems = useCart.getState().items;

        if (user) {
          await saveCartToSupabase(user.id, cartItems);
        }

        const { error } = await supabase.auth.signOut();

        if (error) {
          toast({
            title: 'Logout Failed',
            description: error.message,
            variant: 'destructive',
          });
          throw error;
        }

        toast({
          title: 'Logged Out',
          description: 'You have been logged out successfully.',
        });

        set({ user: null, isAuthenticated: false });
        useCart.getState().clearCart();
      },

      updateUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
