import {
  RadixToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '@/components/ui/toast';

import { useToast } from '@/components/ui/toast-context';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <RadixToastProvider>
      <>
        {toasts.map(({ id, title, description, action }) => (
          <Toast key={id}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </>
    </RadixToastProvider>
  );
}
