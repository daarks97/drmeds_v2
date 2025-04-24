import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { markStudyPlanAsCompleted, toggleStudyPlanCompletion } from '@/services/studyPlans_v2';
import { useQuestionsModal } from '@/hooks/avaliacoes/useQuestionsModal';

// Constantes globais
const REVISION_UPDATE_DELAY_MS = 800;

const queryKeys = {
  studyPlans: ['studyPlans'],
  revisions: {
    today: ['todayRevisions'],
    tomorrow: ['tomorrowRevisions'],
    late: ['lateRevisions'],
    refused: ['refusedRevisions'],
  }
};

export const useStudyPlanMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { openQuestionsModal } = useQuestionsModal();

  const toggleCompletionMutation = useMutation({
    mutationFn: ({ id, isCompleted }: { id: string; isCompleted: boolean }) =>
      toggleStudyPlanCompletion(id, isCompleted),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.studyPlans });

      toast({
        title: "Status atualizado",
        description: "O status do tema foi atualizado com sucesso.",
      });
    },

    onError: (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error("Erro ao alternar status de conclusão:", error);
      }

      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do tema.",
        variant: "destructive",
      });
    },
  });

  const markCompletedMutation = useMutation({
    mutationFn: (id: string) => markStudyPlanAsCompleted(id),

    onSuccess: async (studyPlan) => {
      if (process.env.NODE_ENV === 'development') {
        console.log("🎉 Tema marcado como concluído com sucesso!");
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.studyPlans });

      // Espera o Supabase processar para atualizar revisões com segurança
      setTimeout(() => {
        Object.values(queryKeys.revisions).forEach(key => {
          queryClient.invalidateQueries({ queryKey: key });
        });

        if (process.env.NODE_ENV === 'development') {
          console.log("🔄 Revisões atualizadas após conclusão do tema");
        }
      }, REVISION_UPDATE_DELAY_MS);

      toast({
        title: "Tema concluído!",
        description: "O tema foi marcado como concluído e uma revisão foi agendada para amanhã.",
      });

      openQuestionsModal('Simulado', new Date().getFullYear(), false, studyPlan.theme);
    },

    onError: (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error("❌ Erro ao marcar tema como concluído:", error);
      }

      toast({
        title: "Erro",
        description: "Não foi possível marcar o tema como concluído.",
        variant: "destructive",
      });
    },
  });

  return {
    toggleCompletionMutation,
    markCompletedMutation,
  };
};
