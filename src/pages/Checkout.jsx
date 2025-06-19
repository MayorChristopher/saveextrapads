import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/formatCurrency";
import Spinner from "@/components/Spinner";
import { saveCartToSupabase } from "@/lib/cartHelpers";
import { convertToUSD } from "../lib/convertCurrency";
import { z } from "zod";
import { AlertCircle } from "lucide-react";

const africanCountries = [
  {
    name: "Nigeria",
    cities: ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kaduna", "Abia", "Bayelsa"],
  },
];

const checkoutSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().min(5),
  city: z.string().min(2),
  country: z.string().min(2),
  paymentMethod: z.enum(["paypal", "flutterwave"]),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const cartItems = useCart((state) => state.items);
  const clearCart = useCart((state) => state.clearCart);
  const { user } = useAuth();
  const location = useLocation();
  const [shippingFee, setShippingFee] = useState(0);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!user) {
      toast({
        title: "Please log in to continue",
        description: "Your cart will be saved and restored after login.",
      });

      setTimeout(() => {
        navigate("/auth", {
          state: { from: "/checkout" },
          replace: true,
        });
      }, 1500);
    }
  }, [user]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Nigeria",
    paymentMethod: "paypal",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState([]);

  const getErrorClass = (field) => (errors[field] ? "border-destructive" : "");

  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 1), 0);
  const [total, setTotal] = useState(subtotal + shippingFee);

  useEffect(() => {
    const fetchShippingFee = async () => {
      if (!formData.city || !formData.country) {
        setShippingFee(0);
        return;
      }

      const { data, error } = await supabase
        .from("shipping_fees")
        .select("fee")
        .eq("country", formData.country)
        .eq("city", formData.city)
        .single();

      if (error) {
        console.error("Shipping fee fetch failed:", error.message);
        setShippingFee(0);
        return;
      }

      setShippingFee(Number(data.fee));
    };

    fetchShippingFee();
  }, [formData.city, formData.country]);

  useEffect(() => {
    const computeTotal = async () => {
      const baseTotal = subtotal + shippingFee;
      if (formData.paymentMethod === "paypal") {
        try {
          const converted = await convertToUSD(baseTotal);
          setTotal(converted);
        } catch {
          setTotal(baseTotal);
        }
      } else {
        setTotal(baseTotal);
        toast({
          title: "Conversion Notice",
          description: "Unable to convert to USD. Showing NGN instead.",
          variant: "default"
        });
      }
    };
    computeTotal();
  }, [subtotal, shippingFee, formData.paymentMethod]);

  useEffect(() => {
    const selected = africanCountries.find((c) => c.name === formData.country);
    const updatedCity = selected?.cities.includes(formData.city) ? formData.city : "";

    setCities(selected ? selected.cities : []);
    setFormData((prev) => ({
      ...prev,
      city: updatedCity,
      paymentMethod: formData.country === "Nigeria" ? "flutterwave" : "paypal",
    }));
  }, [formData.country]);

  const validateForm = () => {
    const result = checkoutSchema.safeParse(formData);
    if (result.success) {
      setErrors({});
      return true;
    } else {
      const formatted = {};
      result.error.errors.forEach((err) => {
        formatted[err.path[0]] = err.message;
      });
      setErrors(formatted);
      return false;
    }
  };

  const isValidUUID = (str) =>
    typeof str === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      if (!user) throw new Error("You must be logged in to place an order.");
      await saveCartToSupabase(user.id, cartItems);

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            total_amount: total,
            payment_method: formData.paymentMethod,
            status: "pending",
            failure_reason: null,
            shipping_info: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              city: formData.city,
              country: formData.country,
            },
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map((item) => {
        if (!isValidUUID(item.id)) throw new Error(`Invalid UUID: ${item.id}`);
        return {
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
        };
      });

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) {
        await supabase.from("orders").delete().eq("id", order.id);
        throw itemsError;
      }

      sessionStorage.setItem("order-meta", JSON.stringify({
        email: formData.email,
        name: formData.name,
        total: total.toFixed(2),
        orderId: order.id,
      }));

      if (formData.paymentMethod === "paypal") {
        const res = await fetch(`${baseUrl}/api/payments/paypal`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            total: parseFloat(total.toFixed(2)),
            email: formData.email,
            name: formData.name,
            orderId: order.id,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "PayPal initiation failed.");
        window.location.href = data.link;
        if (!data?.link) throw new Error("Payment link not received.");
        window.location.href = data.link;
      }

      if (formData.paymentMethod === "flutterwave") {
        const res = await fetch(`${baseUrl}/api/payments/flutterwave`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            total: parseFloat(total.toFixed(2)),
            email: formData.email,
            name: formData.name,
            orderId: order.id,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Flutterwave initiation failed.");
        window.location.href = data.link;
        if (!data?.link) throw new Error("Payment link not received.");
        window.location.href = data.link;
      }

    } catch (error) {
      console.error("Checkout error:", error);
      toast({ title: "Checkout Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-secondary to-background">
      {/* Fixed banner at the top */}
      <div className="fixed top-0 left-0 right-0 bg-yellow-100 text-black p-4 rounded-b-md flex items-center justify-between z-50">
        {/* Adding the warning icon */}
        <AlertCircle className="text-yellow-600 mr-2" size={20} />
        <span>
          {formData.country === "Nigeria" ? (
            <>
              You are checking out from <strong>Nigeria</strong>. Your payment method is set to{" "}
              <strong>Flutterwave (₦ NGN)</strong>. Shipping fees are based on your selected Nigerian city.
            </>
          ) : (
            <>
              You are checking out from <strong>{formData.country}</strong>. Your payment method is set to{" "}
              <strong>PayPal ($ USD)</strong>. Shipping fees are location-based and will be converted to USD.
            </>
          )}
        </span>
      </div>
      {/* Main content below the fixed banner */}
      <div className="container-custom py-20 pt-32"> {/* Added pt-32 to create space for the fixed banner */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Login notice banner with icon */}
          {!user && (
            <div className="bg-yellow-100 p-4 rounded text-center mb-6 flex items-center">
              <AlertCircle className="text-yellow-600 mr-2" size={20} />
              Please log in to complete your purchase. Your cart will be saved.
            </div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 120 }}>
            <div className="glass-card p-8 rounded-xl">
              <h2 className="text-2xl font-bold mb-6">Checkout</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={getErrorClass("name")} />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}

                <Input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={getErrorClass("email")} />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}

                <Input type="tel" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={getErrorClass("phone")} />
                {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}

                <Input placeholder="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={getErrorClass("address")} />
                {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}

                <div className="grid grid-cols-2 gap-4">
                  <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                    <SelectTrigger className={getErrorClass("country")}>
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {africanCountries.map((country) => (
                        <SelectItem key={country.name} value={country.name}>{country.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })} disabled={!formData.country}>
                    <SelectTrigger className={getErrorClass("city")}>
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
                  <SelectTrigger><SelectValue placeholder="Select Payment Method" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paypal">PayPal (USD)</SelectItem>
                    <SelectItem value="flutterwave">Flutterwave (NGN)</SelectItem>
                  </SelectContent>
                </Select>

                <Button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2">
                  {isLoading ? (<><Spinner /> Processing...</>) : "Place Order"}
                </Button>
              </form>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="glass-card p-8 rounded-xl">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <span>{formatCurrency(item.price, formData.paymentMethod === "paypal" ? "USD" : "NGN")}</span>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal, formData.paymentMethod === "paypal" ? "USD" : "NGN")}</span></div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{formatCurrency(shippingFee, formData.paymentMethod === "paypal" ? "USD" : "NGN")}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(total, formData.paymentMethod === "paypal" ? "USD" : "NGN")}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
