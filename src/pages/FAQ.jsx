
import React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What makes SaveExtraPad eco-friendly?",
      answer: "Our pads are made from biodegradable materials and sustainable fibers. We use organic cotton and plant-based materials that break down naturally, reducing environmental impact while maintaining superior absorption and comfort."
    },
    {
      question: "How long do your pads last?",
      answer: "Our pads provide up to 8 hours of protection, depending on your flow. We recommend changing your pad every 4-6 hours for optimal hygiene and comfort."
    },
    {
      question: "Are your products hypoallergenic?",
      answer: "Yes, all our products are hypoallergenic and dermatologically tested. They're free from harmful chemicals, dyes, and fragrances, making them suitable for sensitive skin."
    },
    {
      question: "Do you offer different sizes?",
      answer: "Yes, we offer various sizes and absorbency levels to suit different needs: Regular, Super, and Overnight. Each type is available in different lengths and absorption capacities."
    },
    {
      question: "How do I dispose of the pads?",
      answer: "Our pads can be disposed of in regular waste bins. They will naturally biodegrade in landfills much faster than conventional pads. Please do not flush them down the toilet."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship worldwide! Shipping costs and delivery times vary by location. You can view specific shipping information during checkout."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and various local payment methods. All transactions are secure and encrypted."
    },
    {
      question: "Can I subscribe for regular deliveries?",
      answer: "Yes! We offer a subscription service where you can receive your preferred products at regular intervals. Subscribers also enjoy special discounts and free shipping."
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-lg text-gray-600">
              Find answers to common questions about our products and services
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AccordionItem value={`item-${index}`} className="glass-card rounded-lg">
                  <AccordionTrigger className="px-6 py-4 text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
