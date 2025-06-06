
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";

const Products = () => {
  const products = [
    {
      name: "Eco Comfort Daily",
      description: "Ultra-thin, biodegradable daily pads",
      price: "$8.99",
      rating: 5,
      image: "eco-comfort-daily-pads"
    },
    {
      name: "Night Protection Plus",
      description: "Extra coverage for peaceful nights",
      price: "$10.99",
      rating: 5,
      image: "night-protection-pads"
    },
    {
      name: "Active Fit Series",
      description: "Perfect for your active lifestyle",
      price: "$9.99",
      rating: 4,
      image: "active-fit-pads"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Products</h1>
            <p className="text-lg text-gray-600">
              Discover our range of eco-friendly and comfortable sanitary products
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-xl overflow-hidden"
              >
                <div className="aspect-square relative">
                  <img  
                    className="w-full h-full object-cover"
                    alt={product.name}
                   src="https://images.unsplash.com/photo-1605213865682-d4829b3d9186" />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    {[...Array(product.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">{product.price}</span>
                    <Button>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;
