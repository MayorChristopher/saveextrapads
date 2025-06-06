
import React, { useState } from "react";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send } from "lucide-react";


const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMsg(null);

    if (!form.name || !form.email || !form.message) {
      setResponseMsg({ type: "error", text: "Please fill all fields." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/send-contact-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setResponseMsg({ type: "success", text: "Message sent successfully." });
        setForm({ name: "", email: "", message: "" });
      } else {
        setResponseMsg({ type: "error", text: data.error || "Failed to send message." });
      }
    } catch (error) {
      setResponseMsg({ type: "error", text: "Network error. Please try later." });
    }
    setLoading(false);
  };

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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-lg text-gray-600">
              We're here to help! Reach out to us with any questions or concerns
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-secondary rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-600">support@saveextrapad.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-secondary rounded-lg">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-secondary rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p className="text-gray-600">123 Eco Street, Green City, 12345</p>
                  </div>
                </div>
              </div>
            </div>


            <div className="glass-card p-8 rounded-xl">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    name="name"
                    type="text"
                    className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    name="message"
                    className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary h-32"
                    placeholder="Your message"
                    value={form.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                {responseMsg && (
                  <p
                    className={`text-sm ${responseMsg.type === "error" ? "text-red-600" : "text-green-600"
                      }`}
                  >
                    {responseMsg.text}
                  </p>
                )}

                <Button className="w-full" type="submit" disabled={loading}>
                  <Send className="mr-2 h-4 w-4" />
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
