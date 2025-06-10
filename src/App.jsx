import React, { useEffect } from "react"; 
import * as Sentry from "@sentry/react"; 
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from '@/components/ui/toaster';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Products from "@/pages/Products";
import Contact from "@/pages/Contact";
import Shop from "@/pages/Shop";
import Benefits from "@/pages/Benefits";
import FAQ from "@/pages/FAQ";
import Testimonials from "@/pages/Testimonials";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Auth from "@/pages/Auth";
import Account from "@/pages/Account";
import { useAuth } from "@/store/auth";
import Spinner from "@/components/Spinner";
import OrderComplete from "@/pages/OrderComplete";
import ReminderDashboard from "@/pages/ReminderDashboard";
import UpdatePassword from "@/pages/UpdatePassword";
import { ToastProvider } from '@/components/ui/toast-context'; 
import PaymentCancel from "@/pages/PaymentCancel";
import PaymentSuccess from "@/pages/PaymentSuccess";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";


const App = () => {
  const { isAuthenticated, user } = useAuth();
    const init = useAuth((state) => state.init);

  useEffect(() => {
    init(); // Check session and start auth listener
  }, [init]);

  // ⏳ Loading State
  useEffect(() => {
    if (isAuthenticated && user) {
      Sentry.setUser({
        id: user.id,
        email: user.email,
      });
    } else {
      Sentry.setUser(null); // Clear context if user logs out
    }
  }, [isAuthenticated, user]);


  return (
     <ToastProvider>
    <Router>
        <Toaster />
        <ErrorBoundary>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/benefits" element={<Benefits />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="*" element={<NotFound />} />
                <Route
                  path="/reminder-tools"
                  element={
                    isAuthenticated ? <ReminderDashboard /> : <Navigate to="/auth" replace />
                  }
                />

                <Route path="/order-complete" element={<OrderComplete />} />
                <Route path="/update-password" element={<UpdatePassword />} />
                <Route path="/payment-cancel" element={<PaymentCancel />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />

                {/* Auth / Protected Routes */}
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute condition={isAuthenticated} redirectTo="/auth">
                      <Account />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/auth"
                  element={
                    !isAuthenticated ? <Auth /> : <Navigate to="/account" replace />
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </ErrorBoundary>      
    </Router >
    </ToastProvider>
  );
};

export default App;
