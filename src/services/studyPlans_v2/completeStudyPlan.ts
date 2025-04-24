// src/services/studyPlans_v2/completeStudyPlan.ts
import { supabase } from "@/integrations/supabase/client";
import { getBrazilDatePlusDays } from "@/lib/utils";
import { createNextRevisions } from "@/services/revisions/createNextRevisions";

interface StudyPlanResult {
  id: string;
  theme: string;
  discipline: string;
  planned_date: string;
  is_completed: boolean;
  completed_at?: string | null;
  updated_at: string;
  created_at: string;
}

export const completeStudyPlanById = async (id: string): Promise<StudyPlanResult> => {
  const today = getBrazilDatePlusDays(0);

  try {
    const { data: studyPlan, error: fetchError } = await supabase
      .from("study_plans")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    const { data, error } = await supabase
      .from("study_plans")
      .update({
        is_completed: true,
        completed_at: today,
        updated_at: today
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    await createNextRevisions(id, studyPlan.theme);
    return data as StudyPlanResult;
  } catch (err) {
    console.error("❌ Erro ao concluir tema e gerar revisões:", err);
    throw err;
  }
};

export { completeStudyPlanById as concluirTema };
export { completeStudyPlanById as markStudyPlanAsCompleted };
