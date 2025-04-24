import { supabase } from "@/integrations/supabase/client";

export const refuseRevision = async (revisionId: string) => {
  const { error } = await supabase
    .from("revisions")
    .update({ is_refused: true })
    .eq("id", revisionId);

  if (error) {
    console.error("❌ Erro ao recusar revisão:", error.message);
    throw error;
  }

  console.log(`🛑 Revisão ${revisionId} marcada como recusada.`);
  return true;
};
