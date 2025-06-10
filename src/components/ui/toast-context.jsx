import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ ...props }) => {
    const id = Date.now().toString();
    const dismiss = () => setToasts((prev) => prev.filter((t) => t.id !== id));

    setToasts((prev) => [
      { ...props, id, dismiss },
      ...prev,
    ].slice(0, 3)); // optional limit

    if (props.duration !== Infinity) {
      setTimeout(() => dismiss(), props.duration || 5000);
    }

    return { id, dismiss };
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
