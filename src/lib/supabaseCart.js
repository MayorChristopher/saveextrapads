import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";

// Save cart
export const saveCartToSupabase = async (userId, items) => {
  if (!userId) return;
  try {
    const { error } = await supabase
      .from('user_carts')
      .upsert({ user_id: userId, cart_items: items }, { onConflict: ['user_id'] });

    if (error) throw error;

    console.log("Cart saved to Supabase");
  } catch (error) {
    console.error("Error saving cart:", error.message);
    toast.error("Failed to save cart.");
  }
};

// Load cart
export const loadCartFromSupabase = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required to load cart.');
  }

  try {
    const { data, error } = await supabase
      .from('user_carts')
      .select('cart_items')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    return data?.cart_items || [];
  } catch (error) {
    console.error("Error loading cart:", error.message);
    toast.error("Failed to load cart.");
    return [];
  }
};

export async function loadCartOnLogin() {
  const { user } = useAuth.getState();
  const { setItems, items } = useCart.getState();

  if (!user) return;

  try {
    const cartItems = await loadCartFromSupabase(user.id);

    if (Array.isArray(cartItems) && cartItems.length > 0) {
      setItems(cartItems);
    } else {
      setItems([]); // Always sync properly
    }
  } catch (error) {
    console.error('Failed to load cart on login:', error.message);
  }
};


