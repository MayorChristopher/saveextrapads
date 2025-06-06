import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/store/cart";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = params.get("token"); // PayPal order ID
  const provider = params.get("provider"); // 'paypal' | 'flutterwave'
  const email = params.get("email");
  const name = params.get("name");
  const total = params.get("total");
  const orderId = params.get("orderId"); // Required for Flutterwave tx_ref

  useEffect(() => {
    const verifyPayment = async () => {
      if (!provider || !email || !name || !total ||
        (provider === 'paypal' && !token) ||
        (provider === 'flutterwave' && !orderId)) {
        console.error("Missing verification parameters.");
        navigate("/checkout?error=missing-params");
        return;
      }

      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;

        let captureUrl = "";
        if (provider === "paypal") {
          captureUrl = `${baseUrl}/api/payments/paypal/capture/${token}`;
        } else if (provider === "flutterwave") {
          captureUrl = `${baseUrl}/api/payments/flutterwave/verify/${orderId}`;
        } else {
          console.error("Unsupported provider");
          navigate("/checkout?error=unsupported-provider");
          return;
        }

        const res = await fetch(captureUrl, {
          method: "GET",
        });
        

        let data;
        try {
          data = await res.json();
        } catch (err) {
          console.error("Invalid JSON response");
          throw new Error("Unexpected backend response.");
        }

        if (!res.ok) {
          throw new Error(data.message || "Payment verification failed.");
        }

        if (data.message === "Payment captured and order updated") {
          useCart.getState().clearCart();
          navigate("/order-complete");
        } else {
          console.warn("Unexpected message:", data.message);
          navigate("/checkout?error=payment-status-invalid");
        }
      } catch (err) {
        console.error("Payment verification failed:", err);
        toast({
          title: "Payment Error",
          description: err.message,
          variant: "destructive",
        });
        navigate("/checkout?error=network");
      }
    };

    verifyPayment();
  }, [token, provider, email, name, total, orderId, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold mb-6">Processing Payment...</h1>
      <p className="text-gray-500 mb-4">
        Please wait while we confirm your order.
      </p>
      <Button onClick={() => navigate("/shop")}>Go to Shop</Button>
    </div>
  );
};

export default PaymentSuccess;
