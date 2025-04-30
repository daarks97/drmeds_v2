import { supabase } from "@/integrations/supabase/client";
import { ganharXP } from "./xp";
import { registrarConquista } from "./registrarConquista";

interface RegistrarRespostaParams {
  userId: string;
  questaoId: string;
  tema: string;
  prova: string;
  ano: number;
  alternativa: string;
  acertou: boolean;
}

export async function registrarRespostaQuestao({
  userId,
  questaoId,
  tema,
  prova,
  ano,
  alternativa,
  acertou
}: RegistrarRespostaParams) {
  const { error } = await supabase.from("respostas_questoes").insert({
    user_id: userId,
    questao_id: questaoId,
    tema,
    prova,
    ano,
    alternativa_marcada: alternativa,
    correta: acertou ? alternativa : null // opcionalmente armazena correta apenas se acertou
  });

  if (!error && acertou) {
    await ganharXP(userId, "questao", 2);
  }

  // Verifica conquistas por tema
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
