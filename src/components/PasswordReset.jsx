import React, { useState } from "react";
import { supabase } from "@/lib/supabase";  // Adjust the path if necessary
import { Input } from "@/components/ui/input"; // Assuming you're using your custom input component
import { Button } from "@/components/ui/button"; // Assuming you're using your custom button component
import { toast } from "react-hot-toast";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/update-password`,
});

      if (error) throw error;

      setIsSuccess(true);
      toast.success("Password reset email sent!");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      {isSuccess ? (
        <div className="text-center">
          <p className="mb-4">Check your email for a password reset link.</p>
        </div>
      ) : (
        <div>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4"
          />
          <Button
            onClick={handleResetPassword}
            disabled={isLoading}
            className="w-full mt-4"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PasswordReset;
