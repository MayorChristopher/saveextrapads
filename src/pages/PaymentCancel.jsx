import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function PaymentCancel() {
  const navigate = useNavigate();

  // At /payment-cancel route
useEffect(() => {
  const cancelOrder = async () => {
    const token = getTokenFromURL(); // Extract PayPal order ID from URL
    const { data: mapping } = await supabase
      .from("paypal_tokens")
      .select("order_id")
      .eq("token", token)
      .single();

    if (mapping?.order_id) {
      await supabase.from("orders").update({
        status: "cancelled",
        failure_reason: "User canceled PayPal payment"
      }).eq("id", mapping.order_id);
    }
  };
  cancelOrder();
}, []);


  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-xl p-8 text-center">
        <AlertTriangle className="text-yellow-500 w-12 h-12 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Order Cancelled</h1>
        <p className="text-gray-600 mb-6">
          You cancelled your payment. Your cart is still intact.
        </p>

        
        <div className="flex justify-center space-x-4">
          <Button onClick={() => navigate("/checkout")}>Try Again</Button>
          <Button variant="outline" onClick={() => navigate("/shop")}>
            Back to Shop
          </Button>
        </div>
      </div>
    </div>
  );
}
