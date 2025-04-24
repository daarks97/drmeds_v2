
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  markRevisionAsCompleted,
  markRevisionAsRefused, 
  reactivateRevision 
} from "@/lib/supabase/manageRevisions";
import { createNextRevision } from "@/lib/revisions/createNextRevision";

export const useRevisionMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const invalidateAllRevisionQueries = async () => {
    console.log("Invalidating all revision queries");
    await queryClient.invalidateQueries({ queryKey: ["todayRevisions"] });
    await queryClient.invalidateQueries({ queryKey: ["tomorrowRevisions"] });
    await queryClient.invalidateQueries({ queryKey: ["lateRevisions"] });
    await queryClient.invalidateQueries({ queryKey: ["refusedRevisions"] });
    console.log("All revision queries invalidated");
  };

  const markCompletedMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Iniciando mutação para marcar revisão como concluída:", id);
      try {
        // Step 1: Mark the current revision as completed
        const completedRevision = await markRevisionAsCompleted(id);
        console.log("Revisão marcada como concluída:", completedRevision);
        
        if (completedRevision) {
          // Step 2: Create the next revision based on the current stage
          console.log("Criando próxima revisão para:", completedRevision);
          const nextRevision = await createNextRevision(completedRevision);
          console.log("Próxima revisão criada:", nextRevision);
          return { completedRevision, nextRevision };
        }
        
        return { completedRevision };
      } catch (error) {
        console.error("Erro detalhado ao marcar revisão como concluída:", error);
        throw error;
      }
    },
    onSuccess: async (data) => {
      console.log("Sucesso na mutação de conclusão:", data);
      if (data.completedRevision) {
        // Make sure to invalidate and refetch the queries
        await invalidateAllRevisionQueries();
        
        let message = "Revisão concluída com sucesso!";
        let description = "";
        
        if (data.nextRevision) {
          switch (data.nextRevision.revision_stage) {
            case "D7":
              description = "Próxima revisão agendada para 7 dias.";
              break;
            case "D30":
              description = "Próxima revisão agendada para 30 dias.";
              break;
            default:
              description = "Próxima revisão agendada.";
          }
        } else if (data.completedRevision.revision_stage === "D30") {
          description = "Parabéns! Você completou o ciclo de revisões para este tema.";
        }
        
        toast({
          title: message,
          description: description,
        });
      }
    },
    onError: (error: any) => {
      console.error("Erro ao marcar revisão como concluída:", error);
      
      // More specific error message
      let errorMessage = "Não foi possível marcar a revisão como concluída.";
      
      if (error?.message) {
        errorMessage += ` Detalhes: ${error.message}`;
      }
      
      if (error?.code) {
        console.error("Código de erro:", error.code);
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  const refuseMutation = useMutation({
    mutationFn: (id: string) => {
      console.log("Iniciando mutação para recusar revisão:", id);
      return markRevisionAsRefused(id);
    },
    onSuccess: async (data) => {
      console.log("Revisão recusada com sucesso:", data);
      await invalidateAllRevisionQueries();
      toast({
        title: "Revisão recusada",
        description: "A revisão foi recusada com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error("Erro ao recusar revisão:", error);
      
      let errorMessage = "Não foi possível recusar a revisão.";
      if (error?.message) {
        errorMessage += ` Detalhes: ${error.message}`;
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  const reactivateMutation = useMutation({
    mutationFn: (id: string) => {
      console.log("Iniciando mutação para reativar revisão:", id);
      return reactivateRevision(id);
    },
    onSuccess: async (data) => {
      console.log("Revisão reativada com sucesso:", data);
      await invalidateAllRevisionQueries();
      toast({
        title: "Revisão reativada",
        description: "A revisão foi reativada com sucesso para amanhã.",
      });
    },
    onError: (error: any) => {
      console.error("Erro ao reativar revisão:", error);
      
      let errorMessage = "Não foi possível reativar a revisão.";
      if (error?.message) {
        errorMessage += ` Detalhes: ${error.message}`;
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  return {
    markAsCompleted: markCompletedMutation.mutate,
    refuse: refuseMutation.mutate,
    reactivate: reactivateMutation.mutate,
    isLoading: markCompletedMutation.isPending || refuseMutation.isPending || reactivateMutation.isPending,
  };
};
