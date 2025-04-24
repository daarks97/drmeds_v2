
import { supabase } from "@/integrations/supabase/client";

function getMondayAndToday() {
  const now = new Date();
  const today = new Date(now);
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1)); // se for domingo, volta 6 dias

  return {
    start: monday.toISOString().split("T")[0],
    end: today.toISOString().split("T")[0],
  };
}

export async function buscarProgressoSemanal(userId: string) {
  const { start, end } = getMondayAndToday();

  // Remove explicit type instantiation
  const { data } = await supabase
    .from("study_plans")
    .select("id")
    .eq("user_id", userId)
    .eq("is_completed", true) // Use is_completed instead of concluido
    .gte("planned_date", start) // Use planned_date instead of data_estudo
    .lte("planned_date", end);

  return {
    totalConcluidos: data?.length || 0,
    meta: 5, // meta semanal padrão
  };
}
