import { supabase } from "@/lib/supabase";
import { useCart } from '@/store/cart';
import { useAuth } from '@/store/auth';
import { toast } from 'react-hot-toast';

// Save cart to Supabase
export const saveCartToSupabase = async (userId, items) => {
  try {
    const { error } = await supabase
      .from('user_carts') // ✅ unified to 'user_carts'
      .upsert({ user_id: userId, cart_items: items }, { onConflict: ['user_id'] });

    if (error) {
      throw error;
    }

    console.log('Cart saved successfully!');
  } catch (error) {
    console.error('Error saving cart:', error.message);
    toast.error('Failed to save cart.');
  }
};

// Load cart from Supabase
export async function loadCartFromSupabase(userId) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("user_carts") // ✅ unified to 'user_carts'
    .select("cart_items")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error('Error loading cart:', error.message);
    toast.error('Failed to load cart.');
    return [];
  }

  return data?.cart_items || [];
}

// Load cart when user logs in
export async function loadCartOnLogin() {
  const { user } = useAuth.getState();
  const { setItems, items } = useCart.getState();
 


  if (!user) return;
  if (items.length > 0) return; // Already loaded

  const cartItems = await loadCartFromSupabase(user.id);
  console.log("Cart items loaded from Supabase:", cartItems);

  if (cartItems.length > 0) {
    setItems(cartItems);
  }
}
