import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/Spinner";

const ProtectedRoute = ({ condition, redirectTo, children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!condition) {
      toast({
        title: "Access Denied",
        description: "You must be signed in to view this page.",
        variant: "destructive",
      });
      setTimeout(() => navigate(redirectTo), 1500); // Delay for user to read
    }
  }, [condition, navigate, redirectTo]);

  if (!condition) return <Spinner />;

  return children;
};

export default ProtectedRoute;
