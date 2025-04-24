
import { supabase } from "@/integrations/supabase/client";

interface StudyStatistics {
  totalStudied: number;
  totalRevisions: number;
  refusedRevisions: number;
  difficultTopics: number;
  totalStudyTimeHours: number;
  userLevel?: number;
  totalXp?: number;
}

export const fetchStudyStatistics = async (): Promise<StudyStatistics> => {
  try {
    // Get completed study plans count
    const { data: completedStudies, error: completedError } = await supabase
      .from('study_plans')
      .select('id')
      .eq('is_completed', true);
    
    if (completedError) throw completedError;
    
    // Get completed revisions count
    const { data: completedRevisions, error: revisionsError } = await supabase
      .from('revisions')
      .select('id')
      .eq('is_completed', true);
    
    if (revisionsError) throw revisionsError;
    
    // Get refused revisions count
    const { data: refusedRevisions, error: refusedError } = await supabase
      .from('revisions')
      .select('id')
      .eq('is_refused', true);
    
    if (refusedError) throw refusedError;
    
    // Get difficult topics count
    const { data: difficultTopics, error: difficultError } = await supabase
      .from('study_plans')
      .select('id')
      .eq('is_difficult', true);
    
    if (difficultError) throw difficultError;
    
    // Get study time from study_plans
    const { data: studyTimeData, error: timeError } = await supabase
      .from('study_plans')
      .select('study_time_minutes')
      .eq('is_completed', true);
    
    if (timeError) throw timeError;
    
    // Calculate total study time in hours
    const totalMinutes = studyTimeData?.reduce((total, item) => {
      return total + (item.study_time_minutes || 0);
    }, 0) || 0;
    
    const totalStudyTimeHours = parseFloat((totalMinutes / 60).toFixed(1));
    
    // Get user XP data
    const { data: xpData, error: xpError } = await supabase
      .from('user_xp')
      .select('xp, level')
      .single();
    
    return {
      totalStudied: completedStudies?.length || 0,
      totalRevisions: completedRevisions?.length || 0,
      refusedRevisions: refusedRevisions?.length || 0,
      difficultTopics: difficultTopics?.length || 0,
      totalStudyTimeHours,
      userLevel: xpData?.level || 1,
      totalXp: xpData?.xp || 0
    };
  } catch (error) {
    console.error('Error fetching study statistics:', error);
    return {
      totalStudied: 0,
      totalRevisions: 0,
      refusedRevisions: 0,
      difficultTopics: 0,
      totalStudyTimeHours: 0,
      userLevel: 1,
      totalXp: 0
    };
  }
};

