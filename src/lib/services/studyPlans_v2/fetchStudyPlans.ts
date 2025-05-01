import { supabase } from "@/integrations/supabase/client";

export const fetchStudyPlans = async () => {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user?.id) {
    console.warn("⚠️ Sem sessão ativa no Supabase", userError);
    return [];
  }

  const userId = userData.user.id;

  const { data, error } = await supabase
    .from("study_plans")
    .select("*")
    .eq("user_id", userId)
    .order("planned_date", { ascending: true });

  if (error) throw error;

  return data;
};
