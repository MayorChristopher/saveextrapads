import React from "react";
import { useToast } from "./use-toast";

export function ToastRenderer() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-5 right-5 space-y-3 z-50">
      {toasts.map(({ id, title, description, variant = "default", dismiss }) => (
        <div
          key={id}
          className={`toast ${variant === "destructive" ? "toast-error" : "toast-success"}`}
          onClick={() => dismiss()}
          style={{
            background: variant === "destructive" ? "#f87171" : "#34d399",
            color: "white",
            padding: "12px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            minWidth: "280px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <strong>{title}</strong>
          {description && <p>{description}</p>}
        </div>
      ))}
    </div>
  );
}
