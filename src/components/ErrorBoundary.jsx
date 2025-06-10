import * as Sentry from "@sentry/react";
import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, errorInfo: error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("🔴 Error caught by ErrorBoundary:", error, errorInfo);

        // ✅ Only log to Sentry in production
        if (import.meta.env.MODE === "production") {
            try {
                Sentry.captureException(error, {
                    extra: {
                        componentStack: errorInfo?.componentStack || "No stack trace",
                    },
                });
            } catch (sentryError) {
                console.warn("⚠️ Sentry error reporting failed:", sentryError);
            }
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
                    <h1 className="text-2xl font-bold text-red-600">Something went wrong.</h1>
                    <p className="mt-2 text-gray-600">Our engineers have been notified.</p>
                    {import.meta.env.MODE !== "production" && (
                        <pre className="mt-4 text-sm text-left bg-gray-100 p-4 rounded overflow-x-auto">
                            {String(this.state.errorInfo)}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
