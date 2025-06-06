import React, { useEffect, useState } from "react";
import { supabase } from '@/lib/supabase';
import { useAuth } from "@/store/auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

const ReminderHistory = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchReminders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reminders:", error.message);
      } else {
        setReminders(data);
      }

      setLoading(false);
    };

    fetchReminders();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin h-6 w-6 text-primary" />
      </div>
    );
  }

  if (!reminders.length) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No reminders found. Set one in the Setup tab.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reminders.map((reminder) => (
        <Card key={reminder.id}>
          <CardHeader className="font-semibold text-lg">
            {reminder.name}
          </CardHeader>
          <CardContent className="text-sm space-y-2 text-muted-foreground">
            <div>
              <strong>Email:</strong> {reminder.email}
            </div>
            <div>
              <strong>Cycle Start:</strong>{" "}
              {format(new Date(reminder.cycle_start), "PPP")}
            </div>
            <div>
              <strong>Reminder:</strong> {reminder.reminder_days} day(s) before
            </div>
            <div>
              <strong>Notification Type:</strong>{" "}
              {reminder.notification_type.toUpperCase()}
            </div>
            <div>
              <strong>Created:</strong>{" "}
              {format(new Date(reminder.created_at), "PPP p")}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReminderHistory;
