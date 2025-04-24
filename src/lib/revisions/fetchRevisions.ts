import { supabase } from "@/integrations/supabase/client";
import { Revision } from "@/lib/types";

export const fetchRevisions = async (): Promise<Revision[]> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("❌ Erro ao obter usuário:", userError);
    throw new Error("Usuário não autenticado.");
  }

  const { data, error } = await supabase
    .from("revisions")
    .select("*")
    .eq("user_id", user.id)
    .order("revision_date", { ascending: true });

  if (error) {
    console.error("❌ Erro ao buscar revisões:", error.message);
    throw error;
  }

  return data as Revision[];
};
