
import express from "express";
import { Resend } from "resend";

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    await resend.emails.send({
      from: "SaveExtraPad <noreply@yourdomain.com>", 
      to: email,
      subject: "Thanks for Subscribing!",
      html: `<p>Hi there,</p><p>Thanks for subscribing to SaveExtraPad!</p>`,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Resend error:", err);
    return res.status(500).json({ error: "Failed to send confirmation email." });
  }
});

export default router;
