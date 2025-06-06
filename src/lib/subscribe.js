import { supabase } from "@/lib/supabase";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

async function sendConfirmationEmail(email) {
  try {
    const res = await fetch(`${BASE_URL}/api/send-subscription-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) throw new Error("Failed to send confirmation email.");
  } catch (err) {
    console.error("Email error:", err.message);
  }
}
export async function subscribeUser(email) {
  try {
    // Step 1: Check if email already exists
    const { data: existing, error: selectError } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("email", email)
      .maybeSingle();  // <-- Use maybeSingle here

    if (selectError) {
      // Return error if actual query error (not no rows)
      return { error: selectError.message || "Failed to check existing subscription." };
    }

    if (existing) {
      // Email already subscribed
      return { error: "This email is already subscribed." };
    }

    // Step 2: Insert new subscription
    const { data, error } = await supabase
      .from("subscriptions")
      .insert({ email });

    if (error) {
      return { error: error.message || "Subscription failed." };
    }

    await sendConfirmationEmail(email);

    return { success: true };
  } catch (err) {
    return { error: err.message || "Unexpected error during subscription." };
  }
}
