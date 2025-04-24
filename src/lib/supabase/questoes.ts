import { supabase } from "@/integrations/supabase/client";
import { ganharXP } from "./xp";
import { registrarConquista } from "./registrarConquista"; // garante que o caminho esteja certo

interface RegistrarRespostaParams {
  userId: string;
  questaoId: string;
  tema: string;
  acertou: boolean;
}

export async function registrarRespostaQuestao({
  userId,
  questaoId,
  tema,
  acertou
}: RegistrarRespostaParams) {
  const { error } = await supabase
    .from("questoes_respostas")
    .insert({
      user_id: userId,
      questao_id: questaoId,
      tema,
      acertou
    });

  if (!error && acertou) {
    await ganharXP(userId, "questao", 2);
  }

  // 🧠 Verificar e registrar conquistas com base no desempenho do tema
  const { data: desempenho, error: desempenhoError } = await supabase
    .from("desempenho_por_tema")
    .select("*")
    .eq("user_id", userId)
    .eq("tema", tema)
    .maybeSingle();

  if (desempenho && !desempenhoError) {
    const { percentual_acerto } = desempenho;

    if (percentual_acerto >= 90) {
      await registrarConquista(userId, "mestre_tema", tema);
    }

    if (percentual_acerto === 100) {
      await registrarConquista(userId, "gabarito", tema);
    }
  }

  return { success: !error, error };
}
