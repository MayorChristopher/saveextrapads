import React from "react";
import { cn } from "@/lib/utils";

const variantStyles = {
  default: "bg-gray-100 text-gray-800",
  success: "bg-green-100 text-green-800",
  destructive: "bg-red-100 text-red-800",
  outline: "border border-gray-300 text-gray-700",
  secondary: "bg-blue-100 text-blue-800",
};

export function Badge({ variant = "default", className, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold",
        variantStyles[variant] || variantStyles.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
