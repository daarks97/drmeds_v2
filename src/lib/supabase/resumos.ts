import { supabase } from "@/integrations/supabase/client";

export async function salvarResumo(userId: string, tema: string, conteudo: string) {
  const { error } = await supabase
    .from("resumos")
    .upsert([
      {
        user_id: userId,
        tema,
        conteudo,
        atualizado_em: new Date().toISOString(),
      },
    ])
    .eq("user_id", userId)
    .eq("tema", tema);

  return { success: !error, error };
}

export async function buscarResumo(userId: string, tema: string) {
  const { data, error } = await supabase
    .from("resumos")
    .select("conteudo")
    .eq("user_id", userId)
    .eq("tema", tema)
    .single();

  return { conteudo: data?.conteudo || "", error };
}
