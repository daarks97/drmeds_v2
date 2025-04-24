import { supabase } from "@/integrations/supabase/client";
import { getBrazilDatePlusDays } from "@/lib/utils";
import { Revision } from "@/lib/types";

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

    if (fetchError || !studyPlan) {
      console.error("❌ Erro ao buscar tema:", fetchError);
      throw fetchError ?? new Error("Plano de estudo não encontrado.");
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

    if (error || !data) {
      console.error("❌ Erro ao atualizar tema como concluído:", error);
      throw error ?? new Error("Erro ao marcar plano como concluído.");
    }

    // 3. Buscar usuário
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("Usuário não autenticado.");

    // 4. Criar revisões D1, D7, D30
    const revisionsToCreate: Omit<Revision, "id">[] = ["D1", "D7", "D30"].map((stage) => ({
      user_id: user.id,
      study_plan_id: id,
      theme: studyPlan.theme,
      revision_stage: stage as "D1" | "D7" | "D30",
      revision_date: getBrazilDatePlusDays(stage === "D1" ? 1 : stage === "D7" ? 7 : 30),
      is_completed: false,
      is_refused: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { error: insertError } = await supabase
      .from("revisions")
      .insert(revisionsToCreate);

    if (insertError) {
      console.error("❌ Erro ao criar revisões D1, D7, D30:", insertError);
      throw insertError;
    }

    return data as StudyPlanResult;

  } catch (err) {
    console.error("❌ Erro ao concluir tema e gerar revisões:", err);
    throw err;
  }
};

export { completeStudyPlanById as concluirTema };
export { completeStudyPlanById as markStudyPlanAsCompleted };
