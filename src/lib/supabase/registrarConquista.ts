import { supabase } from "@/integrations/supabase/client";
import { useConquistaStore } from "@/store/useConquistaStore";

export async function registrarConquista(
  userId: string,
  tipo: string,
  tema?: string
) {
  const { data, error } = await supabase
    .from("conquistas_usuario")
    .insert([{ user_id: userId, tipo, tema }]);

  if (error) {
    console.error("Erro ao registrar conquista:", error);
  }

  return data;
}
