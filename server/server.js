import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import dotenv from 'dotenv';
import listEndpoints from 'express-list-endpoints';
import bodyParser from 'body-parser';

import paypalRouter from './routes/paypal.js';
import flutterwaveRouter from './routes/flutterwave.js';
import emailRoute from './routes/send-subscription-email.js';
import contactRoute from './routes/send-contact-email.js';
import reminderRouter from './routes/reminder.js';
import { processReminders } from './lib/reminderProcessor.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// Handle raw body for Flutterwave Webhooks
app.use('/api/payments/flutterwave/webhook', bodyParser.raw({ type: '*/*' }));

// Standard JSON body parsing
app.use(express.json());

// Route registration
app.use('/api/payments/paypal', paypalRouter);
app.use('/api/payments/flutterwave', flutterwaveRouter);
app.use('/api/send-subscription-email', emailRoute);
app.use('/api/send-contact-email', contactRoute);
app.use('/api/reminders', reminderRouter);

// Log all routes
logRegisteredRoutes(app);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// CRON: 8 AM daily reminder job
cron.schedule('0 8 * * *', async () => {
  console.log('🔔 Running scheduled reminder process...');
  try {
    await processReminders();
    console.log('✅ Reminder process completed.');
  } catch (err) {
    console.error('❌ Scheduled reminder process failed:', err);
  }
});

// Utility to list all active routes
function logRegisteredRoutes(app) {
  console.log('\n📌 Registered Routes:');
  listEndpoints(app).forEach((route) => {
    console.log(`  ${route.methods.join(', ')} ${route.path}`);
  });
}
