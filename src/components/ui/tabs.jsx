// src/components/ui/tabs.jsx
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils"; // Make sure this utility exists or adjust accordingly

export const Tabs = TabsPrimitive.Root;

export const TabsList = ({ className, ...props }) => (
  <TabsPrimitive.List
    className={cn("inline-flex items-center bg-muted p-1 rounded-md", className)}
    {...props}
  />
);

export const TabsTrigger = ({ className, ...props }) => (
  <TabsPrimitive.Trigger
    className={cn(
      "px-3 py-1.5 text-sm font-medium text-muted-foreground",
      "hover:text-foreground radix-state-active:bg-background radix-state-active:shadow-sm",
      "rounded-md transition-colors",
      className
    )}
    {...props}
  />
);

export const TabsContent = ({ className, ...props }) => (
  <TabsPrimitive.Content className={cn("mt-2", className)} {...props} />
);
