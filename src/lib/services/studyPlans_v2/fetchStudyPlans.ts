// src/services/studyPlans_v2/fetchStudyPlans.ts
import { supabase } from "@/integrations/supabase/client";
import { StudyPlan } from "@/lib/types";

export const fetchStudyPlans = async (discipline?: string): Promise<StudyPlan[]> => {
  let query = supabase
    .from("study_plans")
    .select("*")
    .order("planned_date", { ascending: true });

  if (discipline && discipline !== "Todas") {
    query = query.eq("discipline", discipline);
  }

  const { data, error } = await query;

  if (error) {
    console.error("❌ Erro ao buscar planos de estudo:", error);
    throw error;
  }

  return data as StudyPlan[];
};

export const fetchStudyPlan = async (id: string): Promise<StudyPlan> => {
  const { data, error } = await supabase
    .from("study_plans")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("❌ Erro ao buscar plano de estudo:", error);
    throw error;
  }

  return data as StudyPlan;
};
