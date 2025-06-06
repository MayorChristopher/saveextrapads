import express from 'express';
import Flutterwave from 'flutterwave-node-v3';
import dotenv from 'dotenv';
import { supabase } from '../lib/supabase.js';
import crypto from 'crypto';

dotenv.config();

const router = express.Router();

// Instantiate Flutterwave
const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
);
if (!process.env.FLW_PUBLIC_KEY || !process.env.FLW_SECRET_KEY) {
  console.error("🚨 Missing Flutterwave API keys in environment variables");
  process.exit(1);
}
console.log("Flutterwave Public Key:", process.env.FLW_PUBLIC_KEY);
console.log("Flutterwave Secret Key:", process.env.FLW_SECRET_KEY);


router.post('/', async (req, res) => {
  const { total, email, name, orderId } = req.body;

  try {
    const payload = {
      tx_ref: `saveextra_${Date.now()}`,
      amount: (Math.round(Number(total) * 100) / 100).toFixed(2),
      currency: "NGN",
      redirect_url: `${process.env.FRONTEND_URL}/order-complete`,
      payment_options: "card,banktransfer,ussd",
      customer: { email, name },
      customizations: {
        title: "Save Extra Pad's",
        description: `Order #${orderId} payment`,
        logo: `${process.env.FRONTEND_URL}/logo.png`,
      },
      meta: {
        order_id: orderId,
      },
    };

    // Use the correct method
    const response = await flw.Payment.initiate(payload);
    // ✅ Correct method
    console.log(Object.keys(flw));

    const { id: tx_id, tx_ref } = response.data;

    await supabase.from('flutterwave_tokens').insert([
      {
        order_id: orderId,
        tx_id,
        tx_ref,
      },
    ]);

    return res.status(200).json({ link: response.data.link });
  } catch (error) {
    console.error("❌ Flutterwave error:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });

    return res.status(500).json({
      message: "Flutterwave payment initiation failed",
      details: error.response?.data || error.message,
    });
  }
});

// ✅ Flutterwave Webhook Endpoint
router.post('/webhook', express.raw({ type: '*/*' }), async (req, res) => {
  const rawBody = req.body;

  const hash = crypto.createHmac("sha256", process.env.FLW_SECRET_HASH)
    .update(rawBody)
    .digest("hex");

  const incomingHash = req.headers['verif-hash'] || req.headers['verif-Hash'] || req.headers['Verif-Hash'];



  if (incomingHash !== hash) {
    console.warn("🔒 Invalid webhook signature");
    return res.sendStatus(401);
  }

  const event = JSON.parse(rawBody);

  if (event?.event !== 'charge.completed') {
    return res.status(400).json({ message: 'Invalid event' });
  }

  const tx_ref = event.data.tx_ref;
  const flw_tx_id = event.data.id;

  const { data: tokenData, error: fetchError } = await supabase
    .from("flutterwave_tokens")
    .select("order_id")
    .eq("tx_ref", tx_ref)
    .single();

  if (!tokenData) {
    return res.status(404).json({ message: "No order mapped to tx_ref" });
  }


  if (fetchError || !tokenData?.order_id) {
    console.error("Order mapping failure", fetchError);
    return res.status(404).json({ message: "Order not found for tx_ref" });
  }

  try {
    const verification = await flw.Transaction.verify({ id: flw_tx_id });

    if (verification.data.status !== 'successful' || verification.data.tx_ref !== tx_ref) {
      await supabase.from("orders").update({
        status: "failed",
        failure_reason: `Verification failed or status not successful (${verification.data.status})`
      }).eq("id", tokenData.order_id);

      return res.status(400).json({ message: "Transaction verification failed" });
    }

    const { data: existingOrder } = await supabase
      .from("orders")
      .select("status")
      .eq("id", tokenData.order_id)
      .single();

    if (existingOrder?.status === "completed") {
      return res.status(200).json({ message: "Order already completed" });
    }


    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: "completed" })
      .eq("id", tokenData.order_id);

    if (updateError) {
      console.error("Order update failure", updateError);
      return res.status(500).json({ message: "Failed to update order status" });
    }

    return res.status(200).json({ message: "Order status updated" });
  } catch (err) {
    console.error("❌ Webhook Processing Error:", err);
    return res.status(500).json({ message: "Internal webhook processing error" });
  }
});


export default router;
