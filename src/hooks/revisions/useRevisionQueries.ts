
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchTodayRevisions,
  fetchTomorrowRevisions,
  fetchLateRevisions,
  fetchRefusedRevisions,
} from "@/services/revisions/fetchRevisions";

export const useRevisionQueries = () => {
  const queryClient = useQueryClient();

  const todayRevisionsQuery = useQuery({
    queryKey: ["todayRevisions"],
    queryFn: fetchTodayRevisions,
    staleTime: 0, // Always consider data stale to force refetch
    refetchOnWindowFocus: true,
    refetchOnMount: true, // Added to refetch when component mounts
    refetchOnReconnect: true, // Added to refetch on network reconnect
  });

  const tomorrowRevisionsQuery = useQuery({
    queryKey: ["tomorrowRevisions"],
    queryFn: fetchTomorrowRevisions,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  const lateRevisionsQuery = useQuery({
    queryKey: ["lateRevisions"],
    queryFn: fetchLateRevisions,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  const refusedRevisionsQuery = useQuery({
    queryKey: ["refusedRevisions"],
    queryFn: fetchRefusedRevisions,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  const isLoading = todayRevisionsQuery.isLoading || 
                    tomorrowRevisionsQuery.isLoading || 
                    lateRevisionsQuery.isLoading || 
                    refusedRevisionsQuery.isLoading;

  const hasError = todayRevisionsQuery.error || 
                   tomorrowRevisionsQuery.error || 
                   lateRevisionsQuery.error || 
                   refusedRevisionsQuery.error;

  // Add logs for debugging
  console.log("Resultado das consultas de revisões:");
  console.log("Hoje:", todayRevisionsQuery.data);
  console.log("Amanhã:", tomorrowRevisionsQuery.data);
  console.log("Atrasadas:", lateRevisionsQuery.data);
  console.log("Recusadas:", refusedRevisionsQuery.data);
  console.log("Estado de carregamento:", isLoading);
  console.log("Erros:", hasError);

  const refetchAll = async () => {
    console.log("Forçando refetch de todas as revisões");
    
    try {
      // Invalidate queries first to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["todayRevisions"] });
      queryClient.invalidateQueries({ queryKey: ["tomorrowRevisions"] });
      queryClient.invalidateQueries({ queryKey: ["lateRevisions"] });
      queryClient.invalidateQueries({ queryKey: ["refusedRevisions"] });
      
      // Then manually refetch with a small delay to ensure invalidation completes
      setTimeout(async () => {
        try {
          await Promise.all([
            todayRevisionsQuery.refetch(),
            tomorrowRevisionsQuery.refetch(),
            lateRevisionsQuery.refetch(),
            refusedRevisionsQuery.refetch()
          ]);
          console.log("Refetch completo de todas as revisões");
        } catch (err) {
          console.error("Erro durante refetch após delay:", err);
        }
      }, 300);
    } catch (err) {
      console.error("Erro durante refetch de revisões:", err);
    }
  };

  return {
    todayRevisions: todayRevisionsQuery.data ?? [],
    tomorrowRevisions: tomorrowRevisionsQuery.data ?? [],
    lateRevisions: lateRevisionsQuery.data ?? [],
    refusedRevisions: refusedRevisionsQuery.data ?? [],
    isLoading,
    hasError,
    refetchAll
  };
};
