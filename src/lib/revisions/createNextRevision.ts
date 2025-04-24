import { supabase } from "@/integrations/supabase/client";
import { getBrazilDatePlusDays } from "@/lib/dateHelpers";
import { Revision } from "@/lib/types";

type RevisionStage = "D1" | "D7" | "D30";

export const createNextRevision = async (
  currentRevision: Revision
): Promise<Revision | null> => {
  const { revision_stage, study_plan_id, user_id, theme } = currentRevision;

  const nextStageMap: Record<RevisionStage, RevisionStage | null> = {
    D1: "D7",
    D7: "D30",
    D30: null,
  };

  const daysToAddMap: Record<RevisionStage, number> = {
    D1: 7,
    D7: 30,
    D30: 0,
  };

  const nextStage = nextStageMap[revision_stage];
  const daysToAdd = daysToAddMap[revision_stage];

  if (!nextStage) {
    console.log("✅ Revisão finalizada (D30). Nenhuma nova revisão criada.");
    return null;
  }

  const revisionDateStr = getBrazilDatePlusDays(daysToAdd);

  const { data, error } = await supabase
    .from("revisions")
    .insert({
      study_plan_id,
      revision_stage: nextStage,
      revision_date: revisionDateStr,
      user_id,
      theme,
      is_completed: false,
      is_refused: false,
    })
    .select()
    .single();

  if (error) {
    console.error("❌ Erro ao criar próxima revisão:", error.message);
    throw error;
  }

  console.log(`✅ Revisão ${nextStage} criada para ${revisionDateStr}`);
  return data as Revision;
};
