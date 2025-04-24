import { supabase } from "@/integrations/supabase/client";
import { getBrazilDatePlusDays } from "@/lib/utils";

export const createNextRevisions = async (studyPlanId: string, theme: string) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("❌ Erro ao obter usuário:", userError);
    throw new Error("Usuário não autenticado.");
  }

  const revisionsToInsert = [
    {
      user_id: user.id,
      study_plan_id: studyPlanId,
      theme,
      revision_stage: "D1",
      revision_date: getBrazilDatePlusDays(1),
      is_completed: false,
      is_refused: false,
    },
    {
      user_id: user.id,
      study_plan_id: studyPlanId,
      theme,
      revision_stage: "D7",
      revision_date: getBrazilDatePlusDays(7),
      is_completed: false,
      is_refused: false,
    },
    {
      user_id: user.id,
      study_plan_id: studyPlanId,
      theme,
      revision_stage: "D30",
      revision_date: getBrazilDatePlusDays(30),
      is_completed: false,
      is_refused: false,
    },
  ];

  const { data, error } = await supabase
    .from("revisions")
    .insert(revisionsToInsert);

  if (error) {
    console.error("❌ Erro ao criar revisões automáticas:", error);
    throw error;
  }

  console.log("✅ Revisões D1, D7 e D30 criadas:", data);
  return data;
};
