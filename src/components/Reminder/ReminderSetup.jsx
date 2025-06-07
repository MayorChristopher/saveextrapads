import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Mail, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/auth";

const ReminderSetup = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cycleStart: "",
    cycleLength: "28",
    reminderDays: "3",
    notificationType: "email",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user?.id) return;

      const { data: prefs, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (prefs) {
        setFormData((prev) => ({
          ...prev,
          cycleLength: prefs.cycle_length?.toString() || "28",
          reminderDays: prefs.reminder_days?.toString() || "3",
          notificationType: prefs.notification_type || "email",
        }));
      } else {
        console.info("No saved preferences. Using defaults.");
      }

      if (error && error.code === "PGRST116") {
        console.info("No saved preferences. Using defaults.");
      }
    };

    fetchPreferences();
  }, [user]);


  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === "cycleStart") {
      value = value.trim().slice(0, 10);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Please log in",
        description: "Only authenticated users can create reminders.",
      });
      return;
    }

    if (!formData.cycleStart || !/^\d{4}-\d{2}-\d{2}$/.test(formData.cycleStart)) {
      toast({
        title: "Invalid Date",
        description: "Please provide a valid start date in YYYY-MM-DD format.",
      });
      return;
    }

    setLoading(true);

    const { error: reminderError } = await supabase.from("reminders").insert({
      user_id: user.id,
      name: formData.name,
      email: formData.email,
      cycle_start: formData.cycleStart,
      cycle_length: parseInt(formData.cycleLength),
      reminder_days: parseInt(formData.reminderDays),
      notification_type: formData.notificationType,
    });

    if (reminderError) {
      toast({ title: "Error", description: reminderError.message });
      setLoading(false);
      return;
    }

    const { error: prefsError } = await supabase.from("user_preferences").upsert({
      user_id: user.id,
      cycle_length: parseInt(formData.cycleLength),
      reminder_days: parseInt(formData.reminderDays),
      notification_type: formData.notificationType,
    });

    if (prefsError) {
      console.warn("Reminder saved, but failed to save preferences:", prefsError.message);
    }

    setLoading(false);
    toast({
      title: "Reminder Set",
      description: "We'll notify you before your next cycle starts.",
    });

    setFormData({
      name: "",
      email: "",
      cycleStart: "",
      cycleLength: "28",
      reminderDays: "3",
      notificationType: "email",
    });
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Set Up Reminders</h1>
            <p className="text-lg text-gray-600">
              Never run out of supplies with our convenient reminder system
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input name="name" type="text" required value={formData.name} onChange={handleInputChange} placeholder="Your Name" disabled={loading} />
              <Input name="email" type="email" required value={formData.email} onChange={handleInputChange} placeholder="Email Address" disabled={loading} />
              <Input name="cycleStart" type="date" required value={formData.cycleStart} onChange={handleInputChange} disabled={loading} />
              <Input
                name="cycleLength"
                type="number"
                min={20}
                max={45}
                required
                value={formData.cycleLength}
                onChange={handleInputChange}
                placeholder="Cycle Length (e.g., 28)"
                disabled={loading}
              />


              <div>
                <label className="block text-sm font-medium mb-2">Remind Me</label>
                <select
                  name="reminderDays"
                  value={formData.reminderDays}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                >
                  <option value="3">3 days before</option>
                  <option value="5">5 days before</option>
                  <option value="7">7 days before</option>
                </select>
              </div>

              <div className="mb-4">
                <Button
                  type="button"
                  variant={formData.notificationType === "email" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleInputChange({ target: { name: "notificationType", value: "email" } })}
                >
                  <Mail className="mr-2 h-4 w-4" /> Email
                </Button>

              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" /> Setting Reminder...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" /> Set Up Reminder
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ReminderSetup;
