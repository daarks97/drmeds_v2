import { supabase } from "@/integrations/supabase/client";
import { StudyPlan } from "@/lib/types";
import { createNextRevisions } from "../revisions/createNextRevisions";
import { getBrazilDatePlusDays } from "@/lib/dateHelpers";

// Marca um plano de estudo como concluído e cria revisões futuras
export const completeStudyPlanById = async (id: string): Promise<StudyPlan> => {
  const today = getBrazilDatePlusDays(0);

  try {
    // 1. Buscar o plano de estudo atual
    const { data: studyPlan, error: fetchError } = await supabase
      .from("study_plans")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("❌ Erro ao buscar tema:", fetchError);
      throw fetchError;
    }

    // 2. Marcar como concluído com data
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

    if (error) {
      console.error("❌ Erro ao atualizar tema como concluído:", error);
      throw error;
    }

    // 3. Criar revisões D1, D7 e D30
    await createNextRevisions(id, studyPlan.theme);

    return data as StudyPlan;

  } catch (err) {
    console.error("❌ Erro ao concluir tema e gerar revisões:", err);
    throw err;
  }
};
