import { supabase } from "@/integrations/supabase/client";
import { ganharXP } from "./xp";

export async function buscarRevisoesDoTema(userId: string, tema: string) {
  const { data, error } = await supabase
    .from("revisoes")
    .select("*")
    .eq("user_id", userId)
    .eq("tema", tema)
    .order("data_revisao", { ascending: true });

  return { revisoes: data || [], error };
}

export async function concluirRevisao(id: string) {
  // 1. Buscar a revisão atual
  const { data: atual, error: errBusca } = await supabase
    .from("revisoes")
    .select("*")
    .eq("id", id)
    .single();

  if (errBusca || !atual) return { error: errBusca || "Revisão não encontrada" };

  // 2. Marcar como concluída
  const dataConclusao = new Date().toISOString();

  const { error: errUpdate } = await supabase
    .from("revisoes")
    .update({
      concluida: true,
      data_conclusao: dataConclusao,
      status_revisao: "sucesso",
    })
    .eq("id", id);

  if (errUpdate) return { error: errUpdate };

  await ganharXP(atual.user_id, "revisao", 5);

  // 3. Definir próxima revisão
  const tipoAtual = atual.tipo;
  const proximoTipo =
    tipoAtual === "D1" ? "D7" :
    tipoAtual === "D7" ? "D30" : null;

  if (!proximoTipo) {
    return { nova: null }; // D30 é a última
  }

  // 4. Calcular nova data com base na data de hoje
  const dias = proximoTipo === "D7" ? 7 : 30;
  const dataNova = new Date();
  dataNova.setDate(dataNova.getDate() + dias);
  const dataRevisao = dataNova.toISOString().split("T")[0];

  // 5. Criar a próxima revisão
  const { data: nova, error: errNova } = await supabase
    .from("revisoes")
    .insert({
      user_id: atual.user_id,
      tema: atual.tema,
      tipo: proximoTipo,
      data_revisao: dataRevisao,
      concluida: false,
    })
    .select()
    .single();

  return { nova, error: errNova };
}
