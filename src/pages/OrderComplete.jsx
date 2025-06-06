import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const OrderComplete = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("completed");

  useEffect(() => {
    // Call Supabase to fetch the order status by token/orderId in URL
    const checkOrderStatus = async () => {
      const orderId = new URLSearchParams(window.location.search).get("orderId");
      if (!orderId) return;

      const { data } = await supabase.from("orders").select("status").eq("id", orderId).single();
      setStatus(data?.status || "unknown");
    };
    checkOrderStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <div className="container-custom py-20">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto text-center">
          <div className="glass-card p-12 rounded-xl">
            <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">
              {status === "completed" ? "Thank You!" : "Order Attempt Logged"}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {status === "completed"
                ? "Your order has been successfully placed."
                : status === "cancelled"
                ? "You cancelled the payment. Your order has been recorded."
                : "There was an issue with your order. Please try again."}
            </p>
            <Button onClick={() => navigate("/shop")} className="w-full md:w-auto">
              Continue Shopping
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};


export default OrderComplete;
