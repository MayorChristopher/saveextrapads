import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/auth";
import { useNewsletter } from "@/hooks/useNewsletter";

const Footer = () => {
  const { email, setEmail, handleSubscribe, loading, subscribed, error } = useNewsletter();
  const { isAuthenticated } = useAuth();

  return (
    <footer className="bg-secondary">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div className="space-y-4">
            <img src="/save.png" alt="SaveExtraPad Logo" className="h-13 w-12" />
            <p className="text-gray-600">
              Eco-friendly, affordable, and comfortable sanitary solutions for all.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-600 hover:text-primary">
                  Our Shop
                </Link>
              </li>
              {isAuthenticated && (
                <li>
                  <Link to="/reminder-tools" className="text-gray-600 hover:text-primary">
                    Cycle Tools
                  </Link>
                </li>
              )}

              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=100089364632999" className="text-gray-600 hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://x.com/PadsSave3642?t=6SrNV6zoOVHWxgoQd7A4pg&s=09" className="text-gray-600 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/saveextrapads?igsh=MWJ4NHg5NjRta2w3Zw==" className="text-gray-600 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/save-extra-eco-friendly-products/" className="text-gray-600 hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:saveextrapads@gmail.com"
                className="text-gray-600 hover:text-primary"
                aria-label="Email us"
              >
                <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Newsletter</h4>
          <form
            className="space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubscribe();
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmail(email.trim())}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
              required
              aria-label="Email address"
              disabled={subscribed}
            />
            <Button
              className="w-full"
              type="submit"
              disabled={loading || subscribed}
            >
              {loading ? "Subscribing..." : subscribed ? "Subscribed" : "Subscribe"}
            </Button>

            {error && (
              <p className="text-center mt-2 px-3 py-1 text-red-600 font-medium">
                {error}
              </p>
            )}

            {subscribed && (
              <p className="text-center mt-2 px-3 py-1 text-green-600 font-medium">
                You're now subscribed! Check your email for confirmation.
              </p>
            )}
          </form>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <p className="text-center text-gray-600">
          © {new Date().getFullYear()} SaveExtraPad. All rights reserved.
        </p>
      </div>
    </div>
    </footer >
  );
};

export default Footer;
