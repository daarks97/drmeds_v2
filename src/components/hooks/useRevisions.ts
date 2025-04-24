
import { useRevisionQueries } from "./revisions/useRevisionQueries";
import { useRevisionMutations } from "./revisions/useRevisionMutations";
import { useEffect } from "react";
import { useToast } from "./use-toast";

export const useRevisions = () => {
  const { toast } = useToast();
  const { 
    todayRevisions, 
    tomorrowRevisions, 
    lateRevisions, 
    refusedRevisions,
    isLoading: isLoadingQueries,
    hasError,
    refetchAll
  } = useRevisionQueries();

  const { 
    markAsCompleted, 
    refuse, 
    reactivate, 
    isLoading: isLoadingMutations 
  } = useRevisionMutations();

  const isLoading = isLoadingQueries || isLoadingMutations;

  // Refetch all revisions when the component mounts
  useEffect(() => {
    console.log("useRevisions hook montado, buscando todas as revisões");
    refetchAll();
    
    // Set up a timer to refetch every minute
    const interval = setInterval(() => {
      console.log("Refetch periódico de revisões iniciado");
      refetchAll();
    }, 60000); // Refetch every minute
    
    return () => clearInterval(interval);
  }, [refetchAll]);

  // Wrap the mutation functions to ensure refetch happens after each action
  const handleMarkAsCompleted = async (id: string) => {
    console.log("Marcando revisão como concluída:", id);
    try {
      await markAsCompleted(id);
      toast({
        title: "Revisão concluída!",
        description: "A revisão foi marcada como concluída com sucesso."
      });
      await refetchAll(); // Força atualização imediata
    } catch (error) {
      console.error("Erro ao marcar revisão como concluída:", error);
      toast({
        title: "Erro",
        description: "Não foi possível marcar a revisão como concluída.",
        variant: "destructive"
      });
    }
  };

  const handleRefuse = async (id: string) => {
    console.log("Recusando revisão:", id);
    try {
      await refuse(id);
      toast({
        title: "Revisão recusada",
        description: "A revisão foi recusada com sucesso."
      });
      await refetchAll(); // Força atualização imediata
    } catch (error) {
      console.error("Erro ao recusar revisão:", error);
      toast({
        title: "Erro",
        description: "Não foi possível recusar a revisão.",
        variant: "destructive"
      });
    }
  };

  const handleReactivate = async (id: string) => {
    console.log("Reativando revisão:", id);
    try {
      await reactivate(id);
      toast({
        title: "Revisão reativada",
        description: "A revisão foi reativada com sucesso."
      });
      await refetchAll(); // Força atualização imediata
    } catch (error) {
      console.error("Erro ao reativar revisão:", error);
      toast({
        title: "Erro",
        description: "Não foi possível reativar a revisão.",
        variant: "destructive"
      });
    }
  };

  return {
    todayRevisions,
    tomorrowRevisions,
    lateRevisions,
    refusedRevisions,
    isLoading,
    hasError,
    markAsCompleted: handleMarkAsCompleted,
    refuse: handleRefuse,
    reactivate: handleReactivate,
    refetchAll,
  };
};
