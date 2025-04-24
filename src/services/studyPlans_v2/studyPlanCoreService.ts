import { supabase } from "@/integrations/supabase/client";
import { StudyPlan, StudyPlanFormData } from "@/lib/types";

// 🔍 Busca todos os planos de estudo
export const getAllStudyPlans = async (): Promise<StudyPlan[]> => {
  try {
    const { data, error } = await supabase
      .from("study_plans")
      .select("*")
      .order("planned_date", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("❌ Erro ao buscar planos:", error);
    throw error;
  }
};

// ➕ Cria um novo plano de estudo
export const createStudyPlan = async (plan: StudyPlanFormData): Promise<StudyPlan> => {
  try {
    const formattedPlan = {
      ...plan,
      planned_date: plan.planned_date.toISOString().split("T")[0],
    };

    const { data, error } = await supabase
      .from("study_plans")
      .insert([formattedPlan])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("❌ Erro ao criar plano:", error);
    throw error;
  }
};

// ✏️ Atualiza um plano de estudo
export const updateStudyPlan = async (
  id: string,
  updates: Partial<StudyPlan>
): Promise<StudyPlan | null> => {
  try {
    const { data, error } = await supabase
      .from("study_plans")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`❌ Erro ao atualizar plano ${id}:`, error);
    return null;
  }
};

// 🗑️ Deleta um plano de estudo
export const deleteStudyPlan = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("study_plans")
      .delete()
      .eq("id", id);

    if (error) return false;
    return true;
  } catch (error) {
    console.error(`❌ Erro ao deletar plano ${id}:`, error);
    return false;
  }
};

// ✅ Marca como concluído
export const markStudyPlanAsCompleted = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("study_plans")
    .update({ is_completed: true })
    .eq("id", id);

  if (error) throw error;
};

// 🔁 Alterna status de concluído
export const toggleStudyPlanCompletion = async (
  id: string,
  isCompleted: boolean
): Promise<void> => {
  const { error } = await supabase
    .from("study_plans")
    .update({ is_completed: !isCompleted })
    .eq("id", id);

  if (error) throw error;
};

// 🔁 Alterna status de dificuldade
export const toggleStudyPlanDifficulty = async (
  id: string,
  isDifficult: boolean
): Promise<void> => {
  const { error } = await supabase
    .from("study_plans")
    .update({ is_difficult: !isDifficult })
    .eq("id", id);

  if (error) throw error;
};
