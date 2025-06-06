import express from "express";
import { processReminders } from '../lib/reminderProcessor.js';

const router = express.Router();

router.post("/process", async (req, res) => {
  try {
    await processReminders();
    res.status(200).json({ success: true, message: "Reminders processed successfully." });
  } catch (error) {
    console.error("Reminder processing failed:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
