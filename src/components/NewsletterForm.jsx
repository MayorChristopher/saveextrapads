import React from "react";
import { Button } from "@/components/ui/button";
import { useNewsletter } from "@/hooks/useNewsletter";

export function NewsletterForm() {
  const { email, setEmail, handleSubscribe, loading, subscribed, error } = useNewsletter();

  return (
    <div className="max-w-md mx-auto">
      <div className="flex gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setEmail(email.trim())}
          placeholder="Enter your email"
          aria-label="Email address"
          required
          className="flex-grow px-4 py-2 rounded-md text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button
          variant="secondary"
          onClick={handleSubscribe}
          disabled={loading || subscribed}
          type="button"
        >
          {loading ? "Subscribing" : subscribed ? "Subscribed" : "Subscribe"}
        </Button>
      </div>
      {error && (
        <p className="mt-1 text-center px-1 py-1 text-white font-medium">{error}</p>
      )}
      {subscribed && (
        <p className="mt-1 text-center px-1 py-1 text-white font-medium">
          You're now subscribed! Check your email for confirmation.
        </p>
      )}
    </div>
  );
}
