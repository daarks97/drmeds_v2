import { supabase } from "@/integrations/supabase/client";
import { createNextRevision } from "@/lib/revisions/createNextRevision";
import { getBrazilDatePlusDays } from "@/lib/dateHelpers";
import { Revision } from "@/lib/types";

export const markRevisionAsCompleted = async (revision: Revision) => {
  const today = getBrazilDatePlusDays(0);

  const { error } = await supabase
    .from("revisions")
    .update({ is_completed: true, completed_at: today })
    .eq("id", revision.id);

  if (error) {
    console.error("❌ Erro ao marcar revisão como concluída:", error.message);
    throw error;
  }

  // Se for D1 ou D7, cria a próxima
  if (revision.revision_stage !== "D30") {
    await createNextRevision(revision);
  }

  return true;
};