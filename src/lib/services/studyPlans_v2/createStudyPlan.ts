import { supabase } from "@/integrations/supabase/client";
import { getBrazilDatePlusDays } from "@/lib/utils";
import { StudyPlan } from "@/lib/types";

interface CreateStudyPlanParams {
  user_id: string;
  theme: string;
  discipline: string;
  planned_date?: string;
}

export const createStudyPlan = async ({
  user_id,
  theme,
  discipline,
  planned_date,
}: CreateStudyPlanParams): Promise<StudyPlan> => {
  const today = getBrazilDatePlusDays(0);
  const dateToUse = planned_date || today;

  const { data, error } = await supabase
    .from("study_plans")
    .insert({
      user_id,
      theme,
      discipline,
      planned_date: dateToUse,
      is_completed: false,
    })
    .select()
    .single();

  if (error) {
    console.error("❌ Erro ao criar plano de estudo:", error);
    throw error;
  }

  return data as StudyPlan;
};