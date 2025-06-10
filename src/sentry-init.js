import * as Sentry from "@sentry/react";
import { browserTracingIntegration } from "@sentry/react"; // ✅ For SDK >= 7.59.0

const allowInDev = true;

if (import.meta.env.MODE === "production" || allowInDev) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [browserTracingIntegration()],
    tracesSampleRate: 0.2,
    environment: import.meta.env.MODE,
  });
}
