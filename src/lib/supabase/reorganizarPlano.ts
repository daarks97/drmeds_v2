import { supabase } from "@/integrations/supabase/client";

function getBrazilDatePlusDays(days: number) {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const date = new Date(now.getTime() - offset * 60000);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

export async function reorganizarPlano(userId: string) {
  // Pega todos os temas do plano que ainda não foram concluídos
  const { data: pendentes, error } = await supabase
    .from("study_plans")
    .select("id")
    .eq("user_id", userId)
    .eq("is_completed", false)
    .order("planned_date", { ascending: true });

  if (error || !pendentes) return { success: false, error };

  // Atualiza a data de cada tema a partir de hoje
  const updates = pendentes.map((item, index) => ({
    id: item.id,
    planned_date: getBrazilDatePlusDays(index),
  }));

  const updatesWithIds = updates.map(({ id, planned_date }) =>
    supabase.from("study_plans").update({ planned_date }).eq("id", id)
  );

  await Promise.all(updatesWithIds);

  return { success: true };
}
