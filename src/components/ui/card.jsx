// src/components/ui/card.jsx
import React from "react";
import { cn } from "@/lib/utils";

export const Card = ({ className, ...props }) => (
  <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
);

export const CardHeader = ({ className, ...props }) => (
  <div className={cn("p-4 border-b font-semibold", className)} {...props} />
);

export const CardContent = ({ className, ...props }) => (
  <div className={cn("p-4", className)} {...props} />
);
