// reminderProcessor.js
import { supabase } from '../lib/supabase.js';
import { Resend } from 'resend';
import dayjs from 'dayjs';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function processReminders() {
  const today = dayjs().format('YYYY-MM-DD');

  const { data: reminders, error } = await supabase
    .from('reminders')
    .select('*')
    .gte('cycle_start', today)
    .gte('reminder_days', 0);

  if (error) throw new Error(error.message);

  for (const reminder of reminders) {
    const reminderDate = dayjs(reminder.cycle_start).subtract(reminder.reminder_days, 'day').format('YYYY-MM-DD');
    await supabase.from('reminders').update({ status: 'processing' }).eq('id', reminder.id);


    if (reminderDate === today && !reminder.notified) {
      try {
        // Send notification
        await resend.emails.send({
          from: "SaveExtraPad <noreply@yourdomain.com>",
          to: reminder.email,
          subject: "Your Cycle Reminder",
          html: `<p>Hi ${reminder.name},</p><p>This is a reminder for your upcoming cycle starting on ${reminder.cycle_start}.</p>`,
        });

        // Mark current reminder as notified
        await supabase.from('reminders').update({ notified: true, status: 'notified' }).eq('id', reminder.id);


        // Predict next cycle
        const cycleLength = reminder.cycle_length || 28;
        const nextCycleStart = dayjs(reminder.cycle_start).add(cycleLength, 'day').format('YYYY-MM-DD');


        // Check if next reminder already exists
        const { data: existing } = await supabase
          .from('reminders')
          .select('id')
          .eq('user_id', reminder.user_id)
          .eq('cycle_start', nextCycleStart);

        if (!existing || existing.length === 0) {
          await supabase.from('reminders').insert({
            user_id: reminder.user_id,
            name: reminder.name,
            email: reminder.email,
            cycle_start: nextCycleStart,
            reminder_days: reminder.reminder_days,
            notification_type: reminder.notification_type,
            notified: false,
          });
        }

      } catch (err) {
        console.error(`Failed to send email for reminder ${reminder.id}:`, err);
      }
    }
  }
}
