import { supabase } from "@/integrations/supabase/client";
import { ganharXP } from "./xp";

// Busca todas as revisões de um tema para um usuário
async function buscarRevisoesDoTema(userId: string, tema: string) {
  const { data, error } = await supabase
    .from("revisoes")
    .select("*")
    .eq("user_id", userId)
    .eq("tema", tema)
    .order("data_revisao", { ascending: true });

  return { revisoes: data || [], error };
}

// Marca uma revisão como concluída e gera a próxima (D7 ou D30)
async function concluirRevisao(id: string) {
  const { data: atual, error: errBusca } = await supabase
    .from("revisoes")
    .select("*")
    .eq("id", id)
    .single();

  if (errBusca || !atual) return { error: errBusca || "Revisão não encontrada" };

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

  const tipoAtual = atual.tipo;
  const proximoTipo = tipoAtual === "D1" ? "D7" : tipoAtual === "D7" ? "D30" : null;

  if (!proximoTipo) return { nova: null };

  const dias = proximoTipo === "D7" ? 7 : 30;
  const dataNova = new Date();
  dataNova.setDate(dataNova.getDate() + dias);
  const dataRevisao = dataNova.toISOString().split("T")[0];

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

// Alias necessário para hooks que usam esse nome
const markRevisionAsCompleted = concluirRevisao;

export {
  buscarRevisoesDoTema,
  concluirRevisao,
  markRevisionAsCompleted,
};
