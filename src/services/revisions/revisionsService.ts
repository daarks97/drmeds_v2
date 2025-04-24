import { supabase } from "@/integrations/supabase/client";
import { Revision } from "@/lib/types";

// Busca todas as revisões com dados do plano embutidos
export const fetchAllRevisions = async (): Promise<Revision[]> => {
  try {
    const { data, error } = await supabase
      .from("revisions")
      .select(`
        id,
        study_plan_id,
        revision_date,
        revision_stage,
        is_completed,
        is_refused,
        created_at,
        study_plans:study_plan_id (
          theme,
          discipline,
          difficulty,
          is_difficult
        )
      `)
      .order("revision_date", { ascending: true });

    if (error) {
      console.error("❌ Erro ao buscar todas as revisões:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("❌ Erro inesperado ao buscar revisões:", error);
    throw error;
  }
};

// Atualiza qualquer campo da revisão por ID
export const updateRevisionById = async (
  id: string,
  updates: Partial<Revision>
): Promise<Revision | null> => {
  try {
    const { data, error } = await supabase
      .from("revisions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`❌ Erro ao atualizar revisão ${id}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`❌ Erro inesperado ao atualizar revisão ${id}:`, error);
    return null;
  }
};
