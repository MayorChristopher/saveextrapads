// lib/orderHelpers.js
import { supabase } from '@/lib/supabase';
import { useCart } from '@/store/cart';
import { useAuth } from '@/store/auth';
import { toast } from 'react-hot-toast';

export const placeOrder = async ({ paymentMethod = 'unspecified', notes = '' } = {}) => {
  const { user } = useAuth.getState();
  const { items, clearCart } = useCart.getState();

  if (!user) {
    toast.error('You must be logged in to place an order.');
    throw new Error('User not authenticated');
  }

  if (items.length === 0) {
    toast.error('Cart is empty.');
    throw new Error('No items in cart');
  }

  // Step 1: Create order record
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert([
      {
        user_id: user.id,
        payment_method: paymentMethod,
        notes,
        status: 'pending',
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (orderError) {
    toast.error('Failed to create order.');
    console.error(orderError);
    throw orderError;
  }

  // Step 2: Insert all order_items
  const orderItemsPayload = items.map((item) => ({
    order_id: orderData.id,
    product_id: item.id, // now a custom string ID
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image_url: item.imageUrl,
    created_at: new Date().toISOString(),
  }));
  

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsPayload);

  if (itemsError) {
    toast.error('Failed to save order items.');
    console.error(itemsError);
    throw itemsError;
  }

  // Step 3: Clear cart after success
  clearCart();
  toast.success('Order placed successfully!');
  return orderData;
};