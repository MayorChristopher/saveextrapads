
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const About = () => {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
            <p className="text-lg text-gray-600">
              Empowering women through sustainable and affordable menstrual care solutions
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img  
                className="rounded-2xl shadow-lg"
                alt="Team working on sustainable solutions"
               src="https://images.unsplash.com/photo-1643197126090-d4bcad5faf76" />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Mission</h2>
              <p className="text-gray-600">
                At SaveExtraPad, we believe that every woman deserves access to high-quality, 
                comfortable, and environmentally conscious menstrual care products. Our mission 
                is to revolutionize the industry by providing sustainable solutions that don't 
                compromise on comfort or affordability.
              </p>
              <Button size="lg">Join Our Mission</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Sustainability",
                description: "We're committed to reducing environmental impact through eco-friendly materials and processes."
              },
              {
                title: "Accessibility",
                description: "Making quality menstrual care products affordable and available to all women."
              },
              {
                title: "Innovation",
                description: "Continuously improving our products through research and development."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 rounded-xl"
              >
                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
