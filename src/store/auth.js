import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { saveCartToSupabase, loadCartFromSupabase } from '@/lib/cartHelpers';
import { useCart } from '@/store/cart';
import { toast } from 'react-hot-toast';

export const useAuth = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false, // 👈 Make it a real state!

      signUp: async (email, password, name) => {
        set({ isLoading: true });

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        });

        set({ isLoading: false });

        if (error) {
          toast.error(error.message);
          throw error;
        } else {
          set({ user: data.user, isAuthenticated: true }); 
          toast.success('Signup successful. Check your email.');
          return data.user;
        }
      },

      signIn: async (email, password) => {
        set({ isLoading: true });
      
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
        set({ isLoading: false });
      
        if (error) {
          toast.error(error.message);
          throw error;
        } else {
          set({ user: data.user, isAuthenticated: true });
          await loadCartOnLogin(); // 👈 CENTRALIZED CALL
          toast.success('Login successful.');
          return data.user;
        }
      },
      

      signOut: async () => {
        const { user } = get();
        const cartItems = useCart.getState().items;

        if (user) {
          await saveCartToSupabase(user.id, cartItems);
        }

        const { error } = await supabase.auth.signOut();

        if (error) {
          toast.error(error.message);
          throw error;
        } else {
          set({ user: null, isAuthenticated: false }); // 👈 Update it
          useCart.getState().clearCart();
          toast.success('Logged out successfully.');
        }
      },

      updateUser: (user) => set({ user, isAuthenticated: !!user }), // 👈 Update here too
    }),
    { name: 'auth-storage' }
  )
);
