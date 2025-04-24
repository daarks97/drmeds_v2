import { supabase } from "@/integrations/supabase/client";
import { Revision } from "@/lib/types";

export const getRevisionsByUser = async (userId: string) => {
  const { data, error } = await supabase
    .from("revisions")
    .select("*")
    .eq("user_id", userId)
    .order("revision_date", { ascending: true });

  if (error) {
    console.error("❌ Erro ao buscar revisões do usuário:", error.message);
    throw error;
  }

  return data as Revision[];
};