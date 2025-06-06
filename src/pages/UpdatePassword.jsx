import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import zxcvbn from "zxcvbn";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get("access_token");
    if (!token) {
      toast.error("Invalid or expired reset link");
      navigate("/auth");
      return;
    }
    setAccessToken(token);
  }, [navigate]);

  const handlePasswordUpdate = async () => {
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const strength = zxcvbn(password);
    if (strength.score < 3) {
      toast.error("Password is too weak. Try making it longer and more complex.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password }, { accessToken });
      if (error) throw error;

      setSuccessDialog(true);
    } catch (error) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = zxcvbn(password);

  if (!accessToken) return <Spinner />;

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Reset Your Password</h1>
            <p className="text-gray-500 mt-2">Create a strong password to continue</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className="absolute right-3 top-2.5 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </div>
            </div>

            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div
                className="absolute right-3 top-2.5 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </div>
            </div>

            <div className="h-2 rounded bg-gray-200 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  passwordStrength.score >= 3
                    ? "bg-green-500 w-full"
                    : passwordStrength.score === 2
                    ? "bg-yellow-500 w-2/3"
                    : passwordStrength.score === 1
                    ? "bg-orange-500 w-1/3"
                    : "bg-red-500 w-1/4"
                }`}
              />
            </div>
            <p className="text-sm text-gray-500">
              Strength: {["Too Weak", "Weak", "Fair", "Good", "Strong"][passwordStrength.score]}
            </p>
          </div>

          <Button
            onClick={handlePasswordUpdate}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </div>

      {/* ✅ Success Modal */}
      <Dialog open={successDialog} onOpenChange={setSuccessDialog}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle>Password Updated</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 mb-4">
            Your password has been successfully reset. You can now sign in with your new credentials.
          </p>
          <Button
            className="w-full"
            onClick={() => {
              setSuccessDialog(false);
              navigate("/auth");
            }}
          >
            Go to Login
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdatePassword;
