import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
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
import { ToastProvider } from "@/components/ui/toast";
import PaymentCancel from "@/pages/PaymentCancel";
import PaymentSuccess from "@/pages/PaymentSuccess";


const App = () => {
  const { isAuthenticated } = useAuth();

  // ⏳ Loading State
  if (isAuthenticated === null) {
    return <Spinner />;
  }

  return (
    <Router>
      <ToastProvider>
        <Toaster />
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
                  isAuthenticated ? <Account /> : <Navigate to="/auth" replace />
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
      </ToastProvider>
    </Router>
  );
};

export default App;
