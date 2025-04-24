import { supabase } from "@/integrations/supabase/client";
import { getBrazilDatePlusDays } from "@/lib/utils";
import { createNextRevisions } from "@/lib/revisions/createNextRevision";

// Define concrete interface to avoid deep type instantiation
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

    return data as StudyPlanResult;

  } catch (err) {
    console.error("❌ Erro ao concluir tema e gerar revisões:", err);
    throw err;
  }
};

// ✅ Exportações necessárias para evitar erros nos imports
export { completeStudyPlanById as concluirTema };
export { completeStudyPlanById as markStudyPlanAsCompleted };
