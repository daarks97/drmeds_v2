import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type RecomendacaoTema = {
  tema: string;
  percentual_acerto: number;
  total_respostas: number;
};

export function useRecomendacoesRevisao() {
  return useQuery({
    queryKey: ["recomendacoes_revisao"],
    queryFn: async (): Promise<RecomendacaoTema[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("desempenho_por_tema")
        .select("tema, percentual_acerto, total_respostas")
        .eq("user_id", user.id)
        .lt("percentual_acerto", 50)
        .gt("total_respostas", 2); // só recomendar se tiver respondido o mínimo

      if (error) {
        throw new Error(error.message);
      }

      return data ?? [];
    }
  });
}
