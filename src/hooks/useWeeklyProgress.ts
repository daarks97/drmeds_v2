
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

export const useWeeklyProgress = () => {
  return useQuery<number>({
    queryKey: ['weekly-progress'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Segunda a domingo
      const now = new Date();
      const monday = new Date(now);
      monday.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
      monday.setHours(0, 0, 0, 0);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      const startDate = monday.toISOString().split('T')[0];
      const endDate = sunday.toISOString().split('T')[0];

      const { data: weeklyPlans, error } = await supabase
        .from('study_plans')
        .select('is_completed')
        .eq('user_id', user.id)
        .gte('planned_date', startDate)
        .lte('planned_date', endDate);

      if (error) throw error;

      const total = weeklyPlans?.length ?? 0;
      const completed = weeklyPlans?.filter(plan => plan.is_completed).length ?? 0;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      return percentage;
    },
    fallbackData: 0
  });
};
