import { supabase } from "@/integrations/supabase/client";
import { UserProfile, UserProfileFormData } from "@/lib/types";

export const fetchDefaultUserProfile = async (): Promise<UserProfile> => {
  try {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error("🔒 Nenhum usuário logado.");

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("❌ Erro ao buscar perfil do usuário:", error);
      throw error;
    }

    if (!data) throw new Error("Perfil do usuário não encontrado.");

    return data as UserProfile;
  } catch (error) {
    console.error("❌ Erro geral ao buscar perfil do usuário:", error);
    throw error;
  }
};

export const updateUserProfile = async (
  id: string,
  updates: UserProfileFormData
): Promise<UserProfile> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({
        ...updates,
        updated_at: new Date().toISOString(), // opcional, se existir esse campo na tabela
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`❌ Erro ao atualizar perfil do usuário [${id}]:`, error);
      throw error;
    }

    if (!data) throw new Error(`Perfil do usuário com id ${id} não foi encontrado.`);

    return data as UserProfile;
  } catch (error) {
    console.error(`❌ Erro geral ao atualizar perfil do usuário [${id}]:`, error);
    throw error;
  }
};
