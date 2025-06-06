import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';
import { saveCartToSupabase } from '@/lib/cartHelpers';
import { useAuth } from '@/store/auth';

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const debouncedSaveCart = debounce((userId, items) => {
  saveCartToSupabase(userId, items);
}, 500);

const isUUIDorNumber = (id) =>
  typeof id === 'number' || (typeof id === 'string' && /^[0-9a-fA-F-]{36}$/.test(id));

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item) => {
        if (!isUUIDorNumber(item.id)) {
          toast.error('Invalid product ID format. Cannot add to cart.');
          console.error('Invalid product ID:', item.id);
          return;
        }
        const existingItem = get().items.find((i) => i.id === item.id);
        let updatedItems;
        const normalizedItem = {
          id: item.id,
          slug: item.slug,
          name: item.name,
          description: item.description || '',
          price: item.price,
          imageUrl: item.imageUrl || '',
          quantity: 1,
        };


        if (existingItem) {
          updatedItems = get().items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          updatedItems = [...get().items, normalizedItem];
        }

        set({ items: updatedItems });
        toast.success('Item added to cart.');

        const user = useAuth.getState().user;
        if (user) debouncedSaveCart(user.id, updatedItems);
      },


      removeFromCart: (id) => {
        const updatedItems = get().items.filter((i) => i.id !== id);
        set({ items: updatedItems });
        toast.success('Item removed from cart.');

        const user = useAuth.getState().user;
        if (user) debouncedSaveCart(user.id, updatedItems);
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        const updatedItems = get().items.map((i) =>
          i.id === id ? { ...i, quantity } : i
        );
        set({ items: updatedItems });

        const user = useAuth.getState().user;
        if (user) debouncedSaveCart(user.id, updatedItems);
      },

      clearCart: () => {
        set({ items: [] });

        const user = useAuth.getState().user;
        if (user) debouncedSaveCart(user.id, []);
      },

      setItems: (items = []) => {
        if (!Array.isArray(items)) {
          console.error('Attempted to set invalid cart items');
          return;
        }

        const sanitizedItems = items
          .filter(item => isUUIDorNumber(item.id))
          .map(item => ({
            id: item.id,
            slug: item.slug,
            name: item.name,
            description: item.description || '',
            price: item.price,
            imageUrl: item.imageUrl || '',
            quantity: item.quantity ?? 1,
          }));

        if (sanitizedItems.length !== items.length) {
          console.warn('Removed invalid cart items during setItems');
          toast.error('Some invalid items were removed from your cart.');
        }

        set({ items: sanitizedItems });
      }

    }),
    { name: 'cart-storage' }
  )
);
