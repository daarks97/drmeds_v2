import { useToast } from "@/hooks/use-toast";  // Correta importação do hook
import {
  Toast,
  ToastProvider,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastViewport,
} from "@radix-ui/react-toast";  // Importação correta dos componentes

export const Toaster = () => {
  const { toasts } = useToast();  // Usando o hook corretamente

  // Verificar se os toasts estão prontos
  if (!toasts || toasts.length === 0) {
    return <div>Carregando toasts...</div>;  // Mensagem de carregamento
  }

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action && <ToastAction>{action}</ToastAction>}  {/* Adicionando ação de toast, caso haja */}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
};
