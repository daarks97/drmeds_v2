import { supabase } from "@/integrations/supabase/client";
import { StudyPlan } from "@/lib/types";
import { markStudyPlanAsCompleted } from "@/lib/services/studyPlans_v2/completeStudyPlan"; // ✅ Corrigido

// Centralizada para evitar duplicação
function getBrazilDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const date = new Date(now.getTime() - offset * 60000 - 3 * 60 * 60 * 1000); // UTC-3
  return date.toISOString().split("T")[0];
}

export const toggleStudyPlanCompletion = async (
  id: string,
  isCompleted: boolean
): Promise<StudyPlan> => {
  console.log(`🔄 Toggling study plan completion: ${id} to ${isCompleted ? 'completed' : 'incomplete'}`);

  if (isCompleted) {
    return markStudyPlanAsCompleted(id);
  }

  const todayStr = getBrazilDate();

  try {
    const { data, error } = await supabase
      .from("study_plans")
      .update({
        is_completed: false,
        completed_at: null,
        updated_at: todayStr,
      })
      .eq("id", id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Nenhum estudo encontrado para atualizar.");

    const { error: revisionDeleteError } = await supabase
      .from("revisions")
      .delete()
      .eq("study_plan_id", id)
      .eq("is_completed", false);

    if (revisionDeleteError) {
      console.error("Error deleting pending revisions:", revisionDeleteError);
    }

    return data[0] as StudyPlan;
  } catch (err) {
    console.error("Error toggling study plan completion:", err);
    throw err;
  }
};
