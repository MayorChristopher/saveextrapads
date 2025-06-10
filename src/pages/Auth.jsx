// Auth.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-context";
import { useAuth } from "@/store/auth";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { loadCartOnLogin } from "@/lib/supabaseCart";
import { Eye, EyeOff } from "lucide-react"; // ✅ Correct import


const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, updateUser } = useAuth((state) => ({
    signIn: state.signIn,
    signUp: state.signUp,
    updateUser: state.updateUser,
  }));


  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const validateForm = () => {
    try {
      const schema = isLogin ? authSchema.omit({ name: true }) : authSchema;
      schema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      const formattedErrors = error.errors.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
      setErrors(formattedErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

// Inside handleSubmit
try {
  let user;

  if (isLogin) {
    user = await signIn(formData.email, formData.password, toast);
    await loadCartOnLogin();
    toast({ title: "Welcome back!", description: "You're logged in." });
  } else {
    await signUp(formData.email, formData.password, formData.name, toast);
    toast({
      title: "Account Created",
      description: "Please check your email to verify your account.",
    });
    return; // stop here, don’t navigate until account is verified
  }

  if (user) {
    updateUser(user);
    const redirectPath = location.state?.from || "/";
    navigate(redirectPath);
  }

} catch (error) {
  toast({
    title: "Error",
    description: error?.message || "Authentication failed.",
    variant: "destructive",
  });
}
 finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <div className="container-custom py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="glass-card p-8 rounded-xl shadow-xl">
            <h1 className="text-3xl font-bold text-center mb-8">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`w-full ${errors.name ? "border-destructive" : ""
                      }`}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>
              )}
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`w-full ${errors.email ? "border-destructive" : ""
                    }`}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className={`w-full pr-10 ${errors.password ? "border-destructive" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground focus:outline-none"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
                {errors.password && (
                  <p className="text-sm text-destructive mt-1">{errors.password}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? "Loading..."
                  : isLogin
                    ? "Sign In"
                    : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;