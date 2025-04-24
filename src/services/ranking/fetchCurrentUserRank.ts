
import { supabase } from "@/integrations/supabase/client";

export interface UserRank {
  position: number;
  xp: number;
  userId: string;
  name: string;
}

export const fetchCurrentUserRank = async (): Promise<UserRank | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log("User not authenticated");
      return null;
    }

    // Get current user's XP
    const { data: userXp, error: userXpError } = await supabase
      .from('user_xp')
      .select('xp, user_id')
      .eq('user_id', user.id)
      .single();

    if (userXpError) {
      console.error("Error fetching user XP:", userXpError);
      return null;
    }

    if (!userXp) {
      return null;
    }

    // Get user name from users table
    const { data: userProfile, error: userProfileError } = await supabase
      .from('users')
      .select('name')
      .eq('id', user.id)
      .single();

    if (userProfileError) {
      console.error("Error fetching user profile:", userProfileError);
      return null;
    }

    // Get all users with higher XP to determine rank
    const { data: higherXpUsers, error: rankingError } = await supabase
      .from('user_xp')
      .select('user_id')
      .gt('xp', userXp.xp)
      .order('xp', { ascending: false });

    if (rankingError) {
      console.error("Error fetching ranking:", rankingError);
      return null;
    }

    const userRank = {
      position: (higherXpUsers?.length || 0) + 1,
      xp: userXp.xp,
      userId: user.id,
      name: userProfile?.name || "User"
    };

    return userRank;
  } catch (error) {
    console.error("Error fetching current user rank:", error);
    return null;
  }
};
