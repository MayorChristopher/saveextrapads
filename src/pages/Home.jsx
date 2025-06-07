
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Heart, DollarSign, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { subscribeUser } from "@/lib/subscribe";
import { useToast } from "@/components/ui/use-toast";
import { NewsletterForm } from "../components/NewsletterForm";

const Home = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address.",
      });
      return;
    }

    setLoading(true);
    const response = await subscribeUser(email);
    setLoading(false);

    if (response.error) {
      toast({
        variant: "destructive",
        title: "Subscription failed",
        description: response.error,
      });
    } else if (response.success) {
      toast({
        title: "Subscribed successfully!",
        description: "You've been added to our newsletter.",
      });
      setSubscribed(true);
      setEmail("");
    } else {
      toast({
        variant: "destructive",
        title: "Subscription error",
        description: "Unexpected response.",
      });
    }
  };


  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Sustainable Comfort for Every Woman
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Experience eco-friendly, ultra-affordable sanitary pads designed
                for your comfort and our planet's future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/shop">
                  <Button size="lg" className="w-full sm:w-auto text-lg sm:text-xl">
                    Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/benefits" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg sm:text-xl">
                    Learn More
                  </Button>
                </Link>
              </div>

            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <img
                className="rounded-2xl shadow-xl"
                alt="Eco-friendly sanitary pads"
                src="https://images.unsplash.com/photo-1605213865682-d4829b3d9186" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose SaveExtraPad?</h2>
            <p className="text-gray-600">
              Our products are designed with your comfort and the environment in mind
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <Leaf className="h-8 w-8 text-primary" />,
                title: "Eco-Friendly",
                description: "Made from sustainable materials",
              },
              {
                icon: <Heart className="h-8 w-8 text-primary" />,
                title: "Ultra Comfort",
                description: "Designed for maximum comfort",
              },
              {
                icon: <DollarSign className="h-8 w-8 text-primary" />,
                title: "Affordable",
                description: "Budget-friendly solutions",
              },
              {
                icon: <RefreshCw className="h-8 w-8 text-primary" />,
                title: "Sustainable",
                description: "Reduces environmental impact",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 rounded-xl text-center"
              >
                <div className="mb-4 inline-block p-3 bg-secondary rounded-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom max-w-xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Join the Movement</h2>
          <p className="text-lg mb-8">
            Subscribe to our newsletter for updates, tips, and exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <NewsletterForm className="flex-grow min-w-0" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
