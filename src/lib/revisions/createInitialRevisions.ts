import { supabase } from "@/integrations/supabase/client";
import { getBrazilDatePlusDays } from "@/lib/dateHelpers";

export const createInitialRevisions = async (
  study_plan_id: string,
  theme: string
) => {
  const stages = [
    { stage: "D1", daysToAdd: 1 },
    { stage: "D7", daysToAdd: 7 },
    { stage: "D30", daysToAdd: 30 },
  ];

  const revisions = stages.map(({ stage, daysToAdd }) => ({
    study_plan_id,
    revision_stage: stage,
    revision_date: getBrazilDatePlusDays(daysToAdd),
    is_completed: false,
    is_refused: false,
  }));

  const { data, error } = await supabase
    .from("revisions")
    .insert(revisions)
    .select();

  if (error) {
    console.error("❌ Erro ao criar revisões iniciais:", error.message);
    throw error;
  }

  console.log(`✅ Revisões D1, D7, D30 criadas para "${theme}"`);
  return data;
};