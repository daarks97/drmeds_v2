import {
  Toast as RadixToast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from "@radix-ui/react-toast";
import * as React from "react";

export const Toast = RadixToast;

export {
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};

// Tipos exportados para uso em hooks
export type ToastProps = React.ComponentProps<typeof RadixToast>;
export type ToastActionElement = React.ReactElement<typeof ToastAction>;
