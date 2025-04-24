
import { supabase } from "@/integrations/supabase/client";
import { getBrazilDatePlusDays } from "@/lib/utils";
import { createNextRevisions } from "@/lib/revisions/createNextRevision";

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

  // Buscar plano de estudo pelo ID
  const { data: studyPlan, error: fetchError } = await supabase
    .from("study_plans")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !studyPlan) {
    console.error("❌ Falha ao buscar plano de estudo:", fetchError);
    throw fetchError ?? new Error("Plano de estudo não encontrado.");
  }

  // Atualizar como concluído
  const { data: updatedPlan, error: updateError } = await supabase
    .from("study_plans")
    .update({
      is_completed: true,
      completed_at: today,
      updated_at: today,
    })
    .eq("id", id)
    .select()
    .single();

  if (updateError || !updatedPlan) {
    console.error("❌ Falha ao marcar como concluído:", updateError);
    throw updateError ?? new Error("Erro ao atualizar plano de estudo.");
  }

  // Criar revisões automáticas D1, D7, D30
  try {
    await createNextRevisions(id, studyPlan.theme);
  } catch (revisionError) {
    console.error("⚠️ Tema concluído, mas falha ao gerar revisões:", revisionError);
    // Não bloqueia o fluxo — marca como concluído mesmo que falhe aqui
  }

  return updatedPlan as StudyPlanResult;
};

// Aliases para importações legadas
export { completeStudyPlanById as concluirTema };
export { completeStudyPlanById as markStudyPlanAsCompleted };
