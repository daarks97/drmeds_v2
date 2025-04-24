
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DesempenhoPorTema } from "@/lib/types";

export function useDesempenhoPorTema() {
  return useQuery<DesempenhoPorTema[]>({
    queryKey: ["desempenho_por_tema"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("desempenho_por_tema")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      return data || [];
    },
  });
}
