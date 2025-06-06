import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { supabase } from '../lib/supabase.js'



dotenv.config();
const router = express.Router();

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_SECRET;
const BASE_URL = 'https://api-m.sandbox.paypal.com'; // Switch to live for production

// Get Access Token
async function getAccessToken() {
  const response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  if (!data.access_token) throw new Error('Unable to get PayPal access token');
  return data.access_token;
}


// Create Order
async function createPayPalOrder(total, accessToken) {
  const response = await fetch(`${BASE_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: total.toFixed(2),
          },
        },
      ],
      application_context: {
        return_url: `${process.env.FRONTEND_URL}/payment-success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      }
      ,
    }),
  });

  const data = await response.json();
  return data;
}
router.post('/', async (req, res) => {
  try {
    const { total, orderId } = req.body;

    if (!total || !orderId || typeof total !== 'number') {
      return res.status(400).json({ message: 'Missing or invalid total or orderId' });
    }

    const accessToken = await getAccessToken();
    const order = await createPayPalOrder(total, accessToken);

    const approvalLink = order.links.find(link => link.rel === 'approve')?.href;
    const paypalToken = order.id;

    if (!approvalLink) throw new Error('Unable to generate PayPal approval link');

    // Save token mapping to Supabase
    await supabase.from("paypal_tokens").insert({
      token: paypalToken,
      order_id: orderId,
    });

    res.status(200).json({ link: approvalLink });
  } catch (err) {
    console.error('PayPal route error:', err.message);
    res.status(500).json({ message: 'PayPal payment initialization failed.' });
  }
});

router.post('/capture/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const accessToken = await getAccessToken();

    const response = await fetch(`${BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

if (data.status !== 'COMPLETED') {
  await supabase.from("orders").update({
    status: "failed",
    failure_reason: data.status || 'PayPal payment not completed'
  }).eq("id", tokenData.order_id);

  return res.status(400).json({ message: 'Payment not completed' });
}


    const { data: tokenData, error } = await supabase
      .from("paypal_tokens")
      .select("order_id")
      .eq("token", orderId)
      .single();

    if (error || !tokenData?.order_id) {
      console.error("Token lookup failed:", error);
      return res.status(404).json({ message: "Order mapping not found" });
    }

    await supabase
      .from("orders")
      .update({ status: "completed" })
      .eq("id", tokenData.order_id);

    res.status(200).json({ message: "Payment captured and order updated", data });
  } catch (err) {
    console.error("PayPal capture error:", err.message);
    res.status(500).json({ message: "Failed to capture PayPal order" });
  }
});

export default router;
