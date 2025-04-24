
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import confetti from "canvas-confetti";

export const useConquistaRecente = () => {
  const { toast } = useToast();

  const mostrarConquista = async (tipo: string, tema?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Registrar conquista no supabase
      const { data, error } = await supabase
        .from("conquistas_usuario")
        .insert([
          { 
            user_id: user.id,
            tipo,
            tema,
            data_conquista: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        console.error("Erro ao registrar conquista:", error);
        return;
      }

      // Mostrar toast com animação
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        toast({
          title: "🎉 Nova conquista desbloqueada!",
          description: tipo === "mestre_tema" 
            ? `Você dominou o tema "${tema}"!` 
            : tipo === "gabarito" 
            ? `Você gabaritou as questões sobre "${tema}"!` 
            : "Continue estudando para mais conquistas!",
          duration: 5000,
        });
      }, 500);

      return data;
    } catch (err) {
      console.error("Erro ao mostrar conquista:", err);
    }
  };

  return { mostrarConquista };
};
