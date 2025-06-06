// pages/Cart.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { formatCurrency } from "@/lib/formatCurrency";

const Cart = () => {
  const items = useCart((state) => state.items);
  const removeFromCart = useCart((state) => state.removeFromCart);
  const updateQuantity = useCart((state) => state.updateQuantity);

  const { user } = useAuth();

  const total = items.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  return (
    <div>
      <section className="hero-gradient section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Your Cart</h1>
            <p className="text-lg text-gray-600">
              Review your items before checkout
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">
                Your cart is empty
              </h2>
              <Link to="/shop">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-4 flex items-center gap-4 rounded-lg"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600 text-sm">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.id, (item.quantity || 1) - 1)
                        }
                        disabled={(item.quantity || 1) <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">
                        {item.quantity || 1}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.id, (item.quantity || 1) + 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right min-w-[100px]">
                      <div className="font-semibold">
                        {formatCurrency(item.price * (item.quantity || 1))}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button> 
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="glass-card p-6 mt-10 rounded-lg">
                <div className="flex justify-between mb-4">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                <span>{formatCurrency(total)}</span>
                </div>

                <Link to="/checkout">
                  <Button className="w-full mt-6">Proceed to Checkout</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Cart;
