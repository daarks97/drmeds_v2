import { supabase } from "@/integrations/supabase/client";

export const deleteStudyPlan = async (id: string): Promise<void> => {
  const { error } = await supabase.from("study_plans").delete().eq("id", id);

  if (error) {
    console.error("❌ Erro ao deletar plano de estudo:", error);
    throw error;
  }
};