import { supabase } from "@/integrations/supabase/client";
import { StudyPlan } from "@/lib/types";

export const updateStudyPlan = async (
  id: string,
  updates: Partial<StudyPlan>
): Promise<StudyPlan> => {
  const { data, error } = await supabase
    .from("study_plans")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("❌ Erro ao atualizar plano de estudo:", error);
    throw error;
  }

  return data as StudyPlan;
};