import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRevisions } from "@/lib/revisions/fetchRevisions";
import { Revision } from "@/lib/types";
import { isToday, isTomorrow, isBefore, parseISO } from "date-fns";

export const useRevisionQueries = () => {
  const queryClient = useQueryClient();

  const revisionsQuery = useQuery<Revision[]>({
    queryKey: ["allRevisions"],
    queryFn: fetchRevisions,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  const todayRevisions = (revisionsQuery.data ?? []).filter(
    (r) => !r.is_completed && !r.is_refused && isToday(parseISO(r.revision_date))
  );

  const tomorrowRevisions = (revisionsQuery.data ?? []).filter(
    (r) => !r.is_completed && !r.is_refused && isTomorrow(parseISO(r.revision_date))
  );

  const lateRevisions = (revisionsQuery.data ?? []).filter(
    (r) => !r.is_completed && !r.is_refused && isBefore(parseISO(r.revision_date), new Date())
  );

  const refusedRevisions = (revisionsQuery.data ?? []).filter(
    (r) => r.is_refused === true
  );

  const isLoading = revisionsQuery.isLoading;
  const hasError = revisionsQuery.error;

  const refetchAll = async () => {
    console.log("🔄 Refetching todas as revisões...");
    try {
      await queryClient.invalidateQueries({ queryKey: ["allRevisions"] });
      await revisionsQuery.refetch();
      console.log("✅ Refetch completo!");
    } catch (err) {
      console.error("❌ Erro durante refetch de revisões:", err);
    }
  };

  return {
    todayRevisions,
    tomorrowRevisions,
    lateRevisions,
    refusedRevisions,
    isLoading,
    hasError,
    refetchAll,
  };
};
