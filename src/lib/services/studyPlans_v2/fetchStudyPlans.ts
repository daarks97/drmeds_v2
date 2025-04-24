import { supabase } from "@/integrations/supabase/client";
import { StudyPlan } from "@/lib/types";
import { QueryFunctionContext } from "@tanstack/react-query";

export const fetchStudyPlans = async (
  ctx: QueryFunctionContext<readonly unknown[]>
): Promise<StudyPlan[]> => {
  // Extrai disciplina com segurança
  const discipline = (ctx.queryKey[1] as string | undefined) ?? 'Todas';

  let query = supabase
    .from("study_plans")
    .select("*")
    .order("planned_date", { ascending: true });

  if (discipline !== "Todas") {
    query = query.eq("discipline", discipline);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as StudyPlan[];
};
