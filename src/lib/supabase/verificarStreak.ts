import { supabase } from "@/integrations/supabase/client";
import { registrarConquista } from "./registrarConquista";

export async function verificarStreak(userId: string) {
  const { data, error } = await supabase
    .from("revisoes")
    .select("data_conclusao")
    .eq("user_id", userId)
    .not("data_conclusao", "is", null);

  if (error || !data) return;

  const dias = new Set(
    data.map((rev) => new Date(rev.data_conclusao).toISOString().split("T")[0])
  );

  const hoje = new Date();
  let streak = 0;

  for (let i = 0; i < 7; i++) {
    const dia = new Date(hoje);
    dia.setDate(dia.getDate() - i);
    const diaFormatado = dia.toISOString().split("T")[0];
    if (dias.has(diaFormatado)) {
      streak++;
    } else {
      break;
    }
  }

  if (streak >= 3) {
    await registrarConquista(userId, "streak_3");
  }
  if (streak >= 5) {
    await registrarConquista(userId, "streak_5");
  }
  if (streak >= 7) {
    await registrarConquista(userId, "streak_7");
  }
}
