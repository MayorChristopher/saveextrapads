import express from "express";
import { Resend } from "resend";

const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const data = await resend.emails.send({
      // from: "SaveExtraPad Contact <contact@saveextrapad.com>",
      from: "Ugo <onboarding@resend.dev>", // valid for dev use
      to: "saveextrapads@gmail.com",
      subject: `Contact Message from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Resend email error:", error);
    res.status(500).json({ error: "Failed to send message." });
  }
});

export default router;
