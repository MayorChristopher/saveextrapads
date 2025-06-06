import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/store/auth";
import clsx from "clsx";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cartItems = useCart((state) => state.items);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Clear cart UI on logout, cart data stays in the backend
    if (!isAuthenticated) {
      // Here we can clear the cart UI when the user logs out
      useCart.getState().clearCart(); // Assuming you have a method for clearing the cart UI
    }
  }, [isAuthenticated]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Shop", path: "/shop" },
    { name: "Benefits", path: "/benefits" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact", path: "/contact" },
  ];


  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/save.png" alt="SaveExtraPad Logo" className="h-13 w-12" />
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={clsx(
                  "text-gray-600 hover:text-primary transition-colors",
                  location.pathname === item.path && "text-primary font-semibold"
                )}
              >
                {item.name}
              </Link>
            ))}

            {isAuthenticated && (
              <Link
                to="/reminder-tools"
                className={clsx(
                  "text-gray-600 hover:text-primary transition-colors",
                  location.pathname === "/reminder-tools" && "text-primary font-semibold"
                )}
              >
                Cycle Tools
              </Link>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <Link to="/account">
                <Button
                  variant="ghost"
                  size="icon"
                  className={clsx(
                    "transition-colors",
                    location.pathname === "/account" && "text-primary font-semibold"
                  )}
                  aria-current={location.pathname === "/account" ? "page" : undefined}
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button
                  variant="ghost"
                  size="icon"
                  className={clsx(
                    "transition-colors",
                    location.pathname === "/auth" && "text-primary font-semibold"
                  )}
                  aria-current={location.pathname === "/auth" ? "page" : undefined}
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-1 px-4 py-6 bg-white border-t border-gray-200 rounded-b-md shadow-lg">
                {[...navItems, ...(isAuthenticated ? [{ name: "Cycle Tools", path: "/reminder-tools" }] : [])].map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={clsx(
                      "block w-full px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors",
                      location.pathname === item.path && "text-primary font-semibold bg-gray-50"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="border-t border-gray-100 mt-3 pt-3">
                  {isAuthenticated ? (
                    <Link
                      to="/account"
                      onClick={() => setIsOpen(false)}
                      className={clsx(
                        "block w-full px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors",
                        location.pathname === "/account" && "text-primary font-semibold bg-gray-50"
                      )}
                    >
                      Account
                    </Link>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={() => setIsOpen(false)}
                      className={clsx(
                        "block w-full px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors",
                        location.pathname === "/auth" && "text-primary font-semibold bg-gray-50"
                      )}
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


      </div>
    </nav>
  );
};

export default Navbar;
