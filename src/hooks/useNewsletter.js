import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { isValidEmail, subscribeUser } from "@/lib/subscribe";

export function useNewsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    const trimmedEmail = email.trim();
    setError(null);

    if (!isValidEmail(trimmedEmail)) {
      toast({
        title: "Invalid email address",
        description: "Please enter a valid email before subscribing.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const result = await subscribeUser(trimmedEmail);
    setLoading(false);

    if (result.success) {
      toast({
        title: "You're subscribed!",
        description: "Thank you for subscribing to SaveExtraPad.",
      });
      setSubscribed(true);
      setEmail("");
    } else if (result.error) {
      const isDuplicate = result.error.toLowerCase().includes("already subscribed");
      toast({
        variant: "destructive",
        title: isDuplicate ? "Email Already Subscribed" : "Subscription Failed",
        description: result.error,
      });
      setError(result.error);
    } else {
      toast({
        variant: "destructive",
        title: "Subscription error",
        description: "Unexpected error occurred.",
      });
      setError("Unexpected error occurred.");
    }
  };

  return {
    email,
    setEmail,
    loading,
    subscribed,
    error,
    handleSubscribe,
  };
}
