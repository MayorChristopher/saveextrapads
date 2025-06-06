
import React from "react";
import { motion } from "framer-motion";
import { Leaf, Heart, DollarSign, Shield, Recycle, Clock } from "lucide-react";

const Benefits = () => {
  const benefits = [
    {
      icon: <Leaf className="h-8 w-8 text-primary" />,
      title: "Eco-Friendly Materials",
      description: "Made from sustainable, biodegradable materials that are kind to our planet."
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Gentle on Skin",
      description: "Hypoallergenic and dermatologically tested for sensitive skin."
    },
    {
      icon: <DollarSign className="h-8 w-8 text-primary" />,
      title: "Cost-Effective",
      description: "Save money while choosing sustainable options for your menstrual care."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Maximum Protection",
      description: "Advanced absorption technology for worry-free protection."
    },
    {
      icon: <Recycle className="h-8 w-8 text-primary" />,
      title: "Sustainable Packaging",
      description: "100% recyclable packaging made from recycled materials."
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Long-Lasting",
      description: "Extended durability without compromising comfort or effectiveness."
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Why Choose SaveExtraPad?</h1>
            <p className="text-lg text-gray-600">
              Discover the benefits of choosing our eco-friendly sanitary products
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 rounded-xl text-center"
              >
                <div className="mb-4 inline-block p-3 bg-secondary rounded-lg">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlight */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Better for You, Better for the Planet</h2>
              <p className="text-gray-600">
                Our products are designed with both your comfort and environmental sustainability in mind. 
                We use only the highest quality eco-friendly materials while ensuring maximum protection 
                and comfort throughout your cycle.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <Leaf className="h-5 w-5 text-primary" />
                  <span>100% biodegradable materials</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Heart className="h-5 w-5 text-primary" />
                  <span>Dermatologically tested</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Superior leak protection</span>
                </li>
              </ul>
            </div>
            <div>
              <img 
                className="rounded-2xl shadow-lg"
                alt="Eco-friendly materials and production"
               src="https://images.unsplash.com/photo-1683724709712-b68cbb3f0069" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Benefits;
