
import { supabase } from "@/integrations/supabase/client";
import { startOfWeek, endOfWeek } from "date-fns";

export interface RankingUser {
  position: number;
  userId: string;
  name: string;
  weeklyXp: number;
  level: number;
}

export const fetchWeeklyRanking = async (): Promise<RankingUser[]> => {
  try {
    // Calculate current week boundaries
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 }); // Sunday

    // Get weekly XP for all users
    const { data: weeklyXp, error: weeklyXpError } = await supabase
      .from('user_xp')
      .select(`
        user_id,
        xp,
        level
      `)
      .gt('xp', 0)
      .order('xp', { ascending: false })
      .limit(10);

    if (weeklyXpError) {
      console.error("Error fetching weekly ranking:", weeklyXpError);
      return [];
    }

    // Get user profiles for names
    const userIds = weeklyXp?.map(xp => xp.user_id) || [];
    const { data: profiles, error: profilesError } = await supabase
      .from('users')
      .select('id, name')
      .in('id', userIds);

    if (profilesError) {
      console.error("Error fetching user profiles:", profilesError);
      return [];
    }

    // Map together
    const ranking: RankingUser[] = (weeklyXp || []).map((xp, index) => {
      const userProfile = profiles?.find(profile => profile.id === xp.user_id);
      
      return {
        position: index + 1,
        userId: xp.user_id,
        name: userProfile?.name || "Unknown User",
        weeklyXp: xp.xp || 0,
        level: xp.level || 1
      };
    });

    return ranking;
  } catch (error) {
    console.error("Error fetching weekly ranking:", error);
    return [];
  }
};
