import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Testimonials = () => {
  const [journey, setJourney] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch "Our Journey" data from Supabase
  useEffect(() => {
    const fetchJourney = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('journey')
        .select('*')
        .order('created_at', { ascending: true });

      console.log("✅ Supabase Fetch:", { data, error });

      if (error) {
        console.error("❌ Supabase Error:", error.message);
      }

      if (data?.length) {
        setJourney(data);
      } else {
        console.warn("⚠️ No journey data found.");
      }

      setLoading(false);
    };

    fetchJourney();
  }, []);


  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Environmental Activist",
      comment: "Finally, a sustainable option that doesn't compromise on quality!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1544212408-c711b7c19b92"
    },
    {
      name: "Sarah Johnson",
      role: "Environmental Activist",
      comment: "Finally, a sustainable option that doesn't compromise on quality!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1544212408-c711b7c19b92"
    },
    {
      name: "Sarah Johnson",
      role: "Environmental Activist",
      comment: "Finally, a sustainable option that doesn't compromise on quality!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1544212408-c711b7c19b92"
    },
  ];

  return (
    <section className="section-padding">
      <div className="container-custom">
        <Tabs defaultValue="testimonials" className="w-full">
          <TabsList className="flex justify-center mb-6">
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="journey">Our Journey</TabsTrigger>
          </TabsList>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Customer Stories</h1>
              <p className="text-lg text-gray-600">Hear what our community says</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card p-6 rounded-xl"
                >
                  <div className="flex items-center mb-4">
                    <img className="h-12 w-12 rounded-full object-cover mr-4" src={t.image} alt={t.name} />
                    <div>
                      <h3 className="font-semibold">{t.name}</h3>
                      <p className="text-sm text-gray-600">{t.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-gray-600">{t.comment}</p>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Our Journey Tab */}
          <TabsContent value="journey">
            {loading ? (
              <div className="text-center py-12">Loading journey data...</div>
            ) : (
              <div className="space-y-12">
                {journey.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white p-6 rounded-lg shadow-sm"
                  >
                    <h3 className="text-xl font-bold mb-2">{entry.title}</h3>
                    <p className="text-gray-700 mb-4">{entry.description}</p>
                    {entry.image_url && (
                      <img
                        src={entry.image_url}
                        alt={entry.title}
                        className="rounded-md w-full object-cover max-h-96 mb-4"
                      />
                    )}
                    {entry.video_url && (
                      <div className="aspect-video">
                        <iframe
                          className="w-full h-full"
                          src={entry.video_url}
                          title="Journey video"
                          frameBorder="0"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Testimonials;
