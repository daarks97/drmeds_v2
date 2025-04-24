import { supabase } from "@/integrations/supabase/client";
import { Revision } from "@/lib/types";
import { getBrazilDatePlusDays } from "@/lib/dateHelpers";

// Função genérica para buscar por data
const fetchRevisionsByDate = async (date: string): Promise<Revision[]> => {
  const { data, error } = await supabase
    .from("revisions")
    .select(`
      *,
      study_plans:study_plan_id (
        theme,
        discipline,
        difficulty
      )
    `)
    .eq("revision_date", date)
    .eq("is_completed", false)
    .eq("is_refused", false)
    .order("revision_date", { ascending: true });

  if (error) {
    console.error(`❌ Erro ao buscar revisões da data ${date}:`, error);
    throw error;
  }

  return data as Revision[];
};

// Busca todas as revisões de um plano de estudo
export const fetchRevisions = async (studyPlanId: string): Promise<Revision[]> => {
  const { data, error } = await supabase
    .from("revisions")
    .select("*")
    .eq("study_plan_id", studyPlanId)
    .order("revision_date", { ascending: true });

  if (error) {
    console.error("❌ Erro ao buscar revisões por study_plan_id:", error);
    throw error;
  }

  return data as Revision[];
};

// Busca revisões agendadas para hoje
export const fetchTodayRevisions = async (): Promise<Revision[]> => {
  const today = getBrazilDatePlusDays(0);
  return fetchRevisionsByDate(today);
};

// Busca revisões agendadas para amanhã
export const fetchTomorrowRevisions = async (): Promise<Revision[]> => {
  const tomorrow = getBrazilDatePlusDays(1);
  return fetchRevisionsByDate(tomorrow);
};

// Busca revisões atrasadas (data anterior a hoje)
export const fetchLateRevisions = async (): Promise<Revision[]> => {
  const today = getBrazilDatePlusDays(0);
  
  const { data, error } = await supabase
    .from("revisions")
    .select(`
      *,
      study_plans:study_plan_id (
        theme,
        discipline,
        difficulty
      )
    `)
    .lt("revision_date", today)
    .eq("is_completed", false)
    .eq("is_refused", false)
    .order("revision_date", { ascending: true });

  if (error) {
    console.error("❌ Erro ao buscar revisões atrasadas:", error);
    throw error;
  }

  return data as Revision[];
};

// Busca revisões recusadas
export const fetchRefusedRevisions = async (): Promise<Revision[]> => {
  const { data, error } = await supabase
    .from("revisions")
    .select(`
      *,
      study_plans:study_plan_id (
        theme,
        discipline,
        difficulty
      )
    `)
    .eq("is_refused", true)
    .order("revision_date", { ascending: true });

  if (error) {
    console.error("❌ Erro ao buscar revisões recusadas:", error);
    throw error;
  }

  return data as Revision[];
};
