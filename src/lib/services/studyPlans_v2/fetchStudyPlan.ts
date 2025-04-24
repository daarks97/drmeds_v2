// src/lib/services/studyPlans_v2/fetchStudyPlan.ts

import { supabase } from "@/integrations/supabase/client";
import { StudyPlan } from "@/lib/types";

export const fetchStudyPlan = async (id: string): Promise<StudyPlan> => {
  const { data, error } = await supabase
    .from("study_plans")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as StudyPlan;
};
