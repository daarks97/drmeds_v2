import {
  Toast,
  ToastViewport,
  ToastProvider,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from "@radix-ui/react-toast";

import { useToast as useCustomToast, toast as customToast } from "@/components/ui/use-toast";

// Reexporta com nomes padrão esperados no projeto
export const useToast = useCustomToast;
export const toast = customToast;

export {
  Toast,
  ToastViewport,
  ToastProvider,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
