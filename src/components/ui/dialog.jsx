"use client";

import * as React from "react";
import * as RadixDialog from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils"; // Utility for merging class names
import { X } from "lucide-react"; // For the close icon

const Dialog = RadixDialog.Root;
const DialogTrigger = RadixDialog.Trigger;

const DialogPortal = ({ className, ...props }) => (
  <RadixDialog.Portal {...props} />
);

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <RadixDialog.Overlay
    ref={ref}
    className={cn("fixed inset-0 bg-black/50 z-50 backdrop-blur-sm", className)}
    {...props}
  />
));
DialogOverlay.displayName = RadixDialog.Overlay.displayName;

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <RadixDialog.Content
      ref={ref}
      className={cn(
        "fixed z-50 w-full max-w-lg translate-y-[-50%] translate-x-[-50%] top-[50%] left-[50%] bg-white p-6 rounded-lg shadow-lg focus:outline-none",
        className
      )}
      {...props}
    >
      {children}
      <RadixDialog.Close className="absolute top-4 right-4 text-gray-500 hover:text-gray-900">
        <X className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </RadixDialog.Close>
    </RadixDialog.Content>
  </DialogPortal>
));
DialogContent.displayName = RadixDialog.Content.displayName;

const DialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <RadixDialog.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = RadixDialog.Title.displayName;

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <RadixDialog.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = RadixDialog.Description.displayName;

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
};
