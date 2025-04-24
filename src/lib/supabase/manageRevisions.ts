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

// Marca como concluída e gera próxima revisão (D7 ou D30)
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

// Marca uma revisão como recusada
async function markRevisionAsRefused(id: string) {
  const { error } = await supabase
    .from("revisoes")
    .update({
      is_refused: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("❌ Erro ao recusar revisão:", error);
    throw error;
  }

  return { success: true };
}

// Reativa uma revisão recusada (muda para amanhã e zera status)
async function reactivateRevision(id: string) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const revisionDate = tomorrow.toISOString().split("T")[0];

  const { error } = await supabase
    .from("revisoes")
    .update({
      is_refused: false,
      is_completed: false,
      status_revisao: null,
      data_conclusao: null,
      data_revisao: revisionDate,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("❌ Erro ao reativar revisão:", error);
    throw error;
  }

  return { success: true };
}

// Alias usado nos hooks
const markRevisionAsCompleted = concluirRevisao;

export {
  buscarRevisoesDoTema,
  concluirRevisao,
  markRevisionAsCompleted,
  markRevisionAsRefused,
  reactivateRevision, // ✅ nova exportação
};
