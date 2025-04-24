
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RankingUser } from "@/lib/types";

export function useWeeklyRanking() {
  const { data, isLoading } = useQuery({
    queryKey: ["weekly-ranking"],
    queryFn: async (): Promise<RankingUser[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return [];

      // Busca o ranking semanal
      const { data, error } = await supabase.rpc('get_weekly_ranking');
      
      if (error) {
        console.error("Erro ao buscar ranking:", error);
        return [];
      }
      
      // Formata os dados e marca o usuário atual
      const formattedData = data.map((item: any, index: number) => ({
        userId: item.user_id,
        name: item.name || `Estudante ${index + 1}`,
        position: index + 1,
        weeklyXp: item.weekly_xp || 0,
        level: item.level || 1,
        isCurrentUser: item.user_id === user.id
      }));
      
      return formattedData;
    }
  });

  // Encontrar o ranking do usuário atual
  const currentUserRank = data?.find(user => user.isCurrentUser);

  return {
    ranking: data || [],
    isLoading,
    currentUserRank
  };
}
