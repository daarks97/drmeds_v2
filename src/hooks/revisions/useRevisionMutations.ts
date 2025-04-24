import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  markRevisionAsCompleted,
  markRevisionAsRefused,
  reactivateRevision,
} from "@/lib/supabase/manageRevisions";
import { createNextRevision } from "@/lib/revisions/createNextRevision";

export const useRevisionMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const invalidateAllRevisionQueries = async () => {
    const keys = [
      "todayRevisions",
      "tomorrowRevisions",
      "lateRevisions",
      "refusedRevisions",
      "allRevisions",
    ];
    console.log("🔄 Invalidando todas as queries de revisões...");
    await Promise.all(keys.map((key) => queryClient.invalidateQueries({ queryKey: [key] })));
  };

  const markCompletedMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("✅ Mutação: marcar revisão como concluída →", id);

      const completedRevision = await markRevisionAsCompleted(id);
      console.log("✔️ Revisão concluída:", completedRevision);

      if (!completedRevision) return { completedRevision: null };

      const nextRevision = await createNextRevision(completedRevision);
      return { completedRevision, nextRevision };
    },
    onSuccess: async ({ completedRevision, nextRevision }) => {
      await invalidateAllRevisionQueries();

      const isFinal = completedRevision?.revision_stage === "D30";
      const message = "Revisão concluída com sucesso!";
      const description = nextRevision
        ? `Próxima revisão agendada para ${nextRevision.revision_stage === "D7" ? "7" : "30"} dias.`
        : isFinal
        ? "Parabéns! Você completou o ciclo de revisões para este tema."
        : "";

      toast({ title: message, description });
    },
    onError: (error: any) => {
      console.error("❌ Erro ao marcar revisão como concluída:", error);
      toast({
        title: "Erro",
        description: `Não foi possível concluir a revisão. ${error?.message ?? ""}`,
        variant: "destructive",
      });
    },
  });

  const refuseMutation = useMutation({
    mutationFn: (id: string) => {
      console.log("⚠️ Mutação: recusar revisão →", id);
      return markRevisionAsRefused(id);
    },
    onSuccess: async () => {
      await invalidateAllRevisionQueries();
      toast({ title: "Revisão recusada", description: "A revisão foi recusada com sucesso." });
    },
    onError: (error: any) => {
      console.error("❌ Erro ao recusar revisão:", error);
      toast({
        title: "Erro",
        description: `Não foi possível recusar a revisão. ${error?.message ?? ""}`,
        variant: "destructive",
      });
    },
  });

  const reactivateMutation = useMutation({
    mutationFn: (id: string) => {
      console.log("♻️ Mutação: reativar revisão →", id);
      return reactivateRevision(id);
    },
    onSuccess: async () => {
      await invalidateAllRevisionQueries();
      toast({ title: "Revisão reativada", description: "A revisão foi reativada para amanhã." });
    },
    onError: (error: any) => {
      console.error("❌ Erro ao reativar revisão:", error);
      toast({
        title: "Erro",
        description: `Não foi possível reativar a revisão. ${error?.message ?? ""}`,
        variant: "destructive",
      });
    },
  });

  return {
    markAsCompleted: markCompletedMutation.mutate,
    refuse: refuseMutation.mutate,
    reactivate: reactivateMutation.mutate,
    isLoading:
      markCompletedMutation.isPending ||
      refuseMutation.isPending ||
      reactivateMutation.isPending,
  };
};
