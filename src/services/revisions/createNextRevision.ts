import { supabase } from "@/integrations/supabase/client";
import { Revision } from "@/lib/types";
import { getBrazilDatePlusDays } from "@/lib/dateHelpers";

type RevisionStage = 'D1' | 'D7' | 'D30';

export const createNextRevision = async (currentRevision: Revision) => {
  const { revision_stage, study_plan_id } = currentRevision;

  let nextStage: RevisionStage | null = null;
  let daysToAdd = 0;

  switch (revision_stage) {
    case 'D1':
      nextStage = 'D7';
      daysToAdd = 7;
      break;
    case 'D7':
      nextStage = 'D30';
      daysToAdd = 30;
      break;
    case 'D30':
      console.log('✅ Ciclo de revisão completo (D30). Nenhuma nova revisão criada.');
      return null;
    default:
      console.warn(`⚠️ Estágio desconhecido: ${revision_stage}`);
      return null;
  }

  if (!nextStage) return null;

  try {
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
      .select();

    if (error) {
      console.error("❌ Erro ao criar próxima revisão:", error.message, error.details);
      throw error;
    }

    console.log(`✅ Revisão ${nextStage} criada para ${revisionDateStr}:`, data?.[0]);
    return data?.[0] as Revision;

  } catch (err) {
    console.error("❌ Erro inesperado em createNextRevision:", err);
    throw err;
  }
};
