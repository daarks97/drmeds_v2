import { supabase } from "@/integrations/supabase/client";
import { StudyPlan } from "@/lib/types";

// Retorna datetime no fuso UTC-3 (Brasília)
function getBrazilDateTime() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const brasilia = new Date(now.getTime() - offset * 60000 - 3 * 60 * 60 * 1000);
  return brasilia.toISOString();
}

export const toggleStudyPlanDifficulty = async (
  id: string,
  isDifficult: boolean
): Promise<StudyPlan> => {
  console.log(`🧠 Toggling study plan difficulty: ${id} to ${isDifficult ? 'difficult' : 'normal'}`);
  
  const { data, error } = await supabase
    .from("study_plans")
    .update({
      is_difficult: isDifficult,
      updated_at: getBrazilDateTime(),
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error toggling study plan difficulty:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error("Nenhum plano de estudo encontrado para atualizar.");
  }

  // 💡 Refetch or invalidate statistics cache in the calling component if needed

  return data[0] as StudyPlan;
};
