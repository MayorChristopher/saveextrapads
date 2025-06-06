
import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Environmental Activist",
      comment: "Finally, a sustainable option that doesn't compromise on quality! SaveExtraPad has revolutionized my monthly routine while helping the planet.",
      rating: 5,
      image: "sarah-profile"
    },
    {
      name: "Emily Chen",
      role: "Yoga Instructor",
      comment: "The comfort and flexibility are unmatched. I can maintain my active lifestyle without any worries. Plus, knowing they're eco-friendly makes me feel even better.",
      rating: 5,
      image: "emily-profile"
    },
    {
      name: "Maria Rodriguez",
      role: "Student",
      comment: "As a student on a budget, I love that SaveExtraPad is both affordable and eco-friendly. The subscription service is super convenient too!",
      rating: 5,
      image: "maria-profile"
    },
    {
      name: "Lisa Thompson",
      role: "Healthcare Professional",
      comment: "I recommend SaveExtraPad to all my patients. The hypoallergenic materials and superior protection make them perfect for sensitive skin.",
      rating: 5,
      image: "lisa-profile"
    },
    {
      name: "Aisha Patel",
      role: "Sustainability Consultant",
      comment: "The commitment to environmental sustainability while maintaining product quality is impressive. This is the future of feminine care products.",
      rating: 5,
      image: "aisha-profile"
    },
    {
      name: "Jessica Brown",
      role: "Athletic Trainer",
      comment: "Perfect for intense workouts! No leaks, no discomfort, and environmentally conscious. What more could you ask for?",
      rating: 5,
      image: "jessica-profile"
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Customer Stories</h1>
            <p className="text-lg text-gray-600">
              Hear what our community has to say about SaveExtraPad
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 rounded-xl"
              >
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <img 
                      className="h-12 w-12 rounded-full object-cover"
                      alt={`${testimonial.name}'s profile picture`}
                     src="https://images.unsplash.com/photo-1544212408-c711b7c19b92" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-gray-600">{testimonial.comment}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
