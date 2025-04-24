import { supabase } from "@/integrations/supabase/client";
import { Revision } from "@/lib/types";
import { getBrazilDatePlusDays } from "@/lib/dateHelpers";

type RevisionStage = "D1" | "D7" | "D30";

const nextStageMap: Record<RevisionStage, RevisionStage | null> = {
  D1: "D7",
  D7: "D30",
  D30: null,
};

const daysToAddMap: Record<RevisionStage, number> = {
  D1: 7,
  D7: 23, // Corrigido de 30 → 23 para manter 30 dias totais se necessário
  D30: 0,
};

export const createNextRevision = async (
  currentRevision: Revision
): Promise<Revision | null> => {
  const { revision_stage, study_plan_id } = currentRevision;

  const nextStage = nextStageMap[revision_stage];
  const daysToAdd = daysToAddMap[revision_stage];

  if (!nextStage) {
    console.info("✅ Ciclo de revisão completo (D30). Nenhuma nova revisão criada.");
    return null;
  }

  const revisionDateStr = getBrazilDatePlusDays(daysToAdd);

  const { data, error } = await supabase
    .from("revisions")
    .insert({
      study_plan_id,
      revision_date: revisionDateStr,
      revision_stage: nextStage,
      is_completed: false,
      is_refused: false,
    })
    .select()
    .single();

  if (error) {
    console.error(`❌ Erro ao criar revisão ${nextStage}:`, error.message);
    throw error;
  }

  console.log(`✅ Revisão ${nextStage} agendada para ${revisionDateStr}`);
  return data as Revision;
};
