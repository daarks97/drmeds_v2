
import { supabase } from "@/integrations/supabase/client";

export async function ganharXP(userId: string, tipo: string, quantidade: number) {
  // Using "user_xp" table instead of "xp_log" which doesn't exist in the database schema
  const { error } = await supabase.from("user_xp").upsert([
    {
      user_id: userId,
      xp: quantidade, // Add XP directly to user_xp table
      updated_at: new Date().toISOString(),
    }
  ], { onConflict: 'user_id' });

  return { success: !error, error };
}
