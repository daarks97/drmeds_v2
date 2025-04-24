
import { supabase } from "@/integrations/supabase/client";

export async function fetchHomeData(userId: string) {
  const today = new Date().toISOString().split('T')[0];

  const { data: temaHoje } = await supabase
    .from("study_plans")
    .select("tema")
    .eq("user_id", userId)
    .eq("planned_date", today)
    .maybeSingle();

  const { data: revisoesPendentes } = await supabase
    .from("revisoes")
    .select("tema, tipo")
    .eq("user_id", userId)
    .eq("data_revisao", today)
    .eq("concluida", false);

  return {
    temaHoje,
    revisoesPendentes: revisoesPendentes || []
  };
}
