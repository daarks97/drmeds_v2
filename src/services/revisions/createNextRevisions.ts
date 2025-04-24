
import { supabase } from "@/integrations/supabase/client";
import { getBrazilDatePlusDays } from "@/lib/dateHelpers";

// Tipos de revisão possíveis
export type RevisionStage = "D1" | "D7" | "D30";

// Cria todas as revisões futuras de um estudo (D1, D7, D30)
export const createNextRevisions = async (
  studyPlanId: string,
  theme: string
): Promise<boolean> => {
  console.log(`📅 Iniciando revisões para "${theme}"...`);

  try {
    const revisionSchedule: { days: number; stage: RevisionStage }[] = [
      { days: 1, stage: "D1" },
      { days: 7, stage: "D7" },
      { days: 30, stage: "D30" }
    ];

    const revisions = revisionSchedule.map(({ days, stage }) => ({
      study_plan_id: studyPlanId,
      revision_date: getBrazilDatePlusDays(days),
      revision_stage: stage,
      is_completed: false,
      is_refused: false
    }));

    const { error } = await supabase
      .from("revisions")
      .insert(revisions);

    if (error) {
      console.error("❌ Erro ao criar revisões:", error.message);
      return false;
    }

    console.log("✅ Revisões D1, D7 e D30 criadas com sucesso!");
    return true;

  } catch (err) {
    console.error("❌ Erro inesperado ao criar revisões:", err);
    return false;
  }
};
