import { supabase } from "@/integrations/supabase/client";
import { StudyPlan, StudyPlanFormData } from "@/lib/types";

// Padroniza data com fuso UTC-3
function getBrazilDateTime() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const brasilia = new Date(now.getTime() - offset * 60000 - 3 * 60 * 60 * 1000);
  return brasilia.toISOString();
}

export const updateStudyPlan = async (
  id: string,
  studyPlan: StudyPlanFormData
): Promise<StudyPlan> => {
  const { data, error } = await supabase
    .from("study_plans")
    .update({
      theme: studyPlan.theme,
      discipline: studyPlan.discipline,
      planned_date: studyPlan.planned_date.toISOString().split("T")[0],
      updated_at: getBrazilDateTime(),
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating study plan:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error("Plano de estudo não encontrado para atualização.");
  }

  return data[0] as StudyPlan;
};

export const updateStudyPlanSummaryLink = async (
  id: string,
  summaryLink: string
): Promise<StudyPlan> => {
  const { data, error } = await supabase
    .from("study_plans")
    .update({
      summary_link: summaryLink,
      updated_at: getBrazilDateTime(),
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating study plan summary link:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error("Plano de estudo não encontrado para atualizar link de resumo.");
  }

  return data[0] as StudyPlan;
};

export const updateStudyPlanDifficulty = async (
  id: string,
  difficulty: "easy" | "medium" | "hard"
): Promise<StudyPlan> => {
  const { data, error } = await supabase
    .from("study_plans")
    .update({
      difficulty,
      updated_at: getBrazilDateTime(),
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating study plan difficulty:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error("Plano de estudo não encontrado para atualizar dificuldade.");
  }

  return data[0] as StudyPlan;
};
