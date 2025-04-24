import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type ReviewTopic = {
  id: string;
  tema: string;
  tipo: string; // D1, D7, D30
  data_revisao: string;
  concluida: boolean;
};

export const useReviewTopics = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: reviewTopics = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["reviewTopics"],
    queryFn: async (): Promise<ReviewTopic[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("revisoes")
        .select("*")
        .eq("user_id", user.id)
        .eq("concluida", false)
        .order("data_revisao", { ascending: true });

      if (error) throw new Error(error.message);
      return data ?? [];
    }
  });

  const handleMarkReviewCompleted = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("revisoes")
        .update({
          concluida: true,
          data_conclusao: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Revisão concluída!",
        description: "Sua revisão foi marcada como feita. 👏",
      });
      queryClient.invalidateQueries({ queryKey: ["reviewTopics"] });
    },
  });

  const handleRejectReview = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("revisoes")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Revisão rejeitada",
        description: "Essa revisão foi ignorada.",
      });
      queryClient.invalidateQueries({ queryKey: ["reviewTopics"] });
    },
  });

  return {
    reviewTopic: reviewTopics,
    isLoading,
    isError,
    handleMarkReviewCompleted: handleMarkReviewCompleted.mutate,
    handleRejectReview: handleRejectReview.mutate,
  };
};
